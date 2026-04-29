# PRD — Atualização da Página "Sobre"

## Visão Geral

A página "Sobre" do blog apresenta informações desatualizadas e fictícias que não refletem a identidade real do autor. O objetivo é substituir esses dados por informações corretas e reais: nome, cidade, ano de fundação, texto de apresentação biográfico e meios de contato. A atualização deve respeitar a estrutura i18n existente do projeto (PT e EN) e enriquecer a experiência visual com ícones de contato já disponíveis no projeto.

## Objetivos

- Corrigir todas as informações incorretas visíveis na página "Sobre" (nome, localização, ano, texto)
- Garantir que as versões em português e inglês estejam consistentes com o i18n do projeto
- Adicionar meios de contato (LinkedIn e GitHub) com ícones Material Symbols Outlined
- Reduzir o tamanho visual da foto de perfil para melhorar o equilíbrio da página

## Histórias de Usuário

- Como visitante do blog, quero ver o nome real do autor no hero para saber com quem estou interagindo
- Como visitante, quero ler uma apresentação autêntica do autor para entender seu perfil e o propósito do blog
- Como visitante, quero acessar os perfis profissionais do autor (LinkedIn, GitHub) diretamente da página "Sobre"
- Como visitante que navega em inglês, quero ler o conteúdo da página "Sobre" traduzido para inglês

## Funcionalidades Principais

### RF-01 — Substituição do título hero

**O que faz:** Exibe o nome "Hallison Oliveira" no lugar de "O Arquiteto de Sistemas Digitais"

**Por que é importante:** O texto atual é fictício e não representa o autor real

**Arquivos afetados:** `config.toml` — parâmetros `aboutHero` em PT e EN

**Requisitos funcionais:**
1. O parâmetro `aboutHero` PT deve ser atualizado para `Hallison Oliveira`
2. O parâmetro `aboutHero` EN deve ser atualizado para `Hallison Oliveira`

---

### RF-02 — Atualização de localização e ano

**O que faz:** Exibe "Est. 2022 — Curitiba, Brasil" no lugar de "Est. 2014 — Baseado em Berlin"

**Por que é importante:** O ano e a cidade estão incorretos em relação à realidade do autor

**Arquivos afetados:** `config.toml` — parâmetro `aboutLocation` em PT e EN

**Requisitos funcionais:**
3. O parâmetro `aboutLocation` PT deve ser `Est. 2022 — Curitiba, Brasil`
4. O parâmetro `aboutLocation` EN deve ser `Est. 2022 — Curitiba, Brazil`

---

### RF-03 — Substituição do texto da seção "Filosofia"

**O que faz:** Substitui o conteúdo atual da seção pelo texto biográfico real do autor

**Por que é importante:** O texto atual é genérico e fictício; o novo texto apresenta a trajetória real do autor

**Arquivos afetados:**
- `content/about/_index.pt.md` — conteúdo em português
- `content/about/_index.en.md` — conteúdo em inglês

**Texto PT (substituir conteúdo do arquivo):**

