# Página 404 Customizada

## Visão Geral

O blog suporta posts em múltiplos idiomas (português e inglês). Quando um usuário navega para uma URL inexistente — incluindo o caso em que muda de idioma em um post que não possui tradução — o Hugo exibe a página de erro padrão do navegador ou do servidor, sem identidade visual do blog. Esta funcionalidade cria uma página 404 customizada, integrada ao design system existente e internacionalizada, oferecendo ao usuário uma saída clara para continuar navegando.

## Objetivos

- Substituir a página de erro padrão por uma experiência alinhada ao design do blog em 100% dos casos de 404.
- Reduzir o abandono do site em situações de erro, fornecendo ações claras de retorno à navegação.
- Suportar os dois idiomas configurados (pt e en) sem necessidade de manutenção paralela de templates.

## Histórias de Usuário

- Como **leitor**, quando acesso uma URL inexistente, quero ver uma mensagem amigável que me indique que a página não existe, para que eu entenda o que aconteceu sem me sentir perdido.
- Como **leitor**, ao cair em uma página 404, quero ter acesso rápido à home e à listagem de posts, para que eu possa continuar navegando no blog sem precisar usar o botão voltar do navegador.
- Como **leitor em inglês**, quando acesso uma URL inválida na versão em inglês do blog, quero ver a mensagem de erro em inglês, para que a experiência seja coerente com o idioma que escolhi.
- Como **leitor em português**, ao acessar uma URL inválida na versão em português, quero ver a mensagem de erro em português, para que a comunicação seja natural para mim.

## Funcionalidades Principais

### F1 — Template de Página 404

Criação de um layout Hugo dedicado para erros 404, que estenda o `baseof.html` existente.

- Exibe header e footer padrão do blog, mantendo a consistência de navegação.
- Exibe uma mensagem amigável indicando que a página não foi encontrada, sem mostrar o código numérico "404".
- Apresenta dois botões de ação: retornar à home e ver todos os posts.

**Requisitos funcionais:**

1. O template deve estender `baseof.html` para herdar header, footer e estilos globais.
2. A página deve exibir um título indicando que a página não foi encontrada.
3. A página deve exibir uma mensagem explicativa breve e amigável.
4. A página deve conter um botão "Voltar à home" / "Back to home" que redireciona para `/` (ou `/en/` conforme o idioma).
5. A página deve conter um botão "Ver todos os posts" / "See all posts" que redireciona para a listagem de posts do idioma ativo.
6. Nenhum código numérico de erro (ex: "404") deve ser exibido ao usuário.

### F2 — Internacionalização da Página 404

Todos os textos da página 404 devem ser gerenciados via o sistema i18n já existente do blog (arquivos `i18n/pt.yaml` e `i18n/en.yaml`).

**Requisitos funcionais:**

7. As chaves de tradução para título, mensagem e labels dos botões devem ser adicionadas em `i18n/pt.yaml` e `i18n/en.yaml`.
8. O template deve utilizar `i18n` do Hugo para renderizar os textos conforme o idioma ativo da requisição.
9. As traduções devem estar presentes nos dois idiomas suportados antes do lançamento.

### F3 — Ativação pelo Hugo

O Hugo deve servir o template customizado automaticamente em qualquer resposta 404, sem configuração adicional no servidor.

**Requisitos funcionais:**

10. O arquivo de template deve ser posicionado em local reconhecido pelo Hugo para páginas de erro 404 (convenção nativa do framework).
11. O comportamento deve funcionar tanto em modo de desenvolvimento (`hugo server`) quanto no site gerado estaticamente.

## Experiência do Usuário

**Persona principal:** Leitor que chegou ao blog via link externo ou mudou de idioma em um post sem tradução.

**Fluxo principal:**
1. Usuário acessa uma URL inexistente.
2. O Hugo serve a página 404 customizada no idioma ativo.
3. O usuário lê a mensagem amigável, entende que a página não existe.
4. O usuário clica em um dos dois botões de ação e retorna à navegação normal.

**Considerações de UI/UX:**
- A página deve manter a mesma hierarquia visual das demais páginas (header fixo, área de conteúdo centralizada, footer).
- Os dois botões de ação devem ser visualmente distintos: um primário (home) e um secundário (posts), seguindo os padrões de botão já definidos no design system Tailwind do blog.
- A mensagem deve ser concisa, sem jargão técnico.

**Acessibilidade:**
- O título da página deve estar em uma tag semântica adequada (`h1`).
- Os botões de ação devem ser elementos `<a>` com href válido, não botões sem destino.
- O `<title>` da página deve refletir o idioma ativo.

## Restrições Técnicas de Alto Nível

- A solução deve usar exclusivamente recursos nativos do Hugo (sem plugins, sem JavaScript adicional).
- Textos devem ser gerenciados via i18n do Hugo, seguindo o padrão já adotado no projeto (`i18n/pt.yaml`, `i18n/en.yaml`).
- O template deve seguir os padrões de nomenclatura e estrutura definidos em `.claude/rules/code-standards.md`.
- Nenhuma dependência externa nova deve ser adicionada.

## Fora de Escopo

- Redirecionamento automático para a versão traduzida de um post quando ela existir.
- Listagem de posts recentes ou sugestões de conteúdo na página 404.
- Exibição de contexto específico sobre por que o 404 ocorreu (ex: "este post não está disponível neste idioma").
- Qualquer forma de rastreamento ou analytics específico para erros 404.
- Customização visual além do design system já estabelecido.
