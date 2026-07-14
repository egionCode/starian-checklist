# Backend - modificações

## Arquitetura

- aprimorada a definição de camadas: Model, Controller e Request foram criados para melhor separação (antes era tudo em closures dentro de `routes/api.php`, sem Model, persistindo num arquivo JSON)
- criando rotas definidas do apiResource ( laravel helper para chamada de rotas de listagem, show, update, store e delete)
- adicionado migration para tarefas, usando sqlite como fonte de verdade
- removi o tarefas.json do repositório visto que sqlite é a fonte de verdade agora

## Bug corrigido

- `routes/api.php` estava sendo carregado **duas vezes**: uma pelo `require` dentro de `routes/web.php`, e outra pela chave `api:` no `bootstrap/app.php`. Isso causava `Cannot redeclare function` e quebrava até o `composer install` dentro do Docker. Corrigido removendo o `web.php` do projeto - a aplicação é API pura, não precisa de rotas web.

## Rotas e API

- visto que backend é uma API REST, alterei o bootstrap para carregar somente as rotas api.php
- adicionado versionamento de rotas ( boa prática para REST API ), agora em `/api/v1/tarefas`

## CORS, segurança e limites

- travando a api para funcionar somente no mesmo domínio usando cors ( tomei a liberdade de usar o cors que o laravel já fornece em seu pacote default, removendo o middleware customizado que liberava tudo com `*` )
- restringi também os headers aceitos no CORS (`Content-Type`, `Accept`) em vez de aceitar qualquer header
- aplicado ratelimiter para evitar explosão de requests (60 requisições por minuto por IP)

## Testes

- aproveitei e criei alguns testes para boas práticas de coding: cobrem listagem, criação (com validação), atualização parcial, remoção e o comportamento do CORS - 19 testes no total (`php artisan test`)

## Limitações conhecidas

- o volume do serviço `laravel` no `docker-compose.yml` (`./backend:/var/www`) não bate com o `WORKDIR` da imagem (`/backend`), então o container não reflete edição de arquivo automaticamente. Depois de qualquer mudança de código, precisa rebuildar (`docker compose build laravel`) antes de subir de novo.
