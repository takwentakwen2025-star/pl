(function initMode(){
  const saved = localStorage.getItem('mode');
  if (saved === 'dark') document.documentElement.classList.add('dark');
})();
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('mode', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
}

let toastTimer;
function showToast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

let backdrop;
function openModal(title, contentHTML, onConfirm) {
  if (!backdrop) { backdrop = document.createElement('div'); backdrop.className = 'modal-backdrop'; document.body.appendChild(backdrop); }
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="btn" onclick="closeModal()">إغلاق</button>
      </div>
      <div class="modal-body">${contentHTML}</div>
      <div class="modal-actions">
        <button class="btn" onclick="(window._modalConfirm||(()=>{}))()">تأكيد</button>
      </div>
    </div>
  `;
  window._modalConfirm = onConfirm;
  backdrop.style.display = 'flex';
}
function closeModal() { if (backdrop) backdrop.style.display = 'none'; }

function sanitize(s, max = 500) {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max).replace(/[<>]/g,'');
}
