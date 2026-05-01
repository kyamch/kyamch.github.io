/* ═══════════════════════════════════════════════════════════
   ADMIN.JS — Fine Tracker Admin Panel Logic
   KYA21 · Batch C · Physiology
═══════════════════════════════════════════════════════════ */

const FINE_AMOUNT         = 50;
const STORAGE_KEY_STUDENTS = 'ft_students';
const STORAGE_KEY_RECORDS  = 'ft_records';
const STORAGE_KEY_AUTH     = 'ft_admin_auth';
const ADMIN_PASSWORD       = 'kyamch2025';   // ← Change this password

// ── State ──────────────────────────────────────────────
let students = [];
let records  = [];

// ── Storage helpers ────────────────────────────────────
function loadData() {
  students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]');
  records  = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS)  || '[]');

  // Seed initial data if empty
  if (students.length === 0) {
    students = [
      { roll: 43, name: "Sheikh Mahmmad Huzaif" },
      { roll: 44, name: "Md. Julfikar Rahman Naeem" },
      { roll: 45, name: "Basit Jeelani" },
      { roll: 46, name: "Mahathir Mohammed" },
      { roll: 47, name: "Meftahul Jannat Sova" },
      { roll: 48, name: "Most. Moonwara Khatun Rimi" },
      { roll: 49, name: "Peerzada Simra Shah" },
      { roll: 50, name: "Md. Kawsar Ahmad Somrat" },
      { roll: 51, name: "Al Nahian" },
      { roll: 52, name: "Md. Mridul Sarker Raj" },
      { roll: 53, name: "Bushra Hussain" },
      { roll: 54, name: "Mst. Ummi Fatima" },
      { roll: 55, name: "Rassiyah Jeelani" },
      { roll: 56, name: "Md. Borhan Uddin Pranto" },
      { roll: 57, name: "Md. Reyad Hossain" },
      { roll: 58, name: "Umma Salma Surove" },
      { roll: 59, name: "Tanviruzzaman" },
      { roll: 60, name: "Md. Ekramul Azad" },
      { roll: 61, name: "Jarin Tasnim Shuha" },
      { roll: 62, name: "Md. Rifatuzzaman" },
      { roll: 63, name: "Sheikh Jannat Ara Hakim Esha" },
    ];
    saveStudents();
  }
  if (records.length === 0) {
    records = [
      { roll: 44, type: 'absent', date: '2025-04-20' },
      { roll: 46, type: 'absent', date: '2025-04-20' },
      { roll: 44, type: 'absent', date: '2025-04-25' },
      { roll: 46, type: 'absent', date: '2025-04-25' },
      { roll: 52, type: 'absent', date: '2025-04-25' },
      { roll: 60, type: 'absent', date: '2025-04-25' },
    ];
    saveRecords();
  }
}

function saveStudents() { localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students)); }
function saveRecords()  { localStorage.setItem(STORAGE_KEY_RECORDS,  JSON.stringify(records));  }

// ── Auth ───────────────────────────────────────────────
function isLoggedIn() { return sessionStorage.getItem(STORAGE_KEY_AUTH) === '1'; }

function tryLogin() {
  const pw = document.getElementById('pwInput').value;
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    initDashboard();
  } else {
    const err = document.getElementById('loginError');
    err.style.display = 'block';
    err.textContent = 'Incorrect password. Try again.';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
  }
}

function logout() {
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
  location.reload();
}

// ── Helpers ────────────────────────────────────────────
function getStudentData(roll) {
  const abs  = records.filter(r => r.roll === roll && r.type === 'absent').length;
  const paid = records.filter(r => r.roll === roll && r.type === 'paid').length * FINE_AMOUNT;
  const owed = (abs * FINE_AMOUNT) - paid;
  return { abs, paid, owed };
}

function getStatus(d) {
  if (d.abs === 0) return 'clear';
  if (d.owed <= 0) return 'paid';
  if (d.paid > 0 && d.owed > 0) return 'partial';
  return 'due';
}

