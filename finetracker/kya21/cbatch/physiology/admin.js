/* ═══════════════════════════════════════════════════════════
   ADMIN.JS — Fine Tracker Admin Panel (Cloud DB version)
   KYA21 · Batch C · Physiology
═══════════════════════════════════════════════════════════ */

const FINE_AMOUNT          = 50;
const STORAGE_KEY_AUTH     = 'ft_admin_auth';
const ADMIN_PASSWORD       = 'Admin2357';   // ← Change this

// ── State ───────────────────────────────────────────────
let students = [];
let records  = [];
let _saving  = false;

// ── Persist helpers (cloud) ─────────────────────────────
async function _persist(action) {
  if (_saving) return;
  _saving = true;
  dbShowStatus('💾 Saving…');
  try {
    await dbSave({ students, records });
    dbShowStatus('✅ Saved', 'ok');
    if (action) action();
  } catch (e) {
    dbShowStatus('❌ Save failed! Check your Gist token.', 'error');
    console.error(e);
  } finally {
    _saving = false;
  }
}

// ── Auth ────────────────────────────────────────────────
function isLoggedIn() { return sessionStorage.getItem(STORAGE_KEY_AUTH) === '1'; }

function tryLogin() {
  const pw = document.getElementById('pwInput').value;
  if (pw === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEY_AUTH, '1');
    document.getElementById('loginScreen').style.display    = 'none';
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

// ── Helpers ─────────────────────────────────────────────
function getStudentData(roll) {
  const abs  = records.filter(r => r.roll === roll && r.type === 'absent').length;
  const paid = records.filter(r => r.roll === roll && r.type === 'paid').length * FINE_AMOUNT;
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
  const cls = { clear: 'pill-clear', paid: 'pill-paid', due: 'pill-due', partial: 'pill-partial' }[s];
  const lbl = { clear: 'No Fine',    paid: 'Paid ✓',   due: 'Due',     partial: 'Partial'       }[s];
  return `<span class="status-pill ${cls}">${lbl}</span>`;
}

function getName(roll) {
  return students.find(s => s.roll === roll)?.name || `Roll ${roll}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Toast ────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

// ── Confirm dialog ───────────────────────────────────────
function confirmDialog(title, msg, onYes) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent   = msg;
  document.getElementById('confirmOverlay').style.display = 'flex';
  document.getElementById('confirmYes').onclick = () => {
    document.getElementById('confirmOverlay').style.display = 'none';
    onYes();
  };
  document.getElementById('confirmNo').onclick = () => {
    document.getElementById('confirmOverlay').style.display = 'none';
  };
}

// ── Tabs ─────────────────────────────────────────────────
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  if (id === 'dashboard')   { renderDashTable(); renderStats(); }
  if (id === 'add-absence') { renderChecklist(); }
  if (id === 'add-payment') { renderDueTable(); populatePayDrop(); }
  if (id === 'records')     { renderRecordsTable(); }
  if (id === 'students')    { renderStudentsTable(); }
}

function switchTab(id, el) { showPage(id, el); }

// ── Dashboard ────────────────────────────────────────────
function initDashboard() {
  document.getElementById('payDate').value = todayStr();
  document.getElementById('absDate').value = todayStr();
  renderStats();
  renderDashTable();
}

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

// ── Add Absence ──────────────────────────────────────────
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
    cb.onclick  = e => e.stopPropagation();
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

async function saveAbsences() {
  const date    = document.getElementById('absDate').value;
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

  await _persist(() => {
    if (added > 0)   toast(`✅ ${added} absence${added > 1 ? 's' : ''} saved for ${fmtDate(date)}`);
    if (skipped > 0) toast(`${skipped} duplicate(s) skipped`, 'error');
    clearChecklist();
    renderStats();
  });
}

// ── Add Payment ──────────────────────────────────────────
function populatePayDrop() {
  const sel = document.getElementById('payRoll');
  const cur = sel.value;
  sel.innerHTML = '<option value="">— Select student —</option>';
  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d   = getStudentData(s.roll);
    const opt = document.createElement('option');
    opt.value       = s.roll;
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

async function savePayment() {
  const roll = parseInt(document.getElementById('payRoll').value);
  const date = document.getElementById('payDate').value;
  if (!roll) { toast('Select a student', 'error'); return; }
  if (!date) { toast('Select a date', 'error');    return; }
  records.push({ roll, type: 'paid', date });
  await _persist(() => {
    toast(`✅ ৳${FINE_AMOUNT} payment saved for ${getName(roll)}`);
    document.getElementById('payRoll').value  = '';
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

async function quickPay(roll) {
  const date = document.getElementById('payDate').value || todayStr();
  records.push({ roll, type: 'paid', date });
  await _persist(() => {
    toast(`✅ ৳${FINE_AMOUNT} recorded for ${getName(roll)}`);
    renderDueTable();
    populatePayDrop();
    renderStats();
  });
}

// ── All Records ──────────────────────────────────────────
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

async function deleteRecord(idx) {
  const r = records[idx];
  if (!r) return;
  confirmDialog(
    'Delete Record',
    `Delete ${r.type} record for ${getName(r.roll)} on ${fmtDate(r.date)}?`,
    async () => {
      records.splice(idx, 1);
      await _persist(() => {
        toast('Record deleted');
        renderRecordsTable();
        renderStats();
      });
    }
  );
}

// ── Students ─────────────────────────────────────────────
function renderStudentsTable() {
  const tbody = document.getElementById('studentsBody');
  tbody.innerHTML = '';
  document.getElementById('studentCount').textContent = `(${students.length})`;

  [...students].sort((a,b) => a.roll - b.roll).forEach(s => {
    const d  = getStudentData(s.roll);
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

async function updateName(roll, newName) {
  const s = students.find(x => x.roll === roll);
  if (s && newName.trim() && newName.trim() !== s.name) {
    s.name = newName.trim();
    await _persist(() => toast(`Updated: Roll ${roll}`));
  }
}

async function addStudent() {
  const roll = parseInt(document.getElementById('newRoll').value);
  const name = document.getElementById('newName').value.trim();
  if (!roll || roll < 1)                   { toast('Enter a valid roll number', 'error'); return; }
  if (!name)                               { toast('Enter student name', 'error');        return; }
  if (students.some(s => s.roll === roll)) { toast(`Roll ${roll} already exists`, 'error'); return; }
  students.push({ roll, name });
  students.sort((a,b) => a.roll - b.roll);
  await _persist(() => {
    document.getElementById('newRoll').value = '';
    document.getElementById('newName').value = '';
    toast(`✅ ${name} (Roll ${roll}) added`);
    renderStudentsTable();
    renderStats();
  });
}

async function removeStudent(roll) {
  const s = students.find(x => x.roll === roll);
  const d = getStudentData(roll);
  const extra = d.abs > 0 ? ` This student has ${d.abs} absence record(s) which will remain.` : '';
  confirmDialog('Remove Student', `Remove ${s.name} (Roll ${roll})?${extra}`, async () => {
    students = students.filter(x => x.roll !== roll);
    await _persist(() => {
      toast('Student removed');
      renderStudentsTable();
      renderStats();
    });
  });
}

// ── Boot ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('pwInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') tryLogin();
  });

  dbShowStatus('⏳ Loading data…');
  try {
    const data = await dbLoad();
    students = data.students || [];
    records  = data.records  || [];
    dbShowStatus('✅ Data loaded', 'ok');
  } catch (e) {
    dbShowStatus('❌ Failed to load data. Check Gist config in db.js', 'error');
    console.error(e);
  }

  if (isLoggedIn()) {
    document.getElementById('loginScreen').style.display    = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    initDashboard();
  }
});
