document.addEventListener('DOMContentLoaded', function () {

  // ── Navbar scroll border ──────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // ── Copy to clipboard ─────────────────────────────────────
  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  function copyText(text, btn, feedbackEl) {
    navigator.clipboard.writeText(text).then(function () {
      btn.innerHTML = checkIcon + (btn.dataset.label ? ' ' + btn.dataset.label : '');
      btn.style.color = 'var(--success)';
      if (feedbackEl) feedbackEl.classList.add('show');
      setTimeout(function () {
        btn.innerHTML = copyIcon + (btn.dataset.label ? ' ' + btn.dataset.label : '');
        btn.style.color = '';
        if (feedbackEl) feedbackEl.classList.remove('show');
      }, 2000);
    });
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    const feedbackId = btn.getAttribute('data-feedback');
    const feedbackEl = feedbackId ? document.getElementById(feedbackId) : null;
    copyText(text, btn, feedbackEl);
  });

  // ── Reveal result card if shortId present ─────────────────
  const resultCard = document.getElementById('result-card');
  if (resultCard) resultCard.classList.add('visible');

  // ── Auto-dismiss alerts ───────────────────────────────────
  document.querySelectorAll('.alert[data-auto-dismiss]').forEach(function (el) {
    setTimeout(function () {
      el.style.transition = 'opacity 0.3s ease';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, 4000);
  });

});
