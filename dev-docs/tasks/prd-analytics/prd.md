# PRD — Google Analytics (GA4)

## Visão Geral

O blog `hallison.github.io` é um site estático Hugo bilíngue (PT/EN) sem nenhum mecanismo atual de rastreamento de audiência. A ausência de dados impede decisões sobre quais conteúdos geram mais valor e de onde vêm os leitores.

Este PRD define os requisitos para integrar o Google Analytics 4 (GA4) ao blog, permitindo ao autor monitorar métricas de acesso por página e por idioma, entender o engajamento com artigos e tomar decisões baseadas em dados sobre produção de conteúdo.

---

## Objetivos

- Habilitar coleta de métricas de audiência em todas as páginas do blog
- Identificar quais artigos têm maior engajamento (pageviews, tempo na página, eventos de interação)
- Compreender a origem do tráfego (busca orgânica, direto, redes sociais, referências)
- Distinguir métricas por idioma (PT vs EN) para entender qual audiência é mais ativa
- Estar em conformidade com a LGPD ao coletar dados apenas com consentimento do usuário

**Indicadores de sucesso:**
- GA4 recebendo eventos de pageview em todas as páginas após deploy
- Dados segmentados por idioma visíveis no painel GA4
- Taxa de consentimento do banner mensurável no GA4
- Zero coleta de dados antes do consentimento do usuário

---

## Histórias de Usuário

**Autor do blog (usuário primário):**
- Como autor, eu quero ver quais artigos têm mais pageviews para focar esforços nos temas mais populares
- Como autor, eu quero saber de onde vêm meus leitores (Google, LinkedIn, direto) para direcionar divulgação
- Como autor, eu quero ver o tempo médio na página por artigo para entender se o conteúdo está sendo consumido
- Como autor, eu quero comparar o engajamento entre as versões PT e EN dos artigos para priorizar traduções
- Como autor, eu quero ver eventos de clique em links externos para entender quais referências são mais úteis

**Visitante do blog (usuário secundário):**
- Como visitante, eu quero ser informado sobre coleta de dados e ter a opção de recusar antes de qualquer rastreamento ocorrer
- Como visitante, eu quero que minha preferência de consentimento seja lembrada para não ser questionado em toda visita

---

## Funcionalidades Principais

### 1. Integração do Script GA4

O script de rastreamento do GA4 deve ser carregado condicionalmente — apenas após o consentimento do visitante — em todas as páginas do blog.

**Requisitos funcionais:**
- RF-01: O Measurement ID do GA4 deve ser configurável via `config.toml` sem alteração de templates
- RF-02: O script GA4 (`gtag.js`) não deve ser carregado antes do consentimento explícito do visitante
- RF-03: O script deve estar presente em todas as páginas geradas pelo Hugo (home, artigos, about, listagens)
- RF-04: O rastreamento deve funcionar corretamente em ambos os idiomas (PT e EN)

### 2. Rastreamento por Idioma

O GA4 deve permitir filtrar e comparar dados entre as versões PT e EN do blog.

**Requisitos funcionais:**
- RF-05: Cada pageview deve incluir um parâmetro de idioma (`pt` ou `en`) derivado do idioma atual do Hugo
- RF-06: O painel GA4 deve permitir segmentar relatórios por idioma sem configuração manual adicional

### 3. Rastreamento de Eventos

Além de pageviews automáticos, eventos específicos de engajamento devem ser capturados.

**Requisitos funcionais:**
- RF-07: Rastrear cliques em links externos (saída do blog) como evento `outbound_link`
- RF-08: Rastrear cliques nos links de redes sociais do rodapé como evento `social_click`
- RF-09: Rastrear tempo de leitura estimado por artigo (ex: evento `read_depth` ao atingir 25%, 50%, 75%, 100% do scroll)

### 4. Banner de Consentimento (LGPD)

Por se tratar de um blog brasileiro com audiência nacional, a coleta de dados via GA4 (que usa cookies) exige consentimento explícito conforme a LGPD (Lei nº 13.709/2018).

**Requisitos funcionais:**
- RF-10: Exibir banner de consentimento de cookies na primeira visita, antes de qualquer carregamento do GA4
- RF-11: O banner deve oferecer ação afirmativa ("Aceitar") e ação de recusa ("Recusar")
- RF-12: A preferência do visitante deve ser persistida via `localStorage` para não reaparecer a cada visita
- RF-13: O visitante que recusar não deve ter nenhum dado coletado pelo GA4 durante aquela sessão e sessões futuras
- RF-14: O visitante que aceitar deve poder revogar o consentimento (ex: link no rodapé "Gerenciar cookies")
- RF-15: O banner deve ser exibido nos dois idiomas do blog (PT e EN)

### 5. Documentação de Onboarding

Para facilitar a configuração inicial e manutenção futura, deve existir um guia em Markdown.

**Requisitos funcionais:**
- RF-16: O guia deve cobrir o passo a passo de criação da propriedade GA4 e obtenção do Measurement ID
- RF-17: O guia deve explicar onde e como configurar o Measurement ID no projeto Hugo
- RF-18: O guia deve descrever como verificar se os dados estão chegando corretamente no GA4

---

## Experiência do Usuário

**Visitante:**
- O banner de consentimento deve aparecer de forma não intrusiva (preferencialmente na parte inferior da tela) sem bloquear o conteúdo
- O banner deve ser visualmente consistente com o design atual do blog
- A linguagem do banner deve ser clara e objetiva — sem jargão jurídico excessivo
- O banner não deve reaparecer após a escolha do visitante

**Autor (consumidor dos dados):**
- Os dados devem estar disponíveis no painel padrão do GA4 sem necessidade de configurações avançadas adicionais
- A segmentação por idioma deve funcionar via dimensão customizada ou parâmetro de evento, visível nos relatórios GA4

---

## Restrições Técnicas de Alto Nível

- O blog é um site **estático gerado pelo Hugo** — não há backend, banco de dados ou server-side rendering
- Todo JavaScript deve ser vanilla (sem frameworks), conforme padrões do projeto
- O Measurement ID do GA4 não deve ser hardcoded nos templates — deve vir da configuração do Hugo
- A solução deve funcionar sem Google Tag Manager (GTM), adicionando o script diretamente no `<head>` do layout
- Conformidade obrigatória com a **LGPD** (Lei nº 13.709/2018): nenhum dado pode ser coletado sem consentimento prévio e explícito
- O script GA4 não deve impactar negativamente o Core Web Vitals (LCP, CLS, FID) — carregamento assíncrono é mandatório

---

## Fora de Escopo

- Google Tag Manager (GTM) — a integração será feita diretamente no Hugo
- Funis de conversão avançados ou metas de e-commerce
- Relatórios customizados além dos padrões do GA4
- Integração com outras ferramentas de analytics (ex: Plausible, Fathom, Matomo)
- Rastreamento de formulários (o blog não possui formulários ativos atualmente)
- Exportação automática de dados do GA4 para planilhas ou dashboards externos
- Política de Privacidade completa (documento legal) — apenas o banner de consentimento está no escopo
