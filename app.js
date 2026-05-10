// =====================
// MIEMBROS Y COLORES
// =====================
const MEMBERS = {
  Noelia:   { color: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8' },
  Mareada:  { color: '#EA580C', bg: '#FFF7ED', text: '#C2410C' },
  Héctor:   { color: '#059669', bg: '#ECFDF5', text: '#047857' },
  Maripla:  { color: '#EC4899', bg: '#FDF2F8', text: '#BE185D' },
  Cristian: { color: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
  Familia:  { color: '#6B7280', bg: '#F1F5F9', text: '#374151' }
};

const memberOptions = Object.keys(MEMBERS)
  .map(n => `<option value="${n}">${n}</option>`).join('');

function getMemberStyle(p) { return MEMBERS[p] || MEMBERS['Familia']; }

// =====================
// DATOS INICIALES
// =====================
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const days = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
const diasSemana = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
let currentYear = 2026, currentMonth = 4, modalType = '', modalExtra = {};

const events = [
  { id:1, name:'Médico Maripla',    date:'2026-05-14', time:'10:30', persona:'Maripla' },
  { id:2, name:'Reunión colegio',   date:'2026-05-20', time:'17:00', persona:'Familia' },
  { id:3, name:'Cumpleaños abuela', date:'2026-05-28', time:'13:00', persona:'Familia' },
  { id:4, name:'Fútbol Héctor',     date:'2026-05-16', time:'18:00', persona:'Héctor'  },
  { id:5, name:'Dentista Cristian', date:'2026-05-22', time:'11:00', persona:'Cristian'},
];

const tasks = [
  { id:1, title:'Renovar seguro del coche',   done:false, tag:'urgente', fecha:'15 may', persona:'Noelia'  },
  { id:2, title:'Comprar material escolar',   done:false, tag:'familiar', fecha:'17 may', persona:'Familia' },
  { id:3, title:'Llamar al fontanero',        done:true,  tag:'casa',    fecha:'10 may', persona:'Noelia'  },
  { id:4, title:'Pedir cita dentista',        done:false, tag:'personal',fecha:'20 may', persona:'Maripla' },
  { id:5, title:'Partido de fútbol',          done:false, tag:'personal',fecha:'16 may', persona:'Héctor'  },
];

const reminders = [
  { id:1, title:'Medicación Mareada', time:'09:00 diario',       when:'hoy',    icon:'💊', persona:'Mareada' },
  { id:2, title:'Basura reciclaje',   time:'Martes y viernes',   when:'manana', icon:'♻️', persona:'Familia' },
  { id:3, title:'Pago comunidad',     time:'1 de cada mes',      when:'pronto', icon:'🏢', persona:'Noelia'  },
  { id:4, title:'Revisión ITV',       time:'15 de mayo',         when:'pronto', icon:'🚗', persona:'Cristian'},
];

const docs = [
  { id:1, name:'DNI Maripla',     type:'pdf',  fecha:'Ene 2026', icon:'🪪', persona:'Maripla' },
  { id:2, name:'Foto vacaciones', type:'img',  fecha:'Ago 2025', icon:'🏖️', persona:'Familia' },
  { id:3, name:'Receta médica',   type:'pdf',  fecha:'May 2026', icon:'📋', persona:'Mareada' },
  { id:4, name:'Lista compra',    type:'note', fecha:'Hoy',      icon:'🛒', persona:'Noelia'  },
];

const compra = [
  { id:1, nombre:'Leche',      cat:'lácteos',  done:false },
  { id:2, nombre:'Manzanas',   cat:'frutas',   done:false },
  { id:3, nombre:'Yogures',    cat:'lácteos',  done:true  },
  { id:4, nombre:'Detergente', cat:'limpieza', done:false },
  { id:5, nombre:'Plátanos',   cat:'frutas',   done:false },
  { id:6, nombre:'Queso',      cat:'lácteos',  done:false },
];

const meds = [
  { id:1, nombre:'Ibuprofeno 400mg', persona:'Mareada', dosis:'1 comprimido', frecuencia:'Cada 8h con comida',      hasta:'15 may'     },
  { id:2, nombre:'Vitamina D',       persona:'Maripla', dosis:'1 cápsula',    frecuencia:'1 vez al día en ayunas', hasta:'Indefinido' },
  { id:3, nombre:'Antihistamínico',  persona:'Héctor',  dosis:'1 comprimido', frecuencia:'Por las noches',         hasta:'30 may'     },
];

const menuData = {
  Lu: { comida:'Lentejas con verduras', cena:'Tortilla francesa'  },
  Ma: { comida:'Pollo al horno',        cena:'Sopa de fideos'      },
  Mi: { comida:'Pasta boloñesa',        cena:'Ensalada mixta'      },
  Ju: { comida:'Merluza al vapor',      cena:'Croquetas caseras'   },
  Vi: { comida:'Arroz con pollo',       cena:'Pizza casera'        },
  Sá: { comida:'Paella familiar',       cena:'Bocadillos'          },
  Do: { comida:'Cocido madrileño',      cena:'Sobras / libre'      },
};

const notes = [
  { id:1, title:'📶 Contraseña WiFi',   body:'Nombre: CasaFamilia_5G\nContraseña: familia2026!',                          persona:'Noelia', fecha:'10 may' },
  { id:2, title:'🔧 Número fontanero',  body:'Pepe García: 666 123 456\nDisponible L-V de 8 a 18h',                       persona:'Noelia', fecha:'8 may'  },
  { id:3, title:'☀️ Ideas para verano', body:'Playa en agosto, quizá Cantabria o norte. Preguntar a los abuelos.',         persona:'Familia',fecha:'5 may'  },
];

// =====================
// NAVEGACIÓN
// =====================
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');
}

// =====================
// LEYENDA MIEMBROS
// =====================
function renderLegend() {
  document.getElementById('members-legend').innerHTML = Object.entries(MEMBERS)
    .map(([n, s]) => `
      <div class="member-pill" style="background:${s.bg};border-color:${s.color}">
        <div class="color-dot" style="background:${s.color}"></div>
        <span style="color:${s.text}">${n}</span>
      </div>`
    ).join('');
}

// =====================
// CALENDARIO
// =====================
function renderCalendar() {
  document.getElementById('cal-month-title').textContent = months[currentMonth] + ' ' + currentYear;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');

  const first = new Date(currentYear, currentMonth, 1);
  let startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = new Date(currentYear, currentMonth, 0).getDate();
  const today = new Date();

  for (let i = startDay - 1; i >= 0; i--)
    grid.innerHTML += `<div class="cal-day other-month"><div class="day-num">${prevDays - i}</div></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
    const dots = events.filter(e => e.date === dateStr).map(e => {
      const s = getMemberStyle(e.persona);
      return `<div class="day-event-dot" style="background:${s.color}" title="${e.name}"></div>`;
    }).join('');
    grid.innerHTML += `<div class="cal-day${isToday ? ' today' : ''}"><div class="day-num">${d}</div><div class="day-events">${dots}</div></div>`;
  }
}

function renderEvents() {
  document.getElementById('events-container').innerHTML = [...events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => {
      const s = getMemberStyle(e.persona);
      const label = new Date(e.date + 'T12:00:00').toLocaleDateString('es-ES', { day:'numeric', month:'short' });
      return `
        <div class="event-item">
          <div class="event-bar" style="background:${s.color}"></div>
          <div class="event-info">
            <div class="event-name">${e.name}</div>
            <div class="event-meta">📅 ${label} · ⏰ ${e.time}
              <span class="member-tag" style="background:${s.bg};color:${s.text}">${e.persona}</span>
            </div>
          </div>
          <button class="icon-btn" onclick="deleteItem(events,${e.id},renderCalendar,renderEvents)">🗑️</button>
        </div>`;
    }).join('');
}

function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  renderCalendar();
  renderEvents();
}

// =====================
// TAREAS
// =====================
function renderTasks(filter = 'todas') {
  let list = tasks;
  if (filter === 'pendientes') list = tasks.filter(t => !t.done);
  if (filter === 'hechas ✓')  list = tasks.filter(t => t.done);
  document.getElementById('tasks-container').innerHTML = list.map(t => {
    const s = getMemberStyle(t.persona);
    return `
      <div class="task-item${t.done ? ' done' : ''}">
        <div class="task-check${t.done ? ' checked' : ''}" onclick="toggleTask(${t.id})">${t.done ? '✓' : ''}</div>
        <div class="task-body">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">
            <span class="tag ${t.tag}">${t.tag}</span>
            <span>📅 ${t.fecha}</span>
            <span class="member-tag" style="background:${s.bg};color:${s.text}">${t.persona}</span>
          </div>
        </div>
        <button class="icon-btn" onclick="deleteItem(tasks,${t.id},()=>renderTasks(currentFilter()))">🗑️</button>
      </div>`;
  }).join('');
}

function currentFilter() {
  const a = document.querySelector('.filter-pill.active');
  return a ? a.textContent.toLowerCase().trim() : 'todas';
}

function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) t.done = !t.done;
  renderTasks(currentFilter());
}

function filterTasks(f, btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTasks(f);
}

// =====================
// RECORDATORIOS
// =====================
function renderReminders() {
  document.getElementById('reminders-container').innerHTML = reminders.map(r => {
    const s = getMemberStyle(r.persona);
    const label = r.when === 'hoy' ? '🔴 Hoy' : r.when === 'manana' ? '🟢 Mañana' : '🔵 Próximamente';
    return `
      <div class="reminder-card" style="border-top:3px solid ${s.color}">
        <div class="reminder-icon">${r.icon}</div>
        <div class="reminder-title">${r.title}</div>
        <div class="reminder-time">🕐 ${r.time}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:9px">
          <span class="reminder-badge ${r.when}">${label}</span>
          <span class="member-tag" style="background:${s.bg};color:${s.text}">${r.persona}</span>
        </div>
      </div>`;
  }).join('');
}

// =====================
// LISTA DE COMPRA
// =====================
let compraFilter = 'todas';

const catColors = {
  frutas:   { bg:'#ECFDF5', text:'#047857' },
  lácteos:  { bg:'#EFF6FF', text:'#1D4ED8' },
  limpieza: { bg:'#FDF2F8', text:'#BE185D' },
  otros:    { bg:'#F1F5F9', text:'#374151' }
};

function renderCompra() {
  const list = compraFilter === 'todas' ? compra : compra.filter(c => c.cat === compraFilter);
  const total = compra.length, done = compra.filter(c => c.done).length;
  document.getElementById('compra-stats-txt').textContent = `✅ ${done} de ${total} marcados`;
  document.getElementById('compra-bar').style.width = total ? Math.round(done / total * 100) + '%' : '0%';
  document.getElementById('compra-limpiar').style.display = done > 0 ? 'block' : 'none';
  document.getElementById('compra-container').innerHTML = list.map(c => {
    const cc = catColors[c.cat] || catColors.otros;
    return `
      <div class="compra-item${c.done ? ' comprado' : ''}">
        <div class="compra-check${c.done ? ' checked' : ''}" onclick="toggleCompra(${c.id})">${c.done ? '✓' : ''}</div>
        <div class="compra-name">${c.nombre}</div>
        <span class="compra-cat-tag" style="background:${cc.bg};color:${cc.text}">${c.cat}</span>
        <button class="icon-btn" onclick="deleteItem(compra,${c.id},renderCompra)">🗑️</button>
      </div>`;
  }).join('');
}

function filterCompra(f, btn) {
  compraFilter = f;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderCompra();
}

function toggleCompra(id) {
  const c = compra.find(c => c.id === id);
  if (c) c.done = !c.done;
  renderCompra();
}

function limpiarCompra() {
  compra.forEach(c => { c.done = false; });
  renderCompra();
}

// =====================
// MENÚ SEMANAL
// =====================
function renderMenu() {
  document.getElementById('menu-grid').innerHTML = diasSemana.map(d => {
    const data = menuData[d] || {};
    return `
      <div class="menu-day-col">
        <div class="menu-day-name">${d}</div>
        <div class="menu-slot" onclick="editMenu('${d}','comida')">
          <div class="menu-slot-label">🍽 Comida</div>
          <div class="menu-slot-val${data.comida ? '' : ' empty'}">${data.comida || 'Sin planear'}</div>
        </div>
        <div class="menu-slot" onclick="editMenu('${d}','cena')">
          <div class="menu-slot-label">🌙 Cena</div>
          <div class="menu-slot-val${data.cena ? '' : ' empty'}">${data.cena || 'Sin planear'}</div>
        </div>
      </div>`;
  }).join('');
}

function editMenu(dia, tipo) {
  modalType = 'menu_slot';
  modalExtra = { dia, tipo };
  document.getElementById('modal-title').textContent = `${dia} · ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
  document.getElementById('modal-body').innerHTML = `
    <label>¿Qué hay de ${tipo}?</label>
    <input type="text" id="m-menu" placeholder="Ej: Paella, ensalada..." value="${menuData[dia]?.[tipo] || ''}">`;
  openModal();
}

// =====================
// NOTAS
// =====================
const noteColors = {
  Noelia:   { bg:'#EFF6FF', title:'#1D4ED8' },
  Mareada:  { bg:'#FFF7ED', title:'#C2410C' },
  Héctor:   { bg:'#ECFDF5', title:'#047857' },
  Maripla:  { bg:'#FDF2F8', title:'#BE185D' },
  Cristian: { bg:'#FEF2F2', title:'#B91C1C' },
  Familia:  { bg:'#F0F5FF', title:'#1E3A8A' }
};

function renderNotes() {
  document.getElementById('notes-container').innerHTML = notes.map(n => {
    const s = getMemberStyle(n.persona);
    const c = noteColors[n.persona] || noteColors.Familia;
    return `
      <div class="note-card" style="background:${c.bg}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div class="note-title" style="color:${c.title}">${n.title}</div>
          <button class="icon-btn" onclick="deleteItem(notes,${n.id},renderNotes)">🗑️</button>
        </div>
        <div class="note-body" style="color:${s.text}">${n.body.replace(/\n/g, '<br>')}</div>
        <div class="note-footer">
          <span class="member-tag" style="background:${s.bg};color:${s.text}">${n.persona}</span>
          <span class="note-date">${n.fecha}</span>
        </div>
      </div>`;
  }).join('');
}

// =====================
// MEDICAMENTOS
// =====================
function renderMeds() {
  document.getElementById('med-container').innerHTML = meds.map(m => {
    const s = getMemberStyle(m.persona);
    return `
      <div class="med-card" style="border-top:3px solid ${s.color}">
        <div class="med-header">
          <div>
            <div class="med-name">${m.nombre}</div>
            <span class="member-tag" style="background:${s.bg};color:${s.text}">${m.persona}</span>
          </div>
          <button class="icon-btn" onclick="deleteItem(meds,${m.id},renderMeds)">🗑️</button>
        </div>
        <div class="med-body">
          <div class="med-row">💊 ${m.dosis}</div>
          <div class="med-row">🕐 ${m.frecuencia}</div>
          <div class="med-row">📅 Hasta: ${m.hasta}</div>
        </div>
      </div>`;
  }).join('');
}

// =====================
// DOCUMENTOS
// =====================
function renderDocs() {
  document.getElementById('docs-container').innerHTML = docs.map(d => {
    const s = getMemberStyle(d.persona);
    return `
      <div class="doc-card" style="border-top:3px solid ${s.color}">
        <div style="font-size:28px;margin-bottom:9px">${d.icon}</div>
        <div class="doc-name">${d.name}</div>
        <div class="doc-meta">${d.type.toUpperCase()} · ${d.fecha}</div>
        <div style="margin-top:8px">
          <span class="member-tag" style="background:${s.bg};color:${s.text}">${d.persona}</span>
        </div>
      </div>`;
  }).join('');
}

// =====================
// UTILIDADES
// =====================
function deleteItem(arr, id, ...renders) {
  arr.splice(arr.findIndex(x => x.id === id), 1);
  renders.forEach(r => r());
}

// =====================
// MODAL
// =====================
const modalForms = {
  evento: `
    <label>Nombre</label><input type="text" id="m-name" placeholder="Ej: Médico, cumpleaños...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Fecha</label><input type="date" id="m-date">
    <label>Hora</label><input type="time" id="m-time">`,
  tarea: `
    <label>Tarea</label><input type="text" id="m-name" placeholder="Descripción">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Categoría</label>
    <select id="m-tag">
      <option value="familiar">Familiar</option>
      <option value="casa">Casa</option>
      <option value="personal">Personal</option>
      <option value="urgente">Urgente</option>
      <option value="trabajo">Trabajo</option>
    </select>
    <label>Fecha límite</label><input type="date" id="m-date">`,
  recordatorio: `
    <label>Título</label><input type="text" id="m-name" placeholder="Ej: Medicación...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Frecuencia</label><input type="text" id="m-time" placeholder="Ej: 09:00 diario">
    <label>Cuándo</label>
    <select id="m-when">
      <option value="hoy">Hoy</option>
      <option value="manana">Mañana</option>
      <option value="pronto">Próximamente</option>
    </select>`,
  compra: `
    <label>Producto</label><input type="text" id="m-name" placeholder="Ej: Leche, pan...">
    <label>Categoría</label>
    <select id="m-cat">
      <option value="frutas">🍎 Frutas</option>
      <option value="lácteos">🥛 Lácteos</option>
      <option value="limpieza">🧹 Limpieza</option>
      <option value="otros">📦 Otros</option>
    </select>`,
  medicamento: `
    <label>Medicamento</label><input type="text" id="m-name" placeholder="Nombre y dosis">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Dosis</label><input type="text" id="m-dosis" placeholder="Ej: 1 comprimido">
    <label>Frecuencia</label><input type="text" id="m-freq" placeholder="Ej: Cada 8h con comida">
    <label>Hasta</label><input type="text" id="m-hasta" placeholder="Ej: 30 may / Indefinido">`,
  nota: `
    <label>Título</label><input type="text" id="m-name" placeholder="Ej: Contraseña WiFi">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Contenido</label><textarea id="m-content" placeholder="Escribe la nota..."></textarea>`,
  documento: `
    <label>Nombre</label><input type="text" id="m-name" placeholder="Ej: Factura, DNI...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Tipo</label>
    <select id="m-type">
      <option value="note">📝 Nota</option>
      <option value="pdf">📄 PDF</option>
      <option value="img">📷 Imagen</option>
    </select>`,
};

const modalTitles = {
  evento:       '📅 Nuevo evento',
  tarea:        '✅ Nueva tarea',
  recordatorio: '🔔 Nuevo recordatorio',
  compra:       '🛒 Añadir producto',
  medicamento:  '💊 Nuevo medicamento',
  nota:         '📝 Nueva nota',
  documento:    '📁 Nuevo documento',
};

function showModal(type) {
  modalType = type;
  modalExtra = {};
  document.getElementById('modal-title').textContent = modalTitles[type];
  document.getElementById('modal-body').innerHTML = modalForms[type];
  openModal();
}

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

function saveModal() {
  if (modalType === 'menu_slot') {
    const val = document.getElementById('m-menu')?.value.trim();
    if (!menuData[modalExtra.dia]) menuData[modalExtra.dia] = {};
    menuData[modalExtra.dia][modalExtra.tipo] = val;
    renderMenu();
    closeModal();
    return;
  }

  const name = document.getElementById('m-name')?.value.trim();
  if (!name) return;

  const persona = document.getElementById('m-persona')?.value || 'Familia';
  const today = new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short' });

  if (modalType === 'evento') {
    const date = document.getElementById('m-date')?.value || '2026-05-10';
    const time = document.getElementById('m-time')?.value || '12:00';
    events.push({ id: Date.now(), name, date, time, persona });
    renderCalendar(); renderEvents();

  } else if (modalType === 'tarea') {
    const tag = document.getElementById('m-tag')?.value || 'familiar';
    const d = document.getElementById('m-date')?.value;
    const fecha = d ? new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day:'numeric', month:'short' }) : '-';
    tasks.push({ id: Date.now(), title: name, done: false, tag, fecha, persona });
    renderTasks();

  } else if (modalType === 'recordatorio') {
    const time = document.getElementById('m-time')?.value || 'Sin hora';
    const when = document.getElementById('m-when')?.value || 'pronto';
    reminders.push({ id: Date.now(), title: name, time, when, icon: '🔔', persona });
    renderReminders();

  } else if (modalType === 'compra') {
    const cat = document.getElementById('m-cat')?.value || 'otros';
    compra.push({ id: Date.now(), nombre: name, cat, done: false });
    renderCompra();

  } else if (modalType === 'medicamento') {
    const dosis = document.getElementById('m-dosis')?.value || '-';
    const frecuencia = document.getElementById('m-freq')?.value || '-';
    const hasta = document.getElementById('m-hasta')?.value || 'Indefinido';
    meds.push({ id: Date.now(), nombre: name, persona, dosis, frecuencia, hasta });
    renderMeds();

  } else if (modalType === 'nota') {
    const body = document.getElementById('m-content')?.value || '';
    notes.push({ id: Date.now(), title: name, body, persona, fecha: today });
    renderNotes();

  } else if (modalType === 'documento') {
    const type = document.getElementById('m-type')?.value || 'note';
    const iconMap = { note:'📝', pdf:'📄', img:'📷' };
    docs.push({ id: Date.now(), name, type, fecha: today, icon: iconMap[type], persona });
    renderDocs();
  }

  closeModal();
}

// =====================
// INICIO
// =====================
renderLegend();
renderCalendar();
renderEvents();
renderTasks();
renderReminders();
renderCompra();
renderMenu();
renderNotes();
renderMeds();
renderDocs();
