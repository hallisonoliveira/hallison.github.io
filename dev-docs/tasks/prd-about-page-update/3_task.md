# Tarefa 3.0: Layout e Contatos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Ajustar o template `layouts/about/list.html` para reduzir o tamanho visual da imagem de perfil e adicionar a seção de links de contato (LinkedIn e GitHub) com ícones Material Symbols Outlined.

<requirements>
- A coluna da imagem deve usar `md:col-span-3` (reduzido de `md:col-span-5`)
- A coluna do texto/hero deve usar `md:col-span-9` (ajustado de `md:col-span-7`) para manter a soma em 12
- A seção de contatos deve ser adicionada inline em `list.html`, após `{{ .Content }}`
- A seção deve iterar sobre `socialLinks` excluindo o link "Newsletter"
- Os links devem abrir em nova aba (`target="_blank"`) com `rel="noopener noreferrer"`
- Os ícones devem usar a classe `material-symbols-outlined`
- O arquivo `list.html` deve permanecer abaixo de 100 linhas
- Nenhum novo partial deve ser criado
</requirements>

## Subtarefas

- [ ] 3.1 Alterar `md:col-span-5` → `md:col-span-3` na div da imagem em `list.html`
- [ ] 3.2 Alterar `md:col-span-7` → `md:col-span-9` na div do conteúdo hero em `list.html`
- [ ] 3.3 Adicionar bloco de contatos inline após `{{ .Content }}` conforme spec técnica
- [ ] 3.4 Validar visualmente no browser (elemento decorativo `.absolute -bottom-6 -left-6` não desbalanceado)
- [ ] 3.5 Executar `hugo` e confirmar build sem erros

## Detalhes de Implementação

Consultar seções **"RF-04 — Redução da imagem"** e **"RF-05 — Seção de contatos inline"** da `techspec.md` para o HTML/template exato de cada mudança. Consultar também **"Riscos Conhecidos"** sobre o elemento decorativo absolutamente posicionado.

## Critérios de Sucesso

- A imagem de perfil ocupa visualmente cerca de metade do espaço anterior
- Links de LinkedIn e GitHub aparecem abaixo do texto biográfico com ícones
- Os links abrem em nova aba
- O elemento decorativo `.absolute -bottom-6 -left-6` não fica visivelmente desbalanceado
- `hugo` conclui sem erros
- `list.html` tem menos de 100 linhas

## Testes da Tarefa

- [ ] Build limpo: `hugo 2>&1 | grep -E "ERROR|WARN"` não retorna linhas
- [ ] E2E — link LinkedIn visível: `page.locator('a[href*="linkedin.com"]')` está visível em `/about/`
- [ ] E2E — link GitHub visível: `page.locator('a[href*="github.com"]')` está visível em `/about/`
- [ ] E2E — links abrem em nova aba: atributo `target="_blank"` presente nos links
- [ ] E2E — versão EN: links também visíveis em `/en/about/`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `layouts/about/list.html` — template da página "Sobre" (único arquivo modificado)
- `config.toml` — `socialLinks` lido pelo template via `.Site.Params.socialLinks`
- `techspec.md` — HTML/template exato para RF-04 e RF-05