function getName(roll) {
  const s = students.find(x => x.roll === roll);
  return s ? s.name : `Roll ${roll}`;
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusPill(status) {
  const map = {
    clear:   ['pill-clear',   'No Fine'],
    paid:    ['pill-paid',    'Paid ✓'],
    due:     ['pill-due',     'Due'],
    partial: ['pill-partial', 'Partial'],
  };
  const [cls, label] = map[status] || ['pill-clear', status];
  return `<span class="status-pill ${cls}">${label}</span>`;
}

// ── Toast ──────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.classList.add('toast-out'), 2800);
  setTimeout(() => el.remove(), 3200);
}

// ── Confirm dialog ─────────────────────────────────────
let _confirmCb = null;
function confirmDialog(title, msg, cb) {
  document.getElementById('dlgTitle').textContent = title;
  document.getElementById('dlgMsg').textContent   = msg;
  _confirmCb = cb;
  document.getElementById('dlgBackdrop').classList.add('open');
}
function dlgConfirm() { document.getElementById('dlgBackdrop').classList.remove('open'); if (_confirmCb) _confirmCb(); }
function dlgCancel()  { document.getElementById('dlgBackdrop').classList.remove('open'); }

// ── Navigation ─────────────────────────────────────────
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (btn) btn.classList.add('active');

  if (id === 'dashboard')    { renderStats(); renderDashTable(); }
  if (id === 'add-absence')  { renderChecklist(); document.getElementById('absDate').value = document.getElementById('absDate').value || todayStr(); }
  if (id === 'add-payment')  { populatePayDrop(); document.getElementById('payDate').value = document.getElementById('payDate').value || todayStr(); renderDueTable(); }
  if (id === 'records')      renderRecordsTable();
  if (id === 'students')     renderStudentsTable();
}

// ── Init ───────────────────────────────────────────────
function initDashboard() {
  loadData();
  showPage('dashboard', document.querySelector('.nav-btn'));
}

// ══════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════
function renderStats() {
  const totalDue  = students.filter(s => getStudentData(s.roll).owed > 0).length;
  const collected = records.filter(r => r.type === 'paid').length * FINE_AMOUNT;
  const pending   = students.reduce((sum, s) => sum + Math.max(0, getStudentData(s.roll).owed), 0);

  document.getElementById('st-students').textContent  = students.length;
  document.getElementById('st-due').textContent       = totalDue;
  document.getElementById('st-collected').textContent = `৳${collected}`;
  document.getElementById('st-pending').textContent   = `৳${pending}`;
}

function renderDashTable() {
  const term  = (document.getElementById('dashSearch')?.value || '').toLowerCase();
  const tbody = document.getElementById('dashBody');
  tbody.innerHTML = '';

  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    if (term && !s.name.toLowerCase().includes(term) && !String(s.roll).includes(term)) return;
    const d = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-roll">${String(s.roll).padStart(2,'0')}</td>
      <td class="td-name">${s.name}</td>
      <td style="color:${d.abs > 0 ? 'var(--red)' : 'var(--muted)'};">${d.abs}</td>
      <td class="fine-amount" style="color:var(--green);">৳${d.paid}</td>
      <td class="fine-amount ${d.owed > 0 ? 'pos' : 'zero'}">৳${Math.max(0,d.owed)}</td>
      <td>${statusPill(getStatus(d))}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ══════════════════════════════════════════════════════════
//  ADD ABSENCE
// ══════════════════════════════════════════════════════════
function renderChecklist() {
  const container = document.getElementById('checklist');
  container.innerHTML = '';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const div = document.createElement('div');
    div.className = 'chk-item';
    div.dataset.roll = s.roll;
    div.innerHTML = `
      <input type="checkbox" id="chk${s.roll}">
      <div>
        <span class="chk-roll">${String(s.roll).padStart(2,'0')}</span>
        <div class="chk-name">${s.name}</div>
      </div>
    `;
    const cb = div.querySelector('input');
    div.onclick = () => { cb.checked = !cb.checked; div.classList.toggle('checked', cb.checked); updateChkCount(); };
    cb.onclick = e => e.stopPropagation();
    cb.onchange = () => { div.classList.toggle('checked', cb.checked); updateChkCount(); };
    container.appendChild(div);
  });
  updateChkCount();
}

