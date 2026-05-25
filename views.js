

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ====================== UI HELPERS ====================== */
  function toast(message, kind = 'info') {
    const root = $('#toast-root');
    const el = document.createElement('div');
    el.className = `toast toast-${kind} animate-pop`;
    const icon = kind === 'success' ? 'ph-check-circle' : kind === 'error' ? 'ph-warning-circle' : 'ph-info';
    el.innerHTML = `<i class=\"ph-fill ${icon} text-lg ${kind === 'success' ? 'text-emerald-500' : kind === 'error' ? 'text-rose-500' : 'text-blue-500'}\"></i><span class=\"text-sm\">${message}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s, transform .3s'; el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; }, 2800);
    setTimeout(() => el.remove(), 3200);
  }
  window.toast = toast;

  function openModal(html, onMount) {
    const root = $('#modal-root');
    root.innerHTML = `<div class=\"modal-backdrop animate-fade-in\" data-testid=\"modal-backdrop\"><div class=\"modal-card animate-pop\">${html}</div></div>`;
    const backdrop = root.firstElementChild;
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });
    if (onMount) onMount(backdrop);
  }
  function closeModal() { $('#modal-root').innerHTML = ''; }
  window.openModal = openModal;
  window.closeModal = closeModal;

  function initials(user) {
    if (!user) return '··';
    const a = (user.nombres || '').trim().split(/\s+/)[0] || '';
    const b = (user.apellidos || '').trim().split(/\s+/)[0] || '';
    return ((a[0] || '') + (b[0] || '')).toUpperCase() || (user.cedula || '').slice(-2);
  }
  function fullName(u) { return `${u.apellidos || ''}, ${u.nombres || ''}`.replace(/^,\s*/, '').trim(); }
  function shortName(u) {
    const n = (u.nombres || '').split(' ')[0] || '';
    const a = (u.apellidos || '').split(' ')[0] || '';
    return `${n} ${a}`.trim();
  }
  window.ULAUI = { initials, fullName, shortName };

  /* ====================== LOGIN VIEW ====================== */
  function viewLogin() {
    document.body.classList.add('overflow-x-hidden');
    return `
    <section class=\"min-h-screen grid lg:grid-cols-2 relative\">
      <!-- Left: form -->
      <div class=\"relative flex flex-col px-6 sm:px-12 lg:px-20 py-10 lg:py-14\">
        <div class=\"flex items-center gap-3 mb-10 animate-fade-up\">
          <div class=\"w-11 h-11 rounded-2xl bg-ula-700 grid place-items-center text-white shadow-soft\">
            <i class=\"ph-fill ph-atom text-2xl\"></i>
          </div>
          <div>
            <div class=\"font-display text-lg font-semibold tracking-tight\">Facultad de Ciencias</div>
            <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400\">Universidad de Los Andes · Venezuela</div>
          </div>
        </div>

        <div class=\"max-w-md w-full mx-auto lg:mx-0 animate-fade-up\" style=\"animation-delay:.08s\">
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-tight\">
            Portal <em class=\"italic text-ula-700 dark:text-ula-300\">Académico</em><br/>
            <span class=\"text-slate-700 dark:text-slate-300\">de Estudiantes</span>
          </h1>
          <p class=\"mt-4 text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed\">
            Consulta tu plan de estudio, gestiona tus notas y sigue tu progreso en la carrera.
            Tu información se guarda localmente en este dispositivo.
          </p>

          <div class=\"mt-8 inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800\" role=\"tablist\">
            <button class=\"px-4 py-1.5 rounded-lg text-sm font-medium auth-tab active\" data-tab=\"login\" data-testid=\"tab-login\">Iniciar sesión</button>
            <button class=\"px-4 py-1.5 rounded-lg text-sm font-medium auth-tab\" data-tab=\"register\" data-testid=\"tab-register\">Crear cuenta</button>
          </div>

          <!-- Login form -->
          <form id=\"login-form\" class=\"mt-6 space-y-4 animate-fade-up\" data-testid=\"login-form\">
            <div class=\"field\">
              <label for=\"login-cedula\">Cédula</label>
              <input id=\"login-cedula\" type=\"text\" autocomplete=\"username\" placeholder=\"V031559558\" data-testid=\"login-cedula\" />
              <small class=\"text-[11px] text-slate-500\">Inicia con V o E + tus dígitos.</small>
            </div>
            <div class=\"field\">
              <label for=\"login-password\">Contraseña</label>
              <div class=\"relative\">
                <input id=\"login-password\" type=\"password\" autocomplete=\"current-password\" placeholder=\"••••••••\" data-testid=\"login-password\" />
                <button type=\"button\" class=\"absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200\" data-toggle-pass=\"login-password\" data-testid=\"login-toggle-password\">
                  <i class=\"ph ph-eye\"></i>
                </button>
              </div>
            </div>
            <button type=\"submit\" class=\"btn btn-primary w-full mt-2\" data-testid=\"login-submit\">
              <i class=\"ph ph-sign-in\"></i> Entrar al portal
            </button>
            <div class=\"flex items-center gap-3 text-[12px] text-slate-500\">
              <button type=\"button\" id=\"use-demo\" data-testid=\"login-use-demo\" class=\"underline-offset-2 hover:underline\">Usar cuenta DEMO</button>
              <span class=\"opacity-50\">·</span>
              <span>Cédula demo: V031559558 · Pass: fisica2024</span>
            </div>
          </form>

          <!-- Register form -->
          <form id=\"register-form\" class=\"mt-6 space-y-4 hidden\" data-testid=\"register-form\">
            <div class=\"grid sm:grid-cols-2 gap-3\">
              <div class=\"field\"><label>Nombres</label><input name=\"nombres\" required data-testid=\"register-nombres\" /></div>
              <div class=\"field\"><label>Apellidos</label><input name=\"apellidos\" required data-testid=\"register-apellidos\" /></div>
            </div>
            <div class=\"grid sm:grid-cols-2 gap-3\">
              <div class=\"field\"><label>Cédula</label><input name=\"cedula\" required placeholder=\"V012345678\" data-testid=\"register-cedula\" /></div>
              <div class=\"field\"><label>Teléfono</label><input name=\"telefono\" placeholder=\"+58...\" data-testid=\"register-telefono\" /></div>
            </div>
            <div class=\"field\"><label>Correo electrónico</label><input name=\"email\" type=\"email\" required data-testid=\"register-email\" /></div>
            <div class=\"grid sm:grid-cols-2 gap-3\">
              <div class=\"field\"><label>Carrera</label>
                <select name=\"carrera\" data-testid=\"register-carrera\">
                  ${window.ULA_CARRERAS.map(c => `<option value=\"${c.id}\" ${c.activa ? '' : 'disabled'}>${c.nombre}${c.activa ? '' : ' · Próximamente'}</option>`).join('')}
                </select>
              </div>
              <div class=\"field\"><label>Contraseña</label><input name=\"password\" type=\"password\" required minlength=\"6\" data-testid=\"register-password\" /></div>
            </div>
            <button type=\"submit\" class=\"btn btn-primary w-full\" data-testid=\"register-submit\">
              <i class=\"ph ph-user-plus\"></i> Crear cuenta
            </button>
          </form>
        </div>

        <div class=\"mt-auto pt-12 text-[11px] text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row gap-2 justify-between animate-fade-up\" style=\"animation-delay:.25s\">
          <span class=\"font-display italic\">Initium Sapientiae Timor Domini</span>
          <span>© ${new Date().getFullYear()} · CEPI · ULA · Mérida, Venezuela</span>
        </div>
      </div>

      <!-- Right: cinematic panel -->
      <div class=\"hidden lg:block relative overflow-hidden bg-ula-900\">
        <div class=\"aurora\"></div>
        <div class=\"absolute inset-0 grid-motif opacity-30\"></div>
        <div class=\"absolute inset-0 flex flex-col justify-between p-12 text-white\">
          <div class=\"flex items-center gap-3\">
            <i class=\"ph-fill ph-graduation-cap text-2xl\"></i>
            <span class=\"text-xs uppercase tracking-[0.25em] opacity-80\">CEPI · SIRE 2026</span>
          </div>
          <div class=\"max-w-md animate-fade-up\" style=\"animation-delay:.3s\">
            <div class=\"font-display text-3xl leading-tight italic\">\"La física es la poesía de la naturaleza, escrita en el lenguaje de las matemáticas.\"</div>
            <div class=\"mt-5 flex items-center gap-3 text-sm opacity-80\"><div class=\"w-10 h-px bg-white/40\"></div><span>Facultad de Ciencias · ULA</span></div>
          </div>
          <div class=\"grid grid-cols-3 gap-3 max-w-md text-[12px]\">
            ${window.ULA_CARRERAS.map(c => `
              <div class=\"rounded-xl border border-white/15 bg-white/5 backdrop-blur-md px-3 py-3 ${c.activa ? '' : 'opacity-60'}\">
                <i class=\"ph ${c.icono} text-lg\"></i>
                <div class=\"mt-2 font-medium\">${c.nombre}</div>
                <div class=\"opacity-70 text-[10px] uppercase tracking-wider\">${c.activa ? 'Disponible' : 'Próx.'}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>
    `;
  }

  function mountLogin() {
    // Tabs
    $$('.auth-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.auth-tab').forEach(b => b.classList.remove('active','bg-white','dark:bg-slate-800','shadow'));
        btn.classList.add('active','bg-white','dark:bg-slate-800','shadow');
        const t = btn.dataset.tab;
        $('#login-form').classList.toggle('hidden', t !== 'login');
        $('#register-form').classList.toggle('hidden', t !== 'register');
      });
    });
    // Default tab
    $('.auth-tab[data-tab=\"login\"]').classList.add('bg-white','dark:bg-slate-800','shadow');

    // Toggle password
    $$('[data-toggle-pass]').forEach(b => b.addEventListener('click', () => {
      const inp = document.getElementById(b.dataset.togglePass);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      b.firstElementChild.className = `ph ${inp.type === 'password' ? 'ph-eye' : 'ph-eye-slash'}`;
    }));

    // Use demo
    $('#use-demo').addEventListener('click', () => {
      $('#login-cedula').value = window.ULA_DEMO_USER.cedula;
      $('#login-password').value = window.ULA_DEMO_USER.password;
    });

    // Login submit
    $('#login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const cedula = $('#login-cedula').value;
      const password = $('#login-password').value;
      const r = ULAAuth.login(cedula, password);
      if (!r.ok) return toast(r.error, 'error');
      toast(`Bienvenido(a), ${shortName(r.user)}`, 'success');
      window.location.hash = '#/dashboard';
    });

    // Register submit
    $('#register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const payload = Object.fromEntries(fd.entries());
      const r = ULAAuth.register(payload);
      if (!r.ok) return toast(r.error, 'error');
      toast('Cuenta creada exitosamente.', 'success');
      window.location.hash = '#/dashboard';
    });
  }

  /* ====================== DASHBOARD ====================== */
  function viewDashboard() {
    const u = ULAStore.currentUser();
    const summary = ULAStore.computeAcademicSummary(u.cedula);
    const inscripciones = ULAStore.getInscripciones(u.cedula);
    const totalUC = 169; // aproximación del pensum: suma de UC obligatorias

    const progresoPct = Math.min(100, Math.round((summary.ucAprobadas / totalUC) * 100));

    const cardsActuales = inscripciones.length
      ? agruparPorCodigo(inscripciones).map(({ codigo, ocurrencias }) => {
        const asig = window.ULA_BUSCAR_ASIGNATURA(codigo);
        return `
          <div class=\"glass p-4 flex items-start gap-3\" data-testid=\"current-subject-${codigo}\">
            <div class=\"w-10 h-10 rounded-xl bg-ula-700/10 dark:bg-ula-600/20 grid place-items-center text-ula-700 dark:text-ula-300\">
              <i class=\"ph ph-flask text-xl\"></i>
            </div>
            <div class=\"flex-1 min-w-0\">
              <div class=\"text-[11px] subject-code\">${codigo}${asig ? ' · ' + (asig.creditos) + ' UC' : ''}</div>
              <div class=\"font-medium truncate\">${asig ? asig.nombre : 'Asignatura'}</div>
              <div class=\"text-[12px] text-slate-500 dark:text-slate-400 mt-1\">${ocurrencias.map(o => `${o.dia} ${o.hora_inicio}-${o.hora_fin}`).join(' · ')}</div>
            </div>
          </div>`;
      }).join('')
      : `<div class=\"glass p-6 text-sm text-slate-500 dark:text-slate-400\">Aún no tienes asignaturas inscritas este período. <a href=\"#/inscripciones\" class=\"text-ula-700 dark:text-ula-300 underline-offset-2 hover:underline\">Inscribir asignaturas →</a></div>`;

    return `
    <section class=\"max-w-7xl mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <!-- Header -->
      <div class=\"flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Dependencia · Ciencias</div>
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">
            Hola, <span class=\"italic\">${(u.nombres || '').split(' ')[0] || 'Estudiante'}</span>.
          </h1>
          <p class=\"mt-2 text-slate-600 dark:text-slate-400\">${fullName(u)} · <span class=\"font-mono text-[13px]\">${u.cedula}</span> · Carrera: <strong>${carreraNombre(u.carrera)}</strong> · Pensum ${u.pensum}</p>
        </div>
        <div class=\"flex flex-wrap gap-2\">
          <a href=\"#/plan\" class=\"btn btn-secondary\" data-testid=\"dash-go-plan\"><i class=\"ph ph-graph\"></i> Plan de estudio</a>
          <a href=\"#/inscripciones\" class=\"btn btn-primary\" data-testid=\"dash-go-inscripciones\"><i class=\"ph ph-clipboard-text\"></i> Inscripciones</a>
        </div>
      </div>

      <!-- Metric grid -->
      <div class=\"grid grid-cols-2 md:grid-cols-4 gap-4\">
        <div class=\"metric animate-fade-up\" data-testid=\"metric-global\">
          <div class=\"label\">Promedio Global</div>
          <div class=\"value\">${summary.promedio_global.toFixed(2)}</div>
          <div class=\"hint\">de 20 pts</div>
        </div>
        <div class=\"metric animate-fade-up\" style=\"animation-delay:.05s\" data-testid=\"metric-aprobatorio\">
          <div class=\"label\">Aprobatorio</div>
          <div class=\"value\">${summary.promedio_aprobatorio.toFixed(2)}</div>
          <div class=\"hint\">promedio de aprobadas</div>
        </div>
        <div class=\"metric animate-fade-up\" style=\"animation-delay:.1s\" data-testid=\"metric-ponderado\">
          <div class=\"label\">Ponderado</div>
          <div class=\"value\">${summary.promedio_ponderado.toFixed(2)}</div>
          <div class=\"hint\">por UC cursadas</div>
        </div>
        <div class=\"metric animate-fade-up\" style=\"animation-delay:.15s\" data-testid=\"metric-condicion\">
          <div class=\"label\">Condición</div>
          <div class=\"value text-[1.75rem]\" style=\"font-size:1.75rem\">${u.condicion}</div>
          <div class=\"hint\">${u.causa_condicion}</div>
        </div>
      </div>

      <!-- Progress + cards -->
      <div class=\"grid lg:grid-cols-3 gap-5 mt-6\">
        <div class=\"glass p-6 lg:col-span-2\">
          <div class=\"flex items-center justify-between mb-3\">
            <div>
              <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400\">Progreso en la carrera</div>
              <h3 class=\"font-display text-2xl mt-1\">${summary.ucAprobadas} / ${totalUC} unidades de crédito</h3>
            </div>
            <span class=\"pill pill-cursando\" data-testid=\"progress-percent\">${progresoPct}%</span>
          </div>
          <div class=\"progress mt-2\"><span style=\"width:${progresoPct}%\"></span></div>
          <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-sm\">
            <div><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">Cursadas</div><div class=\"font-display text-2xl mt-1\">${summary.cursadas}</div></div>
            <div><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">Aprobadas</div><div class=\"font-display text-2xl mt-1\">${summary.aprobadas}</div></div>
            <div><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">UC Cursadas</div><div class=\"font-display text-2xl mt-1\">${summary.ucCursadas}</div></div>
            <div><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">UC Aprobadas</div><div class=\"font-display text-2xl mt-1\">${summary.ucAprobadas}</div></div>
          </div>
        </div>
        <div class=\"glass p-6\">
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3\">Estado del proceso</div>
          <ul class=\"space-y-3 text-sm\">
            <li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">Arancel</span><span class=\"pill pill-aprobada\"><i class=\"ph ph-check-circle\"></i> ${u.arancel}</span></li>
            <li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">Grupo</span><span class=\"font-mono\">${u.grupo}</span></li>
            <li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">Vía de Ingreso</span><span class=\"text-right text-[12px] max-w-[60%]\">${u.via_ingreso}</span></li>
            <li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">Fecha de Ingreso</span><span class=\"font-mono\">${u.fecha_ingreso}</span></li>
            <li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">Período</span><span class=\"font-mono\">${u.periodo_ingreso}</span></li>
          </ul>
        </div>
      </div>

      <!-- Asignaturas actuales -->
      <div class=\"mt-10\">
        <div class=\"flex items-center justify-between mb-3\">
          <h2 class=\"font-display text-2xl\">Asignaturas inscritas</h2>
          <a href=\"#/horario\" class=\"text-sm text-ula-700 dark:text-ula-300 hover:underline\" data-testid=\"dash-go-horario\">Ver horario completo →</a>
        </div>
        <div class=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-3\">${cardsActuales}</div>
      </div>

      <!-- Quick actions -->
      <div class=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10\">
        <a href=\"#/notas\" class=\"glass p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-transform\" data-testid=\"dash-link-notas\">
          <i class=\"ph-fill ph-exam text-2xl text-ula-700 dark:text-ula-300\"></i>
          <div><div class=\"font-medium\">Mis Notas</div><div class=\"text-[12px] text-slate-500 dark:text-slate-400\">Calificaciones registradas en el sistema</div></div>
        </a>
        <a href=\"#/plan\" class=\"glass p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-transform\" data-testid=\"dash-link-plan\">
          <i class=\"ph-fill ph-graph text-2xl text-ula-700 dark:text-ula-300\"></i>
          <div><div class=\"font-medium\">Plan de Estudio</div><div class=\"text-[12px] text-slate-500 dark:text-slate-400\">Carrera de ${carreraNombre(u.carrera)} — 10 semestres</div></div>
        </a>
        <a href=\"#/perfil\" class=\"glass p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-transform\" data-testid=\"dash-link-perfil\">
          <i class=\"ph-fill ph-user-gear text-2xl text-ula-700 dark:text-ula-300\"></i>
          <div><div class=\"font-medium\">Actualizar datos</div><div class=\"text-[12px] text-slate-500 dark:text-slate-400\">Modifica correo, teléfono y PIN</div></div>
        </a>
      </div>
    </section>
    `;
  }

  function agruparPorCodigo(lista) {
    const map = {};
    lista.forEach(i => {
      if (!map[i.codigo]) map[i.codigo] = { codigo: i.codigo, ocurrencias: [] };
      map[i.codigo].ocurrencias.push(i);
    });
    return Object.values(map);
  }

  function carreraNombre(id) {
    return (window.ULA_CARRERAS.find(c => c.id === id) || {}).nombre || '—';
  }

  /* ====================== PLAN DE ESTUDIO ====================== */
  function viewPlan() {
    const u = ULAStore.currentUser();
    const status = ULAStore.getPlanComputed(u.cedula);

    const semestres = window.ULA_PLAN_FISICA.map(s => {
      const items = s.asignaturas.map(a => subjectCard(a, status[a.codigo] || 'pendiente')).join('');
      return `
        <article class=\"glass p-4 min-w-[280px] flex-shrink-0\">
          <div class=\"flex items-center justify-between mb-3\">
            <div>
              <div class=\"text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400\">Semestre</div>
              <div class=\"font-display text-3xl leading-none\">${s.semestre.toString().padStart(2,'0')}</div>
            </div>
            <span class=\"pill pill-pendiente\">${s.asignaturas.reduce((a,c)=>a+c.creditos,0)} UC</span>
          </div>
          <div class=\"flex flex-col gap-2\">${items}</div>
        </article>`;
    }).join('');

    const electivas = window.ULA_ELECTIVAS_FISICA.map(a => subjectCard(a, status[a.codigo] || 'pendiente', true)).join('');

    return `
    <section class=\"max-w-[1400px] mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <div class=\"flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Plan de Estudio</div>
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">Carrera de ${carreraNombre(u.carrera)}</h1>
          <p class=\"mt-2 text-slate-600 dark:text-slate-400 max-w-2xl\">10 semestres · Régimen semestral · Pensum ${u.pensum}. Haz clic en una asignatura para ver detalles y actualizar su estado.</p>
        </div>
        <div class=\"flex gap-2 text-xs flex-wrap\">
          <span class=\"pill pill-aprobada\">Aprobada</span>
          <span class=\"pill pill-cursando\">Cursando</span>
          <span class=\"pill pill-pendiente\">Pendiente</span>
          <span class=\"pill pill-electiva\">Electiva</span>
        </div>
      </div>

      <div class=\"flex gap-4 overflow-x-auto pb-4 no-scrollbar\" data-testid=\"plan-semestres\">${semestres}</div>

      <div class=\"mt-12\">
        <h2 class=\"font-display text-2xl mb-3\">Asignaturas Electivas</h2>
        <p class=\"text-sm text-slate-500 dark:text-slate-400 mb-4\">Disponibles desde el ciclo General. Algunas requieren créditos previos o son restringidas.</p>
        <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3\">${electivas}</div>
      </div>
    </section>
    `;
  }

  function subjectCard(a, estado, esElectiva = false) {
    const pill = estado === 'aprobada' ? 'pill-aprobada' : estado === 'cursando' ? 'pill-cursando' : estado === 'reprobada' ? 'pill-pendiente' : 'pill-pendiente';
    const label = estado === 'aprobada' ? 'Aprobada' : estado === 'cursando' ? 'Cursando' : estado === 'reprobada' ? 'Reprobada' : 'Pendiente';
    const statusCls = estado === 'aprobada' ? 'status-aprobada' : estado === 'cursando' ? 'status-cursando' : '';
    return `
    <div class=\"subject-card ${statusCls}\" data-codigo=\"${a.codigo}\" data-testid=\"subject-${a.codigo}\" onclick=\"openSubjectModal('${a.codigo}')\">
      <div class=\"flex items-center justify-between gap-2\">
        <span class=\"subject-code\">${a.codigo} · ${a.creditos} UC</span>
        <span class=\"pill ${pill}\">${label}</span>
      </div>
      <div class=\"mt-1 font-medium leading-snug\">${a.nombre}</div>
      <div class=\"mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400\">
        ${esElectiva || a.tipo === 'EL' ? '<span class=\"pill pill-electiva\">Electiva</span>' : ''}
        <span>${a.horas ? a.horas + ' hrs' : ''}</span>
        ${a.restringida ? '<span class=\"text-amber-600 dark:text-amber-400\"><i class=\"ph ph-lock-key\"></i> Restringida</span>' : ''}
      </div>
    </div>`;
  }

  window.openSubjectModal = function (codigo) {
    const u = ULAStore.currentUser();
    const a = window.ULA_BUSCAR_ASIGNATURA(codigo);
    if (!a) return;
    const status = ULAStore.getPlanComputed(u.cedula)[codigo] || 'pendiente';
    const notas = ULAStore.getNotas(u.cedula).filter(n => n.codigo === codigo);
    const prelaciones = (a.prelaciones || []).map(p => {
      const m = window.ULA_BUSCAR_ASIGNATURA(p);
      return `<li class=\"flex items-center justify-between\"><span class=\"text-slate-500\">${p}</span><span>${m ? m.nombre : '—'}</span></li>`;
    }).join('') || `<li class=\"text-slate-500 text-sm\">Sin prelaciones</li>`;

    openModal(`
      <div class=\"p-6 border-b border-slate-200 dark:border-slate-800\">
        <div class=\"text-[11px] subject-code\">${a.codigo} · ${a.creditos} UC · ${a.tipo === 'EL' ? 'Electiva' : 'Obligatoria'}${a.semestre ? ' · Semestre ' + a.semestre : ''}</div>
        <h3 class=\"font-display text-2xl mt-1\">${a.nombre}</h3>
        <div class=\"mt-2\"><span class=\"pill ${status === 'aprobada' ? 'pill-aprobada' : status === 'cursando' ? 'pill-cursando' : 'pill-pendiente'}\">${status.toUpperCase()}</span></div>
      </div>
      <div class=\"p-6 grid sm:grid-cols-2 gap-6\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2\">Prelaciones</div>
          <ul class=\"space-y-1 text-sm\">${prelaciones}</ul>
          ${a.creditos_req ? `<div class=\"mt-3 text-[12px] text-amber-600 dark:text-amber-400\"><i class=\"ph ph-info\"></i> Requiere ${a.creditos_req} UC aprobadas.</div>` : ''}
        </div>
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2\">Historial de notas</div>
          ${notas.length ? `<ul class=\"space-y-1 text-sm\">${notas.map(n => `<li class=\"flex justify-between\"><span class=\"font-mono text-[12px]\">${n.periodo}</span><span class=\"${n.nota>=10?'text-emerald-600 dark:text-emerald-400':'text-rose-600 dark:text-rose-400'} font-medium\">${n.nota}/20</span></li>`).join('')}</ul>` : `<div class=\"text-sm text-slate-500\">Sin notas registradas</div>`}
        </div>
      </div>
      <div class=\"p-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 justify-between\">
        <div class=\"flex gap-2\">
          <button class=\"btn btn-secondary\" onclick=\"closeModal()\" data-testid=\"modal-close\">Cerrar</button>
        </div>
        <a href=\"#/notas?focus=${a.codigo}\" class=\"btn btn-primary\" onclick=\"closeModal()\" data-testid=\"modal-go-notas\"><i class=\"ph ph-pencil-line\"></i> Registrar nota</a>
      </div>
    `);
  };

  /* ====================== NOTAS ====================== */
  function viewNotas() {
    const u = ULAStore.currentUser();
    const notas = ULAStore.getNotas(u.cedula).slice().sort((a,b) => (b.periodo + b.codigo).localeCompare(a.periodo + a.codigo));
    const filas = notas.length ? notas.map((n, idx) => {
      const a = window.ULA_BUSCAR_ASIGNATURA(n.codigo);
      const aprobada = n.nota >= 10;
      return `
        <tr data-testid=\"nota-row-${idx}\">
          <td class=\"font-mono text-[12px]\">${n.periodo}</td>
          <td class=\"font-mono text-[12px]\">${n.codigo}</td>
          <td class=\"font-medium\">${a ? a.nombre : '—'}</td>
          <td>${n.creditos}</td>
          <td class=\"font-semibold ${aprobada ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}\">${n.nota}</td>
          <td><span class=\"pill ${aprobada ? 'pill-aprobada' : 'pill-pendiente'}\">${aprobada ? 'Aprobada' : 'Reprobada'}</span></td>
          <td class=\"text-right\">
            <button class=\"btn btn-ghost px-2 py-1\" onclick=\"editNota(${idx})\" data-testid=\"nota-edit-${idx}\"><i class=\"ph ph-pencil-line\"></i></button>
            <button class=\"btn btn-ghost px-2 py-1 text-rose-600\" onclick=\"deleteNota(${idx})\" data-testid=\"nota-delete-${idx}\"><i class=\"ph ph-trash\"></i></button>
          </td>
        </tr>`;
    }).join('') : `<tr><td colspan=\"7\" class=\"text-center py-12 text-slate-500\">No tienes calificaciones registradas. Pulsa <strong>Agregar nota</strong> para empezar.</td></tr>`;

    return `
    <section class=\"max-w-7xl mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <div class=\"flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Calificaciones</div>
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">Mis Notas</h1>
          <p class=\"mt-2 text-slate-600 dark:text-slate-400\">Lista de calificaciones registradas en el sistema. Tu progreso se actualiza automáticamente.</p>
        </div>
        <button class=\"btn btn-primary\" onclick=\"openNotaForm()\" data-testid=\"notas-add\"><i class=\"ph ph-plus\"></i> Agregar nota</button>
      </div>
      <div class=\"glass overflow-hidden\">
        <div class=\"overflow-x-auto\">
          <table class=\"data-table\" data-testid=\"notas-table\">
            <thead>
              <tr>
                <th>Período</th><th>Código</th><th>Asignatura</th><th>UC</th><th>Nota</th><th>Condición</th><th></th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    </section>`;
  }

  window.openNotaForm = function (existing = null, idx = null) {
    const u = ULAStore.currentUser();
    const all = window.ULA_TODAS_LAS_ASIGNATURAS;
    const opts = all.map(a => `<option value=\"${a.codigo}\">${a.codigo} · ${a.nombre} (${a.creditos} UC)</option>`).join('');
    openModal(`
      <form id=\"nota-form\" class=\"p-6 space-y-4\">
        <div class=\"flex items-center justify-between\">
          <h3 class=\"font-display text-2xl\">${existing ? 'Editar' : 'Agregar'} nota</h3>
          <button type=\"button\" class=\"btn btn-ghost p-2\" onclick=\"closeModal()\" data-testid=\"nota-form-close\"><i class=\"ph ph-x text-xl\"></i></button>
        </div>
        <div class=\"grid sm:grid-cols-2 gap-3\">
          <div class=\"field\"><label>Asignatura</label>
            <select name=\"codigo\" required data-testid=\"nota-form-codigo\">
              <option value=\"\">Selecciona…</option>${opts}
            </select>
          </div>
          <div class=\"field\"><label>Período</label>
            <select name=\"periodo\" required data-testid=\"nota-form-periodo\">
              ${window.ULA_PERIODOS.map(p => `<option value=\"${p}\">${p}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class=\"grid sm:grid-cols-2 gap-3\">
          <div class=\"field\"><label>Nota (0–20)</label><input name=\"nota\" type=\"number\" min=\"0\" max=\"20\" step=\"0.01\" required data-testid=\"nota-form-nota\" /></div>
          <div class=\"field\"><label>Unidades de Crédito</label><input name=\"creditos\" type=\"number\" min=\"0\" max=\"20\" step=\"1\" required data-testid=\"nota-form-creditos\" /></div>
        </div>
        <div class=\"flex justify-end gap-2 pt-2\">
          <button type=\"button\" class=\"btn btn-secondary\" onclick=\"closeModal()\">Cancelar</button>
          <button type=\"submit\" class=\"btn btn-primary\" data-testid=\"nota-form-submit\"><i class=\"ph ph-floppy-disk\"></i> Guardar</button>
        </div>
      </form>
    `, (root) => {
      if (existing) {
        root.querySelector('[name=codigo]').value = existing.codigo;
        root.querySelector('[name=periodo]').value = existing.periodo;
        root.querySelector('[name=nota]').value = existing.nota;
        root.querySelector('[name=creditos]').value = existing.creditos;
      }
      // Auto-fill creditos when subject selected
      root.querySelector('[name=codigo]').addEventListener('change', (e) => {
        const a = window.ULA_BUSCAR_ASIGNATURA(e.target.value);
        if (a) root.querySelector('[name=creditos]').value = a.creditos;
      });
      root.querySelector('#nota-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        data.nota = parseFloat(data.nota); data.creditos = parseInt(data.creditos, 10);
        if (isNaN(data.nota) || data.nota < 0 || data.nota > 20) return toast('Nota inválida', 'error');
        data.condicion = data.nota >= 10 ? 'Aprobada' : 'Reprobada';

        const notas = ULAStore.getNotas(u.cedula);
        if (idx !== null) notas[idx] = data; else notas.push(data);
        ULAStore.setNotas(u.cedula, notas);
        closeModal();
        toast('Nota guardada', 'success');
        window.ULARouter.render();
      });
    });
  };

  window.editNota = function (idx) {
    const u = ULAStore.currentUser();
    const notas = ULAStore.getNotas(u.cedula).slice().sort((a,b) => (b.periodo + b.codigo).localeCompare(a.periodo + a.codigo));
    // We need actual array index, not sorted index
    const target = notas[idx];
    const raw = ULAStore.getNotas(u.cedula);
    const realIdx = raw.findIndex(n => n.codigo === target.codigo && n.periodo === target.periodo && n.nota === target.nota);
    openNotaForm(target, realIdx);
  };
  window.deleteNota = function (idx) {
    const u = ULAStore.currentUser();
    const sorted = ULAStore.getNotas(u.cedula).slice().sort((a,b) => (b.periodo + b.codigo).localeCompare(a.periodo + a.codigo));
    const target = sorted[idx];
    if (!confirm(`¿Eliminar la nota de ${target.codigo} en ${target.periodo}?`)) return;
    const raw = ULAStore.getNotas(u.cedula);
    const realIdx = raw.findIndex(n => n.codigo === target.codigo && n.periodo === target.periodo && n.nota === target.nota);
    if (realIdx >= 0) {
      raw.splice(realIdx, 1);
      ULAStore.setNotas(u.cedula, raw);
      toast('Nota eliminada', 'success');
      window.ULARouter.render();
    }
  };

  /* ====================== INSCRIPCIONES ====================== */
  function viewInscripciones() {
    const u = ULAStore.currentUser();
    const inscripciones = ULAStore.getInscripciones(u.cedula);
    const status = ULAStore.getPlanComputed(u.cedula);
    const summary = ULAStore.computeAcademicSummary(u.cedula);

    // Available subjects = not aprobada, in plan, prelaciones satisfechas, creditos_req cumplidos
    const disponibles = window.ULA_TODAS_LAS_ASIGNATURAS.filter(a => {
      if (status[a.codigo] === 'aprobada') return false;
      if (a.creditos_req && summary.ucAprobadas < a.creditos_req) return false;
      if (a.prelaciones && a.prelaciones.length) {
        const ok = a.prelaciones.every(p => status[p] === 'aprobada');
        if (!ok) return false;
      }
      return true;
    });

    const codigosInscritos = new Set(inscripciones.map(i => i.codigo));
    const ucInscritas = Array.from(codigosInscritos).reduce((sum, c) => {
      const a = window.ULA_BUSCAR_ASIGNATURA(c); return sum + (a ? a.creditos : 0);
    }, 0);
    const horasInscritas = inscripciones.reduce((sum, i) => {
      const [h1] = i.hora_inicio.split(':').map(Number);
      const [h2] = i.hora_fin.split(':').map(Number);
      return sum + (h2 - h1);
    }, 0);

    const itemsDisponibles = disponibles.map(a => {
      const inscrito = codigosInscritos.has(a.codigo);
      return `
        <div class=\"glass p-4 flex items-center gap-3\" data-testid=\"available-${a.codigo}\">
          <div class=\"w-10 h-10 rounded-xl bg-ula-700/10 dark:bg-ula-600/20 grid place-items-center text-ula-700 dark:text-ula-300\">
            <i class=\"ph ph-${a.tipo === 'EL' ? 'star' : 'book-open'}\"></i>
          </div>
          <div class=\"flex-1 min-w-0\">
            <div class=\"subject-code\">${a.codigo} · ${a.creditos} UC ${a.semestre ? '· Sem '+a.semestre : ''}</div>
            <div class=\"font-medium truncate\">${a.nombre}</div>
          </div>
          <button class=\"btn ${inscrito ? 'btn-secondary' : 'btn-primary'} px-3 py-2 text-sm\"
            onclick=\"toggleInscribir('${a.codigo}')\" data-testid=\"toggle-inscribir-${a.codigo}\">
            ${inscrito ? '<i class=\"ph ph-minus\"></i> Retirar' : '<i class=\"ph ph-plus\"></i> Inscribir'}
          </button>
        </div>`;
    }).join('');

    return `
    <section class=\"max-w-7xl mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <div class=\"flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Inscripciones</div>
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">Asignaturas disponibles</h1>
          <p class=\"mt-2 text-slate-600 dark:text-slate-400\">Selección de asignaturas que el estudiante puede inscribir en función de su progreso y prelaciones.</p>
        </div>
      </div>

      <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6\">
        <div class=\"glass p-4\"><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">Asignaturas</div><div class=\"font-display text-2xl mt-1\">${codigosInscritos.size} <span class=\"text-sm text-slate-400\">/ 8</span></div></div>
        <div class=\"glass p-4\"><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">UC</div><div class=\"font-display text-2xl mt-1\">${ucInscritas} <span class=\"text-sm text-slate-400\">/ 22</span></div></div>
        <div class=\"glass p-4\"><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">Horas semanales</div><div class=\"font-display text-2xl mt-1\">${horasInscritas} <span class=\"text-sm text-slate-400\">/ 40</span></div></div>
        <div class=\"glass p-4\"><div class=\"text-[11px] uppercase tracking-wider text-slate-500\">Disponibles</div><div class=\"font-display text-2xl mt-1\">${disponibles.length}</div></div>
      </div>

      <div class=\"grid lg:grid-cols-2 gap-3\">${itemsDisponibles || '<div class=\"glass p-6 text-sm text-slate-500\">No hay asignaturas disponibles. Aprueba prelaciones para desbloquear más.</div>'}</div>
    </section>
    `;
  }

  window.toggleInscribir = function (codigo) {
    const u = ULAStore.currentUser();
    const list = ULAStore.getInscripciones(u.cedula);
    const has = list.some(i => i.codigo === codigo);
    if (has) {
      ULAStore.setInscripciones(u.cedula, list.filter(i => i.codigo !== codigo));
      toast('Asignatura retirada', 'info');
    } else {
      // Default horario: Lunes/Miércoles 08-10
      const nueva = [
        { codigo, seccion: '01', dia: 'Lunes',     hora_inicio: '08:00', hora_fin: '10:00', aula: 'Por asignar' },
        { codigo, seccion: '01', dia: 'Miércoles', hora_inicio: '08:00', hora_fin: '10:00', aula: 'Por asignar' },
      ];
      ULAStore.setInscripciones(u.cedula, [...list, ...nueva]);
      toast('Asignatura inscrita', 'success');
    }
    window.ULARouter.render();
  };

  /* ====================== HORARIO ====================== */
  function viewHorario() {
    const u = ULAStore.currentUser();
    const ins = ULAStore.getInscripciones(u.cedula);
    const horas = window.ULA_HORAS;
    const dias = window.ULA_DIAS;

    // Build grid header + hours
    let cells = '<div class=\"head\">Hora</div>' + dias.map(d => `<div class=\"head\">${d}</div>`).join('');
    for (const h of horas) {
      cells += `<div class=\"hour\">${h}</div>`;
      for (const d of dias) {
        const block = ins.find(i => i.dia === d && i.hora_inicio === h);
        if (block) {
          const a = window.ULA_BUSCAR_ASIGNATURA(block.codigo);
          const dur = (parseInt(block.hora_fin) - parseInt(block.hora_inicio));
          cells += `<div style=\"grid-row: span ${dur};\"><div class=\"schedule-block\" data-testid=\"block-${block.codigo}-${d}-${h}\">
            <div>
              <div class=\"font-medium leading-tight\">${a ? a.nombre : block.codigo}</div>
              <div class=\"blk-code\">${block.codigo} · Sec ${block.seccion || '01'}</div>
            </div>
            <div class=\"text-[10px] opacity-80\"><i class=\"ph ph-map-pin\"></i> ${block.aula || ''}</div>
          </div></div>`;
        } else {
          // check if a previous block occupies this cell (skip rendering)
          const occupied = ins.some(i => {
            if (i.dia !== d) return false;
            const start = parseInt(i.hora_inicio);
            const end = parseInt(i.hora_fin);
            const current = parseInt(h);
            return current > start && current < end;
          });
          if (occupied) cells += `<div style=\"display:none\"></div>`;
          else cells += `<div></div>`;
        }
      }
    }

    return `
    <section class=\"max-w-[1400px] mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <div class=\"flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6\">
        <div>
          <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Horario</div>
          <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">Mi semana</h1>
          <p class=\"mt-2 text-slate-600 dark:text-slate-400\">Horario actual del estudiante. Se actualiza al inscribir o retirar asignaturas.</p>
        </div>
        <a href=\"#/inscripciones\" class=\"btn btn-secondary\" data-testid=\"horario-go-inscripciones\"><i class=\"ph ph-plus\"></i> Inscribir asignatura</a>
      </div>
      <div class=\"glass p-3 overflow-x-auto\">
        <div class=\"schedule-grid\" data-testid=\"schedule-grid\">${cells}</div>
      </div>
    </section>`;
  }

  /* ====================== PERFIL ====================== */
  function viewPerfil() {
    const u = ULAStore.currentUser();
    return `
    <section class=\"max-w-3xl mx-auto px-5 sm:px-8 py-10 animate-fade-up\">
      <div class=\"mb-6\">
        <div class=\"text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1\">Perfil</div>
        <h1 class=\"font-display text-4xl sm:text-5xl font-semibold tracking-tight\">Editar mi cuenta</h1>
        <p class=\"mt-2 text-slate-600 dark:text-slate-400\">Modifica tu correo electrónico, teléfono, PIN y contraseña.</p>
      </div>

      <!-- Datos básicos -->
      <div class=\"glass p-6 mb-5\">
        <h2 class=\"font-display text-2xl mb-1\">Datos de contacto</h2>
        <p class=\"text-sm text-slate-500 mb-4\">Estos datos son los que la facultad utiliza para comunicarse contigo.</p>
        <form id=\"form-datos\" class=\"grid sm:grid-cols-2 gap-3\" data-testid=\"perfil-datos-form\">
          <div class=\"field\"><label>Cédula</label><input value=\"${u.cedula}\" disabled /></div>
          <div class=\"field\"><label>Carrera</label><input value=\"${carreraNombre(u.carrera)}\" disabled /></div>
          <div class=\"field\"><label>Apellidos</label><input name=\"apellidos\" value=\"${u.apellidos || ''}\" data-testid=\"perfil-apellidos\" /></div>
          <div class=\"field\"><label>Nombres</label><input name=\"nombres\" value=\"${u.nombres || ''}\" data-testid=\"perfil-nombres\" /></div>
          <div class=\"field\"><label>Correo electrónico</label><input name=\"email\" type=\"email\" value=\"${u.email || ''}\" data-testid=\"perfil-email\" /></div>
          <div class=\"field\"><label>Teléfono</label><input name=\"telefono\" value=\"${u.telefono || ''}\" data-testid=\"perfil-telefono\" /></div>
          <div class=\"sm:col-span-2 flex justify-end\">
            <button type=\"submit\" class=\"btn btn-primary\" data-testid=\"perfil-datos-submit\"><i class=\"ph ph-floppy-disk\"></i> Guardar cambios</button>
          </div>
        </form>
      </div>

      <!-- PIN -->
      <div class=\"glass p-6 mb-5\">
        <h2 class=\"font-display text-2xl mb-1\">Cambiar PIN</h2>
        <p class=\"text-sm text-slate-500 mb-4\">El PIN se usa para confirmar operaciones críticas (inscripciones, retiros, etc.).</p>
        <form id=\"form-pin\" class=\"grid sm:grid-cols-2 gap-3\" data-testid=\"perfil-pin-form\">
          <div class=\"field\"><label>Nuevo PIN (4–6 dígitos)</label><input name=\"pin\" inputmode=\"numeric\" pattern=\"\\d{4,6}\" maxlength=\"6\" required data-testid=\"perfil-pin\" /></div>
          <div class=\"field\"><label>Confirmar PIN</label><input name=\"pin2\" inputmode=\"numeric\" pattern=\"\\d{4,6}\" maxlength=\"6\" required data-testid=\"perfil-pin2\" /></div>
          <div class=\"sm:col-span-2 flex justify-end\">
            <button type=\"submit\" class=\"btn btn-primary\" data-testid=\"perfil-pin-submit\"><i class=\"ph ph-key\"></i> Actualizar PIN</button>
          </div>
        </form>
      </div>

      <!-- Password -->
      <div class=\"glass p-6 mb-5\">
        <h2 class=\"font-display text-2xl mb-1\">Cambiar contraseña</h2>
        <p class=\"text-sm text-slate-500 mb-4\">Mínimo 6 caracteres. La contraseña se guarda hasheada en este navegador.</p>
        <form id=\"form-pass\" class=\"grid sm:grid-cols-2 gap-3\" data-testid=\"perfil-pass-form\">
          <div class=\"field sm:col-span-2\"><label>Contraseña actual</label><input name=\"actual\" type=\"password\" required data-testid=\"perfil-pass-actual\" /></div>
          <div class=\"field\"><label>Nueva contraseña</label><input name=\"nueva\" type=\"password\" required minlength=\"6\" data-testid=\"perfil-pass-nueva\" /></div>
          <div class=\"field\"><label>Confirmar nueva</label><input name=\"nueva2\" type=\"password\" required minlength=\"6\" data-testid=\"perfil-pass-nueva2\" /></div>
          <div class=\"sm:col-span-2 flex justify-end\">
            <button type=\"submit\" class=\"btn btn-primary\" data-testid=\"perfil-pass-submit\"><i class=\"ph ph-lock-key\"></i> Actualizar contraseña</button>
          </div>
        </form>
      </div>

      <!-- Danger -->
      <div class=\"glass p-6 border-rose-200/60 dark:border-rose-900/40\">
        <h2 class=\"font-display text-2xl mb-1 text-rose-600 dark:text-rose-400\">Zona crítica</h2>
        <p class=\"text-sm text-slate-500 mb-4\">Cerrar sesión te llevará a la pantalla de inicio. Tus datos quedan guardados localmente.</p>
        <button class=\"btn btn-danger\" id=\"btn-logout-perfil\" data-testid=\"perfil-logout\"><i class=\"ph ph-sign-out\"></i> Cerrar sesión</button>
      </div>
    </section>`;
  }

  function mountPerfil() {
    const u = ULAStore.currentUser();
    $('#form-datos').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const r = ULAAuth.updateProfile(u.cedula, data);
      if (!r.ok) return toast(r.error, 'error');
      toast('Datos actualizados', 'success');
      window.ULARouter.render();
    });
    $('#form-pin').addEventListener('submit', (e) => {
      e.preventDefault();
      const { pin, pin2 } = Object.fromEntries(new FormData(e.target).entries());
      if (pin !== pin2) return toast('Los PIN no coinciden', 'error');
      const r = ULAAuth.updatePin(u.cedula, pin);
      if (!r.ok) return toast(r.error, 'error');
      toast('PIN actualizado', 'success');
      e.target.reset();
    });
    $('#form-pass').addEventListener('submit', (e) => {
      e.preventDefault();
      const { actual, nueva, nueva2 } = Object.fromEntries(new FormData(e.target).entries());
      if (nueva !== nueva2) return toast('Las contraseñas nuevas no coinciden', 'error');
      const r = ULAAuth.updatePassword(u.cedula, actual, nueva);
      if (!r.ok) return toast(r.error, 'error');
      toast('Contraseña actualizada', 'success');
      e.target.reset();
    });
    $('#btn-logout-perfil').addEventListener('click', () => {
      ULAAuth.logout();
      window.location.hash = '#/login';
    });
  }

  /* ====================== EXPORT ====================== */
  window.ULAViews = {
    viewLogin, mountLogin,
    viewDashboard,
    viewPlan,
    viewNotas,
    viewInscripciones,
    viewHorario,
    viewPerfil, mountPerfil,
  };
})();