> Olá! Sou o Hallison, desenvolvedor de software com mais de uma década de jornada técnica. Minha base foi moldada no desenvolvimento de sistemas embarcados utilizando Java, C e C++, onde aprendi a valorizar soluções de baixo nível e alta performance.
>
> Desde 2019, direcionei meu foco para o ecossistema Android, construindo soluções robustas para o setor financeiro. Tive a oportunidade de atuar em grandes instituições de pagamento e bancos digitais, passando por produtos que vão de contas digitais e cartões a investimentos e Pix. Recentemente, expandi minha atuação para plataforma e observabilidade, o que me levou a uma nova fase: explorar o mundo de infraestrutura e backend em Go.
>
> Atualmente, dedico meus estudos e trabalho ao desenvolvimento backend, Kubernetes, containers e OpenTelemetry, buscando entender a fundo como métricas, logs e traces podem elevar a confiabilidade de sistemas complexos.
>
> Além do Código — Minha conexão com o áudio vem desde a infância. Sou fascinado pela física por trás do som — de ondas estacionárias a reflexões acústicas — e um entusiasta de discos de vinil. Essa mistura de paixão analógica com expertise digital deu vida ao Primmo Audio Lab (https://primmoaudio.com/), uma ferramenta que utiliza redes neurais e processamento de sinais (DSP) para restaurar gravações de vinil e fitas K7.
>
> Este blog é o meu "laboratório" de ideias, onde compartilho aprendizados sobre engenharia de software, observabilidade, áudio e tudo o que envolve tecnologia.

**Texto EN (tradução do texto PT):**

> Hi! I'm Hallison, a software developer with over a decade of technical experience. My foundation was shaped in embedded systems development using Java, C and C++, where I learned to value low-level, high-performance solutions.
>
> Since 2019, I've focused on the Android ecosystem, building robust solutions for the financial sector. I had the opportunity to work at major payment institutions and digital banks, across products ranging from digital accounts and cards to investments and Pix. Recently, I expanded into platform and observability, which led me to a new chapter: exploring the world of infrastructure and backend in Go.
>
> Currently, I dedicate my studies and work to backend development, Kubernetes, containers and OpenTelemetry, seeking a deep understanding of how metrics, logs and traces can elevate the reliability of complex systems.
>
> Beyond Code — My connection with audio goes back to childhood. I'm fascinated by the physics behind sound — from standing waves to acoustic reflections — and I'm a vinyl record enthusiast. This blend of analog passion and digital expertise gave rise to Primmo Audio Lab (https://primmoaudio.com/), a tool that uses neural networks and digital signal processing (DSP) to restore vinyl and cassette recordings.
>
> This blog is my "idea laboratory", where I share learnings about software engineering, observability, audio and everything that involves technology.

**Requisitos funcionais:**
5. O arquivo `_index.pt.md` deve ter seu conteúdo substituído pelo texto PT acima (frontmatter preservado)
6. O arquivo `_index.en.md` deve ter seu conteúdo substituído pelo texto EN acima (frontmatter preservado)

---

### RF-04 — Redução da foto de perfil

**O que faz:** Reduz o tamanho visual da imagem de perfil pela metade

**Por que é importante:** Na implementação atual, a imagem ocupa espaço excessivo e desequilibra o layout

**Arquivos afetados:** `layouts/about/list.html`

**Contexto atual:** A imagem ocupa `md:col-span-5` (5/12 colunas) com `aspect-[4/5]` e `w-full h-full object-cover`

**Requisitos funcionais:**
7. O tamanho visual da imagem de perfil deve ser reduzido pela metade em relação à implementação atual, ajustando as classes CSS relevantes sem alterar outros elementos do layout

---

### RF-05 — Adição de meios de contato com ícones

**O que faz:** Exibe links de LinkedIn e GitHub com ícones na página "Sobre"

**Por que é importante:** O visitante precisa de formas de contato direto com o autor; o layout fica mais rico visualmente com os ícones já disponíveis no projeto

**Arquivos afetados:**
- `config.toml` — atualizar `socialLinks` com URLs corretas
- `layouts/about/list.html` — adicionar seção de contatos renderizando os links com ícones Material Symbols Outlined

**URLs corretas:**
- LinkedIn: `https://www.linkedin.com/in/hallisonoliveira/`
- GitHub: `https://github.com/hallisonoliveira`

**Ícones disponíveis no projeto (Material Symbols Outlined):**
- LinkedIn: ícone `share` (já definido no `socialLinks`)
- GitHub: ícone `terminal` (já definido no `socialLinks`)

**Requisitos funcionais:**
8. O `socialLinks` em `config.toml` deve ter as URLs de LinkedIn e GitHub corrigidas para os valores reais do autor
9. A página "Sobre" deve exibir os links de LinkedIn e GitHub com seus respectivos ícones Material Symbols Outlined
10. Os links devem abrir em nova aba (`target="_blank"`)
11. Os ícones devem seguir o mesmo padrão visual já utilizado no projeto

## Experiência do Usuário

- O visitante acessa a página "Sobre" e imediatamente vê o nome real "Hallison Oliveira" no destaque
- Ao rolar a página, encontra a seção com o texto de apresentação autêntico do autor
- Abaixo do texto, visualiza os links de contato (LinkedIn e GitHub) com ícones reconhecíveis
- A foto de perfil está em proporção equilibrada com o restante do conteúdo
- Ao alternar para inglês, todo o conteúdo da página aparece devidamente traduzido

## Restrições Técnicas de Alto Nível

- O projeto usa Hugo com i18n via `config.toml` (params por idioma) e arquivos `.pt.md`/`.en.md`
- Os ícones devem usar exclusivamente Material Symbols Outlined (já carregado via Google Fonts no `baseof.html`)
- Nenhuma nova dependência externa deve ser adicionada
- Apenas os elementos listados neste PRD devem ser modificados

## Fora de Escopo

- Alteração de layout geral da página (hero, grid, cores, tipografia)
- Modificação de qualquer outra página além de "Sobre"
- Alteração da lógica de i18n, navegação ou seletor de idioma
- Criação de nova seção de contato fora do contexto da página "Sobre"
- Adição do link "Newsletter" ou qualquer outro link de contato além de LinkedIn e GitHub
- Tamanho físico/peso do arquivo de imagem de perfil

claude --resume 2adacbcb-02e6-415f-bfd8-3ef91631740e