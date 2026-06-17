/* =============================================================
   ADMIN.JS — Fine Tracker Admin Panel
   KYA21 · Batch C · Physiology · KYAMCH
============================================================= */

const FINE_AMOUNT      = 50;
const STORAGE_KEY_AUTH = 'ft_admin_auth';
const ADMIN_PASSWORD   = 'Admin2357';

let students = [];
let records  = [];
let _saving  = false;

async function _persist(action) {
  if (_saving) return;
  _saving = true;
  dbShowStatus('Saving...');
  try {
    await dbSave({ students, records });
    dbShowStatus('Saved', 'ok');
    if (action) action();
  } catch (e) {
    dbShowStatus('Save failed!', 'error');
    console.error(e);
  } finally { _saving = false; }
}

function isLoggedIn() { return sessionStorage.getItem(STORAGE_KEY_AUTH) === '1'; }

function tryLogin() {
  const pw = document.getElementById('pwInput').value;
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, '1');
    document.getElementById('loginScreen').style.display     = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    initDashboard();
  } else {
    const err = document.getElementById('loginError');
    err.style.display = 'block';
    err.textContent   = 'Incorrect password. Try again.';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
  }
}

function logout() { sessionStorage.removeItem(STORAGE_KEY_AUTH); location.reload(); }

function getStudentData(roll) {
  const abs  = records.filter(r => r.roll === roll && r.type === 'absent').length;
  const paid = records.filter(r => r.roll === roll && r.type === 'paid')
                      .reduce((s, r) => s + (r.amount || FINE_AMOUNT), 0);
  const owed = (abs * FINE_AMOUNT) - paid;
  return { abs, paid, owed };
}

function getStatus(d) {
  if (d.abs === 0)               return 'clear';
  if (d.owed <= 0)               return 'paid';
  if (d.paid > 0 && d.owed > 0) return 'partial';
  return 'due';
}

function statusPill(s) {
  const cls = { clear:'pill-clear', paid:'pill-paid', due:'pill-due', partial:'pill-partial' }[s];
  const lbl = { clear:'No Fine',    paid:'Paid',      due:'Due',      partial:'Partial'      }[s];
  return '<span class="status-pill ' + cls + '">' + lbl + '</span>';
}

function getName(roll) {
  const s = students.find(x => x.roll === roll);
  return s ? s.name : 'Roll ' + roll;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function toast(msg, type) {
  type = type || 'success';
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

function confirmDialog(title, msg, onYes) {
  document.getElementById('dlgTitle').textContent = title;
  document.getElementById('dlgMsg').textContent    = msg;
  document.getElementById('dlgBackdrop').classList.add('open');
  window._dlgConfirmAction = onYes;
}

function dlgConfirm() {
  document.getElementById('dlgBackdrop').classList.remove('open');
  if (window._dlgConfirmAction) window._dlgConfirmAction();
  window._dlgConfirmAction = null;
}

function dlgCancel() {
  document.getElementById('dlgBackdrop').classList.remove('open');
  window._dlgConfirmAction = null;
}

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  if (id === 'dashboard')   { renderDashTable(); renderStats(); }
  if (id === 'add-absence') { _populateTopicSuggestions(); renderChecklist(); }
  if (id === 'add-payment') { renderDueTable(); populatePayDrop(); }
  if (id === 'records')     { renderRecordsTable(); }
  if (id === 'students')    { renderStudentsTable(); }
}
function switchTab(id, el) { showPage(id, el); }

function initDashboard() {
  document.getElementById('payDate').value = todayStr();
  document.getElementById('absDate').value = todayStr();
  renderStats();
  renderDashTable();
}

function renderStats() {
  const totalDue  = students.filter(s => getStudentData(s.roll).owed > 0).length;
  const collected = records.filter(r => r.type === 'paid').reduce((s,r) => s + (r.amount||FINE_AMOUNT), 0);
  const pending   = students.reduce((sum,s) => sum + Math.max(0, getStudentData(s.roll).owed), 0);
  document.getElementById('st-students').textContent  = students.length;
  document.getElementById('st-due').textContent       = totalDue;
  document.getElementById('st-collected').textContent = '\u09f3' + collected;
  document.getElementById('st-pending').textContent   = '\u09f3' + pending;
}

function renderDashTable() {
  const term  = (document.getElementById('dashSearch')?.value || '').toLowerCase();
  const tbody = document.getElementById('dashBody');
  tbody.innerHTML = '';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    if (term && !s.name.toLowerCase().includes(term) && !String(s.roll).includes(term)) return;
    const d  = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="td-roll">' + String(s.roll).padStart(2,'0') + '</td>'
      + '<td class="td-name">' + s.name + '</td>'
      + '<td style="color:' + (d.abs > 0 ? 'var(--red)' : 'var(--muted)') + ';">' + d.abs + '</td>'
      + '<td class="fine-amount" style="color:var(--green);">\u09f3' + d.paid + '</td>'
      + '<td class="fine-amount ' + (d.owed > 0 ? 'pos' : 'zero') + '">\u09f3' + Math.max(0,d.owed) + '</td>'
      + '<td>' + statusPill(getStatus(d)) + '</td>';
    tbody.appendChild(tr);
  });
}

