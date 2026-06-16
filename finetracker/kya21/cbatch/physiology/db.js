/* ═══════════════════════════════════════════════════════════
   DB.JS — Universal storage via cPanel PHP+MySQL backend
   KYA21 · Batch C · Physiology · KYAMCH
═══════════════════════════════════════════════════════════ */

// ── CONFIG ──────────────────────────────────────────────
const DB_API_URL = 'https://kyamch.club/finetracker/api.php';  // ← URL where api.php is uploaded
const DB_API_KEY = 'ft_kya21_physio_2025';                     // ← must match API_KEY in api.php

// ── Load all data (public, no auth) ────────────────────
async function dbLoad() {
    try {
        const res = await fetch(`${DB_API_URL}?action=load`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data;
    } catch (e) {
        console.error('[DB] Load failed:', e.message);
        dbShowStatus(`❌ ${e.message}`, 'error');
        throw e;
    }
}

// ── Save all data (admin only, requires API key) ────────
async function dbSave(data) {
    try {
        const res = await fetch(`${DB_API_URL}?action=save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': DB_API_KEY
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const result = await res.json();
        if (result.error) throw new Error(result.error);
    } catch (e) {
        console.error('[DB] Save failed:', e.message);
        throw e;
    }
}

// ── Status banner ───────────────────────────────────────
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
