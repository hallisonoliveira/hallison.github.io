# PRD: Sistema de Internacionalização (i18n) Robusto

## Visão Geral

O site atualmente possui uma solução de internacionalização que não funciona de forma confiável, resultando em inconsistências críticas em múltiplas telas: página Sobre, posts, header, footer e navegação. Esta funcionalidade reescreve a solução de i18n do zero, implementando uma arquitetura robusta e adequada para Hugo (estático) hospedado na Vercel, sem dependências de backend ou infraestrutura própria. A nova solução deve garantir que o idioma selecionado persista em toda a navegação do site e que o usuário permaneça no contexto correto ao alternar idiomas.

## Objetivos

- **Funcionalidade Completa**: Garantir suporte completo a internacionalização em 100% das páginas do site
- **Confiabilidade**: Eliminar inconsistências atuais em Sobre, Posts, Header, Footer e Navegação
- **Experiência Preservada**: Quando o usuário muda de idioma, ele permanece na mesma página/seção traduzida
- **Padrão Linguístico**: Suporte total a português brasileiro (PT-BR) como idioma padrão e inglês (EN) como idioma secundário
- **Localização de Data**: Datas devem ser exibidas no formato apropriado para o idioma selecionado
- **Pronto para Publicação**: Site deve estar completamente funcional em ambos os idiomas antes de publicação

## Histórias de Usuário

### Persona: Visitante PT-BR
- Como visitante português, quero que o site apareça em português por padrão para que eu compreenda o conteúdo sem esforço
- Como visitante, quero trocar para inglês quando desejar e que o site inteiro (header, footer, navegação, conteúdo) mude para inglês

### Persona: Visitante EN
- Como visitante inglês, quero ter opção de ver o site em português mesmo que meu navegador esteja configurado para inglês
- Como visitante, quando estou na página "Sobre" (About) em inglês e troco para português, quero permanecer na página "Sobre" em português (não na home)

### Fluxos Críticos
- **Caso 1**: Visitante navega para `/articles/post-name.pt.md`, troca para EN, deve ver `/articles/post-name.en.md`
- **Caso 2**: Post existe apenas em PT (`post-name.pt.md`), não deve aparecer quando idioma é EN
- **Caso 3**: Visitante em `/pt/about/`, troca para EN, deve ir para `/en/about/` (ou equivalente)
- **Caso 4**: Seletor de idioma no header muda idioma em qualquer página e a navegação é preservada

## Funcionalidades Principais

### 1. Seletor de Idioma Funcional
**O que faz**: Permite ao usuário alternar entre PT-BR e EN de forma clara e intuitiva
- Localizado no header (visível em todas as páginas)
- Exibe o idioma atual de forma clara (ex: "PT" ou "EN")
- Clique alterna para o outro idioma preservando a página atual

**Requisitos Funcionais**:
1. O seletor deve estar presente em todas as páginas
2. O seletor deve indicar visualmente qual idioma está ativo
3. Ao clicar no seletor, o idioma deve alternar
4. A navegação do usuário deve ser preservada (ex: da página X em PT para página X em EN)

### 2. Persistência de Idioma
**O que faz**: O idioma selecionado persiste durante toda a sessão do usuário e entre visitas futuras
- Quando usuário seleciona EN, todos os links navegados mantêm EN como padrão
- Quando o usuário volta ao site depois, o idioma anteriormente selecionado é respeitado (se possível)

**Requisitos Funcionais**:
5. O idioma selecionado deve ser armazenado de forma persistente (localStorage ou cookie)
6. Ao carregar o site, o idioma deve ser recuperado da persistência
7. Se nenhum idioma foi selecionado antes, padrão é PT-BR
8. A persistência deve funcionar em navegações de página (hard refresh, nova aba)

### 3. Conteúdo Traduzido (Posts)
**O que faz**: Posts são servidos na versão de idioma apropriada, ocultando versões não disponíveis

**Requisitos Funcionais**:
9. Posts em PT devem ser nomeados `post-name.pt.md`
10. Posts em EN devem ser nomeados `post-name.en.md`
11. Se um post existe apenas em PT, não deve aparecer na listagem de posts quando idioma é EN
12. URLs devem refletir o idioma (ex: `/pt/articles/post-name/` ou `/articles/post-name/` com indicação de idioma)
13. Links internos para posts devem apontar para a versão correta do idioma

### 4. Header Multilíngue
**O que faz**: Header da página segue o idioma selecionado em todas as suas partes

