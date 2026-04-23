# Logging

## Tipos de Logging em Hugo

Em um projeto Hugo, o logging ocorre em dois contextos diferentes:

**Build-time (Logs do Hugo durante geração do site):**
```bash
# ✅ Hugo exibe logs durante o build
hugo
hugo -D  # com drafts

# ❌ Evite adicionar muitos logs customizados durante build
# Mantenha os builds limpos e informativos
```

**Client-side (Logs no navegador):**
```javascript
// ✅ Use console.log/error para debugging no navegador
console.log('Page loaded', { path: window.location.pathname });
console.error('JavaScript error', { message: error.message });

// ❌ Nunca exponha informações sensíveis no console do navegador
console.log('User data:', sensitiveData); // NUNCA faça isso
```

## Armazenamento

Para um site estático como Hugo, não há backend para armazenar logs. Logs ocorrem durante build ou no navegador.

**Build-time:**
```bash
# ✅ Redirecionando output do Hugo
hugo > build.log 2>&1

# ✅ Para CI/CD (GitHub Actions, etc), logs vão para stdout
# Serviços como GitHub Actions armazenam automaticamente os logs
```

**Client-side:**
```javascript
// ✅ Logs apenas no console do navegador (desenvolvimento)
console.log('Debug info', { data: 'value' });

// ✅ Para rastrear erros em produção, use um serviço externo
async function reportError(error) {
  await fetch('https://error-tracking-service.com/api/errors', {
    method: 'POST',
    body: JSON.stringify({
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  });
}
```

## Dados Sensíveis

Nunca registre dados sensíveis no navegador ou em logs. **Logs no navegador são visíveis aos usuários e podem ser interceptados.**

**Exemplo:**
```javascript
// ❌ NUNCA faça isso
console.log('User info', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890'
});

// ❌ NUNCA registre tokens ou credenciais
console.log('API token:', authToken);
console.log('User password:', password);

// ✅ Prefira - apenas informações públicas
console.log('Page loaded', {
  path: window.location.pathname,
  timestamp: new Date().toISOString()
});

// ✅ Se necessário debugar, use IDs genéricos
console.log('User interaction', {
  userId: 'user_123',
  action: 'button_click'
});
```

## Mensagens Claras

Seja sempre claro nas mensagens de log, sem exagerar ou utilizar textos longos.

**Exemplo:**
```javascript
// ❌ Evite - muito verboso
console.log('The article with the ID 123 has successfully loaded in the browser and is now able to display all content to the user');

// ❌ Evite - muito vago
console.log('Done');
console.log('Error');

// ✅ Prefira - claro e conciso
console.log('Article loaded successfully', { articleId: '123' });
console.error('Image load failed', { 
  imageUrl: '/images/article.jpg', 
  reason: 'not_found' 
});
```

## Métodos de Console

Use `console.log`, `console.warn` e `console.error` de forma apropriada.

**Exemplo Client-side (JavaScript):**
```javascript
// ✅ Prefira - logs estruturados
console.log('Navigation event', {
  from: previousPath,
  to: window.location.pathname,
  timestamp: new Date().toISOString()
});

console.warn('Deprecated API used', {
  api: 'oldFunction',
  replacement: 'newFunction'
});

console.error('Failed to load resource', {
  resource: 'image-url',
  status: 404
});

// ❌ Evite - logs sem contexto
console.log('Done');
console.warn('Something');
console.error('Error occurred');
```

**Exemplo Vanilla JavaScript:**
```javascript
// ✅ Prefira - inicialização com log
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded', {
    documentReady: true,
    timestamp: new Date().toISOString()
  });
  
  // inicializar aplicação
});

// ✅ Para eventos
const button = document.getElementById('submit-button');
button?.addEventListener('click', () => {
  console.log('Form submitted', {
    formId: 'contact-form'
  });
});
```

## Tratamento de Exceções

Nunca silencie exceções. Sempre registre com contexto completo.

**Exemplo em JavaScript:**
```javascript
// ❌ Evite - silenciar erros
try {
  fetchData();
} catch (error) {
  // ignorado silenciosamente
}

// ✅ Prefira - registrar com contexto
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
} catch (error) {
  console.error('Failed to fetch data', {
    error: error instanceof Error ? error.message : 'Unknown error',
    url: '/api/data',
    timestamp: new Date().toISOString()
  });
  // Re-lançar ou tratar apropriadamente
  throw error;
}
```

**Exemplo com Event Listeners:**
```javascript
// ✅ Sempre registre erros não capturados
window.addEventListener('error', (event) => {
  console.error('Uncaught error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: new Date().toISOString()
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection', {
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
});
```

## Contexto nos Logs

Sempre inclua contexto relevante nos logs para facilitar debugging.

**Exemplo:**
```javascript
// ❌ Evite - sem contexto
console.log('Loaded');
console.error('Failed');

// ✅ Prefira - com contexto
console.log('Article loaded', {
  articleId: 'how-to-hugo',
  language: 'pt',
  timestamp: new Date().toISOString()
});

console.error('Failed to load image', {
  imageUrl: '/images/article-header.jpg',
  errorCode: 404,
  timestamp: new Date().toISOString()
});
```

## Estrutura de Logs

Use objetos estruturados para facilitar análise.

**Exemplo:**
```javascript
// ❌ Evite - string não estruturada
console.log(`Article ${title} with ${views} views loaded`);

// ✅ Prefira - objeto estruturado
console.log('Article view tracked', {
  articleId: 'how-to-hugo',
  title: 'How to use Hugo',
  views: 42,
  language: 'pt',
  timestamp: new Date().toISOString()
});
```

## Desenvolvimento vs Produção

Ajuste logs baseado no ambiente.

**Exemplo:**
```javascript
// logger.js
const isDevelopment = window.location.hostname === 'localhost';

export function logDebug(message, data) {
  if (isDevelopment) {
    console.log(message, data);
  }
}

export function logError(message, error) {
  console.error(message, {
    error: error instanceof Error ? error.message : String(error),
    stack: isDevelopment && error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
}

// Uso
logDebug('Rendering page', { section: 'articles' }); // só em dev
logError('Failed to render', renderError); // sempre registra, stack só em dev
```

## Performance Metrics

Para logs de performance, inclua duração e métricas relevantes.

**Exemplo - Build Hugo:**
```bash
# Hugo exibe automaticamente métricas durante build
$ hugo

# Output típico:
# Cached "/path/to/file" (5.2ms)
# Built in 234ms
```

**Exemplo - Performance no Navegador:**
```javascript
// ✅ Prefira - rastrear performance
function trackPageLoadTime() {
  if (window.performance && window.performance.timing) {
    const navigationStart = window.performance.timing.navigationStart;
    const loadComplete = window.performance.timing.loadEventEnd;
    const loadTime = loadComplete - navigationStart;

    console.log('Page load metrics', {
      totalLoadTime: `${loadTime}ms`,
      domReady: window.performance.timing.domContentLoadedEventEnd - navigationStart,
      timestamp: new Date().toISOString()
    });
  }
}

document.addEventListener('load', trackPageLoadTime);

// ✅ Rastrear operações específicas
async function loadArticle(articleId) {
  const startTime = performance.now();
  
  try {
    const response = await fetch(`/articles/${articleId}/index.html`);
    const content = await response.text();
    
    const duration = performance.now() - startTime;
    console.log('Article loaded', {
      articleId,
      duration: `${duration.toFixed(2)}ms`,
      size: content.length,
      timestamp: new Date().toISOString()
    });
    
    return content;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error('Failed to load article', {
      articleId,
      duration: `${duration.toFixed(2)}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}
```