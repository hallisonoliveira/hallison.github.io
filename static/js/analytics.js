document.addEventListener('DOMContentLoaded', function() {
  var isDevelopment = location.hostname === 'localhost';
  if (isDevelopment) {
    console.log('Analytics initialized', {
      consent: localStorage.getItem('cookie-consent'),
      language: document.documentElement.lang,
      timestamp: new Date().toISOString()
    });
  }

  if (localStorage.getItem('cookie-consent') !== 'accepted') return;
  if (typeof window.gtag !== 'function') return;

  // outbound_link
  document.querySelectorAll('a[href^="http"]').forEach(function(link) {
    if (!link.href.includes(location.hostname)) {
      link.addEventListener('click', function() {
        gtag('event', 'outbound_link', { url: link.href });
      });
    }
  });

  // social_click
  document.querySelectorAll('footer a[target="_blank"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'social_click', { network: link.dataset.network || link.hostname });
    });
  });

  // read_depth — scroll milestones on article pages
  var milestones = [25, 50, 75, 100];
  var reached = {};
  window.addEventListener('scroll', function() {
    var scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    milestones.forEach(function(m) {
      if (!reached[m] && scrolled >= m) {
        reached[m] = true;
        gtag('event', 'read_depth', { depth: m, page: location.pathname });
      }
    });
  });
});
