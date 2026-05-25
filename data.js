
window.ULA_CARRERAS = [
  {
    id: 'fisica',
    nombre: 'Física',
    icono: 'ph-atom',
    color: '#1E3A8A',
    activa: true,
    duracion_meses: 60,
    periodos: 10,
    pensum: 1,
    descripcion: 'Licenciatura en Física · Pensum 1 · 10 semestres'
  },
  { id: 'matematicas', nombre: 'Matemáticas', icono: 'ph-function', color: '#7C3AED', activa: false, descripcion: 'Próximamente' },
  { id: 'quimica',     nombre: 'Química',     icono: 'ph-flask',    color: '#059669', activa: false, descripcion: 'Próximamente' },
  { id: 'biologia',    nombre: 'Biología',    icono: 'ph-leaf',     color: '#16A34A', activa: false, descripcion: 'Próximamente' },
];

/**
 * Plan de Estudio de la carrera de Física (Pensum 1).
 * Extraído del documento oficial CEPI-SIRE de la ULA, Facultad de Ciencias.
 * Las prelaciones aproximadas se modelan con `prelaciones` (códigos)
 * y `creditos_req` (créditos aprobados mínimos para inscribirse).
 */
window.ULA_PLAN_FISICA = [
  { semestre: 1, asignaturas: [
    { codigo: '21101', nombre: 'Idiomas 10', creditos: 4, tipo: 'OB', ciclo: 'F', horas: 4 },
    { codigo: '21102', nombre: 'Matemáticas 10', creditos: 6, tipo: 'OB', ciclo: 'F', horas: 6 },
    { codigo: '21103', nombre: 'Sociología 10', creditos: 3, tipo: 'OB', ciclo: 'F', horas: 3 },
    { codigo: '21104', nombre: 'Técnicas de estudio 10', creditos: 4, tipo: 'OB', ciclo: 'F', horas: 4 },
  ]},
  { semestre: 2, asignaturas: [
    { codigo: '21201', nombre: 'Física 11', creditos: 5, tipo: 'OB', ciclo: 'F', horas: 5, prelaciones: ['21102'] },
    { codigo: '21202', nombre: 'Idiomas 20', creditos: 4, tipo: 'OB', ciclo: 'F', horas: 4, prelaciones: ['21101'] },
    { codigo: '21203', nombre: 'Matemáticas 20', creditos: 6, tipo: 'OB', ciclo: 'F', horas: 6, prelaciones: ['21102'] },
    { codigo: '21204', nombre: 'Química 11', creditos: 5, tipo: 'OB', ciclo: 'F', horas: 5 },
  ]},
  { semestre: 3, asignaturas: [
    { codigo: '21301', nombre: 'Física 21', creditos: 5, tipo: 'OB', ciclo: 'F', horas: 5, prelaciones: ['21201','21203'] },
    { codigo: '21302', nombre: 'Laboratorio 1 de Física', creditos: 2, tipo: 'OB', ciclo: 'F', horas: 4, prelaciones: ['21201'] },
    { codigo: '21303', nombre: 'Matemáticas 30', creditos: 6, tipo: 'OB', ciclo: 'F', horas: 6, prelaciones: ['21203'] },
  ]},
  { semestre: 4, asignaturas: [
    { codigo: '21401', nombre: 'Física general 3', creditos: 5, tipo: 'OB', ciclo: 'F', horas: 5, prelaciones: ['21301'] },
    { codigo: '21402', nombre: 'Laboratorio 2 de Física', creditos: 2, tipo: 'OB', ciclo: 'F', horas: 4, prelaciones: ['21302'] },
    { codigo: '21403', nombre: 'Matemáticas de la Física 1', creditos: 6, tipo: 'OB', ciclo: 'F', horas: 6, prelaciones: ['21303'] },
    { codigo: '21404', nombre: 'Mecánica', creditos: 5, tipo: 'OB', ciclo: 'F', horas: 5, prelaciones: ['21301'] },
  ]},
  { semestre: 5, asignaturas: [
    { codigo: '22101', nombre: 'Ciencia y sociedad', creditos: 1, tipo: 'OB', ciclo: 'G', horas: 1 },
    { codigo: '22102', nombre: 'Electrónica', creditos: 6, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['21401'] },
    { codigo: '22103', nombre: 'Física moderna 1', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5, prelaciones: ['21401','21404'] },
    { codigo: '22104', nombre: 'Matemáticas de la Física 2', creditos: 6, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['21403'] },
  ]},
  { semestre: 6, asignaturas: [
    { codigo: '22201', nombre: 'Física estadística', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5, prelaciones: ['22103'] },
    { codigo: '22202', nombre: 'Física moderna 2', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5, prelaciones: ['22103'] },
    { codigo: '22203', nombre: 'Mecánica clásica', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5, prelaciones: ['21404','22104'] },
    { codigo: '22204', nombre: 'Programación y Diseño algorítmico 1', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5 },
  ]},
  { semestre: 7, asignaturas: [
    { codigo: '22301', nombre: 'Laboratorio 3', creditos: 3, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['21402'] },
    { codigo: '22302', nombre: 'Matemáticas de la Física 3', creditos: 6, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['22104'] },
    { codigo: '22303', nombre: 'Mecánica cuántica', creditos: 6, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['22202','22203'] },
  ]},
  { semestre: 8, asignaturas: [
    { codigo: '22401', nombre: 'Electromagnetismo', creditos: 5, tipo: 'OB', ciclo: 'G', horas: 5, prelaciones: ['22302'] },
    { codigo: '22402', nombre: 'Laboratorio 4', creditos: 3, tipo: 'OB', ciclo: 'G', horas: 6, prelaciones: ['22301'] },
  ]},
  { semestre: 9, asignaturas: [
    { codigo: '23102', nombre: 'Seminario', creditos: 6, tipo: 'OB', ciclo: 'E', horas: 6, restringida: true },
  ]},
  { semestre: 10, asignaturas: [
    { codigo: '23199', nombre: 'Inducción al Servicio Comunitario', creditos: 0, tipo: 'OB', ciclo: 'E', horas: 0, creditos_req: 86 },
    { codigo: '23200', nombre: 'Servicio Comunitario', creditos: 0, tipo: 'OB', ciclo: 'E', horas: 8, creditos_req: 86 },
    { codigo: '23201', nombre: 'Tesis de grado', creditos: 28, tipo: 'OB', ciclo: 'E', horas: 16, creditos_req: 139 },
  ]},
];

