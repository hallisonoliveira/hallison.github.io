(function () {
  'use strict';

  const STORAGE_KEY = 'preferredLanguage';
  const SUPPORTED_LANGS = ['pt', 'en'];

  function getPageLang() {
    const button = document.getElementById('language-toggle');
    if (button) {
      const lang = button.getAttribute('data-current-lang');
      if (lang && SUPPORTED_LANGS.indexOf(lang) !== -1) return lang;
    }
    return window.location.pathname.startsWith('/en/') ? 'en' : 'pt';
  }

  function detectBrowserLang() {
    const lang = (navigator.language || '').toLowerCase();
    return lang.startsWith('en') ? 'en' : 'pt';
  }

  function updateHtmlLang(lang) {
    document.documentElement.lang = lang;
  }

  function updateButtonUI(button, lang) {
    if (!button) return;
    if (lang === 'en') {
      button.title = 'Português';
      button.setAttribute('aria-label', 'Mudar para português');
    } else {
      button.title = 'English';
      button.setAttribute('aria-label', 'Switch to English');
    }
  }

  function getTargetUrl(targetLang) {
    const mapper = window.NavigationMapper;
    if (!mapper || typeof mapper.mapUrl !== 'function') {
      console.error('NavigationMapper not available', { timestamp: new Date().toISOString() });
      return targetLang === 'en'
        ? '/en' + window.location.pathname
        : window.location.pathname.replace(/^\/en/, '') || '/';
    }
    return mapper.mapUrl(window.location.pathname, targetLang);
  }

  function switchLanguage() {
    const currentLang = getPageLang();
    const nextLang = currentLang === 'pt' ? 'en' : 'pt';

    localStorage.setItem(STORAGE_KEY, nextLang);

    console.log('Language switched', {
      from: currentLang,
      to: nextLang,
      timestamp: new Date().toISOString()
    });

    window.location.href = getTargetUrl(nextLang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const pageLang = getPageLang();
    const button = document.getElementById('language-toggle');
    let stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      stored = detectBrowserLang();
      localStorage.setItem(STORAGE_KEY, stored);
    }

    console.log('Language initialized', {
      detected: navigator.language,
      stored: stored,
      current: pageLang,
      timestamp: new Date().toISOString()
    });

    updateHtmlLang(pageLang);
    updateButtonUI(button, pageLang);

    if (button) {
      button.addEventListener('click', switchLanguage);
    }
  });
}());
