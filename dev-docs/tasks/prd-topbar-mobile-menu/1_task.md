# Tarefa 1.0: Estrutura estática do menu mobile

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar as chaves i18n de acessibilidade e modificar o template `header.html` para incluir o botão hambúrguer e o painel dropdown de navegação mobile. Ao final desta tarefa, a estrutura HTML estará correta e o build Hugo deve compilar sem erros ou warnings de i18n.

<requirements>
- Adicionar chaves mobile_menu_open, mobile_menu_close e mobile_menu_label em i18n/pt.yaml e i18n/en.yaml
- Adicionar botão hambúrguer em layouts/partials/header.html, visível apenas em viewport < 768px (md:hidden)
- Adicionar painel dropdown com links para Início, Artigos e Sobre usando i18n keys existentes (nav_home, nav_posts, nav_about)
- Active state nos links deve ser consistente com o comportamento desktop
- Nenhuma alteração no comportamento em telas >= 768px
- O seletor de idioma não deve ser alterado
</requirements>

## Subtarefas

- [ ] 1.1 Adicionar as 3 chaves i18n em `i18n/pt.yaml`
- [ ] 1.2 Adicionar as 3 chaves i18n em `i18n/en.yaml`
- [ ] 1.3 Inserir botão hambúrguer (`#mobile-menu-toggle`) dentro do `<div class="flex items-center gap-4">` no `header.html`
- [ ] 1.4 Inserir painel dropdown (`#mobile-nav-panel`) com os três links de navegação, após o `</div>` do `flex justify-between`
- [ ] 1.5 Validar build com `hugo` sem erros ou warnings de chave i18n ausente

## Detalhes de Implementação

Ver `techspec.md` — seções:
- **Estrutura de Templates** (botão hambúrguer e painel dropdown)
- **Configuração de Dados** (chaves i18n)
- **Considerações Técnicas** (decisões sobre dropdown vs drawer, ícone Material Symbols, toggle via classe `hidden`)

## Critérios de Sucesso

- `hugo` compila sem erros ou warnings relacionados a i18n
- Em viewport < 768px, o botão hambúrguer é renderizado no HTML com `id="mobile-menu-toggle"`
- O painel `id="mobile-nav-panel"` está presente no HTML com os três links
- O link da página atual possui a classe de active state
- Em viewport >= 768px, nenhum elemento visual novo é exibido

## Testes da Tarefa

- [ ] Build test: `hugo` retorna exit code 0
- [ ] Build test: `hugo --logLevel info 2>&1 | grep -i "missing\|error"` não retorna resultados relacionados a i18n
- [ ] Build test: `test -f public/index.html` — validar que o output foi gerado
- [ ] Inspeção manual: abrir `public/index.html` e confirmar presença dos elementos `#mobile-menu-toggle` e `#mobile-nav-panel` no HTML gerado

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `i18n/pt.yaml`
- `i18n/en.yaml`
- `layouts/partials/header.html`
