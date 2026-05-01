# PRD — Menu Hambúrguer Mobile na Topbar

## Visão Geral

Em dispositivos com telas menores que 768px, os links de navegação da topbar (Início, Artigos, Sobre) não são exibidos, pois estão ocultos via classe `hidden md:flex`. Isso impede que usuários mobile naveguem pelas páginas principais do blog. Este PRD define os requisitos para adicionar um menu hambúrguer mobile que torne a navegação acessível nessas telas, sem alterar o comportamento atual em telas ≥ 768px.

## Objetivos

- Garantir que 100% dos links de navegação principais sejam acessíveis em dispositivos mobile (< 768px)
- Manter comportamento e layout atuais em telas ≥ 768px sem regressões
- Preservar o suporte a internacionalização (i18n) nos links exibidos no menu mobile
- Não introduzir alterações em conteúdo, rotas ou funcionalidades existentes

## Histórias de Usuário

- Como **leitor do blog em um smartphone**, eu quero acessar as páginas Início, Artigos e Sobre pelo menu de navegação para que eu possa explorar o conteúdo sem precisar digitar URLs manualmente.
- Como **leitor em qualquer idioma suportado**, eu quero que os rótulos do menu mobile estejam no idioma correto para que a navegação seja compreensível independentemente do idioma selecionado.
- Como **usuário de desktop ou tablet (≥ 768px)**, eu quero que a navegação continue funcionando exatamente como está para que minha experiência não seja afetada pela mudança.

## Funcionalidades Principais

### 1. Ícone Hambúrguer no Mobile

- Exibido apenas em telas < 768px (oculto em telas ≥ 768px)
- Posicionado na área direita da topbar, ao lado do seletor de idioma
- Ao ser clicado, abre o painel de navegação mobile
- Ao ser clicado novamente (ou ao navegar), fecha o painel

**Requisitos funcionais:**
- RF-01: O ícone hambúrguer deve ser visível apenas em viewport < 768px
- RF-02: O ícone hambúrguer deve ser acessível via teclado e ter `aria-label` descritivo
- RF-03: O estado do menu (aberto/fechado) deve ser refletido no atributo `aria-expanded` do botão

### 2. Painel de Navegação Mobile

- Exibe os links: Início, Artigos, Sobre
- Links usam as traduções via `i18n` já existentes (`nav_home`, `nav_posts`, `nav_about`)
- Link da página atual recebe destaque visual consistente com o comportamento desktop
- Fechar ao clicar em qualquer link

**Requisitos funcionais:**
- RF-04: O painel deve exibir os três links de navegação com os mesmos rótulos traduzidos já utilizados na versão desktop
- RF-05: O link correspondente à página atual deve receber destaque visual (active state)
- RF-06: Clicar em um link deve fechar o menu e navegar para a página correta
- RF-07: O painel deve ser fechado ao clicar fora dele ou pressionar `Esc`

### 3. Seletor de Idioma

- Permanece em sua posição atual (lado direito da topbar), visível em todos os tamanhos de tela
- Não é movido para dentro do menu hambúrguer

**Requisitos funcionais:**
- RF-08: O seletor de idioma não deve ser alterado em posição, aparência ou comportamento

### 4. Comportamento Desktop Preservado

- Em telas ≥ 768px, os links centrais da topbar continuam sendo exibidos inline
- O ícone hambúrguer não deve aparecer nessas telas

**Requisitos funcionais:**
- RF-09: Nenhuma alteração visual ou funcional deve ocorrer em viewports ≥ 768px

## Experiência do Usuário

**Persona principal:** Leitor do blog acessando via smartphone (< 768px).

**Fluxo principal:**
1. Usuário acessa qualquer página do blog no mobile
2. Vê a topbar com o nome do site à esquerda e os controles à direita (seletor de idioma + ícone hambúrguer)
3. Toca no ícone hambúrguer
4. Um painel de navegação é exibido com os links Início, Artigos e Sobre
5. Usuário toca no link desejado
6. O menu fecha e a página é carregada corretamente

**Requisitos de UX:**
- O painel mobile deve ser claramente distinguível do conteúdo da página (ex: sobreposição ou área dedicada abaixo da topbar)
- Transição suave de abertura/fechamento é desejável, mas não obrigatória
- O menu não deve cobrir permanentemente o conteúdo da página quando fechado

**Acessibilidade:**
- Botão hambúrguer com `aria-label` e `aria-expanded`
- Links do menu navegáveis via teclado
- Foco deve ser gerenciado ao abrir/fechar o menu

## Restrições Técnicas de Alto Nível

- O projeto usa **Hugo** como gerador de site estático com templates Go
- Estilos são baseados em **Tailwind CSS** (via CDN)
- O suporte a **i18n** deve ser mantido — rótulos via `i18n` keys existentes
- JavaScript usado deve ser **vanilla JS** (sem frameworks), seguindo padrão do projeto
- A alteração deve se restringir ao partial `layouts/partials/header.html` e, se necessário, a um novo partial ou arquivo JS dedicado
- Nenhuma rota, conteúdo ou configuração de idioma deve ser modificada

## Fora de Escopo

- Alteração de qualquer conteúdo de página, post ou metadado
- Mudança no seletor de idioma (posição, aparência ou comportamento)
- Criação de novas páginas ou rotas de navegação
- Alteração do comportamento da topbar em telas ≥ 768px
- Menu de navegação com submenus ou hierarquia aninhada
- Animações complexas ou bibliotecas de UI externas
- Testes automatizados E2E (fora do escopo desta entrega)
