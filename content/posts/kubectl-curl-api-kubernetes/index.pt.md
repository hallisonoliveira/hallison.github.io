---
title: "kubectl + cURL - Validando APIs internas em Kubernetes"
translationKey: "posts/kubectl-curl-api-kubernetes"
date: 2026-06-08
description: "Um guia prático para validar APIs internas em Kubernetes usando kubectl e cURL."
image: cover.png
category: Infraestrutura
tags:
  - kubernetes
  - kubectl
  - curl
  - cluster
draft: false
---

Quando um microserviço roda **dentro do cluster**, bater nele via `curl` parece simples mas pode não ser, pois podem aparecer erros `404`, dúvidas de _namespace_, ou incertezas sobre qual é a rota real/correta.  
Este guia reúne o fluxo completo pra você sair do zero até um teste confiável com comandos prontos para serem utilizados. Ao final, você vai ser capaz de validar com tranquilidade se seu serviço está rodando e com as rotas publicadas.

## Cenário

Imagine o seguinte cenário onde você consegue acessar o _cluster_ com o `kubectl` e quer testar _endpoints_ HTTP de um serviço interno. Por exemplo:

- API: `ms-my-service-api`
- _Namespace_: `ms-my-service`
- _Service Port_: `80`

## 1. Descubra em qual _cluster_/contexto você está:

Primeiro, valide o contexto ativo no `kubectl`:

```bash
kubectl config current-context
```

Para ver todos os contextos disponíveis:

```bash
kubectl config get-contexts
```

Para ver apenas o _cluster_ do contexto atual:

```bash
kubectl config view --minify -o jsonpath='{.contexts[0].context.cluster}{"\n"}'
```

Para ver URL do API _server_:

```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}{"\n"}'
```

---

## 2. Descubra/valide _namespace_ e _service_

Para listar os _namespaces_ disponíveis:

```bash
kubectl get ns
```

Buscar _service_ em todos os _namespaces_:

```bash
kubectl get svc -A | grep ms-my-service-api
```

Inspecionar os detalhes do _service_:

```bash
kubectl -n ms-my-service get svc ms-my-service-api -o yaml
```

Exemplo de trecho relevante encontrado no arquivo YAML de detalhes do _service_:

```yaml
ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
```

## 3. Faça _port-forward_ do _service_

Com os dados acima, o comando fica:

```bash
kubectl -n ms-my-service port-forward svc/ms-my-service-api 8080:80
```

Agora, no seu _host_ local, o serviço responde em `http://localhost:8080`.

(!) NÃo feche o terminal onde você rodou o `port-forward`. Ele deve ficar em execução durante os testes.

---

## 4. Teste básico com `curl`

Sem _path_ específico:

```bash
curl -i http://localhost:8080/
```

_Healthchecks_ comuns:

```bash
curl -i http://localhost:8080/health
curl -i http://localhost:8080/ready
curl -i http://localhost:8080/metrics
```

---

## 5. Entendendo o `404 page not found`

Se o `port-forward` está ativo e você recebe `404`, isso normalmente significa:

1. O túnel está ok.
2. A rota chamada não existe na aplicação naquele _path_/método.

Por exemplo: se `GET /metrics` retornar 404, pode indicar:
- _path_ incorreto (`/api/v1/metrics` etc.)
- método incorreto (_endpoint_ espera `POST`, por exemplo)
- rota publicada só via _gateway_ com _rewrite_ (prefixo diferente)
- docs/roteamento não carregados no ambiente

---

## 6. Como listar “rotas publicadas”

O Kubernetes **não** lista rotas HTTP da sua aplicação. Ele conhece _service_, porta e _endpoints_ (IP dos _pods_).

Pra descobrir as rotas da que sua API possui, use:

### 6.1 Swagger/OpenAPI (se existir)

```bash
curl -i http://localhost:8080/swagger
curl -i http://localhost:8080/swagger/index.html
curl -i http://localhost:8080/openapi.json
curl -i http://localhost:8080/docs
```

### 6.2 Código da aplicação (quando você tem acesso)

Procurar definições de rotas/_handlers_ no projeto.

---

## 7. Como listar pods de um service

Primeiro, veja qual é o _selector_ do seu service:

```bash
kubectl -n ms-my-service get svc ms-my-service-api -o yaml
```

Depois, liste os _pods_ pelo _selector_ (exemplo)

```bash
kubectl -n ms-my-service get pods -l app=ms-my-service-api
```

Alternativa direta pra ver quem está atrás do _service_:

```bash
kubectl -n ms-my-service get endpoints ms-my-service-api
```

Ou, uma visão completa:

```bash
kubectl -n ms-my-service describe svc ms-my-service-api
```

---

## 8. Checklist rápido de _troubleshooting_

Se algo não funcionar, valida as informações nessa ordem:

1. **Contexto certo**
   - `kubectl config current-context`
2. **_Namespace_ certo**
   - `kubectl get svc -A | grep <service>`
3. **_Service_ existe e porta confere**
   - `kubectl -n <ns> get svc <svc> -o yaml`
4. **_Endpoints_ ativos (_pods_ saudáveis)**
   - `kubectl -n <ns> get endpoints <svc>`
5. **_Port-forward_ subiu sem erro**
   - terminal do `port-forward` precisa ficar aberto
6. **Rota/método corretos**
   - teste `/`, `/health`, docs e OpenAPI

---

## Conclusão

Para testar uma API interna no Kubernetes com rapidez e previsibilidade:

- valide contexto/namespace,
- confirme porta real do service,
- use `port-forward` para o seu `localhost`,
- e trate `404` como problema de **roteamento da aplicação**, não de conexão com cluster.

Esse fluxo evita "tentativa e erro" e acelera muito a depuração de APIs internas.
