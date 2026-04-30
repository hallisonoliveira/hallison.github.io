# Guia de Onboarding — Google Analytics 4 (GA4)

Este guia explica como criar uma propriedade GA4, obter o Measurement ID, configurar no projeto e verificar se os dados estão chegando corretamente.

---

## Pré-requisitos

- Conta Google ativa (Gmail ou Google Workspace)
- Acesso ao repositório do blog (permissão para editar `config.toml`)
- Blog publicado ou rodando localmente para testes

---

## Passo a passo: Criar propriedade GA4 e obter o Measurement ID

### 1. Acessar o Google Analytics

1. Acesse [analytics.google.com](https://analytics.google.com)
2. Faça login com a sua conta Google
3. Clique em **"Começar a medir"** (ou **"Criar conta"** se for a primeira vez)

### 2. Criar uma conta GA4

1. Preencha o **Nome da conta** (ex: `Hallison Blog`)
2. Nas configurações de compartilhamento de dados, mantenha os padrões e clique em **"Próxima"**

### 3. Criar a propriedade

1. Preencha o **Nome da propriedade** (ex: `hallison.github.io`)
2. Selecione o **fuso horário**: `Brasil — Horário de Brasília (UTC-3)`
3. Selecione a **moeda**: `Real brasileiro (BRL)`
4. Clique em **"Próxima"**

### 4. Configurar detalhes do negócio

1. Selecione a categoria: `Artes e entretenimento` ou `Outro`
2. Selecione o tamanho: `Pequeno`
3. Clique em **"Próxima"**

### 5. Definir os objetivos

1. Selecione **"Examinar o comportamento do usuário"** e clique em **"Criar"**
2. Aceite os Termos de Serviço do Google Analytics

### 6. Criar um fluxo de dados Web

1. Na tela seguinte, selecione **"Web"** como plataforma
2. Preencha a **URL do site**: `https://hallison.github.io`
3. Preencha o **Nome do fluxo**: `Blog - Web`
4. Clique em **"Criar fluxo"**

### 7. Obter o Measurement ID

Após criar o fluxo, você verá a tela de detalhes com o **ID de medição** no formato `G-XXXXXXXXXX`.

Copie esse valor — ele será usado na próxima etapa.

---

## Passo a passo: Configurar o Measurement ID no projeto

O Measurement ID é configurado no arquivo `config.toml`, na raiz do repositório.

### 1. Abra o arquivo `config.toml`

Localize a seção `[params]`:

```toml
[params]
  ga4MeasurementId = "G-XXXXXXXXXX"   # ← substitua aqui
```

### 2. Substitua o placeholder pelo ID real

```toml
ga4MeasurementId = "G-ABC123XYZ"   # seu ID real aqui
```

> **Importante:** Não adicione espaços extras ou aspas duplas aninhadas. O valor deve ser exatamente o ID copiado do painel GA4.

### 3. Salve o arquivo e faça o deploy

O script `layouts/partials/ga4-script.html` lê esse valor automaticamente. Não é necessário alterar nenhum template.

Após o commit e deploy, o script GA4 estará ativo para visitantes que aceitaram os cookies.

---

## Como verificar se o rastreamento está funcionando

### Usando o GA4 DebugView (tempo real)

O DebugView permite ver eventos chegando em tempo real enquanto você navega no site.

**Ativar o modo debug no navegador:**

1. Instale a extensão **Google Tag Assistant Companion** na Chrome Web Store (busque por "Google Tag Assistant Companion")
2. Ative a extensão clicando no ícone dela
3. Acesse o blog localmente (`http://localhost:1313`) ou no endereço publicado
4. Aceite os cookies quando o banner aparecer

**Verificar no painel GA4:**

1. No painel GA4, acesse **Configurar → DebugView** no menu lateral esquerdo
2. Você verá os eventos chegando em tempo real à medida que navega no site
3. Eventos esperados:
   - `page_view` — a cada página visitada
   - `session_start` — ao iniciar uma nova sessão
   - `first_visit` — na primeira visita

### Usando o Relatório de Eventos

Para verificar eventos históricos (após 24–48h de coleta):

1. No painel GA4, acesse **Relatórios → Engajamento → Eventos**
2. Você verá a lista de eventos coletados, incluindo os customizados:
   - `outbound_link` — cliques em links externos ao blog
   - `social_click` — cliques nos links de redes sociais do rodapé
   - `read_depth` — profundidade de leitura (25%, 50%, 75%, 100% do scroll)

---

## Como filtrar dados por idioma (PT vs EN)

O blog envia o idioma da página (`pt` ou `en`) automaticamente com cada evento, usando o atributo `lang` do HTML (ex: `<html lang="pt">`).

### Ver dados por idioma no GA4

O script envia o parâmetro `language` com o valor `pt` ou `en` (o idioma real da página, conforme definido pelo Hugo em `<html lang="...">`). Para segmentar por idioma da página:

1. Acesse **Explorar → Análise em branco**
2. Na aba **Variáveis**, clique em **Dimensões** → busque por `Idioma`
3. Selecione a dimensão **Idioma** e adicione-a nas linhas
4. Adicione a métrica **Visualizações** nos valores
5. Os dados serão separados por `pt` e `en`

> **Nota:** A dimensão "Idioma" nos relatórios demográficos padrão reflete o idioma do **navegador** do visitante (ex: `pt-BR`), não o idioma da página acessada. Use a análise exploratória acima para segmentação precisa por idioma do conteúdo.

---

## Troubleshooting comum

### O banner de cookies não aparece

- **Causa provável:** O consentimento já foi salvo anteriormente no navegador
- **Solução:** Abra as ferramentas do desenvolvedor (F12) → aba **Application** → **Local Storage** → remova a entrada `cookie-consent` e recarregue a página

### Nenhum dado aparece no GA4

- **Causa 1 — Ad-blocker ativo:** Extensões como uBlock Origin bloqueiam `googletagmanager.com`
  - Solução: Teste em um perfil de navegador sem extensões ou em modo anônimo sem extensões
- **Causa 2 — Consentimento não dado:** O script GA4 só carrega após o usuário aceitar os cookies
  - Solução: Certifique-se de que clicou em "Aceitar" no banner
- **Causa 3 — ID errado no `config.toml`:** O placeholder `G-XXXXXXXXXX` ainda está presente
  - Solução: Confirme que `ga4MeasurementId` em `config.toml` contém o ID real

### O DebugView não mostra eventos

- **Causa:** A extensão de debug não está ativa ou o modo debug não foi iniciado corretamente
- **Solução:** Desative e reative a extensão Google Tag Assistant Companion e recarregue a página após aceitar os cookies

### O evento `read_depth` não aparece

- **Causa:** O script `analytics.js` só registra eventos em páginas de artigo com conteúdo suficiente para rolar
- **Solução:** Acesse um artigo longo e role a página até o final; verifique o DebugView

### Os eventos `outbound_link`, `social_click` ou `read_depth` não aparecem

- **Causa:** O arquivo `static/js/analytics.js` só registra eventos quando o consentimento foi aceito (`cookie-consent = "accepted"` no localStorage) e quando `window.gtag` está disponível
- **Solução:** Confirme que aceitou os cookies e recarregue a página. Verifique também no DebugView se o evento `page_view` base está chegando — se não estiver, o problema é anterior ao `analytics.js`

### O link "Gerenciar cookies" não redefine o consentimento

- **Causa:** O botão no rodapé remove a chave `cookie-consent` do `localStorage` e recarrega a página
- **Solução:** Após clicar em "Gerenciar cookies", o banner deve reaparecer. Se não aparecer, verifique se o botão `#cookie-manage` está presente no HTML gerado

---

## Arquivos de referência do projeto

| Arquivo | Função |
|---|---|
| `config.toml` | Configuração do `ga4MeasurementId` |
| `layouts/partials/ga4-script.html` | Carrega o script GA4 condicionalmente |
| `layouts/partials/cookie-consent.html` | Banner LGPD e lógica de consentimento |
| `static/js/analytics.js` | Eventos customizados (outbound, social, scroll) |
| `i18n/pt.yaml` e `i18n/en.yaml` | Textos do banner em PT e EN |
