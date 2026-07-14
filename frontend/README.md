# Frontend - modificações

Angular 17 (standalone components), SPA que consome a API de tarefas.

## Arquitetura

- Adicionado arquivo de `environment` para o frontend, com a URL da API centralizada - removidas todas as URLs que estavam hardcoded no componente.
- Separação de responsabilidades: criada uma camada de `service` para as chamadas de API, tirando o `HttpClient` de dentro do componente.
- Adicionadas tipagens às chamadas (interface `Tarefa`), no lugar do `any` usado antes.
- Reestruturado em arquitetura por feature: `AppComponent` virou só a casca de roteamento (`<router-outlet />`), e o `TarefaComponent` concentra toda a lógica e o template da página de tarefas.
- Removido o fallback de dados falsos que existia quando a API falhava (o app fingia sucesso com dados fake em vez de mostrar o erro). Agora existe um `errorMessage` real e um estado de `loading` visíveis na tela.

## Rotas

Adicionado redirecionamento de rota (`path: '**'` → `/`). Um pouco de overengineering aqui, visto que a aplicação só tem uma rota e não havia necessidade real - mas a maioria das aplicações Angular usa essa estrutura, e ela já deixa o projeto preparado caso surjam novas rotas.

## Estilo e responsividade

- Separação das definições de estilo, movidas para o arquivo de estilos do próprio componente (antes eram inline no template).
- Modificações de estilo para melhorar a responsividade (flexbox, sem larguras fixas).
- Classes seguindo a convenção BEM, onde `__` indica elemento e `--` indica modificador.

## Funcionalidade

Adicionado o `update` de tarefas: no código original não havia como finalizar uma tarefa, embora o objeto já tivesse a propriedade `completed`.

## Testes

```bash
npm test
```

12 testes (Karma + Jasmine): `tarefa.service.spec.ts` (chamadas HTTP - GET/POST/PUT/DELETE), `tarefa.component.spec.ts` (carregar, criar, remover e finalizar tarefa, incluindo os casos de erro) e `app.component.spec.ts` (smoke test da casca de roteamento).

Esse projeto está no Angular 17.3, que usa Karma + Jasmine e precisa de um Chrome/Chromium real para rodar (o Vitest, que roda sem navegador via `jsdom`, só é padrão a partir do Angular 20/21 - migrar exigiria um upgrade de Angular fora do escopo desse refactor). Em vez de usar Puppeteer, o Chromium foi instalado direto no `Dockerfile` do frontend, com um `karma.conf.js` customizado (launcher `ChromeHeadlessNoSandbox`) para rodar headless dentro do container.
