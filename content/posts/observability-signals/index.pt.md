---
title: "Logs, métricas e traces: os sinais da observabilidade"
translationKey: "posts/observability-signals"
date: 2026-10-01
description: "O que são logs, métricas e traces, o que respondem, o que não respondem e como eles definem a observabilidade."
image: cover.png
category: Tecnologia
tags:
  - observabilidade
  - logs
  - métricas
  - traces
  - opentelemetry
draft: false
ai_usage:
  - visual
  - review
---

Quando um serviço começa a responder devagar, falhar de vez em quando ou consumir mais recursos do que deveria, a primeira pergunta costuma ser: o que aconteceu? Para responder, precisamos de evidências sobre o comportamento do sistema. É aí que entram os sinais de observabilidade.

Observabilidade é a capacidade de entender o estado interno de um sistema a partir dos dados que ele produz. Logs, métricas e traces são os sinais mais conhecidos: cada um revela uma parte do comportamento e ajuda a responder perguntas diferentes. Nenhum deles, sozinho, conta a história toda. A observabilidade aparece quando conseguimos fazer perguntas, encontrar evidências e relacionar essas evidências entre si. Ter dashboards ou muito dado armazenado, por si só, não basta.

Como meu dia a dia está relacionado ao contexto bancário, vou usar como exemplo simples uma transferência feita via app, na qual o aplicativo valida a operação, consulta o saldo, passa por uma validação de segurança e envia a transação para processamento. Essa transferência demora e termina em erro. Vamos analisar o que cada sinal consegue nos contar.

## Métricas

