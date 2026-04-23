(function () {
  'use strict';

  function mapUrl(currentPath, targetLanguage) {
    if (targetLanguage === 'en') {
      if (!currentPath.startsWith('/en/')) {
        return '/en' + (currentPath.startsWith('/') ? currentPath : '/' + currentPath);
      }
      return currentPath;
    }
    // targetLanguage === 'pt': remove /en prefix
    if (currentPath.startsWith('/en/')) {
      return currentPath.replace(/^\/en/, '') || '/';
    }
    return currentPath;
  }

  window.NavigationMapper = { mapUrl };
}());
