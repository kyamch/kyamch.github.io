/* ═══════════════════════════════════════════════════════════
   STUDENT LIST
   Add or edit students here.
   Format: { roll: <number>, name: '<name>' }
═══════════════════════════════════════════════════════════ */
const students = [
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

/* ═══════════════════════════════════════════════════════════
   RECORDS
   Each line is one event.
   type: 'absent' → adds a ৳50 fine
   type: 'paid'   → records a ৳50 payment

   HOW TO ADD A NEW ITEM EXAM:
   Copy the block below and paste it, then change the date
   and the roll numbers of whoever was absent that day.

   Example — Item 1 on 2025-04-20, rolls 44, 46 & 61 absent,
   roll 44 paid on 2025-04-14:

   { roll: 44, type: 'absent', date: '2025-04-10' },
   { roll: 47, type: 'absent', date: '2025-04-10' },
   { roll: 44, type: 'paid',   date: '2025-04-14' },

   ─── ADD YOUR REAL DATA BELOW THIS LINE ───────────────── */
const records = [
  
  // ── Item 1 — 2025-04-20 ──────────────────────────────
  { roll: 44, type: 'absent', date: '2025-04-20' },
  { roll: 46, type: 'absent', date: '2025-04-20' },
  { roll: 61, type: 'absent', date: '2025-04-20' },
  
  // ── Item 2 — 2025-04-23 ──────────────────────────────
  
   { roll: 44, type: 'absent', date: '2025-04-25' },
  { roll: 46, type: 'absent', date: '2025-04-25' },
  { roll: 61, type: 'absent', date: '2025-04-25' },
  { roll: 60, type: 'absent', date: '2025-04-25' },
  { roll: 52, type: 'absent', date: '2025-04-25' },
  
  
  
  // ── Payments received ─────────────────────────────────
  
  
  
  // ── ADD MORE ITEMS / PAYMENTS BELOW ──────────────────
  
];
/* ─────────────────────────────────────────────────────────
   END OF DATA SECTION — do not edit below unless you know
   what you are doing.
───────────────────────────────────────────────────────── */

const FINE_AMOUNT = 50;
let currentFilter = 'all';
let currentSearch = '';

// ── Derived helpers ────────────────────────────────────
function getStudentData(roll) {
  const abs = records.filter(r => r.roll === roll && r.type === 'absent').length;
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

const pillClass = s => ({ clear: 'pill-clear', paid: 'pill-paid', due: 'pill-due', partial: 'pill-partial' } [s]);
const pillLabel = s => ({ clear: 'No Fine', paid: 'Paid ✓', due: 'Due', partial: 'Partial' } [s]);

// ── Render table ───────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('studentTableBody');
  tbody.innerHTML = '';
  const term = currentSearch.toLowerCase();
  let visible = 0;
  
  students.forEach(s => {
    const d = getStudentData(s.roll);
    const status = getStatus(d);
    
    if (currentFilter === 'due' && status !== 'due' && status !== 'partial') return;
    if (currentFilter === 'clear' && status !== 'clear' && status !== 'paid') return;
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

// ── Stats ──────────────────────────────────────────────
function updateStats() {
  const totalDue = students.filter(s => getStudentData(s.roll).owed > 0).length;
  const collected = records.filter(r => r.type === 'paid').length * FINE_AMOUNT;
  const pending = students.reduce((sum, s) => sum + Math.max(0, getStudentData(s.roll).owed), 0);
  
  document.getElementById('stat-total-students').textContent = students.length;
  document.getElementById('stat-due').textContent = totalDue;
  document.getElementById('stat-collected').textContent = `৳${collected}`;
  document.getElementById('stat-pending').textContent = `৳${pending}`;
  document.getElementById('collectorTotal').textContent = `৳${collected}`;
}

// ── Item-wise sidebar breakdown ────────────────────────
function renderBreakdown() {
  // Group absences by date
  const byDate = {};
  records.filter(r => r.type === 'absent').forEach(r => {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r.roll);
  });
  
  const dates = Object.keys(byDate).sort();
  const container = document.getElementById('itemBreakdown');
  
  if (dates.length === 0) {
    container.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0;">No records yet.</div>';
    return;
  }
  
  container.innerHTML = dates.map((date, i) => {
    const rolls = byDate[date];
    const names = rolls.map(r => {
      const s = students.find(x => x.roll === r);
      return s ? s.name : `Roll ${r}`;
    }).join(', ');
    const amount = rolls.length * FINE_AMOUNT;
    const display = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    return `
      <div class="item-row">
        <div>
          <div class="item-date">Item ${i+1} · ${display}</div>
          <div class="item-absentees">${rolls}</div>
        </div>
        <div class="item-amount">৳${amount}</div>
      </div>
    `;
  }).join('');
}

// ── Filter / search ────────────────────────────────────
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

// ── Init ───────────────────────────────────────────────
renderTable();
renderBreakdown();
