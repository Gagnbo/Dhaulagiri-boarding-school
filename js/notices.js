/**
 * Dhaulagiri Boarding School – Notices & Events
 * Items added by admin are stored in localStorage.
 * Deleted items are tracked so they stay gone after refresh.
 */

(function () {
  'use strict';

  /* ── Built-in data ─────────────────────────────────────────────────── */

  const builtinNotices = [
    { id: 'bn0', day: 12, month: 'Nov', title: 'School Holiday',               desc: 'The school will remain closed on Friday, 15th November.',                            file: null },
    { id: 'bn1', day:  8, month: 'Nov', title: 'Exam Routine Published',        desc: 'Routine for the upcoming second term examination is available.',                     file: 'downloads/exam-routine.pdf' },
    { id: 'bn2', day:  3, month: 'Nov', title: 'Admission Open 2026/27',        desc: 'Admissions are now open for Nursery to Class IX for the new academic session.',      file: 'src/Hope special school.jpeg' },
    { id: 'bn3', day: 28, month: 'Oct', title: 'School Calendar 2026',          desc: 'Official calendar showing school terms, exam weeks, and holidays.',                  file: 'src/school-calendar-2026.jpg' },
    { id: 'bn4', day: 19, month: 'Oct', title: 'Parent-Teacher Conference',     desc: 'Quarterly meeting to discuss student academic progress and growth.',                  file: null },
    { id: 'bn5', day: 10, month: 'Oct', title: 'Science Exhibition Participation', desc: 'Registration open for student science and robotics projects.',                    file: null }
  ];

  const builtinEvents = [
    { id: 'be0', day: 15, month: 'Nov', title: 'Parent-Teacher Meeting',           loc: '9:00 AM – 12:00 PM · School Auditorium' },
    { id: 'be1', day: 22, month: 'Nov', title: 'Annual Sports Meet',               loc: 'School Sports Ground' },
    { id: 'be2', day: 25, month: 'Nov', title: 'Cultural & Dance Program',         loc: 'Auditorium Hall' },
    { id: 'be3', day:  5, month: 'Dec', title: 'Inter-School Science Exhibition',  loc: 'Main Campus Hall' },
    { id: 'be4', day: 18, month: 'Dec', title: 'Winter Term Final Examinations',   loc: 'Respective Classrooms' }
  ];

  /* ── localStorage helpers ──────────────────────────────────────────── */

  function load(key)       { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } }
  function save(key, val)  { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { alert('Storage full.'); } }

  /* ── Live data (stored = admin-added; deleted sets = hidden built-ins) */

  let storedNotices   = load('dbs_notices');
  let storedEvents    = load('dbs_events');
  let storedResources = load('dbs_resources');
  let deletedNotices  = new Set(load('dbs_del_notices'));   // set of ids ('bn0', 'sn_timestamp', …)
  let deletedEvents   = new Set(load('dbs_del_events'));
  let deletedResources = new Set(load('dbs_del_resources'));

  /* ── DOM refs ──────────────────────────────────────────────────────── */

  const noticesListEl = document.getElementById('nl');
  const searchInputEl = document.getElementById('ns');
  const eventsListEl  = document.getElementById('ev');
  const resourceGrid  = document.getElementById('resourceGrid');

  /* ── Admin credentials ─────────────────────────────────────────────── */

  const ADMIN_USER = 'dhaulagiri';
  const ADMIN_PASS = '000000';

  /* ── Pending delete (set when a delete btn is clicked) ─────────────── */
  /* { type: 'notice'|'event'|'resource', id: string } */
  let _pendingDelete = null;

  /* ── Shared modal helpers ──────────────────────────────────────────── */

  function showModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'flex';
    el.onclick = e => { if (e.target === el) el.style.display = 'none'; };
  }
  function hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  function setErr(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.color = '#e53935'; }
  }
  function setOk(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.color = '#2e7d32'; }
  }
  function clearFields(ids) {
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  }

  /* ════════════════════════════════════════════════════════════════════
     DELETE FLOW
     1. _requestDelete(type, id) — save pending, open delete-login modal
     2. confirmDelete()          — check credentials → perform deletion
  ════════════════════════════════════════════════════════════════════ */

  window._requestDelete = function (type, id) {
    _pendingDelete = { type, id };
    document.getElementById('delLoginErr').textContent = '';
    clearFields(['delLoginUser', 'delLoginPass']);
    showModal('deleteLoginModal');
    setTimeout(() => document.getElementById('delLoginUser').focus(), 120);
  };

  window.closeDeleteLoginModal = function () {
    hideModal('deleteLoginModal');
    _pendingDelete = null;
    clearFields(['delLoginUser', 'delLoginPass']);
    document.getElementById('delLoginErr').textContent = '';
  };

  window.confirmDelete = function () {
    const u = document.getElementById('delLoginUser').value.trim();
    const p = document.getElementById('delLoginPass').value;

    if (u !== ADMIN_USER || p !== ADMIN_PASS) {
      document.getElementById('delLoginErr').textContent = '❌ Incorrect username or password.';
      document.getElementById('delLoginPass').value = '';
      return;
    }

    if (!_pendingDelete) { hideModal('deleteLoginModal'); return; }

    const { type, id } = _pendingDelete;

    if (type === 'notice') {
      // Stored notice?
      const si = storedNotices.findIndex(n => n._id === id);
      if (si !== -1) {
        storedNotices.splice(si, 1);
        save('dbs_notices', storedNotices);
      } else {
        deletedNotices.add(id);
        save('dbs_del_notices', [...deletedNotices]);
      }
      renderNotices(searchInputEl ? searchInputEl.value : '');

    } else if (type === 'event') {
      const si = storedEvents.findIndex(e => e._id === id);
      if (si !== -1) {
        storedEvents.splice(si, 1);
        save('dbs_events', storedEvents);
      } else {
        deletedEvents.add(id);
        save('dbs_del_events', [...deletedEvents]);
      }
      renderEvents();

    } else if (type === 'resource') {
      const si = storedResources.findIndex(r => r._id === id);
      if (si !== -1) {
        storedResources.splice(si, 1);
        save('dbs_resources', storedResources);
      } else {
        deletedResources.add(id);
        save('dbs_del_resources', [...deletedResources]);
      }
      renderStoredResources();
    }

    hideModal('deleteLoginModal');
    _pendingDelete = null;
  };

  /* ── Delete button HTML ────────────────────────────────────────────── */

  function delBtn(type, id) {
    return `<button onclick="_requestDelete('${type}','${id}')"
      style="background:#e53935;color:#fff;border:none;padding:5px 12px;border-radius:5px;
             cursor:pointer;font-size:.8rem;font-weight:600;white-space:nowrap;">🗑 Delete</button>`;
  }

  /* ── Render: Notices ───────────────────────────────────────────────── */

  const imageExts = ['jpg','jpeg','png','webp','gif','svg'];

  function noticeRowHtml(n) {
    const { _id, day, month, title, desc, file, fileData } = n;
    let btns;

    if (fileData) {
      const ext  = (file||'').split('.').pop().toLowerCase();
      const name = (file||'file').split('/').pop();
      const lbl  = imageExts.includes(ext) ? 'Download Image' : (ext==='pdf' ? 'Download PDF' : 'Download File');
      btns = `<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                <a href="${fileData}" target="_blank" class="small-btn">View</a>
                <a href="${fileData}" download="${name}" class="small-btn">${lbl}</a>
                ${delBtn('notice', _id)}
              </div>`;
    } else if (file) {
      const ext  = file.split('.').pop().toLowerCase();
      const name = file.split('/').pop();
      const lbl  = imageExts.includes(ext) ? 'Download Image' : (ext==='pdf' ? 'Download PDF' : 'Download File');
      btns = `<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                <a href="${file}" target="_blank" class="small-btn">View</a>
                <a href="${file}" download="${name}" class="small-btn">${lbl}</a>
                ${delBtn('notice', _id)}
              </div>`;
    } else {
      btns = `<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                <button class="small-btn"
                  onclick="alert('${title.replace(/'/g,"\\'")}:\\n${(desc||'').replace(/'/g,"\\'")}')">View Notice</button>
                ${delBtn('notice', _id)}
              </div>`;
    }

    return `<div class="row">
               <div class="date"><b>${day}</b>${month}</div>
               <div><b>${title}</b><small>${desc||''}</small></div>
               ${btns}
             </div>`;
  }

  function renderNotices(query) {
    if (!noticesListEl) return;
    const q = (query||'').trim().toLowerCase();

    // Stored notices with _id
    const stored = storedNotices
      .filter(n => !deletedNotices.has(n._id))
      .map(n => ({ ...n, fileData: n.fileData, file: n.fileName }));

    // Built-in notices (skip deleted)
    const builtin = builtinNotices
      .filter(n => !deletedNotices.has(n.id))
      .map(n => ({ _id: n.id, day: n.day, month: n.month,
                   title: n.title, desc: n.desc, file: n.file, fileData: null }));

    const all = [...stored, ...builtin]
      .filter(n => (n.title + ' ' + (n.desc||'')).toLowerCase().includes(q));

    if (all.length === 0) {
      noticesListEl.innerHTML = '<p class="lead" style="padding:10px 0;">No notices match your search.</p>';
      return;
    }
    noticesListEl.innerHTML = all.map(noticeRowHtml).join('');
  }

  /* ── Render: Events ────────────────────────────────────────────────── */

  function eventRowHtml(e) {
    return `<div class="row">
               <div class="date"><b>${e.day}</b>${e.month}</div>
               <div><b>${e.title}</b><small>${e.loc||''}</small></div>
               <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                 ${delBtn('event', e._id)}
               </div>
             </div>`;
  }

  function renderEvents() {
    if (!eventsListEl) return;

    const stored = storedEvents
      .filter(e => !deletedEvents.has(e._id))
      .map(e => ({ ...e }));

    const builtin = builtinEvents
      .filter(e => !deletedEvents.has(e.id))
      .map(e => ({ _id: e.id, day: e.day, month: e.month, title: e.title, loc: e.loc }));

    eventsListEl.innerHTML = [...stored, ...builtin].map(eventRowHtml).join('');
  }

  /* ── Render: Stored Resources ──────────────────────────────────────── */

  function renderStoredResources() {
    if (!resourceGrid) return;
    resourceGrid.querySelectorAll('.stored-resource-card').forEach(el => el.remove());

    storedResources
      .filter(r => !deletedResources.has(r._id))
      .forEach(r => {
        const card = document.createElement('div');
        card.className = 'card stored-resource-card';
        card.innerHTML = `
          <b>${r.isImg ? '🖼️' : '📄'} ${r.title}</b><br>
          <small>${r.fileExt||''} · ${r.kb||'?'} KB</small><br>
          ${r.desc ? `<span style="font-size:.85rem;opacity:.8;">${r.desc}</span><br>` : ''}
          <br>
          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
            <a href="${r.fileData}" target="_blank" class="small-btn">View</a>
            <a href="${r.fileData}" download="${r.fileName||r.title}" class="small-btn">Download</a>
            ${delBtn('resource', r._id)}
          </div>`;
        resourceGrid.appendChild(card);
      });
  }

  /* ── Initial render ────────────────────────────────────────────────── */

  renderNotices();
  renderEvents();
  renderStoredResources();

  if (searchInputEl) {
    searchInputEl.addEventListener('input', e => renderNotices(e.target.value));
  }

  /* ════════════════════════════════════════════════════════════════════
     ADD SYSTEM  (login → form → save)
  ════════════════════════════════════════════════════════════════════ */

  let _addTarget = null;

  window._adminOpenAdd = function (target) {
    _addTarget = target;
    const labels = { notice: 'add a notice', event: 'add an event', resource: 'add a resource' };
    document.getElementById('loginSubtitle').textContent =
      'Enter credentials to ' + (labels[target]||'continue') + '.';
    document.getElementById('loginErr').textContent = '';
    clearFields(['loginUser','loginPass']);
    showModal('loginModal');
    setTimeout(() => document.getElementById('loginUser').focus(), 120);
  };

  window.closeLoginModal = () => {
    hideModal('loginModal');
    clearFields(['loginUser','loginPass']);
    document.getElementById('loginErr').textContent = '';
  };

  window.submitLogin = function () {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      hideModal('loginModal');
      const map = { notice: 'addNoticeModal', event: 'addEventModal', resource: 'addModal' };
      showModal(map[_addTarget]||'addModal');
    } else {
      document.getElementById('loginErr').textContent = '❌ Incorrect username or password.';
      document.getElementById('loginPass').value = '';
    }
  };

  window.closeAddModal = function () {
    hideModal('addModal');
    clearFields(['resTitle','resDesc','resFile']);
    setOk('resSaveStatus','');
  };
  window.closeAddNoticeModal = function () {
    hideModal('addNoticeModal');
    clearFields(['notTitle','notDesc','notDay','notMonth','notFile']);
    setOk('notSaveStatus','');
  };
  window.closeAddEventModal = function () {
    hideModal('addEventModal');
    clearFields(['evTitle','evLoc','evDay','evMonth']);
    setOk('evSaveStatus','');
  };

  /* ── File → Data URL ───────────────────────────────────────────────── */

  function fileToDataURL(file) {
    return new Promise((res,rej) => {
      const fr = new FileReader();
      fr.onload  = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
  }

  /* ── ADD NOTICE ────────────────────────────────────────────────────── */

  window.submitNotice = async function () {
    const title = document.getElementById('notTitle').value.trim();
    const desc  = document.getElementById('notDesc').value.trim();
    const day   = parseInt(document.getElementById('notDay').value, 10);
    const month = document.getElementById('notMonth').value;
    const fi    = document.getElementById('notFile');

    if (!title) { setErr('notSaveStatus','⚠️ Title is required.'); return; }
    if (!month) { setErr('notSaveStatus','⚠️ Please select a month.'); return; }
    if (!day||day<1||day>31) { setErr('notSaveStatus','⚠️ Enter a valid day (1–31).'); return; }

    setOk('notSaveStatus','⏳ Saving…');

    let fileData = null, fileName = null;
    if (fi.files && fi.files.length > 0) {
      try { fileData = await fileToDataURL(fi.files[0]); fileName = fi.files[0].name; }
      catch(e) { setErr('notSaveStatus','❌ Could not read file.'); return; }
    }

    const entry = { _id: 'sn_' + Date.now(), day, month, title, desc, fileData, fileName };
    storedNotices.unshift(entry);
    save('dbs_notices', storedNotices);
    renderNotices(searchInputEl ? searchInputEl.value : '');
    setOk('notSaveStatus','✅ Notice saved!');
    setTimeout(window.closeAddNoticeModal, 1600);
  };

  /* ── ADD EVENT ─────────────────────────────────────────────────────── */

  window.submitEvent = function () {
    const title = document.getElementById('evTitle').value.trim();
    const loc   = document.getElementById('evLoc').value.trim();
    const day   = parseInt(document.getElementById('evDay').value, 10);
    const month = document.getElementById('evMonth').value;

    if (!title) { setErr('evSaveStatus','⚠️ Title is required.'); return; }
    if (!month) { setErr('evSaveStatus','⚠️ Please select a month.'); return; }
    if (!day||day<1||day>31) { setErr('evSaveStatus','⚠️ Enter a valid day (1–31).'); return; }

    const entry = { _id: 'se_' + Date.now(), day, month, title, loc };
    storedEvents.unshift(entry);
    save('dbs_events', storedEvents);
    renderEvents();
    setOk('evSaveStatus','✅ Event saved!');
    setTimeout(window.closeAddEventModal, 1600);
  };

  /* ── ADD RESOURCE ──────────────────────────────────────────────────── */

  window.submitResource = async function () {
    const title = document.getElementById('resTitle').value.trim();
    const desc  = document.getElementById('resDesc').value.trim();
    const fi    = document.getElementById('resFile');

    if (!title) { setErr('resSaveStatus','⚠️ Title is required.'); return; }
    if (!fi.files||fi.files.length===0) { setErr('resSaveStatus','⚠️ Please select a file or image.'); return; }

    setOk('resSaveStatus','⏳ Saving…');

    const file   = fi.files[0];
    const isImg  = file.type.startsWith('image/');
    const kb     = (file.size/1024).toFixed(0);
    const fileExt = file.name.split('.').pop().toUpperCase();

    let fileData;
    try { fileData = await fileToDataURL(file); }
    catch(e) { setErr('resSaveStatus','❌ Could not read file.'); return; }

    const entry = { _id: 'sr_' + Date.now(), title, desc, fileData,
                    fileName: file.name, fileExt, kb, isImg };
    storedResources.push(entry);
    save('dbs_resources', storedResources);
    renderStoredResources();
    setOk('resSaveStatus','✅ Resource saved!');
    setTimeout(window.closeAddModal, 1600);
  };

  /* ── Enter keys ────────────────────────────────────────────────────── */

  ['loginUser','loginPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key==='Enter') window.submitLogin(); });
  });

  ['delLoginUser','delLoginPass'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', e => { if (e.key==='Enter') window.confirmDelete(); });
  });

})();
