# Tarefa 2.0: Conteúdo Biográfico

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Substituir o conteúdo fictício da página "Sobre" pelo texto biográfico real do autor, nas versões PT e EN, e atualizar o campo `image` do frontmatter para apontar para o asset local.

<requirements>
- O frontmatter de ambos os arquivos deve ser preservado integralmente, alterando apenas o campo `image`
- O campo `image` deve ser atualizado para `/images/profile-picture.jpg` em ambos os arquivos
- O corpo de `_index.pt.md` deve ser substituído pelo texto biográfico em português conforme o PRD (RF-03)
- O corpo de `_index.en.md` deve ser substituído pelo texto biográfico em inglês conforme o PRD (RF-03)
- Nenhuma outra página deve ser modificada
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `image` no frontmatter de `content/about/_index.pt.md` para `/images/profile-picture.jpg`
- [ ] 2.2 Substituir o corpo de `content/about/_index.pt.md` pelo texto biográfico PT do PRD
- [ ] 2.3 Atualizar `image` no frontmatter de `content/about/_index.en.md` para `/images/profile-picture.jpg`
- [ ] 2.4 Substituir o corpo de `content/about/_index.en.md` pelo texto biográfico EN do PRD
- [ ] 2.5 Executar `hugo` e confirmar build sem erros

## Detalhes de Implementação

Consultar seção **"Modelos de Dados (Frontmatter)"** da `techspec.md` para a estrutura esperada do frontmatter. Os textos completos PT e EN estão na seção **RF-03** do `prd.md`.

## Critérios de Sucesso

- O frontmatter de ambos os arquivos mantém todos os campos originais, com `image` atualizado
- O texto biográfico PT está íntegro em `_index.pt.md`
- O texto biográfico EN está íntegro em `_index.en.md`
- `hugo` conclui sem erros

## Testes da Tarefa

- [ ] Build limpo: `hugo 2>&1 | grep -E "ERROR|WARN"` não retorna linhas
- [ ] E2E PT — hero e localização: `page.goto('/about/')` → `h1` contém `Hallison Oliveira`
- [ ] E2E PT — texto biográfico: página contém "desenvolvedor de software com mais de uma década"
- [ ] E2E EN — hero e localização: `page.goto('/en/about/')` → `h1` contém `Hallison Oliveira`
- [ ] E2E EN — texto biográfico: página contém "software developer with over a decade"

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `content/about/_index.pt.md` — conteúdo da página "Sobre" em português
- `content/about/_index.en.md` — conteúdo da página "Sobre" em inglês
- `prd.md` (RF-03) — textos biográficos completos PT e EN
- `techspec.md` — estrutura esperada do frontmatter