function _populateTopicSuggestions() {
  const dl = document.getElementById('topicSuggestions');
  if (!dl) return;
  const topics = [...new Set(records.filter(r => r.topic).map(r => r.topic))];
  dl.innerHTML  = topics.map(t => '<option value="' + t + '">').join('');
  const input   = document.getElementById('absTopic');
  if (input && !input.value && topics.length > 0) input.value = topics[topics.length - 1];
}

function renderChecklist() {
  const container = document.getElementById('checklist');
  container.innerHTML = '';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const div = document.createElement('div');
    div.className   = 'chk-item';
    div.dataset.roll = s.roll;
    div.innerHTML   = '<input type="checkbox" id="chk' + s.roll + '">'
      + '<div><span class="chk-roll">' + String(s.roll).padStart(2,'0') + '</span>'
      + '<div class="chk-name">' + s.name + '</div></div>';
    const cb = div.querySelector('input');
    div.onclick  = () => { cb.checked = !cb.checked; div.classList.toggle('checked', cb.checked); updateChkCount(); };
    cb.onclick   = e => e.stopPropagation();
    cb.onchange  = () => { div.classList.toggle('checked', cb.checked); updateChkCount(); };
    container.appendChild(div);
  });
  updateChkCount();
}

function updateChkCount() {
  const n = document.querySelectorAll('#checklist .chk-item.checked').length;
  document.getElementById('chkCount').textContent = n > 0 ? (n + ' selected · Fine: \u09f3' + (n * FINE_AMOUNT)) : '';
}

function clearChecklist() {
  document.querySelectorAll('#checklist .chk-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('input').checked = false;
  });
  updateChkCount();
}

async function saveAbsences() {
  const date  = document.getElementById('absDate').value;
  const topic = document.getElementById('absTopic').value.trim();
  if (!date)  { toast('Select a date first', 'error');     return; }
  if (!topic) { toast('Enter a topic/card name', 'error'); return; }
  const checked = [...document.querySelectorAll('#checklist .chk-item.checked')];
  if (checked.length === 0) { toast('No students selected', 'error'); return; }

  let added = 0, skipped = 0;
  checked.forEach(el => {
    const roll = parseInt(el.dataset.roll);
    if (records.some(r => r.roll === roll && r.type === 'absent' && r.date === date)) { skipped++; return; }
    records.push({ roll, type: 'absent', date, topic });
    added++;
  });

  await _persist(() => {
    if (added > 0)   toast('\u2705 ' + added + ' absence' + (added > 1 ? 's' : '') + ' saved for ' + fmtDate(date));
    if (skipped > 0) toast(skipped + ' duplicate(s) skipped', 'error');
    clearChecklist();
    renderStats();
  });
}

function populatePayDrop() {
  const sel = document.getElementById('payRoll');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select student —</option>';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d   = getStudentData(s.roll);
    const opt = document.createElement('option');
    opt.value       = s.roll;
    opt.textContent = String(s.roll).padStart(2,'0') + ' · ' + s.name + (d.owed > 0 ? ' (Owes \u09f3' + d.owed + ')' : '');
    sel.appendChild(opt);
  });
  if (cur) sel.value = cur;
  sel.onchange = updatePayPreview;
}

function updatePayPreview() {
  const roll = parseInt(document.getElementById('payRoll').value);
  const box  = document.getElementById('payPreview');
  if (!roll) { box.innerHTML = ''; return; }
  const d = getStudentData(roll);
  const s = students.find(x => x.roll === roll);
  box.innerHTML = '<div class="preview-box">'
    + '<div class="preview-name">' + s.name + '</div>'
    + '<div class="preview-row">'
    + '<span>Absences: <strong style="color:var(--red);">' + d.abs + '</strong></span>'
    + '<span>Paid: <strong style="color:var(--green);">\u09f3' + d.paid + '</strong></span>'
    + '<span>Owed: <strong style="color:' + (d.owed > 0 ? 'var(--red)' : 'var(--muted)') + ';">\u09f3' + Math.max(0,d.owed) + '</strong></span>'
    + '</div>'
    + (d.owed <= 0 ? '<div class="preview-warn">\u26a0\ufe0f No outstanding fines.</div>' : '')
    + '</div>';
}

