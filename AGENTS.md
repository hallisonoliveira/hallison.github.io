# Guia para agentes

## Contexto do projeto

Este repositório é o blog pessoal de Hallison Oliveira, construído como um site estático em **Hugo**. O site é multilíngue:

- Português (`pt-br`) é o idioma padrão e é publicado na raiz, por exemplo `/posts/`.
- Inglês (`en-us`) é publicado em `/en/`, por exemplo `/en/posts/`.
- A configuração de idiomas, metadados do site e parâmetros de cada idioma ficam em `config.toml`.

Leia primeiro [`docs/index.md`](docs/index.md). A documentação em `docs/` segue o Open Knowledge Format (OKF), que usa Markdown e frontmatter YAML para ser consumida tanto por pessoas quanto por agentes.

## Estrutura Hugo

- `content/`: conteúdo editorial. Páginas de seção usam `_index.<idioma>.md`; posts usam bundles de página em `content/posts/<slug>/`.
- `content/posts/<slug>/index.pt.md` e `index.en.md`: versões localizadas de um post. Mantenha imagens do post no mesmo bundle e use caminhos relativos, como `image: cover.png`.
- `archetypes/posts.md`: frontmatter inicial para novos posts. O validador exige `title`, `date` e `description` nos posts publicados.
- `layouts/`: templates Hugo próprios. `layouts/_default/baseof.html` define a estrutura comum; `layouts/partials/` reúne componentes reutilizáveis; `layouts/shortcodes/` contém shortcodes.
- `i18n/pt.yaml` e `i18n/en.yaml`: chaves usadas pelos templates com `i18n`. Ao introduzir uma chave nova, adicione-a nos dois arquivos.
- `static/`: ativos copiados sem processamento para a raiz pública. Scripts do navegador ficam em `static/js/`.
- `resources/` e `public/`: saída/artefatos gerados pelo Hugo. Não os edite manualmente.
- `themes/`: disponível para temas, mas o site atual usa layouts próprios; não assuma um tema ativo sem conferir `config.toml`.

## Convenções de alteração

1. Preserve a paridade entre PT e EN para navegação, labels e conteúdo que deva existir nos dois idiomas. Para um post deliberadamente em apenas um idioma, não crie uma tradução vazia.
2. Use nomes de slug em minúsculas e com hífens. Prefira um page bundle para novos posts e mantenha seus ativos dentro dele.
3. Preserve o frontmatter YAML existente e use datas em formato ISO (`YYYY-MM-DD`).
4. Ao editar templates, respeite a composição existente por partials e use `relLangURL` para links internos que precisam acompanhar o idioma.
5. O Tailwind é carregado por CDN e configurado inline em `layouts/_default/baseof.html`; não introduza uma etapa de build de CSS sem uma solicitação explícita.
6. Não inclua segredos, chaves de analytics ou dados pessoais novos. Antes de alterar integrações de analytics, cookie consent ou deployment, leia a documentação e os arquivos relacionados.
7. Atualize a documentação OKF em `docs/` quando a arquitetura, o fluxo editorial, a validação ou o deploy mudarem de forma relevante. Cada conceito deve ter frontmatter com pelo menos `type`.

## Comandos e validação

Execute a menor validação que cubra a alteração e informe qualquer limitação do ambiente:

```bash
npm run validate:i18n       # paridade das chaves de tradução
npm run validate:content    # frontmatter dos posts
npm run test:content        # testes unitários de conteúdo
npm run test:build          # build Hugo + verificação de traduções
npm run test:e2e            # Playwright; inicia o Hugo via WSL
make check                  # validações de i18n, conteúdo e build
make test                   # todas as validações e E2E
```

`make dev` inicia o servidor Hugo com hot reload. No Windows, o script `npm run hugo:server` espera que o Hugo esteja disponível pelo WSL em `/snap/bin/hugo`. Não altere `public/`, `.hugo_build.lock` ou `build.log` para simular uma validação.

## Antes de concluir

- Verifique o diff para evitar alterações não relacionadas.
- Confirme que o conteúdo e as chaves de interface permanecem coerentes nos dois idiomas aplicáveis.
- Atualize `docs/log.md` ao mudar um documento OKF ou ao introduzir uma mudança arquitetural relevante.