/* Electivas (disponibles desde el ciclo General) */
window.ULA_ELECTIVAS_FISICA = [
  { codigo: '22330', nombre: 'Electiva Astrofísica General 1', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22331', nombre: 'Electiva Estado Sólido 1', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22334', nombre: 'Electiva Geofísica 1', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22335', nombre: 'Electiva Superficies 1', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22337', nombre: 'Electiva Astronomía Básica 1', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22341', nombre: 'Electiva Programación y Diseño algorítmico 2', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22351', nombre: 'Electiva Fund. Electrodinámica clásica y efecto cuántico', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22369', nombre: 'Electiva Análisis y Procesamiento de Datos', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22378', nombre: 'Electiva Tópicos de Astrofísica Teórica', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22382', nombre: 'Electiva Int. a la Física de Partículas', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22431', nombre: 'Electiva Astronomía Básica 2', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22432', nombre: 'Electiva Mecánica Cuántica 2', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22433', nombre: 'Electiva Astrofísica General 2', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22435', nombre: 'Electiva Geofísica 2', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22437', nombre: 'Electiva Superficies 2', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22439', nombre: 'Electiva Teoría Clásica de Campos', creditos: 5, tipo: 'EL', ciclo: 'G', restringida: true },
  { codigo: '22442', nombre: 'Electiva Inteligencia Artificial', creditos: 5, tipo: 'EL', ciclo: 'G' },
  { codigo: '22446', nombre: 'Electiva Introducción a la Física Médica', creditos: 6, tipo: 'EL', ciclo: 'G', creditos_req: 121 },
  { codigo: '22501', nombre: 'Electiva FisicoQuímica 3', creditos: 5, tipo: 'EL', ciclo: 'G', creditos_req: 121 },
  { codigo: '22502', nombre: 'Electiva Mecánica de Fluidos', creditos: 5, tipo: 'EL', ciclo: 'G', creditos_req: 106, restringida: true },
];

/* Períodos académicos disponibles */
window.ULA_PERIODOS = ['2023-1','2023-2','2023-3','2024-1','2024-2','2024-3','2025-1','2025-2','2025-3','2026-1'];

/* Horarios: días y bloques horarios */
window.ULA_DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
window.ULA_HORAS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

/* Vías de ingreso ULA */
window.ULA_VIAS_INGRESO = ['OPSU - Ofic. Planific. Sector Universitario','Prueba Interna','Convenio','Equivalencia','Reincorporación'];

/* Cuenta DEMO pre-cargada (registro abierto continúa funcionando) */
window.ULA_DEMO_USER = {
  cedula: 'V031559558',
  nombres: 'Yefferson Andrés',
  apellidos: 'Hernández Martínez',
  email: 'yefferson.hernandez@estudiantes.ula.ve',
  telefono: '+58 424 7654321',
  password: 'fisica2024',
  pin: '0000',
  carrera: 'fisica',
  pensum: 1,
  fecha_ingreso: '04/10/2023',
  periodo_ingreso: '2023-3',
  via_ingreso: 'OPSU - Ofic. Planific. Sector Universitario',
  condicion: 'Activo',
  causa_condicion: 'Regular',
  grupo: 'U',
  arancel: 'Cancelado'
};

/* Notas DEMO (historial) — alineadas al perfil mostrado en la captura original */
window.ULA_DEMO_NOTAS = [
  { codigo: '21101', periodo: '2023-3', nota: 14, creditos: 4, condicion: 'Aprobada' },
  { codigo: '21102', periodo: '2023-3', nota: 12, creditos: 6, condicion: 'Aprobada' },
  { codigo: '21103', periodo: '2023-3', nota: 15, creditos: 3, condicion: 'Aprobada' },
  { codigo: '21104', periodo: '2023-3', nota: 13, creditos: 4, condicion: 'Aprobada' },
  { codigo: '21201', periodo: '2024-1', nota: 11, creditos: 5, condicion: 'Aprobada' },
  { codigo: '21203', periodo: '2024-1', nota: 14, creditos: 6, condicion: 'Aprobada' },
  { codigo: '21204', periodo: '2024-1', nota: 16, creditos: 5, condicion: 'Aprobada' },
  { codigo: '21202', periodo: '2024-1', nota: 8,  creditos: 4, condicion: 'Reprobada' },
  { codigo: '21202', periodo: '2024-2', nota: 9,  creditos: 4, condicion: 'Reprobada' },
  { codigo: '21301', periodo: '2024-2', nota: 7,  creditos: 5, condicion: 'Reprobada' },
  { codigo: '21302', periodo: '2024-2', nota: 10, creditos: 2, condicion: 'Reprobada' },
  { codigo: '21303', periodo: '2024-2', nota: 11, creditos: 6, condicion: 'Reprobada' },
  { codigo: '21202', periodo: '2024-3', nota: 13, creditos: 4, condicion: 'Aprobada' },
];

/* Inscripción actual demo: 1 asignatura, 6 UC, 6 horas (como en la captura) */
window.ULA_DEMO_INSCRIPCIONES = [
  { codigo: '21303', seccion: '01', dia: 'Lunes',     hora_inicio: '08:00', hora_fin: '10:00', aula: 'A-201' },
  { codigo: '21303', seccion: '01', dia: 'Miércoles', hora_inicio: '08:00', hora_fin: '10:00', aula: 'A-201' },
  { codigo: '21303', seccion: '01', dia: 'Viernes',   hora_inicio: '08:00', hora_fin: '10:00', aula: 'A-201' },
];

/* Helper: aplanar plan en una sola lista de asignaturas */
window.ULA_TODAS_LAS_ASIGNATURAS = (function () {
  const all = [];
  window.ULA_PLAN_FISICA.forEach(s => s.asignaturas.forEach(a => all.push({ ...a, semestre: s.semestre })));
  window.ULA_ELECTIVAS_FISICA.forEach(a => all.push({ ...a, semestre: null }));
  return all;
})();

window.ULA_BUSCAR_ASIGNATURA = function (codigo) {
  return window.ULA_TODAS_LAS_ASIGNATURAS.find(a => a.codigo === codigo) || null;
};