**Requisitos Funcionais**:
14. Logo/nome do site deve estar presente em ambos idiomas (se houver texto)
15. Menu de navegação deve ser traduzido (ex: "Artigos" em PT, "Articles" em EN)
16. Links no menu devem apontar para as versões corretas de cada página no idioma selecionado
17. Seletor de idioma deve estar no header e funcionar em qualquer página

### 5. Footer Multilíngue
**O que faz**: Footer segue o idioma selecionado, incluindo textos e links

**Requisitos Funcionais**:
18. Textos do footer devem ser traduzidos (ex: "Sobre", "Contato", "Redes Sociais")
19. Links sociais devem estar presentes em ambos os idiomas
20. Ano/informações de copyright devem estar localizadas corretamente

### 6. Navegação Preservada ao Trocar Idioma
**O que faz**: Quando usuário muda idioma em qualquer página, permanece no equivalente daquela página no novo idioma

**Requisitos Funcionais**:
21. Sistema deve manter mapeamento entre URLs de PT e EN
22. Ao clicar no seletor de idioma, deve navegar para a URL equivalente no novo idioma
23. Se não houver equivalente no novo idioma (ex: post sem tradução), deve exibir mensagem clara ou redirecionar para home do idioma

### 7. Suporte Completo em Todas as Páginas
**O que faz**: Todo conteúdo estático (Sobre, Contato, Home, etc) tem versão em PT-BR e EN

**Requisitos Funcionais**:
24. Página "Sobre" (About) deve existir em ambos idiomas com conteúdo apropriado
25. Página "Home" deve ser totalmente multilíngue
26. Qualquer nova página criada deve ter suporte a i18n desde o início
27. Conteúdo no frontmatter deve estar disponível em ambos idiomas

### 8. Localização de Data
**O que faz**: Datas em artigos e posts são exibidas no formato apropriado para o idioma (PT-BR: DD/MM/YYYY, EN: MM/DD/YYYY)

**Requisitos Funcionais**:
28. Função de formatação de data deve considerar o idioma ativo
29. Datas devem aparecer no formato padrão do país correspondente
30. Meses devem ser exibidos em nome (ex: "janeiro" em PT, "January" em EN)

## Experiência do Usuário

### Jornada Principal
1. Visitante acessa o site (primeira vez) → vê PT-BR por padrão
2. Visitante navega por artigos, páginas em PT-BR
3. Visitante clica no seletor de idioma no header
4. Seletor alterna para EN, página atual recarrega em EN (preservando o artigo/seção)
5. Visitante navega em EN, o seletor agora exibe EN como ativo
6. Ao clicar no seletor novamente, volta para PT-BR na página correspondente
7. Ao sair e voltar ao site, PT-BR é recuperado da persistência

### Fluxo de Posts
1. Visitante acessa `/articles/` em PT, vê lista de todos os posts que têm versão .pt.md
2. Clica em um post, vê conteúdo em PT
3. Troca para EN no header
4. Se post tem versão .en.md, vê o conteúdo em EN
5. Se post NÃO tem versão .en.md, vê mensagem indicando que não está disponível em EN ou é redirecionado para lista de posts EN

### Requisitos de Acessibilidade
- Seletor de idioma deve ser claramente identificável (alta contraste, tamanho adequado)
- Navegação de idioma deve ser possível via teclado
- Aria labels devem indicar qual idioma está ativo
- Mudança de idioma não deve causar desorientação do usuário

## Restrições Técnicas de Alto Nível

- **Hospedagem**: Vercel com site estático gerado por Hugo
- **Sem Backend**: Não há servidor backend para gerenciar idiomas; toda lógica deve ser client-side ou durante build de Hugo
- **Sem Microserviços**: Nenhuma chamada externa para serviços de tradução ou gerenciamento de i18n
- **Performance**: Solução não deve degradar performance do site (sem overhead excessivo de JavaScript)
- **SEO Friendly**: URLs e estrutura devem ser adequadas para SEO em ambos os idiomas
- **Compatibilidade Hugo**: Solução deve trabalhar com paradigmas Hugo (templates, front matter, diretórios de conteúdo)

## Fora de Escopo

- **Detecção Automática por Geolocalização**: Não incluir redirecionamento automático baseado em IP do visitante
- **Outros Idiomas**: Suporte exclusivo a PT-BR e EN neste PRD; futuros idiomas requerem novo PRD
- **Análise de Idiomas (Analytics)**: Rastreamento de qual idioma é mais usado não está incluído
- **Conversão de Moeda**: Apenas data será localizada; valores monetários não serão tratados neste PRD
- **Detecção de Navegador**: Não detectar idioma do SO/navegador automaticamente
- **Suporte a RTL**: Suporte a idiomas right-to-left está fora de escopo
