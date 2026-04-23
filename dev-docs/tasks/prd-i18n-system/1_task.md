# Tarefa 1.0: Configuração i18n Hugo

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Estabelecer a base de internacionalização no Hugo, criando os arquivos de configuração e tradução necessários. Esta tarefa configura os idiomas suportados (Português e Inglês) e cria os arquivos de strings de UI que serão usados nos templates.

<requirements>
- Estender `config.toml` com parâmetros de i18n (defaultLanguage, enableI18nWarn)
- Criar arquivo `i18n/pt.yaml` com todas as strings de UI em português
- Criar arquivo `i18n/en.yaml` com todas as strings de UI em inglês
- Garantir que Hugo carrega as traduções sem warnings
- Validar que as chaves de tradução correspondem entre os dois idiomas
</requirements>

## Subtarefas

- [ ] 1.1 Estender `config.toml` com estrutura de linguagens (PT raiz, EN prefixado)
- [ ] 1.2 Adicionar parâmetros i18n: `defaultLanguage`, `enableI18nWarn`, `defaultContentLanguageInSubdir`
- [ ] 1.3 Criar `i18n/pt.yaml` com strings de UI (nav, footer, labels, mensagens)
- [ ] 1.4 Criar `i18n/en.yaml` com strings de UI correspondentes
- [ ] 1.5 Validar que Hugo não exibe warnings de tradução faltante ao fazer build

## Detalhes de Implementação

Consulte as seções do `techspec.md`:
- **Arquitetura do Sistema** (linha 9-67): visão geral dos componentes i18n
- **Configuração de Dados** (linha 217-255): estrutura detalhada do `config.toml`
- **Ficheiros i18n** (linha 26-29): descrição dos arquivos de tradução

Chaves i18n esperadas no mínimo:
- Navegação: `nav_home`, `nav_posts`, `nav_about`
- Footer: `footer_tagline`, `footer_privacy`, `footer_terms`
- Posts: `posts_title`, `posts_description`, `posts_empty`
- Datas: `month_1` até `month_12` para nomes de meses, `date_format`

## Critérios de Sucesso

- ✓ `config.toml` está válido e Hugo carrega sem erros
- ✓ Ambos `i18n/pt.yaml` e `i18n/en.yaml` existem e estão bem-formados
- ✓ Chaves de tradução correspondem entre PT e EN (nenhuma faltando)
- ✓ `hugo build` não exibe warnings `[missing i18n]`
- ✓ Estrutura de linguagens respeita: PT na raiz (`/`), EN prefixado (`/en/`)

## Testes da Tarefa

- [ ] **Teste de unidade**: Validar que arquivo YAML está bem-formado (sintaxe válida)
- [ ] **Teste de integração**: Executar `hugo build` e capturar output para verificar:
  - Nenhum warning sobre tradução faltante
  - Build completa com sucesso
  - Ficheiros críticos gerados: `public/index.html`, `public/en/index.html`, `public/sitemap.xml`

**Comando de teste:**
```bash
# Validar YAML
npx js-yaml i18n/pt.yaml > /dev/null && echo "✅ pt.yaml válido"
npx js-yaml i18n/en.yaml > /dev/null && echo "✅ en.yaml válido"

# Validar build
hugo --printI18nWarnings 2>&1 | tee build.log
if ! grep -i "missing" build.log; then
  echo "✅ Sem warnings de tradução"
else
  echo "❌ Tradução faltante detectada"
  exit 1
fi
```

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `config.toml` - Configuração do Hugo (modificar)
- `i18n/pt.yaml` - Tradução português (criar)
- `i18n/en.yaml` - Tradução inglês (criar)
- `dev-docs/tasks/prd-i18n-system/techspec.md` - Referência técnica (ler)
