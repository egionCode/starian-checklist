# Frontend - modificações

## Arquitetura

- qol em coding: adicionando arquivo de environment para o frontend com url da api
- resolvido falha de seguranca: remvi todos os url que estão hardcoded
- separacão de responsabilidades: criado uma camada de service para as chamadas de api
- adicionei tipagens às chamadas

## Rotas

- manutenibilidade: adicionei redirecionamento de rotas ( um pouco de overegineering aqui, visto que só tem uma rota, não tinha muito necessidade, mas aplicações em angular, em sua maioria usa essa estrutura de rotas, e até facilita na estilização )

## Estilo e responsividade

- legibilidade e manutenibilidade: separacao de definicoes de estilos, adicionado ao arquivo de estilos do componente
- algumas modificações de estilo para melhorar responsividade
- legibilidade e manutenibilidade: as classes estão com a convenção BEM, onde __ indica elemento e o -- são modificadores de elementos

## Funcionalidade

- adicionei o update nas tarefas, no codigo original nao tinha como finalizar uma terefa, porem no objeto existe a propriedade completed

## Testes

- adicionei testes unitários pro service e pro componente de tarefas

```bash
npm test
```

Esse projeto está no Angular 17.3, que usa Karma + Jasmine e precisa de um Chrome/Chromium real pra rodar (o Vitest, que roda sem navegador via `jsdom`, só é padrão a partir do Angular 20/21). Em vez de Puppeteer, instalei o Chromium direto no `Dockerfile` do frontend, com um `karma.conf.js` customizado (`ChromeHeadlessNoSandbox`) pra rodar headless dentro do container.
