document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const panel = document.getElementById('mobile-nav-panel');

  if (!toggle || !panel) return;

  const isDevelopment = window.location.hostname === 'localhost';

  if (isDevelopment) {
    console.log('Mobile menu initialized', { timestamp: new Date().toISOString() });
  }

  window.addEventListener('error', (event) => {
    console.error('Mobile menu error', {
      message: event.message,
      filename: event.filename,
      timestamp: new Date().toISOString()
    });
  });

  toggle.dataset.openLabel = toggle.getAttribute('aria-label');
  toggle.dataset.closeLabel = toggle.getAttribute('data-close-label');

  function openMenu() {
    panel.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', toggle.dataset.closeLabel);
  }

  function closeMenu() {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', toggle.dataset.openLabel);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.contains('hidden') ? openMenu() : closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !panel.contains(e.target)) closeMenu();
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});