function updateChkCount() {
  const n = document.querySelectorAll('#checklist .chk-item.checked').length;
  document.getElementById('chkCount').textContent = n > 0 ? `${n} selected · Fine: ৳${n * FINE_AMOUNT}` : '';
}

function clearChecklist() {
  document.querySelectorAll('#checklist .chk-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('input').checked = false;
  });
  updateChkCount();
}

function saveAbsences() {
  const date = document.getElementById('absDate').value;
  if (!date) { toast('Select a date first', 'error'); return; }
  const checked = [...document.querySelectorAll('#checklist .chk-item.checked')];
  if (checked.length === 0) { toast('No students selected', 'error'); return; }

  let added = 0, skipped = 0;
  checked.forEach(el => {
    const roll = parseInt(el.dataset.roll);
    if (records.some(r => r.roll === roll && r.type === 'absent' && r.date === date)) { skipped++; return; }
    records.push({ roll, type: 'absent', date });
    added++;
  });

  saveRecords();
  if (added > 0) toast(`✅ ${added} absence${added > 1 ? 's' : ''} saved for ${fmtDate(date)}`);
  if (skipped > 0) toast(`${skipped} duplicate(s) skipped`, 'error');
  clearChecklist();
  renderStats();
}

// ══════════════════════════════════════════════════════════
//  ADD PAYMENT
// ══════════════════════════════════════════════════════════
function populatePayDrop() {
  const sel = document.getElementById('payRoll');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select student —</option>';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d = getStudentData(s.roll);
    const opt = document.createElement('option');
    opt.value = s.roll;
    opt.textContent = `${String(s.roll).padStart(2,'0')} · ${s.name}` + (d.owed > 0 ? ` (Owes ৳${d.owed})` : '');
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
  box.innerHTML = `
    <div class="preview-box">
      <div class="preview-name">${s.name}</div>
      <div class="preview-row">
        <span>Absences: <strong style="color:var(--red);">${d.abs}</strong></span>
        <span>Paid: <strong style="color:var(--green);">৳${d.paid}</strong></span>
        <span>Owed: <strong style="color:${d.owed > 0 ? 'var(--red)' : 'var(--muted)'};">৳${Math.max(0,d.owed)}</strong></span>
      </div>
      ${d.owed <= 0 ? '<div class="preview-warn">⚠️ No outstanding fines for this student.</div>' : ''}
    </div>
  `;
}

function savePayment() {
  const roll = parseInt(document.getElementById('payRoll').value);
  const date = document.getElementById('payDate').value;
  if (!roll) { toast('Select a student', 'error'); return; }
  if (!date) { toast('Select a date', 'error'); return; }
  records.push({ roll, type: 'paid', date });
  saveRecords();
  toast(`✅ ৳${FINE_AMOUNT} payment saved for ${getName(roll)}`);
  document.getElementById('payRoll').value = '';
  document.getElementById('payPreview').innerHTML = '';
  renderDueTable();
  populatePayDrop();
  renderStats();
}

