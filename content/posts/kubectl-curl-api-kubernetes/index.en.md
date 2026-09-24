---
title: "kubectl + cURL - Validating internal APIs on Kubernetes"
translationKey: "posts/kubectl-curl-api-kubernetes"
date: 2026-06-08
description: "A practical guide to validating internal Kubernetes APIs with kubectl and cURL."
image: cover.png
category: Infraestrutura
tags:
  - kubernetes
  - kubectl
  - curl
  - cluster
draft: false
---

When a microservice runs **in a Kubernetes cluster**, checking if it is working using `curl` might seem simple but its not because some `404` errors and uncertanty about the namespace and routes can happen.

This guide reunites the full workflow for you to start a reliable test with commands "ready to go". At the end, you'll be able to validate if your service is up and with the routes published.

## Scenario

Imagine the following scenario where you are able to access the cluster thru `kubectl` and want to test HTTP endpoints of an internal service, like:

- API: `ms-my-service-api`
- _Namespace_: `ms-my-service`
- _Service Port_: `80`

## 1. Figure it out in what cluster/context you are:

First, validate the active context in `kubectl`:

```bash
kubectl config current-context
```

To see all available contexts:

```bash
kubectl config get-contexts
```

To see only the cluster of the current context:

```bash
kubectl config view --minify -o jsonpath='{.contexts[0].context.cluster}{"\n"}'
```
To see the API server's URL:

```bash
kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}{"\n"}'
```

---

## 2. Validate the _namespace_ and _service_

To list all the available namespaces:

```bash
kubectl get ns
```

To search the service in all available namespaces:

```bash
kubectl get svc -A | grep ms-my-service-api
```

To inspect the service's details:

```bash
kubectl -n ms-my-service get svc ms-my-service-api -o yaml
```

An example of the relevant part of the service's details YAML file:

```yaml
ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
```

## 3. _port-forward_

With the previous data, the command looks like:

```bash
kubectl -n ms-my-service port-forward svc/ms-my-service-api 8080:80
```

Now, on your local host, the service answers in `http://localhost:8080`.

(!) Do not close the terminal screen where you ran the `port-forward` command. The terminal needs to be running during the tests.

---

## 4. Basic test with `curl`

Without specific _path_:

```bash
curl -i http://localhost:8080/
```

Most common _Healthchecks_:

```bash
curl -i http://localhost:8080/health
curl -i http://localhost:8080/ready
curl -i http://localhost:8080/metrics
```

---

## 5. Understanding the `404 page not found`

If the `port-forward` is active and you get `404`, it normally means that:

1. The tunel is ok.
2. The called route doesn't exist in that path/method.

For example: if `GET /metrics` returns 404, it can mean that:
- incorrect path (`api/v1/metrics`, etc.)
- wrong method (the endpoint accepts only `POST`, for example)
- the published route only via gateway with rewrite (different prefix)
- docs/routing wasn't loaded on the environment

---

## 6. How to list the "published routes"

The Kubernetes **does not** list the HTTP routes of your application. It only knows services, ports and endpoints (pods IPs).

To discover which routes your API has:

### 6.1 Swagger/OpenAPI (if available)

```bash
curl -i http://localhost:8080/swagger
curl -i http://localhost:8080/swagger/index.html
curl -i http://localhost:8080/openapi.json
curl -i http://localhost:8080/docs
```

### 6.2 Source code (when you have access to it)

Search for route/handlers definitions on the project.

---

## 7. How to list pods of a service

First, search for the services's selector:

```bash
kubectl -n ms-my-service get svc ms-my-service-api -o yaml
```
Then, list the pods using the selector:

```bash
kubectl -n ms-my-service get pods -l app=ms-my-service-api
```

Direct alternative to see who's behind the service:

```bash
kubectl -n ms-my-service get endpoints ms-my-service-api
```

Or, a full view:

```bash
kubectl -n ms-my-service describe svc ms-my-service-api
```

---

## 8. Troubleshooting checklist

If something didn't work, validate the information in the following order:

1. **Right context**
   - `kubectl config current-context`
2. **Right namespace**
   - `kubectl get svc -A | grep <service>`
3. **_Service_ exists and the port is correct**
   - `kubectl -n <ns> get svc <svc> -o yaml`
4. **Active _endpoints_ (healthy _pods_)**
   - `kubectl -n <ns> get endpoints <svc>`
5. **_Port-forward_ ran without errors**
   - `port-forward` terminal screen needs to stay open
6. **Right route/method**
   - test `/`, `/health`, docs and OpenAPI

---

## Conclusion

To test an internal Kubernetes API in a fast and predictable way:

- validate the context/namespace,
- check the real service's port,
- use `port-forward` to your `localhost`,
- and handle `404` as an **application routing** problem instead of a cluster's connection problem.

This workflow avoids "try and error" and speeds up debugging of internal APIs.
