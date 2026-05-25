
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const routes = ['login','dashboard','plan','notas','inscripciones','horario','perfil'];

  function parseHash() {
    const raw = (window.location.hash || '').replace(/^#\/?/, '');
    const [name, qs] = raw.split('?');
    const route = routes.includes(name) ? name : (ULAStore.getSession() ? 'dashboard' : 'login');
    const params = {};
    if (qs) qs.split('&').forEach(p => { const [k, v] = p.split('='); params[k] = decodeURIComponent(v || ''); });
    return { route, params };
  }

  function requireAuth(route) {
    if (route !== 'login' && !ULAStore.getSession()) {
      window.location.hash = '#/login';
      return false;
    }
    if (route === 'login' && ULAStore.getSession()) {
      window.location.hash = '#/dashboard';
      return false;
    }
    return true;
  }

  function setChrome(isAuthView) {
    $('#topbar').classList.toggle('hidden', isAuthView);
    $('#footer').classList.toggle('hidden', isAuthView);
  }

  function render() {
    const { route } = parseHash();
    if (!requireAuth(route)) return;
    setChrome(route === 'login');

    const main = $('#app-root');
    main.classList.remove('animate-fade-up');
    let html = '';
    let onMount = null;

    if (route === 'login') {
      html = ULAViews.viewLogin();
      onMount = ULAViews.mountLogin;
    } else if (route === 'dashboard') {
      html = ULAViews.viewDashboard();
    } else if (route === 'plan') {
      html = ULAViews.viewPlan();
    } else if (route === 'notas') {
      html = ULAViews.viewNotas();
    } else if (route === 'inscripciones') {
      html = ULAViews.viewInscripciones();
    } else if (route === 'horario') {
      html = ULAViews.viewHorario();
    } else if (route === 'perfil') {
      html = ULAViews.viewPerfil();
      onMount = ULAViews.mountPerfil;
    }

    main.innerHTML = html;
    if (onMount) onMount();

    // Highlight nav
    $$('#primary-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
    refreshUserChrome();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.ULARouter = { render, parseHash };

  /* ---------- Top chrome (user, career, theme) ---------- */
  function refreshUserChrome() {
    const u = ULAStore.currentUser();
    if (!u) return;
    $('#user-shortname').textContent = window.ULAUI.shortName(u);
    $('#user-avatar').textContent = window.ULAUI.initials(u);
    $('#year').textContent = new Date().getFullYear();
    // Career label
    const car = (window.ULA_CARRERAS.find(c => c.id === u.carrera) || window.ULA_CARRERAS[0]);
    $('#career-label').textContent = car.nombre;
  }

  function buildCareerMenu() {
    const u = ULAStore.currentUser();
    const items = window.ULA_CARRERAS.map(c => {
      const active = u && u.carrera === c.id;
      const dis = !c.activa;
      return `<button class=\"menu-item w-full text-left ${dis ? 'opacity-60 cursor-not-allowed' : ''}\" ${dis ? 'disabled' : ''} data-career=\"${c.id}\" data-testid=\"career-option-${c.id}\">
        <i class=\"ph ${c.icono}\"></i>
        <div class=\"flex-1\">
          <div class=\"font-medium\">${c.nombre}</div>
          <div class=\"text-[11px] text-slate-500\">${c.descripcion || ''}</div>
        </div>
        ${active ? '<i class=\"ph-fill ph-check-circle text-emerald-500\"></i>' : dis ? '<i class=\"ph ph-lock-key text-slate-400\"></i>' : ''}
      </button>`;
    }).join('');
    $('#career-menu').innerHTML = items;
    $$('#career-menu [data-career]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.career;
      const car = window.ULA_CARRERAS.find(c => c.id === id);
      if (!car || !car.activa) return;
      const cu = ULAStore.currentUser();
      if (cu) ULAAuth.updateProfile(cu.cedula, { carrera: id });
      window.toast(`Carrera cambiada a ${car.nombre}`, 'info');
      $('#career-menu').classList.add('hidden');
      render();
    }));
  }

  function buildMobileNav() {
    const links = [
      ['dashboard','ph-squares-four','Resumen'],
      ['plan','ph-graph','Plan'],
      ['notas','ph-exam','Notas'],
      ['inscripciones','ph-clipboard-text','Inscrip.'],
      ['horario','ph-calendar-blank','Horario'],
      ['perfil','ph-user-gear','Perfil'],
    ];
    $('#mobile-nav').innerHTML = links.map(([r,i,t]) =>
      `<a href=\"#/${r}\" class=\"nav-link justify-center\" data-testid=\"mobile-nav-${r}\"><i class=\"ph ${i}\"></i><span>${t}</span></a>`
    ).join('');
  }

  /* ---------- Wire events ---------- */
  function wireGlobalEvents() {
    // Theme
    $('#theme-toggle').addEventListener('click', () => ULAStore.toggleTheme());

    // Toggle menus
    $('#user-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#user-menu').classList.toggle('hidden');
      $('#career-menu').classList.add('hidden');
    });
    $('#career-trigger').addEventListener('click', (e) => {
      e.stopPropagation();
      buildCareerMenu();
      $('#career-menu').classList.toggle('hidden');
      $('#user-menu').classList.add('hidden');
    });
    document.addEventListener('click', () => {
      $('#user-menu').classList.add('hidden');
      $('#career-menu').classList.add('hidden');
    });
    [$('#user-menu'), $('#career-menu')].forEach(el => el && el.addEventListener('click', e => e.stopPropagation()));

    // Logout
    $('#logout-btn').addEventListener('click', () => {
      ULAAuth.logout();
      window.location.hash = '#/login';
      window.toast('Sesión cerrada', 'info');
    });

    // Mobile menu toggle
    $('#mobile-menu-btn').addEventListener('click', () => {
      $('#mobile-nav').classList.toggle('hidden');
    });

    // Hash routing
    window.addEventListener('hashchange', () => {
      $('#mobile-nav').classList.add('hidden');
      render();
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Seed demo
    ULAStore.seedDemoIfMissing();
    // Theme init
    document.documentElement.classList.toggle('dark', ULAStore.getTheme() === 'dark');
    buildMobileNav();
    wireGlobalEvents();
    render();
  });
})();
