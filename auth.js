
(function () {
  // Simple obfuscation (NOT secure — local-only learning portal)
  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
    return String(h >>> 0);
  }

  function normalizeCedula(c) {
    if (!c) return '';
    return c.toString().trim().replace(/\s+/g, '').toUpperCase();
  }

  function login(cedula, password) {
    cedula = normalizeCedula(cedula);
    if (!cedula || !password) return { ok: false, error: 'Ingresa tu cédula y tu contraseña.' };
    const user = ULAStore.getUserByCedula(cedula);
    if (!user) return { ok: false, error: 'No existe una cuenta con esa cédula.' };
    if (user.password_hash) {
      if (user.password_hash !== hash(password)) return { ok: false, error: 'Contraseña incorrecta.' };
    } else if (user.password && user.password !== password) {
      return { ok: false, error: 'Contraseña incorrecta.' };
    }
    ULAStore.setSession(user.cedula);
    return { ok: true, user };
  }

  function register(payload) {
    const cedula = normalizeCedula(payload.cedula);
    const required = ['nombres','apellidos','email','password'];
    for (const f of required) {
      if (!payload[f] || !payload[f].toString().trim()) {
        return { ok: false, error: `El campo \"${f}\" es obligatorio.` };
      }
    }
    if (!cedula.match(/^[VE]\d{6,10}$/i)) {
      return { ok: false, error: 'La cédula debe iniciar con V o E seguida de 6 a 10 dígitos. Ej: V031559558' };
    }
    if (payload.password.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }
    if (!payload.email.includes('@')) {
      return { ok: false, error: 'Ingresa un correo válido.' };
    }
    if (ULAStore.getUserByCedula(cedula)) {
      return { ok: false, error: 'Ya existe una cuenta con esa cédula.' };
    }

    const today = new Date();
    const fecha_ingreso = today.toLocaleDateString('es-VE');
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const trimestre = month <= 4 ? 1 : month <= 8 ? 2 : 3;

    const user = {
      cedula,
      nombres: payload.nombres.trim(),
      apellidos: payload.apellidos.trim(),
      email: payload.email.trim(),
      telefono: (payload.telefono || '').trim(),
      password_hash: hash(payload.password),
      pin: '0000',
      carrera: payload.carrera || 'fisica',
      pensum: 1,
      fecha_ingreso,
      periodo_ingreso: `${year}-${trimestre}`,
      via_ingreso: 'OPSU - Ofic. Planific. Sector Universitario',
      condicion: 'Activo',
      causa_condicion: 'Regular',
      grupo: 'U',
      arancel: 'Cancelado'
    };
    ULAStore.upsertUser(user);
    ULAStore.setNotas(user.cedula, []);
    ULAStore.setInscripciones(user.cedula, []);
    ULAStore.setHorario(user.cedula, []);
    ULAStore.setSession(user.cedula);
    return { ok: true, user };
  }

  function logout() {
    ULAStore.clearSession();
  }

  function updateProfile(cedula, patch) {
    const user = ULAStore.getUserByCedula(cedula);
    if (!user) return { ok: false, error: 'Usuario no encontrado.' };
    if (patch.email !== undefined && !patch.email.includes('@')) {
      return { ok: false, error: 'Correo inválido.' };
    }
    ULAStore.upsertUser({ ...user, ...patch });
    return { ok: true };
  }

  function updatePassword(cedula, oldPass, newPass) {
    const user = ULAStore.getUserByCedula(cedula);
    if (!user) return { ok: false, error: 'Usuario no encontrado.' };
    const currentHash = user.password_hash || (user.password ? hash(user.password) : null);
    if (currentHash && currentHash !== hash(oldPass) && user.password !== oldPass) {
      return { ok: false, error: 'La contraseña actual no es correcta.' };
    }
    if (!newPass || newPass.length < 6) return { ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    ULAStore.upsertUser({ ...user, password_hash: hash(newPass), password: undefined });
    return { ok: true };
  }

  function updatePin(cedula, newPin) {
    if (!/^\d{4,6}$/.test(newPin)) return { ok: false, error: 'El PIN debe tener entre 4 y 6 dígitos.' };
    const user = ULAStore.getUserByCedula(cedula);
    if (!user) return { ok: false, error: 'Usuario no encontrado.' };
    ULAStore.upsertUser({ ...user, pin: newPin });
    return { ok: true };
  }

  window.ULAAuth = { login, register, logout, updateProfile, updatePassword, updatePin, hash, normalizeCedula };
})();