function renderDueTable() {
  const tbody = document.getElementById('dueBody');
  tbody.innerHTML = '';
  const due = students.filter(s => getStudentData(s.roll).owed > 0).sort((a,b) => a.roll - b.roll);

  if (due.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">🎉 No outstanding fines!</td></tr>`;
    return;
  }

  due.forEach(s => {
    const d = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-roll">${String(s.roll).padStart(2,'0')}</td>
      <td class="td-name">${s.name}</td>
      <td style="color:var(--red);">${d.abs}</td>
      <td class="fine-amount" style="color:var(--green);">৳${d.paid}</td>
      <td class="fine-amount pos">৳${d.owed}</td>
      <td><button class="btn btn-sm btn-primary" onclick="quickPay(${s.roll})">+ Pay ৳50</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function quickPay(roll) {
  const date = document.getElementById('payDate').value || todayStr();
  records.push({ roll, type: 'paid', date });
  saveRecords();
  toast(`✅ ৳${FINE_AMOUNT} recorded for ${getName(roll)}`);
  renderDueTable();
  populatePayDrop();
  renderStats();
}

// ══════════════════════════════════════════════════════════
//  ALL RECORDS
// ══════════════════════════════════════════════════════════
function renderRecordsTable() {
  const term   = (document.getElementById('recSearch')?.value || '').toLowerCase();
  const filter = document.getElementById('recTypeFilter')?.value || 'all';
  const tbody  = document.getElementById('recBody');
  tbody.innerHTML = '';

  const sorted = [...records].map((r, i) => ({...r, _i: i}))
    .sort((a, b) => b.date.localeCompare(a.date) || a.roll - b.roll);

  let shown = 0;
  sorted.forEach(r => {
    if (filter !== 'all' && r.type !== filter) return;
    const name = getName(r.roll);
    if (term && !name.toLowerCase().includes(term) && !String(r.roll).includes(term) && !r.date.includes(term)) return;

    shown++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-roll" style="color:var(--muted);font-size:11px;">${shown}</td>
      <td class="td-roll">${String(r.roll).padStart(2,'0')}</td>
      <td class="td-name">${name}</td>
      <td><span class="status-pill ${r.type === 'absent' ? 'pill-due' : 'pill-paid'}">${r.type === 'absent' ? '📌 Absent' : '✅ Payment'}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--muted);">${fmtDate(r.date)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="deleteRecord(${r._i})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  if (shown === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No records found.</td></tr>`;
  }
}

function deleteRecord(idx) {
  const r = records[idx];
  if (!r) return;
  confirmDialog(
    'Delete Record',
    `Delete ${r.type} record for ${getName(r.roll)} on ${fmtDate(r.date)}?`,
    () => {
      records.splice(idx, 1);
      saveRecords();
      toast('Record deleted');
      renderRecordsTable();
      renderStats();
    }
  );
}

// ══════════════════════════════════════════════════════════
//  STUDENTS
// ══════════════════════════════════════════════════════════
function renderStudentsTable() {
  const tbody = document.getElementById('studentsBody');
  tbody.innerHTML = '';
  document.getElementById('studentCount').textContent = `(${students.length})`;

  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d = getStudentData(s.roll);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-roll">${String(s.roll).padStart(2,'0')}</td>
      <td>
        <input class="inline-input" value="${s.name}"
          onblur="updateName(${s.roll}, this.value)"
          onkeydown="if(event.key==='Enter') this.blur()">
      </td>
      <td style="color:${d.abs > 0 ? 'var(--red)' : 'var(--muted)'};">${d.abs}</td>
      <td>${statusPill(getStatus(d))}</td>
      <td><button class="btn btn-sm btn-danger" onclick="removeStudent(${s.roll})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateName(roll, newName) {
  const s = students.find(x => x.roll === roll);
  if (s && newName.trim() && newName.trim() !== s.name) {
    s.name = newName.trim();
    saveStudents();
    toast(`Updated: Roll ${roll}`);
  }
}

function addStudent() {
  const roll = parseInt(document.getElementById('newRoll').value);
  const name = document.getElementById('newName').value.trim();
  if (!roll || roll < 1)               { toast('Enter a valid roll number', 'error'); return; }
  if (!name)                           { toast('Enter student name', 'error'); return; }
  if (students.some(s => s.roll === roll)) { toast(`Roll ${roll} already exists`, 'error'); return; }
  students.push({ roll, name });
  students.sort((a,b) => a.roll - b.roll);
  saveStudents();
  document.getElementById('newRoll').value = '';
  document.getElementById('newName').value = '';
  toast(`✅ ${name} (Roll ${roll}) added`);
  renderStudentsTable();
  renderStats();
}

function removeStudent(roll) {
  const s = students.find(x => x.roll === roll);
  const d = getStudentData(roll);
  const extra = d.abs > 0 ? ` This student has ${d.abs} absence record(s) which will remain.` : '';
  confirmDialog('Remove Student', `Remove ${s.name} (Roll ${roll})?${extra}`, () => {
    students = students.filter(x => x.roll !== roll);
    saveStudents();
    toast('Student removed');
    renderStudentsTable();
    renderStats();
  });
}

// ── Boot ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) {
    document.getElementById('loginScreen').style.display    = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    initDashboard();
  }

  // Allow Enter key on password input
  document.getElementById('pwInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });
});
