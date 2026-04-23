# Tarefa 5.0: Testes Build & E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar suite completa de testes automatizados para validar build do Hugo e comportamento do site em navegador real. Esta tarefa integra todos os componentes das tarefas anteriores (1-4) e garante que o sistema de i18n funciona ponta-a-ponta. Inclui testes de build, testes E2E com Playwright, e validação de HTML.

<requirements>
- Criar `scripts/validate-build.sh` para validar build Hugo
- Configurar `tests/e2e/i18n.spec.js` com Playwright
- Testar cenários: padrão PT, switch para EN, persistência de idioma, detecção de navegador, posts filtrados
- Testar navegação preservada ao trocar idioma (ex: `/posts/` → `/en/posts/`)
- Testar acessibilidade (aria-labels, html[lang])
- Validar que HTML gerado é válido e não contém erros
- Garantir que todos os testes E2E passam
</requirements>

## Subtarefas

- [ ] 5.1 Criar `scripts/validate-build.sh` com validação de build Hugo
- [ ] 5.2 Adicionar validação de warnings i18n em build
- [ ] 5.3 Validar que ficheiros críticos foram gerados (index.html, en/index.html, sitemap.xml)
- [ ] 5.4 Configurar Playwright (`tests/playwright.config.js` se não existir)
- [ ] 5.5 Criar `tests/e2e/i18n.spec.js` com testes principais
- [ ] 5.6 Implementar teste: padrão PT ao carregar `/`
- [ ] 5.7 Implementar teste: switch para EN via language-toggle
- [ ] 5.8 Implementar teste: persistência de idioma entre páginas
- [ ] 5.9 Implementar teste: detecção de navigator.language em primeira visita
- [ ] 5.10 Implementar teste: posts não traduzidos não aparecem em EN
- [ ] 5.11 Executar suite completa de testes

## Detalhes de Implementação

Consulte as seções do `techspec.md`:
- **Testes de Build** (linha 318-337): exemplo de validação de build
- **Testes E2E com Playwright** (linha 340-415): exemplos detalhados de testes
- **Pontos de Integração** (linha 257-274): como componentes se integram

Estrutura esperada de `validate-build.sh`:
```bash
#!/bin/bash

# 1. Executar Hugo com warnings
hugo --printI18nWarnings 2>&1 | tee build.log

# 2. Verificar se há warnings faltando tradução
if grep -i "missing" build.log; then
  echo "❌ Tradução faltante detectada"
  exit 1
fi

# 3. Validar arquivos críticos gerados
test -f public/index.html || exit 1
test -f public/en/index.html || exit 1
test -f public/sitemap.xml || exit 1

echo "✅ Build validation passed"
```

Testes E2E esperados:
1. **Padrão PT**: Carregar `/` → html[lang]="pt", nav em português
2. **Switch EN**: Clicar language-toggle → URL `/en/`, html[lang]="en", nav em inglês
3. **Persistência**: Trocar idioma → nova página mantém idioma via localStorage
4. **Detecção browser**: Simular locale en-US → detectar EN em primeira visita
5. **Posts filtrados**: Carregar `/en/posts/` → não mostrar posts PT-only
6. **Navegação preservada**: Estar em `/posts/` → trocar para EN → ir para `/en/posts/`

## Critérios de Sucesso

- ✓ `scripts/validate-build.sh` é executável e valida build com sucesso
- ✓ Hugo build completa sem erros ou warnings i18n
- ✓ Todos os arquivos críticos são gerados (public/index.html, public/en/index.html, etc)
- ✓ Playwright está configurado e testes E2E rodam sem erros
- ✓ Teste de padrão PT passa
- ✓ Teste de switch para EN passa
- ✓ Teste de persistência passa
- ✓ Teste de detecção de navegador passa
- ✓ Teste de filtragem de posts passa
- ✓ Todos os testes E2E passam consistentemente
- ✓ HTML gerado é válido e acessível

## Testes da Tarefa

- [ ] **Teste de validação de build**: Executar script
  ```bash
  bash scripts/validate-build.sh
  # Esperado: Build completa, nenhum warning i18n, exit code 0
  ```

- [ ] **Teste E2E simples**: Testar padrão PT
  ```bash
  npm run test:e2e -- --grep "should display site in Portuguese"
  # Esperado: Teste passa
  ```

- [ ] **Teste E2E switching idioma**: Testar switch para EN
  ```bash
  npm run test:e2e -- --grep "should switch to English"
  # Esperado: Teste passa
  ```

- [ ] **Teste E2E persistência**: Testar localStorage
  ```bash
  npm run test:e2e -- --grep "should persist language preference"
  # Esperado: Teste passa
  ```

- [ ] **Suite completa**: Rodar todos os testes E2E
  ```bash
  npm run test:e2e
  # Esperado: Todos os testes passam
  ```

- [ ] **Teste em CI/CD**: Validar que pode ser integrado
  ```bash
  # Simular CI/CD
  npm run test:e2e && echo "✅ Testes passam em CI"
  ```

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `scripts/validate-build.sh` - Script de validação de build (criar)
- `tests/e2e/i18n.spec.js` - Suite de testes E2E (criar)
- `tests/playwright.config.js` - Configuração Playwright (criar se necessário)
- `package.json` - Scripts npm (adicionar test:e2e se não existir)
- Todos os arquivos das Tarefas 1-4 (já devem estar implementados)
- `dev-docs/tasks/prd-i18n-system/techspec.md` - Referência técnica (ler)
