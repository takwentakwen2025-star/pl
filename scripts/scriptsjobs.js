let JOBS_CACHE = [];

async function loadJobs() {
  const res = await fetch('/api/jobs');
  const data = await res.json().catch(()=>({jobs:[]}));
  JOBS_CACHE = data.jobs || [];
  renderJobs(JOBS_CACHE);
}

function renderJobs(list) {
  const container = document.getElementById('jobs-list');
  container.innerHTML = '';
  list.forEach(j => {
    const el = document.createElement('div');
    el.className = 'card job-card';
    el.innerHTML = `
      <h3 style="margin:0 0 8px">${j.title}</h3>
      <p><span class="badge">${j.company || '—'}</span>
         <span class="badge">${j.location || '—'}</span>
         <span class="badge">${j.contract_type || '—'}</span></p>
      <p>${j.description || ''}</p>
      <div style="display:flex; gap:8px;">
        <button class="btn" onclick="openApply('${j.id}','${sanitize(j.title,80)}')">تقديم</button>
      </div>
    `;
    container.appendChild(el);
  });
}

function filterJobs() {
  const q = sanitize(document.getElementById('q').value,120).toLowerCase();
  const loc = sanitize(document.getElementById('loc').value,80).toLowerCase();
  const ct = sanitize(document.getElementById('ct').value,40).toLowerCase();
  const filtered = JOBS_CACHE.filter(j => {
    const mm = (j.title||'').toLowerCase() + ' ' + (j.company||'').toLowerCase() + ' ' + (j.description||'').toLowerCase();
    const okQ = q ? mm.includes(q) : true;
    const okLoc = loc ? (j.location||'').toLowerCase().includes(loc) : true;
    const okCt = ct ? (j.contract_type||'').toLowerCase().includes(ct) : true;
    return okQ && okLoc && okCt;
  });
  renderJobs(filtered);
}

function openApply(jobId, jobTitle) {
  openModal('تقديم على وظيفة', `
    <p>أنتِ تقدّمين على: <strong>${jobTitle}</strong></p>
    <label>اسمك الكامل</label>
    <input id="apply_name" type="text" required>
    <label>بريدك الإلكتروني</label>
    <input id="apply_email" type="email" required>
    <label>رابط سيرتك (اختياري)</label>
    <input id="apply_resume" type="url">
  `, async () => {
    const payload = {
      job_id: jobId,
      fullname: sanitize(document.getElementById('apply_name').value,120),
      email: sanitize(document.getElementById('apply_email').value,180),
      resume_url: sanitize(document.getElementById('apply_resume').value,300)
    };
    const res = await postJSON('/api/apply', payload);
    showToast(res.message || res.error || 'تم');
    closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const q = document.getElementById('q');
  const loc = document.getElementById('loc');
  const ct = document.getElementById('ct');
  if (q && loc && ct) {
    q.addEventListener('input', filterJobs);
    loc.addEventListener('input', filterJobs);
    ct.addEventListener('change', filterJobs);
  }
  loadJobs();
});