async function savePayment() {
  const roll   = parseInt(document.getElementById('payRoll').value);
  const date   = document.getElementById('payDate').value;
  const amount = parseInt(document.getElementById('payAmount').value) || FINE_AMOUNT;
  if (!roll)      { toast('Select a student', 'error');     return; }
  if (!date)      { toast('Select a date', 'error');        return; }
  if (amount < 1) { toast('Enter a valid amount', 'error'); return; }
  records.push({ roll, type: 'paid', date, amount });
  await _persist(() => {
    toast('\u2705 \u09f3' + amount + ' payment saved for ' + getName(roll));
    document.getElementById('payRoll').value   = '';
    document.getElementById('payAmount').value = '50';
    document.getElementById('payPreview').innerHTML = '';
    renderDueTable();
    populatePayDrop();
    renderStats();
  });
}

function renderDueTable() {
  const tbody = document.getElementById('dueBody');
  tbody.innerHTML = '';
  const due = students.filter(s => getStudentData(s.roll).owed > 0).sort((a,b) => a.roll - b.roll);
  if (due.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No outstanding fines!</td></tr>';
    return;
  }
  due.forEach(s => {
    const d  = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="td-roll">' + String(s.roll).padStart(2,'0') + '</td>'
      + '<td class="td-name">' + s.name + '</td>'
      + '<td style="color:var(--red);">' + d.abs + '</td>'
      + '<td class="fine-amount" style="color:var(--green);">\u09f3' + d.paid + '</td>'
      + '<td class="fine-amount pos">\u09f3' + d.owed + '</td>'
      + '<td><button class="btn btn-sm btn-primary" onclick="quickPay(' + s.roll + ')">\u09f3' + FINE_AMOUNT + ' Pay</button></td>';
    tbody.appendChild(tr);
  });
}

async function quickPay(roll) {
  const date = document.getElementById('payDate').value || todayStr();
  records.push({ roll, type: 'paid', date, amount: FINE_AMOUNT });
  await _persist(() => {
    toast('\u2705 \u09f3' + FINE_AMOUNT + ' recorded for ' + getName(roll));
    renderDueTable();
    populatePayDrop();
    renderStats();
  });
}

function renderRecordsTable() {
  const term   = (document.getElementById('recSearch')?.value || '').toLowerCase();
  const filter = document.getElementById('recTypeFilter')?.value || 'all';
  const tbody  = document.getElementById('recBody');
  tbody.innerHTML = '';

  const sorted = records.map((r,i) => ({...r, _i:i}))
    .sort((a,b) => b.date.localeCompare(a.date) || a.roll - b.roll);

  let shown = 0;
  sorted.forEach(r => {
    if (filter !== 'all' && r.type !== filter) return;
    const name = getName(r.roll);
    if (term && !name.toLowerCase().includes(term) && !String(r.roll).includes(term) && !r.date.includes(term)) return;
    shown++;
    const amt      = r.type === 'paid' ? ('\u09f3' + (r.amount || FINE_AMOUNT)) : '\u2014';
    const amtColor = r.type === 'paid' ? 'var(--green)' : 'var(--muted)';
    const tr       = document.createElement('tr');
    tr.innerHTML = '<td class="td-roll" style="color:var(--muted);font-size:11px;">' + shown + '</td>'
      + '<td class="td-roll">' + String(r.roll).padStart(2,'0') + '</td>'
      + '<td class="td-name">' + name + '</td>'
      + '<td><span class="status-pill ' + (r.type === 'absent' ? 'pill-due' : 'pill-paid') + '">'
      + (r.type === 'absent' ? 'Absent' : 'Payment') + '</span></td>'
      + '<td style="font-family:\'DM Mono\',monospace;font-size:12px;color:' + amtColor + ';">' + amt + '</td>'
      + '<td style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);">' + fmtDate(r.date) + '</td>'
      + '<td style="display:flex;gap:5px;">'
      + '<button class="btn btn-sm btn-primary" onclick="openEditRecord(' + r._i + ')">Edit</button>'
      + '<button class="btn btn-sm btn-danger"  onclick="deleteRecord('   + r._i + ')">Del</button>'
      + '</td>';
    tbody.appendChild(tr);
  });

  if (shown === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No records found.</td></tr>';
  }
}

