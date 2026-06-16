/* ═══════════════════════════════════════════════════════════
   DB.JS — Universal Cloud Storage via GitHub Gist
   Replaces localStorage with a shared Gist so data is
   universal across all browsers and devices.

   SETUP (one time):
   1. Go to https://github.com/settings/tokens/new
   2. Select "Gist" scope only → Generate token
   3. Go to https://gist.github.com → Create a SECRET gist
      with one file named: ft_data.json
      Content: {"students":[],"records":[]}
   4. Set DB_GIST_ID and DB_GITHUB_TOKEN below.
   
   <script src="https://gist.github.com/kyamch/4dca79e1b0bf580065b59e6c38e1455c.js"></script>
═══════════════════════════════════════════════════════════ */

const DB_GIST_ID      = '4dca79e1b0bf580065b59e6c38e1455c';   // ← Paste your Gist ID here  (e.g. "a1b2c3d4e5f6...")
const DB_GITHUB_TOKEN = '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';   // ← Paste your GitHub token here

// ── Seed data (used only on very first save if Gist is empty) ──
const _seedStudents = [
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

const _seedRecords = [
  { roll: 44, type: 'absent', date: '2025-04-20' },
  { roll: 46, type: 'absent', date: '2025-04-20' },
  { roll: 44, type: 'absent', date: '2025-04-25' },
  { roll: 46, type: 'absent', date: '2025-04-25' },
  { roll: 52, type: 'absent', date: '2025-04-25' },
  { roll: 60, type: 'absent', date: '2025-04-25' },
];

// ── Internal cache ──────────────────────────────────────
window._dbCache = null;

function _isConfigured() {
  return DB_GIST_ID && DB_GITHUB_TOKEN;
}

// ── Fetch all data from Gist ────────────────────────────
async function dbLoad() {
  if (!_isConfigured()) {
    console.warn('[DB] Gist not configured — using localStorage fallback.');
    return _localLoad();
  }
  try {
    const res = await fetch(`https://api.github.com/gists/${DB_GIST_ID}`, {
      headers: {
        'Authorization': `token ${DB_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const gist = await res.json();
    const raw  = gist.files['ft_data.json']?.content || '{}';
    const data = JSON.parse(raw);
    if (!data.students || data.students.length === 0) {
      data.students = _seedStudents;
      data.records  = _seedRecords;
      await dbSave(data);
    }
    window._dbCache = data;
    return data;
  } catch (e) {
    console.error('[DB] Load failed:', e);
    throw e;
  }
}

// ── Write all data to Gist ──────────────────────────────
async function dbSave(data) {
  if (!_isConfigured()) {
    return _localSave(data);
  }
  window._dbCache = data;
  try {
    const res = await fetch(`https://api.github.com/gists/${DB_GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${DB_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'ft_data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  } catch (e) {
    console.error('[DB] Save failed:', e);
    throw e;
  }
}

// ── localStorage fallback (when Gist not configured) ───
const _LS_KEY = 'ft_db_v2';

function _localLoad() {
  const raw = localStorage.getItem(_LS_KEY);
  if (raw) return JSON.parse(raw);
  const data = { students: _seedStudents, records: _seedRecords };
  _localSave(data);
  return data;
}

function _localSave(data) {
  localStorage.setItem(_LS_KEY, JSON.stringify(data));
}

// ── Status banner (shown on pages while loading) ────────
function dbShowStatus(msg, type = 'info') {
  let el = document.getElementById('_db_status');
  if (!el) {
    el = document.createElement('div');
    el.id = '_db_status';
    el.style.cssText = `
      position:fixed; top:0; left:0; right:0; z-index:9999;
      padding:8px 16px; font-size:13px; text-align:center;
      font-family: 'DM Sans', sans-serif;
      transition: opacity 0.4s;
    `;
    document.body.prepend(el);
  }
  el.style.opacity = '1';
  el.style.background = type === 'error' ? '#7f1d1d' : type === 'ok' ? '#14532d' : '#1e293b';
  el.style.color = '#fff';
  el.textContent = msg;
  if (type === 'ok') {
    setTimeout(() => { el.style.opacity = '0'; }, 2000);
  }
}
