# Problemas identificados

Levantamento de más práticas e problemas técnicos encontrados no projeto, organizados por camada. Inclui tanto os comentários já deixados propositalmente no código ("má prática") quanto problemas identificados por análise, sem comentário explícito.

## Backend (Laravel)

### `backend/routes/api.php`
Todo o CRUD de tarefas está implementado como closures direto no arquivo de rotas, sem Model, sem Controller, sem validação, persistindo em um arquivo JSON (`storage/tarefas.json`) em vez de banco de dados (que já está configurado via SQLite, só falta migration).

- Linha 6: função `lerTarefas()` lê o arquivo JSON em vez de usar banco de dados.
- Linha 21: leitura do JSON sem tratamento de erro (`file_get_contents` pode falhar silenciosamente).
- Linha 32: rota `GET /tarefas` sem Controller.
- Linha 38: rota `POST /tarefas` sem validação de entrada (`title` aceita qualquer coisa, inclusive vazio).
- Linha 43: geração de ID via `max(array_column($tarefas, 'id')) + 1`, não atômico (condição de corrida em concorrência).
- Linha 54: rota `DELETE /tarefas/{id}` sem verificação de existência.
- Linha 61: remoção do array sem checar se o índice foi encontrado antes.
- Linha 67: retorna 204 mesmo se a tarefa não existia (delete de ID inexistente devolve sucesso).

### `backend/routes/web.php`
- Linha 9-10: `require __DIR__.'/api.php';` mistura rotas web e API no mesmo arquivo, contrariando a separação padrão do Laravel (`routes/web.php` vs `routes/api.php`).

### `backend/bootstrap/app.php`
- Linha 15-16: registra `CorsMiddleware` customizado globalmente via `$middleware->append(...)`.
- **Bug de estado não commitado**: há uma alteração no working tree (`git diff`) adicionando `api: __DIR__.'/../routes/api.php'` ao `withRouting()`. Combinada com o `require` de `web.php` citado acima, isso registra a rota de tarefas **duas vezes** (uma vez via `web.php` sem prefixo, outra via a chave `api:` nativa do Laravel, que aplicaria prefixo `/api`). Precisa ser resolvido junto da correção de rotas misturadas.

### `backend/app/Http/Middleware/CorsMiddleware.php`
- Linha 20-25: middleware customizado que seta `Access-Control-Allow-Origin: *`, liberando CORS para qualquer origem, sem nenhuma restrição. Duplica funcionalidade que o Laravel já resolve nativamente via `Illuminate\Http\Middleware\HandleCors` + `config/cors.php` (que nem existe no projeto).

### Ausência de estrutura
- Não existe Model, Migration, Controller ou FormRequest para tarefas. A tabela não existe no banco.
- Não existem testes cobrindo o CRUD de tarefas (só o `ExampleTest` padrão do scaffolding do Laravel).

## Frontend (Angular)

### `frontend/src/app/app.component.ts`
- Único componente da aplicação: concentra chamada HTTP, lógica de negócio e apresentação, sem separação em Service.
- `todos: any[]` e `newTodo: any`: tipagem `any` em toda a entidade, sem interface `Task`/`Tarefa`.
- `apiUrl = 'http://localhost:8000/tarefas'`: URL da API hardcoded no componente, sem uso de `environment.ts` (que nem existe no projeto).
- Linhas 27-33 (`ngOnInit`), 48-57 (`addTodo`), 66-69 (`removeTodo`): em **todos** os handlers de erro, a falha da API é mascarada com dados falsos/locais como se a operação tivesse tido sucesso (tarefas "offline", tarefa fake com ID aleatório, remoção "otimista" do array mesmo se o delete falhou no servidor). O usuário nunca é informado de que algo deu errado.
- Sem estado de loading: a UI não indica se uma requisição está em andamento.

### `frontend/src/app/app.component.html`
- Estilos inline (`style="..."`) em praticamente todos os elementos, em vez de CSS no `app.component.scss` (que existe mas está vazio).
- Input com largura fixa (`width: 300px`), sem responsividade - conflita com o requisito do README de "garantir responsividade".

### `frontend/src/app/app.config.ts`
- Não registra `provideHttpClient()`. O `HttpClient` é obtido importando `HttpClientModule` direto no componente (`app.component.ts`), um padrão de módulo antigo misturado com a API standalone do Angular 17.

### Ausência de estrutura
- Não existe `Service` para chamadas HTTP.
- Não existe pasta `environments/`.
- Não existe interface/type para a entidade de tarefa.

## Infraestrutura (Docker)

### `backend/Dockerfile`
- Instala a extensão `pdo_mysql` (linha 6), mas o projeto usa `DB_CONNECTION=sqlite` por padrão e a extensão `pdo_sqlite` não é instalada. Rodar migrations dentro do container com a configuração padrão deve falhar por falta de driver.

### `docker-compose.yml` (raiz)
- Serviço `laravel`: o volume monta `./backend` em `/var/www`, mas o `working_dir` do serviço é `/backend` (o path usado no `WORKDIR`/`COPY` do Dockerfile). Ou seja, o container roda o código copiado no build da imagem, não o volume montado - alterações locais no código não refletem no container sem rebuild.
- Nenhum dos dois serviços roda `php artisan migrate` antes do `serve`; o banco SQLite não é criado/migrado automaticamente ao subir o container.
