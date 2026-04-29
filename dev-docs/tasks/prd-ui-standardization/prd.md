# Padronização Visual do Blog

## Visão Geral

O blog possui três páginas principais (Início, Artigos, Sobre) e páginas de post, criadas em momentos distintos. Isso resultou em inconsistências visuais — principalmente em margens e espaçamentos — que comprometem a coesão da experiência do leitor. Esta tarefa unifica a aparência do blog sem alterar nenhum conteúdo.

## Objetivos

- Eliminar inconsistências de padding e margens horizontais entre todas as páginas
- Padronizar a hierarquia de espaçamento vertical entre seções
- Garantir que animações e transições sigam o mesmo padrão em todos os layouts
- Assegurar que a experiência seja consistente em dispositivos mobile e desktop
- Critério de sucesso: revisão visual confirmando que todas as páginas parecem pertencer ao mesmo sistema de design

## Histórias de Usuário

- Como leitor, ao navegar entre páginas, quero que os elementos de conteúdo se alinhem visualmente, para que a experiência pareça coesa e profissional
- Como leitor mobile, quero que margens e espaçamentos sejam proporcionais em telas pequenas, para que o conteúdo seja confortável de ler sem cortes ou excessos
- Como editor do blog, quero que novos layouts sigam um padrão claro de espaçamento, para que futuras páginas fiquem consistentes sem esforço extra

## Funcionalidades Principais

### RF-01 — Padding horizontal unificado

O padding horizontal das páginas deve ser definido uma única vez, no layout base (`baseof.html`), e nenhum layout filho deve reintroduzir padding horizontal adicional ao container principal.

- **O que é**: Remoção do padding duplicado em `single.html`, que atualmente soma o padding do `baseof.html` com o seu próprio
- **Por que importa**: A página de post apresenta margens maiores que as demais, quebrando o alinhamento visual ao navegar entre páginas
- **Requisitos**:
  1. O padding horizontal padrão é `px-6 md:px-12 lg:px-16`, definido somente em `baseof.html`
  2. `single.html` não deve redefinir padding horizontal no container raiz do artigo
  3. Seções que precisam de fundo full-width (como na página Sobre) usam margens negativas compensatórias coerentes com o padding base

### RF-02 — Max-width consistente

As páginas devem adotar uma largura máxima de conteúdo consistente para telas grandes.

- **O que é**: Definição de um max-width padrão para o conteúdo principal em todas as páginas
- **Por que importa**: `single.html` usa `max-w-screen-xl` e `about/list.html` usa `max-w-7xl`, enquanto `index.html` e `posts/list.html` não usam max-width, criando larguras de conteúdo diferentes entre páginas
- **Requisitos**:
  1. Todas as páginas devem usar o mesmo valor de max-width para o container de conteúdo principal
  2. Seções decorativas (fundos, banners) podem ultrapassar esse limite intencionalmente

### RF-03 — Hierarquia de espaçamento vertical padronizada

Os espaçamentos verticais entre seções devem seguir uma escala definida e consistente.

- **O que é**: Revisão dos valores de `mb-*` e `mt-*` entre seções de todas as páginas
- **Por que importa**: Os layouts usam `mb-24`, `mb-32` e `mt-32` de forma variada sem hierarquia clara, gerando ritmo visual inconsistente entre páginas
- **Requisitos**:
  1. Seções primárias de página devem usar o mesmo espaçamento inferior
  2. Subsections e componentes dentro de seções seguem escala menor consistente
  3. A hierarquia deve ser perceptivelmente uniforme ao comparar páginas lado a lado

### RF-04 — Animações e transições padronizadas

Todas as animações de hover e transições devem usar os mesmos valores de duração e easing.

- **O que é**: Revisão de classes `transition-*` e `duration-*` em todos os layouts
- **Por que importa**: Existem variações (`duration-300`, `duration-500`, `duration-700`) aplicadas a elementos similares em páginas diferentes, sem critério visual claro
- **Requisitos**:
  1. Transições de cor/opacidade em links e botões: valor único e consistente
  2. Transições de imagem (grayscale, scale): valor único e consistente
  3. Elementos funcionalmente equivalentes devem ter a mesma duração de transição

## Experiência do Usuário

**Página de referência**: A página Início é usada como base de comparação, mas todas as páginas — incluindo ela — devem ser revisadas.

**Persona principal**: Leitor do blog navegando entre a lista de artigos, um post específico e a página Sobre.

**Fluxo principal**:
1. Leitor acessa a Página Inicial → vê o header fixo e conteúdo com margens definidas
2. Navega para Artigos → espera o mesmo alinhamento de conteúdo
3. Abre um post → espera que o conteúdo comece no mesmo ponto visual que as outras páginas
4. Acessa a página Sobre → espera o mesmo ritmo de espaçamento

**Requisitos de UX**:
- O alinhamento horizontal do conteúdo deve ser visivelmente o mesmo em todas as páginas
- A transição entre páginas não deve causar "salto" visual nas margens
- O layout responsivo (mobile e desktop) deve ser revisado em ambos os breakpoints

**Acessibilidade**:
- Nenhuma alteração deve reduzir o contraste de texto já existente
- Hierarquia de títulos (h1, h2, h3) deve ser mantida em todas as páginas

## Restrições Técnicas de Alto Nível

- Framework: Hugo com Tailwind CSS via CDN
- Nenhum sistema externo ou integração envolvido
- O modo claro é o único modo visual suportado; dark mode não deve ser introduzido
- Nenhum conteúdo textual, imagem ou dado de configuração deve ser alterado
- Apenas arquivos em `layouts/` e `static/` são elegíveis para modificação

## Fora de Escopo

- Alterações de conteúdo (textos, títulos, descrições, imagens)
- Introdução de dark mode ou novos temas
- Novos componentes ou funcionalidades não existentes
- Mudanças na paleta de cores definida no `tailwind.config` do `baseof.html`
- Otimizações de performance ou SEO
- Criação de novos partials (a menos que necessário para unificar implementações duplicadas)
