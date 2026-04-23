# Tarefa 4.0: Validação de Conteúdo

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar e implementar script de validação que verifica se todos os posts têm frontmatter válido e estrutura correta. Esta tarefa garante que o conteúdo está bem-formado antes de ser renderizado pelo Hugo, prevenindo erros em build time.

<requirements>
- Criar `scripts/validate-i18n.js` que valida frontmatter de posts
- Verificar presença de campos obrigatórios: `title`, `date`, `description`
- Validar formato YAML do frontmatter
- Detectar e reportar erros de forma clara
- Parar execução com exit code 1 se erros detectados
- Fornecer relatório claro de quais posts passaram/falharam
</requirements>

## Subtarefas

- [ ] 4.1 Criar `scripts/validate-i18n.js` com função de leitura de arquivos
- [ ] 4.2 Implementar parser de frontmatter (extrair YAML entre `---`)
- [ ] 4.3 Implementar validação de campos obrigatórios (title, date, description)
- [ ] 4.4 Implementar validação de formato YAML
- [ ] 4.5 Iterar sobre todos os posts em `content/posts/` (recursivamente)
- [ ] 4.6 Gerar relatório com status de cada arquivo (✅ ou ❌)
- [ ] 4.7 Testar script contra posts existentes

## Detalhes de Implementação

Consulte as seções do `techspec.md`:
- **Abordagem de Testes** (linha 276-315): exemplo de script de validação
- **Modelos de Dados** (linha 198-215): estrutura esperada do frontmatter

O script deve:
1. Ler todos os arquivos `.md` em `content/posts/` (incluindo subdiretórios)
2. Para cada arquivo, extrair frontmatter (entre `---` e `---`)
3. Validar YAML (pode usar `js-yaml` package)
4. Verificar se title, date, description existem e não são vazios
5. Reportar erros com nome do arquivo e motivo
6. Exibir sumário: X passaram, Y falharam
7. Saída: `console.log('✅ arquivo.md')` ou `console.error('❌ arquivo.md: razão')`
8. Exit code: 0 se tudo passou, 1 se há erros

## Critérios de Sucesso

- ✓ Script `validate-i18n.js` pode ser executado via `node scripts/validate-i18n.js`
- ✓ Detecta frontmatter faltante (não há `---`)
- ✓ Detecta YAML inválido
- ✓ Detecta campos obrigatórios faltantes (title, date, description)
- ✓ Relatório claro: ✅ ou ❌ para cada arquivo
- ✓ Exit code 0 se tudo passa, 1 se há erros
- ✓ Script funciona contra a estrutura real de `content/posts/` do projeto

## Testes da Tarefa

- [ ] **Teste de unidade**: Validar lógica de parser
  ```bash
  # Criar arquivo de teste com frontmatter válido
  cat > /tmp/test.md << 'EOF'
  ---
  title: Test
  date: 2024-04-16T00:00:00Z
  description: Test article
  ---
  Content here
  EOF
  
  # Rodar script em arquivo de teste
  node scripts/validate-i18n.js /tmp/test.md
  # Esperado: ✅ ou relatório claro de sucesso
  ```

- [ ] **Teste de integração**: Rodar contra posts reais
  ```bash
  node scripts/validate-i18n.js
  # Esperado: relatório de todos os posts em content/posts/
  # Se houver posts com frontmatter ruim, deve reportar
  # Se tudo OK, exit code 0
  ```

- [ ] **Teste de erro**: Validar que detecta erros
  ```bash
  # Criar arquivo de teste com frontmatter inválido
  cat > /tmp/invalid.md << 'EOF'
  ---
  title: Test
  # falta date e description
  ---
  EOF
  
  node scripts/validate-i18n.js /tmp/invalid.md
  # Esperado: ❌ invalid.md: Missing "date"
  # Exit code: 1
  ```

- [ ] **Teste de integração completa**: Adicionar script ao workflow
  ```bash
  # Verificar que pode ser usado em CI/CD
  node scripts/validate-i18n.js && echo "✅ Todos os posts válidos"
  ```

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `scripts/validate-i18n.js` - Script de validação (criar)
- `content/posts/` - Posts a validar (já existem)
- `dev-docs/tasks/prd-i18n-system/techspec.md` - Referência técnica (ler)
