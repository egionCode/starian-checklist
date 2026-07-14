# Starian Checklist

Teste técnico de refatoração fullstack: API REST em Laravel 11 (PHP 8.2) + SPA em Angular 17, orquestrados via Docker Compose.

## Stack atual

- **Backend**: Laravel 11, PHP 8.2, SQLite
- **Frontend**: Angular 17 (standalone components)
- **Orquestração**: Docker Compose

## Como rodar

```bash
docker compose up --build
```

| Serviço | URL | Porta |
|---|---|---|
| API (Laravel) | http://localhost:8080/api/v1 | 8080 |
| Frontend (Angular) | http://localhost:4200 | 4200 |

Na primeira vez, gere o `.env` e o banco do backend (dentro do container `laravel`, em `/backend`, ou local em `backend/`):

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
```

## Rotas

**Backend** (`/api/v1`):

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tarefas` | Lista todas as tarefas |
| GET | `/tarefas/{id}` | Mostra uma tarefa |
| POST | `/tarefas` | Cria uma tarefa |
| PUT/PATCH | `/tarefas/{id}` | Atualiza título e/ou status |
| DELETE | `/tarefas/{id}` | Remove uma tarefa |

**Frontend**:

| Rota | Componente |
|---|---|
| `/` | `TarefaComponent` (lista de tarefas) |
| `**` (qualquer outra) | redireciona para `/` |

## Uso de IA

Usei o **Claude Code** (modelo Sonnet 5) como assistente durante o refactor, seguindo o espírito do que o Fábio Akita (AkitaOnRails) descreveu sobre programar com agentes de IA aplicando XP (Extreme Programming): pair programming, mudanças pequenas e incrementais, e disciplina de validar cada passo em vez de aceitar sugestão sem checar. Eu direcionava o que fazer e por quê, a IA executava, e cada mudança foi validada (rodando os containers, testando endpoints, rodando a suíte de testes) antes de eu aceitar.

Algumas decisões que tomei, contra ou além do que foi sugerido:

- Rejeitei a sugestão de criar um `TarefaResource` (API Resource) para formatar a resposta JSON - avaliei que era over-engineering pra um recurso de 3 campos.
- Descartei instalar Puppeteer pra viabilizar teste de frontend; no lugar, optamos por instalar Chromium direto no `Dockerfile` do frontend (mais simples, sem dependência npm extra) depois de confirmar que o Karma desse projeto (Angular 17) precisa de um browser real - migrar pra Vitest/jsdom exigiria upgrade de Angular fora do escopo desse refactor.
- Pedi explicitamente a reestruturação do frontend para arquitetura por feature (separar `AppComponent` da lógica de tarefas), depois de discutir se fazia sentido dado o tamanho da aplicação.
- Aprovei ou recusei sugestões técnicas pontualmente: aceitei o rate limiter e a restrição de CORS por origem, recusei nomear o service genérico (`app.service`) e pedi nome pelo domínio (`tarefa.service`).

O que a IA ajudou a identificar e eu validei manualmente: o bug de `routes/api.php` sendo carregado duas vezes (quebrava o build do Docker inteiro), e o mismatch de volume no `docker-compose.yml` que impedia live-reload.

Essa documentação (os três READMEs) também foi escrita com ajuda do Claude Code.

## Documentação por camada

- [`backend/README.md`](backend/README.md) - o que foi modificado no backend
- [`frontend/README.md`](frontend/README.md) - o que foi modificado no frontend
