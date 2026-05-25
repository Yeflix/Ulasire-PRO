
(function () {
  const NS = 'ula';
  const K = {
    users: `${NS}:users`,
    session: `${NS}:session`,
    theme: `${NS}:theme`,
    notas: (ced) => `${NS}:notas:${ced}`,
    inscripciones: (ced) => `${NS}:inscripciones:${ced}`,
    horario: (ced) => `${NS}:horario:${ced}`,
    plan: (ced) => `${NS}:plan-status:${ced}`,
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (_) { return fallback; }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function remove(key) { localStorage.removeItem(key); }

  /* ---------- Users ---------- */
  function getUsers() { return read(K.users, []); }
  function setUsers(arr) { write(K.users, arr); }
  function getUserByCedula(c) {
    return getUsers().find(u => (u.cedula || '').toLowerCase() === (c || '').toLowerCase()) || null;
  }
  function upsertUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.cedula.toLowerCase() === user.cedula.toLowerCase());
    if (idx >= 0) users[idx] = { ...users[idx], ...user };
    else users.push(user);
    setUsers(users);
  }
  function deleteUser(cedula) {
    setUsers(getUsers().filter(u => u.cedula !== cedula));
  }

  /* ---------- Session ---------- */
  function getSession() { return read(K.session, null); }
  function setSession(cedula) { write(K.session, { cedula, at: Date.now() }); }
  function clearSession() { remove(K.session); }
  function currentUser() {
    const s = getSession();
    return s ? getUserByCedula(s.cedula) : null;
  }

  /* ---------- Theme ---------- */
  function getTheme() { return localStorage.getItem(K.theme) || 'dark'; }
  function setTheme(t) {
    localStorage.setItem(K.theme, t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  /* ---------- Per-user collections ---------- */
  function getNotas(c) { return read(K.notas(c), []); }
  function setNotas(c, arr) { write(K.notas(c), arr); }

  function getInscripciones(c) { return read(K.inscripciones(c), []); }
  function setInscripciones(c, arr) { write(K.inscripciones(c), arr); }

  function getHorario(c) { return read(K.horario(c), []); }
  function setHorario(c, arr) { write(K.horario(c), arr); }

  function getPlanStatus(c) { return read(K.plan(c), {}); }
  function setPlanStatus(c, obj) { write(K.plan(c), obj); }

  /* ---------- Seeding ---------- */
  function seedDemoIfMissing() {
    const users = getUsers();
    const demo = window.ULA_DEMO_USER;
    if (!users.some(u => u.cedula === demo.cedula)) {
      upsertUser(demo);
    }
    if (getNotas(demo.cedula).length === 0) setNotas(demo.cedula, window.ULA_DEMO_NOTAS);
    if (getInscripciones(demo.cedula).length === 0) setInscripciones(demo.cedula, window.ULA_DEMO_INSCRIPCIONES);
    // Reset plan-status snapshot is derived from notas, so no extra seed needed
  }

  /* ---------- Computed metrics ---------- */
  function computeAcademicSummary(cedula) {
    const notas = getNotas(cedula);

    // Asignaturas únicas cursadas (cada combinación codigo+periodo cuenta como cursada)
    const cursadas = notas.length;

    // Para \"aprobadas\", contar última nota >= 10 por código
    const ultimaPorCodigo = {};
    notas.forEach(n => {
      const prev = ultimaPorCodigo[n.codigo];
      if (!prev || n.periodo > prev.periodo) ultimaPorCodigo[n.codigo] = n;
    });

    let aprobadas = 0;
    let ucCursadas = 0;
    let ucAprobadas = 0;
    let sumPond = 0; // ponderado = sum(nota*UC)/sum(UC)
    let sumUC = 0;
    let sumNotaApr = 0; let countApr = 0;

    notas.forEach(n => {
      ucCursadas += (n.creditos || 0);
      sumPond += (n.nota || 0) * (n.creditos || 0);
      sumUC += (n.creditos || 0);
    });

    Object.values(ultimaPorCodigo).forEach(n => {
      if (n.nota >= 10) {
        aprobadas += 1;
        ucAprobadas += (n.creditos || 0);
        sumNotaApr += (n.nota || 0);
        countApr += 1;
      }
    });

    const ponderado = sumUC ? (sumPond / sumUC) : 0;
    const aprobatorio = countApr ? (sumNotaApr / countApr) : 0;
    // Promedio global: media simple de todas las notas registradas
    const global = notas.length ? (notas.reduce((a, n) => a + (n.nota || 0), 0) / notas.length) : 0;

    return {
      cursadas,
      aprobadas,
      ucCursadas,
      ucAprobadas,
      promedio_global: round(global),
      promedio_aprobatorio: round(aprobatorio),
      promedio_ponderado: round(ponderado),
    };
  }

  function round(n) { return Math.round(n * 100) / 100; }

  function getPlanComputed(cedula) {
    const notas = getNotas(cedula);
    const inscripciones = getInscripciones(cedula);
    const ultimaPorCodigo = {};
    notas.forEach(n => {
      const prev = ultimaPorCodigo[n.codigo];
      if (!prev || n.periodo > prev.periodo) ultimaPorCodigo[n.codigo] = n;
    });
    const cursandoCodigos = new Set(inscripciones.map(i => i.codigo));

    const status = {}; // codigo -> 'aprobada'|'cursando'|'reprobada'|'pendiente'
    Object.entries(ultimaPorCodigo).forEach(([cod, n]) => {
      status[cod] = n.nota >= 10 ? 'aprobada' : 'reprobada';
    });
    cursandoCodigos.forEach(c => { if (status[c] !== 'aprobada') status[c] = 'cursando'; });
    return status;
  }

  /* ---------- Export ---------- */
  window.ULAStore = {
    K,
    getUsers, getUserByCedula, upsertUser, deleteUser,
    getSession, setSession, clearSession, currentUser,
    getTheme, setTheme, toggleTheme,
    getNotas, setNotas,
    getInscripciones, setInscripciones,
    getHorario, setHorario,
    getPlanStatus, setPlanStatus,
    seedDemoIfMissing,
    computeAcademicSummary,
    getPlanComputed,
  };
})();