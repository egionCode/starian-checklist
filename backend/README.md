# Backend - modificações

Laravel 11 (PHP 8.2), API REST pura para o CRUD de tarefas.

## Arquitetura

- Aprimorada a definição de camadas: `Model`, `Controller` e `Request` foram criados para melhor separação de responsabilidades (antes, tudo estava em closures dentro de `routes/api.php`, sem `Model`, persistindo os dados num arquivo JSON).
- Rotas definidas via `apiResource` (helper do Laravel para as rotas de listagem, exibição, criação, atualização e remoção).
- Adicionada migration para `tarefas`, usando SQLite como fonte de verdade.
- Removido o `tarefas.json` do repositório, já que o SQLite é a fonte de verdade agora.
- Validação de entrada via `StoreTarefaRequest` (título obrigatório, string, até 255 caracteres) e `UpdateTarefaRequest` (campos opcionais, para suportar atualização parcial).

## Bug corrigido

`routes/api.php` estava sendo carregado **duas vezes**: uma pelo `require` dentro de `routes/web.php`, e outra pela chave `api:` no `bootstrap/app.php`. Isso causava `Cannot redeclare function` e quebrava até o `composer install` dentro do Docker. Corrigido removendo o `web.php` do projeto - a aplicação é uma API pura, não precisa de rotas web.

## Rotas e API

- Como o backend é uma API REST, o bootstrap foi alterado para carregar somente as rotas de `api.php`.
- Adicionado versionamento de rotas (boa prática para APIs REST): agora em `/api/v1/tarefas`.

## CORS, segurança e limites

- A API foi restrita para funcionar apenas com a origem do frontend, usando o CORS que o próprio Laravel já fornece por padrão - removido o middleware customizado que liberava tudo com `*`.
- Restringidos também os headers aceitos no CORS (`Content-Type`, `Accept`), em vez de aceitar qualquer header.
- Aplicado rate limiter para evitar explosão de requisições (60 requisições por minuto por IP).

## Testes

```bash
php artisan test
```

19 testes (PHPUnit), divididos em:

- **`TarefaControllerTest`** (15): listagem, exibição, criação com validação, atualização parcial e remoção, incluindo os casos de erro (404, 422).
- **`CorsTest`** (4): garante que a origem liberada não é `*`, que o preflight responde corretamente para a origem do frontend, e que rotas fora de `api/*` não recebem header de CORS.

## Limitações conhecidas

O volume do serviço `laravel` no `docker-compose.yml` (`./backend:/var/www`) não corresponde ao `WORKDIR` da imagem (`/backend`), então o container não reflete edições de arquivo automaticamente. Depois de qualquer mudança de código, é preciso rebuildar (`docker compose build laravel`) antes de subir de novo.
