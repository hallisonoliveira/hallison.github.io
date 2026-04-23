# Tarefa 3.0: Implementar JavaScript Client-side

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar os scripts JavaScript que gerenciam a persistência de preferência de idioma no navegador, detectam o idioma do browser em primeira visita, e mapeiam URLs entre idiomas. Esta tarefa trabalha em paralelo com a Tarefa 2.0 (refatoração de templates) e depende da Tarefa 1.0 (configuração Hugo).

<requirements>
- Criar `static/js/language-service.js` para gerenciar localStorage, detecção de navegador, atualização de html[lang]
- Criar `static/js/navigation-mapper.js` para mapear URLs entre idiomas (PT ↔ EN)
- Garantir que preferência de idioma persiste em localStorage
- Detectar `navigator.language` como fallback em primeira visita
- Redirecionar corretamente ao trocar idioma via language-selector
- Atualizar atributo `lang` do HTML para acessibilidade
</requirements>

## Subtarefas

- [ ] 3.1 Criar `static/js/language-service.js` com lógica de localStorage + detecção
- [ ] 3.2 Implementar função para ler/escrever localStorage (chave: `preferredLanguage`)
- [ ] 3.3 Implementar função para detectar `navigator.language` em primeira visita
- [ ] 3.4 Implementar função para atualizar `document.documentElement.lang`
- [ ] 3.5 Adicionar event listener ao `#language-toggle` para trocar idioma
- [ ] 3.6 Criar `static/js/navigation-mapper.js` com função `mapUrl(currentPath, targetLanguage)`
- [ ] 3.7 Implementar lógica de redirecionamento ao trocar idioma (adicionar/remover `/en/`)
- [ ] 3.8 Testar persistência e navegação entre idiomas

## Detalhes de Implementação

Consulte as seções do `techspec.md`:
- **JavaScript Client-side** (linha 22-24): visão geral dos scripts
- **Fluxo de Dados** (linha 35-58): como language-service.js se integra
- **Monitoramento e Observabilidade** (linha 451-485): exemplos de logs e performance tracking

Estrutura esperada de `language-service.js`:
```javascript
// Inicializar ao carregar página
// Ler localStorage → se vazio, detectar navigator.language
// Atualizar html[lang]
// Atualizar botão de seletor (visualmente)
// Adicionar listener ao #language-toggle para redirecionar
```

Estrutura esperada de `navigation-mapper.js`:
```javascript
// Função mapUrl(currentUrl, targetLanguage)
// Se targetLanguage === 'en': adicionar /en/ se não existir
// Se targetLanguage === 'pt': remover /en/ se existir
// Retornar URL mapeada
```

## Critérios de Sucesso

- ✓ `language-service.js` carrega sem erros (pode validar com `node -c`)
- ✓ localStorage funciona: escreve e lê `preferredLanguage`
- ✓ `navigator.language` é detectado em primeira visita (sem localStorage)
- ✓ `html[lang]` é atualizado quando página carrega
- ✓ Clique no #language-toggle redireciona para idioma correto
- ✓ URL é mapeada corretamente: PT remove `/en/`, EN adiciona `/en/`
- ✓ Redirecionamento preserva caminho (ex: `/posts/` → `/en/posts/`)
- ✓ localStorage persiste entre abas/recargas da página

## Testes da Tarefa

- [ ] **Teste de sintaxe**: Validar JavaScript é válido
  ```bash
  node -c static/js/language-service.js && echo "✅ language-service.js válido"
  node -c static/js/navigation-mapper.js && echo "✅ navigation-mapper.js válido"
  ```

- [ ] **Teste de unidade**: localStorage
  ```javascript
  // Em um teste Node.js ou Playwright
  localStorage.setItem('preferredLanguage', 'en');
  const stored = localStorage.getItem('preferredLanguage');
  assert(stored === 'en', 'localStorage não persiste corretamente');
  console.log('✅ localStorage funciona');
  ```

- [ ] **Teste de integração**: Navegação com Playwright
  ```javascript
  // Em tests/e2e/language-service.spec.js
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  
  // Clicar language toggle
  await page.locator('#language-toggle').click();
  await expect(page).toHaveURL('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  
  console.log('✅ Navegação de idioma funciona');
  ```

- [ ] **Teste de persistência**: localStorage persiste
  ```javascript
  // Primeira página
  await page.goto('/');
  await page.locator('#language-toggle').click();
  
  // Segunda página (nova context com mesmo storage)
  const localStorage = await page.evaluate(() => 
    window.localStorage.getItem('preferredLanguage')
  );
  assert(localStorage === 'en', 'Preferência não persistiu');
  console.log('✅ Preferência persiste');
  ```

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `static/js/language-service.js` - Gerenciador de idioma (criar)
- `static/js/navigation-mapper.js` - Mapeador de URLs (criar)
- `layouts/_default/baseof.html` - Já refatorado em Tarefa 2.0, importa language-service.js
- `dev-docs/tasks/prd-i18n-system/techspec.md` - Referência técnica (ler)
