// =====================
// SUPABASE CONFIG
// =====================
const SUPABASE_URL = 'https://rufqicrpcxnxysxouaxt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cljKe44XH76vob40WyutYg_nilFVYUM';

async function dbGet(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=id.asc`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  return res.json();
}

async function dbAdd(table, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(data)
  });
}

async function dbDelete(table, id) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
}

async function dbUpdate(table, id, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// =====================
// MIEMBROS Y COLORES
// =====================
const MEMBERS = {
  Noelia:   { color: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8' },
  Mareada:  { color: '#EA580C', bg: '#FFF7ED', text: '#C2410C' },
  Hector:   { color: '#059669', bg: '#ECFDF5', text: '#047857' },
  Maripla:  { color: '#EC4899', bg: '#FDF2F8', text: '#BE185D' },
  Cristian: { color: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
  Familia:  { color: '#6B7280', bg: '#F1F5F9', text: '#374151' }
};

const memberOptions = Object.keys(MEMBERS).map(n => `<option value="${n}">${n}</option>`).join('');
function getMemberStyle(p) { return MEMBERS[p] || MEMBERS['Familia']; }

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const days = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];
const diasSemana = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];
let currentYear = 2026, currentMonth = 4, modalType = '', modalExtra = {};
let calEvents = [];

// =====================
// NAVEGACION
// =====================
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');
  btn.classList.add('active');
}

// =====================
// LEYENDA
// =====================
function renderLegend() {
  document.getElementById('members-legend').innerHTML = Object.entries(MEMBERS).map(([n, s]) =>
    `<div class="member-pill" style="background:${s.bg};border-color:${s.color}">
      <div class="color-dot" style="background:${s.color}"></div>
      <span style="color:${s.text}">${n}</span>
    </div>`
  ).join('');
}

// =====================
// CALENDARIO
// =====================
async function renderCalendar() {
  calEvents = await dbGet('eventos');
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
    const dots = calEvents.filter(e => e.date === dateStr).map(e => {
      const s = getMemberStyle(e.persona);
      return `<div class="day-event-dot" style="background:${s.color}" title="${e.name}"></div>`;
    }).join('');
    grid.innerHTML += `<div class="cal-day${isToday ? ' today' : ''}"><div class="day-num">${d}</div><div class="day-events">${dots}</div></div>`;
  }
  renderEvents();
}

function renderEvents() {
  document.getElementById('events-container').innerHTML = [...calEvents]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(e => {
      const s = getMemberStyle(e.persona);
      const label = new Date(e.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      return `<div class="event-item">
        <div class="event-bar" style="background:${s.color}"></div>
        <div class="event-info">
          <div class="event-name">${e.name}</div>
          <div class="event-meta">ðŸ“… ${label} Â· â° ${e.time}
            <span class="member-tag" style="background:${s.bg};color:${s.text}">${e.persona}</span>
          </div>
        </div>
        <button class="icon-btn" onclick="deleteEvento(${e.id})">ðŸ—‘ï¸</button>
      </div>`;
    }).join('');
}

async function deleteEvento(id) {
  await dbDelete('eventos', id);
  await renderCalendar();
}

function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
}

// =====================
// TAREAS
// =====================
async function renderTasks(filter = 'todas') {
  const allTasks = await dbGet('tareas');
  let list = allTasks;
  if (filter === 'pendientes') list = allTasks.filter(t => !t.done);
  if (filter === 'hechas') list = allTasks.filter(t => t.done);
  document.getElementById('tasks-container').innerHTML = list.map(t => {
    const s = getMemberStyle(t.persona);
    return `<div class="task-item${t.done ? ' done' : ''}">
      <div class="task-check${t.done ? ' checked' : ''}" onclick="toggleTask(${t.id}, ${t.done})">${t.done ? 'âœ“' : ''}</div>
      <div class="task-body">
        <div class="task-title">${t.title}</div>
        <div class="task-meta">
          <span class="tag ${t.tag}">${t.tag}</span>
          <span>ðŸ“… ${t.fecha}</span>
          <span class="member-tag" style="background:${s.bg};color:${s.text}">${t.persona}</span>
        </div>
      </div>
      <button class="icon-btn" onclick="deleteTarea(${t.id})">ðŸ—‘ï¸</button>
    </div>`;
  }).join('');
}

async function toggleTask(id, done) {
  await dbUpdate('tareas', id, { done: !done });
  renderTasks(currentFilter());
}

async function deleteTarea(id) {
  await dbDelete('tareas', id);
  renderTasks(currentFilter());
}

function currentFilter() {
  const a = document.querySelector('.filter-pill.active');
  return a ? a.textContent.toLowerCase().trim() : 'todas';
}

function filterTasks(f, btn) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTasks(f);
}

// =====================
// RECORDATORIOS
// =====================
async function renderReminders() {
  const reminders = await dbGet('recordatorios');
  document.getElementById('reminders-container').innerHTML = reminders.map(r => {
    const s = getMemberStyle(r.persona);
    const label = r.when === 'hoy' ? 'ðŸ”´ Hoy' : r.when === 'manana' ? 'ðŸŸ¢ Manana' : 'ðŸ”µ Proximamente';
    return `<div class="reminder-card" style="border-top:3px solid ${s.color}">
      <div class="reminder-icon">${r.icon}</div>
      <div class="reminder-title">${r.title}</div>
      <div class="reminder-time">ðŸ• ${r.time}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:9px">
        <span class="reminder-badge ${r.when}">${label}</span>
        <span class="member-tag" style="background:${s.bg};color:${s.text}">${r.persona}</span>
      </div>
      <button class="icon-btn" onclick="deleteRecordatorio(${r.id})" style="margin-top:8px">ðŸ—‘ï¸</button>
    </div>`;
  }).join('');
}

async function deleteRecordatorio(id) {
  await dbDelete('recordatorios', id);
  renderReminders();
}

// =====================
// COMPRA
// =====================
let compraFilter = 'todas';
const catColors = {
  frutas:   { bg: '#ECFDF5', text: '#047857' },
  lacteos:  { bg: '#EFF6FF', text: '#1D4ED8' },
  limpieza: { bg: '#FDF2F8', text: '#BE185D' },
  otros:    { bg: '#F1F5F9', text: '#374151' }
};

async function renderCompra() {
  const compra = await dbGet('compra');
  const list = compraFilter === 'todas' ? compra : compra.filter(c => c.cat === compraFilter);
  const total = compra.length, done = compra.filter(c => c.done).length;
  document.getElementById('compra-stats-txt').textContent = `${done} de ${total} marcados`;
  document.getElementById('compra-bar').style.width = total ? Math.round(done / total * 100) + '%' : '0%';
  document.getElementById('compra-limpiar').style.display = done > 0 ? 'block' : 'none';
  document.getElementById('compra-container').innerHTML = list.map(c => {
    const cc = catColors[c.cat] || catColors.otros;
    return `<div class="compra-item${c.done ? ' comprado' : ''}">
      <div class="compra-check${c.done ? ' checked' : ''}" onclick="toggleCompra(${c.id}, ${c.done})">${c.done ? 'âœ“' : ''}</div>
      <div class="compra-name">${c.nombre}</div>
      <span class="compra-cat-tag" style="background:${cc.bg};color:${cc.text}">${c.cat}</span>
      <button class="icon-btn" onclick="deleteCompra(${c.id})">ðŸ—‘ï¸</button>
    </div>`;
  }).join('');
}

async function toggleCompra(id, done) {
  await dbUpdate('compra', id, { done: !done });
  renderCompra();
}

async function deleteCompra(id) {
  await dbDelete('compra', id);
  renderCompra();
}

async function limpiarCompra() {
  const compra = await dbGet('compra');
  for (const c of compra.filter(c => c.done)) {
    await dbUpdate('compra', c.id, { done: false });
  }
  renderCompra();
}

function filterCompra(f, btn) {
  compraFilter = f;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderCompra();
}

// =====================
// MENU
// =====================
async function renderMenu() {
  const menuRows = await dbGet('menu');
  const menuMap = {};
  menuRows.forEach(r => { menuMap[r.dia] = r; });
  document.getElementById('menu-grid').innerHTML = diasSemana.map(d => {
    const data = menuMap[d] || {};
    return `<div class="menu-day-col">
      <div class="menu-day-name">${d}</div>
      <div class="menu-slot" onclick="editMenu('${d}','comida')">
        <div class="menu-slot-label">Comida</div>
        <div class="menu-slot-val${data.comida ? '' : ' empty'}">${data.comida || 'Sin planear'}</div>
      </div>
      <div class="menu-slot" onclick="editMenu('${d}','cena')">
        <div class="menu-slot-label">Cena</div>
        <div class="menu-slot-val${data.cena ? '' : ' empty'}">${data.cena || 'Sin planear'}</div>
      </div>
    </div>`;
  }).join('');
}

function editMenu(dia, tipo) {
  modalType = 'menu_slot';
  modalExtra = { dia, tipo };
  document.getElementById('modal-title').textContent = `${dia} - ${tipo}`;
  document.getElementById('modal-body').innerHTML = `<label>Que hay de ${tipo}?</label><input type="text" id="m-menu" placeholder="Ej: Paella, ensalada...">`;
  openModal();
}

// =====================
// NOTAS
// =====================
const noteColors = {
  Noelia:   { bg: '#EFF6FF', title: '#1D4ED8' },
  Mareada:  { bg: '#FFF7ED', title: '#C2410C' },
  Hector:   { bg: '#ECFDF5', title: '#047857' },
  Maripla:  { bg: '#FDF2F8', title: '#BE185D' },
  Cristian: { bg: '#FEF2F2', title: '#B91C1C' },
  Familia:  { bg: '#F0F5FF', title: '#1E3A8A' }
};

async function renderNotes() {
  const notes = await dbGet('notas');
  document.getElementById('notes-container').innerHTML = notes.map(n => {
    const s = getMemberStyle(n.persona);
    const c = noteColors[n.persona] || noteColors.Familia;
    return `<div class="note-card" style="background:${c.bg}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="note-title" style="color:${c.title}">${n.title}</div>
        <button class="icon-btn" onclick="deleteNota(${n.id})">ðŸ—‘ï¸</button>
      </div>
      <div class="note-body" style="color:${s.text}">${n.body ? n.body.replace(/\n/g, '<br>') : ''}</div>
      <div class="note-footer">
        <span class="member-tag" style="background:${s.bg};color:${s.text}">${n.persona}</span>
        <span class="note-date">${n.fecha}</span>
      </div>
    </div>`;
  }).join('');
}

async function deleteNota(id) {
  await dbDelete('notas', id);
  renderNotes();
}

// =====================
// MEDICAMENTOS
// =====================
async function renderMeds() {
  const meds = await dbGet('medicamentos');
  document.getElementById('med-container').innerHTML = meds.map(m => {
    const s = getMemberStyle(m.persona);
    return `<div class="med-card" style="border-top:3px solid ${s.color}">
      <div class="med-header">
        <div>
          <div class="med-name">${m.nombre}</div>
          <span class="member-tag" style="background:${s.bg};color:${s.text}">${m.persona}</span>
        </div>
        <button class="icon-btn" onclick="deleteMed(${m.id})">ðŸ—‘ï¸</button>
      </div>
      <div class="med-body">
        <div class="med-row">ðŸ’Š ${m.dosis}</div>
        <div class="med-row">ðŸ• ${m.frecuencia}</div>
        <div class="med-row">ðŸ“… Hasta: ${m.hasta}</div>
      </div>
    </div>`;
  }).join('');
}

async function deleteMed(id) {
  await dbDelete('medicamentos', id);
  renderMeds();
}

// =====================
// DOCUMENTOS
// =====================
async function renderDocs() {
  const docs = await dbGet('documentos');
  document.getElementById('docs-container').innerHTML = docs.map(d => {
    const s = getMemberStyle(d.persona);
    return `<div class="doc-card" style="border-top:3px solid ${s.color}">
      <div style="font-size:28px;margin-bottom:9px">${d.icon}</div>
      <div class="doc-name">${d.name}</div>
      <div class="doc-meta">${d.type.toUpperCase()} - ${d.fecha}</div>
      <div style="margin-top:8px">
        <span class="member-tag" style="background:${s.bg};color:${s.text}">${d.persona}</span>
      </div>
      <button class="icon-btn" onclick="deleteDoc(${d.id})" style="margin-top:8px">ðŸ—‘ï¸</button>
    </div>`;
  }).join('');
}

async function deleteDoc(id) {
  await dbDelete('documentos', id);
  renderDocs();
}

// =====================
// MODAL
// =====================
const modalForms = {
  evento: `<label>Nombre</label><input type="text" id="m-name" placeholder="Ej: Medico, cumpleanos...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Fecha</label><input type="date" id="m-date">
    <label>Hora</label><input type="time" id="m-time">`,
  tarea: `<label>Tarea</label><input type="text" id="m-name" placeholder="Descripcion">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Categoria</label><select id="m-tag">
      <option value="familiar">Familiar</option><option value="casa">Casa</option>
      <option value="personal">Personal</option><option value="urgente">Urgente</option>
      <option value="trabajo">Trabajo</option></select>
    <label>Fecha limite</label><input type="date" id="m-date">`,
  recordatorio: `<label>Titulo</label><input type="text" id="m-name" placeholder="Ej: Medicacion...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Frecuencia</label><input type="text" id="m-time" placeholder="Ej: 09:00 diario">
    <label>Cuando</label><select id="m-when">
      <option value="hoy">Hoy</option><option value="manana">Manana</option>
      <option value="pronto">Proximamente</option></select>`,
  compra: `<label>Producto</label><input type="text" id="m-name" placeholder="Ej: Leche, pan...">
    <label>Categoria</label><select id="m-cat">
      <option value="frutas">Frutas</option><option value="lacteos">Lacteos</option>
      <option value="limpieza">Limpieza</option><option value="otros">Otros</option></select>`,
  medicamento: `<label>Medicamento</label><input type="text" id="m-name" placeholder="Nombre y dosis">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Dosis</label><input type="text" id="m-dosis" placeholder="Ej: 1 comprimido">
    <label>Frecuencia</label><input type="text" id="m-freq" placeholder="Ej: Cada 8h con comida">
    <label>Hasta</label><input type="text" id="m-hasta" placeholder="Ej: 30 may / Indefinido">`,
  nota: `<label>Titulo</label><input type="text" id="m-name" placeholder="Ej: Contrasena WiFi">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Contenido</label><textarea id="m-content" placeholder="Escribe la nota..."></textarea>`,
  documento: `<label>Nombre</label><input type="text" id="m-name" placeholder="Ej: Factura, DNI...">
    <label>Miembro</label><select id="m-persona">${memberOptions}</select>
    <label>Tipo</label><select id="m-type">
      <option value="note">Nota</option><option value="pdf">PDF</option>
      <option value="img">Imagen</option></select>`,
};

const modalTitles = {
  evento: 'Nuevo evento', tarea: 'Nueva tarea', recordatorio: 'Nuevo recordatorio',
  compra: 'AÃ±adir producto', medicamento: 'Nuevo medicamento', nota: 'Nueva nota', documento: 'Nuevo documento',
};

function showModal(type) {
  modalType = type; modalExtra = {};
  document.getElementById('modal-title').textContent = modalTitles[type];
  document.getElementById('modal-body').innerHTML = modalForms[type];
  openModal();
}

function openModal()  { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

async function saveModal() {
  if (modalType === 'menu_slot') {
    const val = document.getElementById('m-menu')?.value.trim();
    if (!val) { closeModal(); return; }
    const rows = await dbGet('menu');
    const existing = rows.find(r => r.dia === modalExtra.dia);
    if (existing) {
      await dbUpdate('menu', existing.id, { [modalExtra.tipo]: val });
    } else {
      await dbAdd('menu', { dia: modalExtra.dia, [modalExtra.tipo]: val });
    }
    await renderMenu();
    closeModal();
    return;
  }

  const name = document.getElementById('m-name')?.value.trim();
  if (!name) return;
  const persona = document.getElementById('m-persona')?.value || 'Familia';
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

  if (modalType === 'evento') {
    const date = document.getElementById('m-date')?.value || '';
    const time = document.getElementById('m-time')?.value || '12:00';
    await dbAdd('eventos', { name, date, time, persona });
    await renderCalendar();
  } else if (modalType === 'tarea') {
    const tag = document.getElementById('m-tag')?.value || 'familiar';
    const d = document.getElementById('m-date')?.value;
    const fecha = d ? new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '-';
    await dbAdd('tareas', { title: name, done: false, tag, fecha, persona });
    await renderTasks();
  } else if (modalType === 'recordatorio') {
    const time = document.getElementById('m-time')?.value || 'Sin hora';
    const when = document.getElementById('m-when')?.value || 'pronto';
    await dbAdd('recordatorios', { title: name, time, when, icon: 'ðŸ””', persona });
    await renderReminders();
  } else if (modalType === 'compra') {
    const cat = document.getElementById('m-cat')?.value || 'otros';
    await dbAdd('compra', { nombre: name, cat, done: false });
    await renderCompra();
  } else if (modalType === 'medicamento') {
    const dosis = document.getElementById('m-dosis')?.value || '-';
    const frecuencia = document.getElementById('m-freq')?.value || '-';
    const hasta = document.getElementById('m-hasta')?.value || 'Indefinido';
    await dbAdd('medicamentos', { nombre: name, persona, dosis, frecuencia, hasta });
    await renderMeds();
  } else if (modalType === 'nota') {
    const body = document.getElementById('m-content')?.value || '';
    await dbAdd('notas', { title: name, body, persona, fecha: today });
    await renderNotes();
  } else if (modalType === 'documento') {
    const type = document.getElementById('m-type')?.value || 'note';
    const iconMap = { note: 'ðŸ“', pdf: 'ðŸ“„', img: 'ðŸ“·' };
    await dbAdd('documentos', { name, type, fecha: today, icon: iconMap[type], persona });
    await renderDocs();
  }
  closeModal();
}

// =====================
// INICIO
// =====================
async function init() {
  renderLegend();
  await renderCalendar();
  await renderTasks();
  await renderReminders();
  await renderCompra();
  await renderMenu();
  await renderNotes();
  await renderMeds();
  await renderDocs();
}

init();
