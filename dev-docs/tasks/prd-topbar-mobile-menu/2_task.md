# Tarefa 2.0: Comportamento interativo e testes E2E

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar o script `static/js/mobile-menu.js` com toda a lógica de interação do menu mobile, incluí-lo no layout base, e criar a suite de testes E2E com Playwright que valida todos os comportamentos definidos no PRD.

<requirements>
- Criar static/js/mobile-menu.js com vanilla JS (sem frameworks)
- Implementar toggle abrir/fechar ao clicar no botão hambúrguer
- Fechar menu ao pressionar tecla Esc
- Fechar menu ao clicar fora do botão e do painel
- Fechar menu ao clicar em qualquer link do painel
- Atualizar aria-expanded (true/false) e aria-label (open/close) a cada toggle
- Incluir o script no layout base (layouts/_default/baseof.html) com atributo defer
- Criar testes E2E cobrindo todos os comportamentos acima
</requirements>

## Subtarefas

- [ ] 2.1 Verificar como `analytics.js` e `language-service.js` são incluídos no `baseof.html` para seguir o mesmo padrão
- [ ] 2.2 Criar `static/js/mobile-menu.js` com funções `openMenu` e `closeMenu`
- [ ] 2.3 Implementar listener de clique no toggle, Esc, clique fora e clique em links
- [ ] 2.4 Garantir que `aria-expanded` e `aria-label` são atualizados a cada toggle
- [ ] 2.5 Incluir `<script src="{{ "js/mobile-menu.js" | relURL }}" defer></script>` no `baseof.html`
- [ ] 2.6 Criar `tests/e2e/mobile-menu.spec.js` com os 5 cenários de teste
- [ ] 2.7 Executar suite Playwright e garantir que todos os testes passam

## Detalhes de Implementação

Ver `techspec.md` — seções:
- **Pontos de Integração** (estrutura do script e inclusão no baseof.html)
- **Testes E2E com Playwright** (cenários e viewports)
- **Monitoramento e Observabilidade** (logs de inicialização dev/prod)
- **Riscos Conhecidos** (aria-label dinâmico, Tailwind purge)

## Critérios de Sucesso

- `static/js/mobile-menu.js` existe e é copiado para `public/js/mobile-menu.js` após build
- Em viewport 375px: hambúrguer visível, painel oculto por padrão
- Clicar no hambúrguer exibe o painel; `aria-expanded` passa para `"true"`
- Pressionar Esc fecha o painel; `aria-expanded` volta para `"false"`
- Clicar fora do painel fecha o menu
- Clicar em link do painel fecha o menu e navega para a página correta
- Em viewport 1024px: hambúrguer não é visível
- Todos os 5 testes Playwright passam sem falhas

## Testes da Tarefa

```javascript
// tests/e2e/mobile-menu.spec.js
describe('Mobile Navigation Menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  it('should show hamburger button on mobile viewport')
  it('should open panel when hamburger is clicked')
  it('should close panel when a nav link is clicked')
  it('should close panel when Esc key is pressed')
  it('should not show hamburger button on desktop viewport') // viewport 1024x768
});
```

- [ ] Testes E2E: `npx playwright test tests/e2e/mobile-menu.spec.js` — todos passam
- [ ] Build test: `test -f public/js/mobile-menu.js` — arquivo presente no output

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `static/js/mobile-menu.js` (novo)
- `layouts/_default/baseof.html`
- `tests/e2e/mobile-menu.spec.js` (novo)
