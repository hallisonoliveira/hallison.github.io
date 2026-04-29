# Tarefa 1.0: Assets e Configuração

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Preparar o asset de imagem de perfil e atualizar os parâmetros globais no `config.toml` com os dados reais do autor (nome hero, localização e URLs dos social links).

<requirements>
- O arquivo `static/images/profile-picture.jpg` deve existir (copiado de `dev-docs/prompts/profile-picture.jpg`)
- O parâmetro `aboutHero` em PT deve ser `Hallison Oliveira`
- O parâmetro `aboutHero` em EN deve ser `Hallison Oliveira`
- O parâmetro `aboutLocation` em PT deve ser `Est. 2022 — Curitiba, Brasil`
- O parâmetro `aboutLocation` em EN deve ser `Est. 2022 — Curitiba, Brazil`
- O `socialLinks` do GitHub deve ter URL `https://github.com/hallisonoliveira`
- O `socialLinks` do LinkedIn deve ter URL `https://www.linkedin.com/in/hallisonoliveira/`
</requirements>

## Subtarefas

- [x] 1.1 Copiar `dev-docs/prompts/profile-picture.jpg` → `static/images/profile-picture.jpg`
- [x] 1.2 Atualizar `[params.pt]` no `config.toml`: campos `aboutHero` e `aboutLocation`
- [x] 1.3 Atualizar `[params.en]` no `config.toml`: campos `aboutHero` e `aboutLocation`
- [x] 1.4 Atualizar as URLs de GitHub e LinkedIn em `[[params.socialLinks]]` no `config.toml`
- [x] 1.5 Executar `hugo` e confirmar build sem erros

## Detalhes de Implementação

Consultar seções **"Configuração de Dados (config.toml)"** e **"Pontos de Integração"** da `techspec.md` para os valores exatos de cada campo e o caminho de destino da imagem.

## Critérios de Sucesso

- `static/images/profile-picture.jpg` existe no repositório
- `hugo` conclui sem erros ou warnings relacionados a esses parâmetros
- Os valores de `aboutHero`, `aboutLocation` e URLs dos social links estão corretos no `config.toml`

## Testes da Tarefa

- [x] Verificar existência do arquivo: `test -f static/images/profile-picture.jpg`
- [x] Build limpo: `hugo 2>&1 | grep -E "ERROR"` não retorna linhas (WARNs pré-existentes sobre taxonomy/JSON home não relacionados a esta tarefa)
- [x] Confirmar imagem no output do build: `test -f public/images/profile-picture.jpg`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `dev-docs/prompts/profile-picture.jpg` — origem da imagem
- `static/images/profile-picture.jpg` — destino da imagem (a ser criado)
- `config.toml` — parâmetros `aboutHero`, `aboutLocation`, `socialLinks`
