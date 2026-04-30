# PRD — Melhorias na Página de Post

## Visão Geral

A página de exibição de posts do blog apresenta problemas visuais e de usabilidade que a destoam do restante do site. O layout atual possui título e imagem de destaque superdimensionados, ausência de espaçamento entre parágrafos, imagens sem margens, legendas mal posicionadas, links sem diferenciação visual e um bug que exibe o próprio post na seção de "Leitura Relacionada". O objetivo é reformular o layout da página de post para que seja claro, legível e visualmente consistente com o design system do site — sem alterar header e footer.

---

## Objetivos

- A página de post deve seguir as diretrizes visuais do design system definido em `mockup/post/DESIGN.md` e `mockup/post/code.html`
- O corpo do texto deve ser legível e agradável para qualquer perfil de leitor, sem priorizar público específico
- Todas as melhorias se aplicam a **todos os posts** do blog
- O post atual **não deve aparecer** na seção de leitura relacionada
- Links no corpo do texto devem ser visualmente distinguíveis do texto comum
- As melhorias não devem afetar o header nem o footer

---

## Histórias de Usuário

- Como **leitor**, eu quero que o título do post tenha um tamanho proporcional ao restante do layout, para que a leitura seja confortável e equilibrada visualmente.
- Como **leitor**, eu quero espaçamento adequado entre parágrafos, para que o texto seja fácil de acompanhar sem perder o fio da leitura.
- Como **leitor**, eu quero que as imagens dentro do post tenham margens e espaçamento ao redor, para que não fiquem coladas ao texto e prejudiquem a leitura.
- Como **leitor**, eu quero que as legendas das imagens apareçam centralizadas abaixo delas, para que a relação entre imagem e descrição seja clara.
- Como **leitor**, eu quero que links no corpo do post tenham cor e estilo distintos, para que eu consiga identificá-los facilmente sem confundi-los com texto comum.
- Como **leitor**, eu quero que a seção "Leitura Relacionada" exiba apenas posts diferentes do atual, para que a navegação seja útil e não redundante.
- Como **editor**, eu quero que a imagem de destaque do post seja apresentada em proporções harmoniosas, para que não domine visualmente a página nem prejudique a hierarquia de informação.

---

## Funcionalidades Principais

### RF01 — Título do Post
- O título deve ter tamanho tipográfico reduzido em relação ao estado atual
- Deve seguir a família `Manrope` (font-headline) conforme o design system
- Tamanho de referência: `text-5xl` a `text-7xl` responsivo, com `tracking-tighter` e `leading-none`

### RF02 — Imagem de Destaque
- A imagem deve ter proporção reduzida (referência: `aspect-[21/9]`)
- Deve ter `border-radius` (`rounded-xl`) e `overflow-hidden`
- Deve respeitar margens laterais consistentes com o restante do layout

### RF03 — Espaçamento entre Parágrafos
- Parágrafos no corpo do post devem ter espaçamento vertical claro entre si
- Referência: `space-y-12` no container do corpo do conteúdo

### RF04 — Ausência de tabulação no início de parágrafo
- **Não aplicar** indent/tabulação no início dos parágrafos
- O mockup utiliza `first-letter` drop cap apenas no primeiro parágrafo do artigo

### RF05 — Imagens no Corpo do Post
- Imagens inseridas via Markdown devem ter margens superiores e inferiores
- Referência de espaçamento: mínimo `mt-8 mb-4` ou equivalente
- Imagens devem ter `border-radius` consistente com o design system

### RF06 — Legenda de Imagens
- Legendas (`<figcaption>`) devem ser centralizadas horizontalmente
- Devem ser exibidas abaixo da imagem, com tamanho menor que o corpo do texto
- Fonte de referência: `font-label` (Inter), `text-sm`, `text-on-surface-variant`

### RF07 — Espaçamento antes e depois de imagens
- Deve haver espaço visual claro separando imagens do texto que as precede e sucede
- Referência: `my-12` ou equivalente ao redor do elemento de imagem

### RF08 — Leitura Relacionada (bug)
- O post atualmente em exibição não deve aparecer na lista de posts relacionados
- A lógica de filtragem deve excluir o post atual pelo seu identificador (URL ou permalink)

### RF09 — Links no Corpo do Post
- Links devem ter cor diferenciada, usando a cor `primary` (`#680A08` / `primary-container`) do design system
- Devem ter sublinhado ou outro indicador visual que os diferencie do texto comum
- Estado hover deve reforçar o destaque visual

---

## Experiência do Usuário

**Persona:** Qualquer leitor — desde visitantes casuais a leitores regulares, independente de perfil técnico.

**Fluxo principal:** O leitor chega à página de um post (via listagem, busca ou link direto), lê o conteúdo e ao terminar encontra sugestões de outros posts relevantes.

**Requisitos de UX:**
- A hierarquia visual deve guiar o olhar: metadados → título → imagem de destaque → corpo do texto → leitura relacionada
- O corpo do texto deve usar `Newsreader` (font-body) para máxima legibilidade em leitura longa
- Metadados (data, tempo de leitura, tags) devem usar `Inter` (font-label) em tamanho reduzido
- A sidebar com autor e tags (visível em desktop) deve ser `sticky` e não competir visualmente com o conteúdo principal
- A seção "Leitura Relacionada" deve exibir cards com imagem, categoria e título, em grid responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- Sem dark mode — o layout é exclusivamente light

**Acessibilidade:**
- Contraste de texto deve seguir WCAG AA mínimo
- Imagens devem ter atributo `alt` descritivo
- Links devem ser identificáveis sem depender exclusivamente de cor

---

## Restrições Técnicas de Alto Nível

- O site usa **Hugo** como gerador estático; todas as mudanças de layout ocorrem em templates (`.html`) e CSS
- O design system de referência é definido em `mockup/post/DESIGN.md` e `mockup/post/code.html`
- Paleta de cores, tipografia e tokens já estão definidos no mockup — a implementação deve seguir esses valores
- Header e footer estão fora do escopo; suas estruturas e estilos não devem ser alterados
- Não há dark mode no projeto

---

## Fora de Escopo

- Alterações no header ou footer
- Implementação de dark mode
- Mudanças na listagem de posts (página de índice)
- Alterações no sistema de busca
- Criação de novos componentes além dos necessários para as melhorias listadas
- Animações complexas ou transições que impactem performance de build
- Alterações em outras páginas que não sejam o layout de post (`single.html` e seus partials)
