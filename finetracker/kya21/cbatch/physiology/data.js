/* ═══════════════════════════════════════════════════════════
   DATA.JS — Public viewer, loads from universal cloud DB
═══════════════════════════════════════════════════════════ */

const FINE_AMOUNT = 50;

// ── These are populated after dbLoad() ─────────────────
let students = [];
let records  = [];

// ── Derived helpers ─────────────────────────────────────
function getStudentData(roll) {
  const abs  = records.filter(r => r.roll === roll && r.type === 'absent').length;
  const paid = records.filter(r => r.roll === roll && r.type === 'paid').length * FINE_AMOUNT;
  const owed = (abs * FINE_AMOUNT) - paid;
  return { abs, paid, owed };
}

function getStatus(d) {
  if (d.abs === 0)                      return 'clear';
  if (d.owed <= 0)                      return 'paid';
  if (d.paid > 0 && d.owed > 0)        return 'partial';
  return 'due';
}

const pillClass = s => ({ clear: 'pill-clear', paid: 'pill-paid', due: 'pill-due', partial: 'pill-partial' }[s]);
const pillLabel = s => ({ clear: 'No Fine', paid: 'Paid ✓', due: 'Due', partial: 'Partial' }[s]);

// ── Render helpers ──────────────────────────────────────
let currentFilter = 'all';
let currentSearch = '';

function renderTable() {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';
  const term = currentSearch.toLowerCase();
  let visible = 0;

  students.forEach(s => {
    const d = getStudentData(s.roll);
    const status = getStatus(d);

    if (currentFilter === 'due'   && status !== 'due' && status !== 'partial') return;
    if (currentFilter === 'clear' && status !== 'clear' && status !== 'paid')  return;
    if (term && !s.name.toLowerCase().includes(term) && !String(s.roll).includes(term)) return;

    visible++;
    const fineClass = d.abs === 0 ? 'zero' : d.abs > 2 ? 'high' : 'low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-roll">${String(s.roll).padStart(2,'0')}</td>
      <td class="td-name">${s.name}${s.roll === 50 ? ' <span style="color:var(--accent);font-size:10px;">(ক্যাশিয়ার)</span>' : ''}</td>
      <td><span class="fine-count ${fineClass}">${d.abs}</span></td>
      <td class="fine-amount" style="color:var(--green);">৳${d.paid}</td>
      <td class="fine-amount ${d.owed > 0 ? 'pos' : 'zero'}">৳${Math.max(0, d.owed)}</td>
      <td><span class="status-pill ${pillClass(status)}">${pillLabel(status)}</span></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('noResults').style.display = visible === 0 ? 'block' : 'none';
  updateStats();
}

function updateStats() {
  const totalDue  = students.filter(s => getStudentData(s.roll).owed > 0).length;
  const collected = records.filter(r => r.type === 'paid').length * FINE_AMOUNT;
  const pending   = students.reduce((sum, s) => sum + Math.max(0, getStudentData(s.roll).owed), 0);

  document.getElementById('stat-total-students').textContent = students.length;
  document.getElementById('stat-due').textContent            = totalDue;
  document.getElementById('stat-collected').textContent      = `৳${collected}`;
  document.getElementById('stat-pending').textContent        = `৳${pending}`;
  document.getElementById('collectorTotal').textContent      = `৳${collected}`;
}

function renderBreakdown() {
  var absentRecords = records.filter(function(r) { return r.type === 'absent'; });
  var container = document.getElementById('itemBreakdown');

  if (absentRecords.length === 0) {
    container.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0;">No records yet.</div>';
    return;
  }

  var topicOrder = [];
  var byTopic = {};
  absentRecords.forEach(function(r) {
    var topic = r.topic || 'General';
    if (!byTopic[topic]) { byTopic[topic] = {}; topicOrder.push(topic); }
    if (!byTopic[topic][r.date]) byTopic[topic][r.date] = [];
    byTopic[topic][r.date].push(r.roll);
  });

  var html = '';
  topicOrder.forEach(function(topic) {
    var dateMap = byTopic[topic];
    var dates = Object.keys(dateMap).sort();
    var totalAbsences = dates.reduce(function(s, d) { return s + dateMap[d].length; }, 0);

    var itemsHtml = '';
    dates.forEach(function(date, i) {
      var rolls  = dateMap[date];
      var amount = rolls.length * FINE_AMOUNT;
      var display = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      itemsHtml += '<div class="item-row">'
        + '<div>'
        + '<div class="item-date">Item ' + (i + 1) + ' &middot; ' + display + '</div>'
        + '<div class="item-absentees">' + rolls.join(', ') + '</div>'
        + '</div>'
        + '<div class="item-amount">&#2547;' + amount + '</div>'
        + '</div>';
    });

    html += '<div class="breakdown-card" style="margin-bottom:14px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">'
      + '<h3 style="font-size:13.5px;color:var(--accent);font-family:\'DM Sans\',sans-serif;font-weight:600;">'
      + '&#128218; ' + topic + '</h3>'
      + '<span style="font-size:11px;color:var(--muted);">'
      + dates.length + ' ' + (dates.length !== 1 ? 'items' : 'item')
      + ' &middot; ' + totalAbsences + ' ' + (totalAbsences !== 1 ? 'absences' : 'absence')
      + '</span></div>'
      + itemsHtml
      + '</div>';
  });

  container.innerHTML = html;
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTable();
}

function filterTable() {
  currentSearch = document.getElementById('searchInput').value;
  renderTable();
}

// ── Boot: load from cloud, then render ─────────────────
(async () => {
  dbShowStatus('⏳ Loading data…');
  try {
    const data = await dbLoad();
    students = data.students || [];
    records  = data.records  || [];
    dbShowStatus('✅ Data loaded', 'ok');
    renderTable();
    renderBreakdown();
  } catch (e) {
    dbShowStatus('❌ Failed to load data. Check console.', 'error');
    console.error(e);
  }
})();