async function deleteRecord(idx) {
  const r = records[idx];
  if (!r) return;
  confirmDialog('Delete Record',
    'Delete ' + r.type + ' record for ' + getName(r.roll) + ' on ' + fmtDate(r.date) + '?',
    async () => {
      records.splice(idx, 1);
      await _persist(() => { toast('Record deleted'); renderRecordsTable(); renderStats(); });
    }
  );
}

function openEditRecord(idx) {
  const r = records[idx];
  if (!r) return;
  document.getElementById('editIdx').value    = idx;
  document.getElementById('editType').value   = r.type;
  document.getElementById('editDate').value   = r.date;
  document.getElementById('editTopic').value  = r.topic  || '';
  document.getElementById('editAmount').value = r.amount || FINE_AMOUNT;
  _toggleEditFields(r.type);
  document.getElementById('editType').onchange = function() { _toggleEditFields(this.value); };
  document.getElementById('editOverlay').style.display = 'flex';
}

function _toggleEditFields(type) {
  document.getElementById('editTopicGroup').style.display  = type === 'absent' ? 'block' : 'none';
  document.getElementById('editAmountGroup').style.display = type === 'paid'   ? 'block' : 'none';
}

async function saveEditRecord() {
  const idx = parseInt(document.getElementById('editIdx').value);
  const r   = records[idx];
  if (!r) return;
  r.type   = document.getElementById('editType').value;
  r.date   = document.getElementById('editDate').value;
  r.topic  = document.getElementById('editTopic').value.trim();
  r.amount = parseInt(document.getElementById('editAmount').value) || FINE_AMOUNT;
  if (!r.date) { toast('Select a date', 'error'); return; }
  document.getElementById('editOverlay').style.display = 'none';
  await _persist(() => { toast('Record updated'); renderRecordsTable(); renderStats(); });
}

function renderStudentsTable() {
  const tbody = document.getElementById('studentsBody');
  tbody.innerHTML = '';
  document.getElementById('studentCount').textContent = '(' + students.length + ')';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d  = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="td-roll">' + String(s.roll).padStart(2,'0') + '</td>'
      + '<td><input class="inline-input" value="' + s.name + '"'
      + ' onblur="updateName(' + s.roll + ', this.value)"'
      + ' onkeydown="if(event.key===\'Enter\') this.blur()"></td>'
      + '<td style="color:' + (d.abs > 0 ? 'var(--red)' : 'var(--muted)') + ';">' + d.abs + '</td>'
      + '<td>' + statusPill(getStatus(d)) + '</td>'
      + '<td><button class="btn btn-sm btn-danger" onclick="removeStudent(' + s.roll + ')">Remove</button></td>';
    tbody.appendChild(tr);
  });
}

async function updateName(roll, newName) {
  const s = students.find(x => x.roll === roll);
  if (s && newName.trim() && newName.trim() !== s.name) {
    s.name = newName.trim();
    await _persist(() => toast('Updated: Roll ' + roll));
  }
}

async function addStudent() {
  const roll = parseInt(document.getElementById('newRoll').value);
  const name = document.getElementById('newName').value.trim();
  if (!roll || roll < 1)                   { toast('Enter a valid roll number', 'error'); return; }
  if (!name)                               { toast('Enter student name', 'error');        return; }
  if (students.some(s => s.roll === roll)) { toast('Roll ' + roll + ' already exists', 'error'); return; }
  students.push({ roll, name });
  students.sort((a,b) => a.roll - b.roll);
  await _persist(() => {
    document.getElementById('newRoll').value = '';
    document.getElementById('newName').value = '';
    toast('\u2705 ' + name + ' (Roll ' + roll + ') added');
    renderStudentsTable();
    renderStats();
  });
}

async function removeStudent(roll) {
  const s = students.find(x => x.roll === roll);
  const d = getStudentData(roll);
  const extra = d.abs > 0 ? ' This student has ' + d.abs + ' absence record(s) which will remain.' : '';
  confirmDialog('Remove Student', 'Remove ' + s.name + ' (Roll ' + roll + ')?' + extra, async () => {
    students = students.filter(x => x.roll !== roll);
    await _persist(() => { toast('Student removed'); renderStudentsTable(); renderStats(); });
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('pwInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });
  dbShowStatus('Loading data...');
  try {
    const data = await dbLoad();
    students = data.students || [];
    records  = data.records  || [];
    dbShowStatus('Data loaded', 'ok');
  } catch (e) {
    dbShowStatus('Failed to load data.', 'error');
    console.error(e);
  }
  if (isLoggedIn()) {
    document.getElementById('loginScreen').style.display     = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    initDashboard();
  }
});