“Uma métrica é uma medida de um serviço capturada em tempo de execução” ([OpenTelemetry: Metrics](https://opentelemetry.io/docs/concepts/signals/metrics/)). Cada captura, ou evento de métrica, associa o valor medido ao momento em que foi registrado e aos metadados relacionados. Contagem de requisições, tempo de resposta, quantidade de erros, uso de CPU e memória e tamanho de filas são exemplos comuns de métricas.

Trazendo para nosso exemplo, um *dashboard* poderia mostrar um aumento no tempo de resposta das transferências. Ao observar também a taxa de erros das _requests_ ao longo do tempo, poderíamos identificar quando o problema começou e se os dois indicadores pioraram juntos. Isso ajuda a perceber que algum problema está ocorrendo.

O ponto central é a forma como as métricas são agregadas. Uma métrica pode dizer que uma quantidade `X` de transferências falhou, mas não informa quais operações, em qual etapa do processo ou qual foi a causa da falha. Saber definir uma métrica que, de fato, trará uma resposta útil num momento de crise é fundamental, pois, se ela for mal definida, perderá a utilidade. Da mesma forma, se ela incluir algum identificador único com muita variação de valores (ID de usuário, e-mail, CPF, etc.), poderá causar alta cardinalidade (falarei sobre isso em um post no futuro), o que pode dificultar a busca pelos dados e aumentar os custos de infraestrutura.

Métricas são ótimas para acompanhar padrões. Mas, de maneira geral, não contam a história em detalhes.

## Logs

“Um log é um registro de texto com data e hora que pode ser estruturado (recomendado) ou não estruturado” ([OpenTelemetry: Logs](https://opentelemetry.io/docs/concepts/signals/logs/)).

Em outras palavras, um log registra uma ocorrência em determinado momento: uma validação rejeitada, um erro, uma exceção ou uma alteração de configuração. O foco aqui é responder: **o que esse componente registrou quando essa ação aconteceu?**

Um log pode (eu diria que deve!) ser estruturado, ou seja, ter dados separados em campos com significado definido. Por exemplo:

```json
{
  "timestamp": "2026-09-30T14:32:00Z",
  "level": "ERROR",
  "message": "Falha ao acessar o banco",
  "service": "checkout",
  "order_id": "12345"
}
```

Mas, dependendo do caso, o log também pode ser não estruturado. Nesse caso, é uma mensagem em texto livre, sem separação de campos.

```text
2026-09-30 14:32:00 ERROR checkout: falha ao acessar o banco do pedido 12345
```

Quando os logs precisam ser pesquisados e agrupados, a estruturação ajuda bastante: fica mais fácil filtrar pelos campos e comparar registros semelhantes.

No nosso exemplo da transferência, um log pode explicar que a verificação de segurança excedeu o tempo limite ou que a validação recusou a operação por alguma regra de negócio. Diferentemente das métricas, aqui podemos ter informações detalhadas, úteis para entender um comportamento específico.

Em um app bancário, também é importante evitar dados sensíveis nos logs, como números completos de conta ou informações de autenticação.

Mas os logs, por si só, não são bala de prata para resolver problemas. Se o sistema não registrou um detalhe importante, não será possível obtê-lo posteriormente. Além disso, logs em sistemas de larga escala são custosos para armazenar e consultar: exigem bastante capacidade de armazenamento, o que se traduz em um boleto de valor considerável.

Se os logs não forem estruturados, a análise pode ficar mais difícil.

Logs, se bem definidos, estruturados e planejados, respondem muito bem a perguntas localizadas, mas não oferecem sozinhos uma visão ampla nem o caminho completo de uma transação.

## Traces

Trace, em inglês, significa rastro ou vestígio, entre outros sinônimos. Podemos pensar em um trace como o registro do caminho percorrido por uma requisição: os passos de um fluxo e os diferentes serviços pelos quais ela passou. O OpenTelemetry explica que traces ajudam a entender esse caminho, seja em um monolito com um único banco de dados, seja em uma malha de serviços ([OpenTelemetry: Traces](https://opentelemetry.io/docs/concepts/signals/traces/)). Aqui, o objetivo é responder às seguintes perguntas: **por onde esta requisição passou? Qual etapa consumiu mais tempo? Onde surgiu o erro?**

No exemplo, o trace da transferência pode mostrar 20 milissegundos na validação, 40 milissegundos na consulta de saldo e 3 segundos aguardando a resposta do sistema que processa a transação. Assim, fica mais fácil localizar o gargalo sem precisar acessar logs de diferentes serviços e tentar correlacioná-los. Para que isso funcione, os serviços precisam propagar o mesmo contexto da requisição e registrar [spans](https://opentelemetry.io/docs/concepts/signals/traces/#spans) com nomes coerentes para cada etapa.

Um trace também tem limites. Ele mostra uma execução observada, mas não necessariamente a frequência do problema ou seu impacto geral. Uma instrumentação mal feita pode deixar o caminho incompleto entre os serviços, e mesmo um trace completo nem sempre explica por que uma etapa falhou ou demorou. Para investigar os detalhes registrados pelos componentes, recorremos aos logs; para entender a frequência e o impacto, olhamos para as métricas.

## Juntando os sinais

Uma forma simples de escolher por onde começar é pensar nas perguntas:

- **Há um problema e quando começou?** Métricas.
- **O que foi registrado nesta ocorrência?** Logs.
- **Qual caminho a operação percorreu e onde gastou tempo?** Traces.

Durante um incidente, podemos começar pelo gráfico de latência e pela taxa de erros, selecionar um trace lento e abrir os logs relacionados àquela operação.

Essa sequência não é uma receita de bolo. O importante é que os sinais possam ser correlacionados por contexto comum (serviço, ambiente, operação, tempo e, quando aplicável, identificadores de trace), sem replicar indiscriminadamente todos os atributos em todos os dados. Sem essa conexão, cada ferramenta vira uma ilha e o trabalho de investigação volta a ser manual.

## Conclusão

Logs, métricas e traces são a base da observabilidade. Eles revelam aspectos complementares do sistema: ocorrências, tendências agregadas e caminhos de execução. Cada sinal responde a perguntas específicas do seu contexto, mas nenhum responde a tudo. O conjunto das perguntas que queremos responder com todos os sinais define o nível de observabilidade da aplicação.

No fim das contas, observabilidade não é a quantidade de gráficos num _dashboard_ bonito nem o volume de dados armazenado. É a capacidade de fazer perguntas sobre o comportamento do sistema e encontrar evidências úteis para respondê-las.

Uma dica que eu ouvi recentemente: ao definir a observabilidade de um sistema, pense primeiro nas perguntas que se quer responder. A partir das perguntas, defina qual sinal usar e o ponto onde esse sinal será emitido no sistema.

## Referências

- [Elastic: O que é a observabilidade?](https://www.elastic.co/pt/what-is/observability)
- [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry: Metrics](https://opentelemetry.io/docs/concepts/signals/metrics/)
- [OpenTelemetry: Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [OpenTelemetry: Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
