# Luna Backend

Backend local do MVP da Luna.

Ele inclui:

- Fastify para API HTTP;
- Prisma com SQLite local;
- cadastro e login por e-mail/senha;
- login Google preparado por `GOOGLE_CLIENT_ID`;
- chat persistente;
- memoria basica heuristica;
- estado de relacionamento com intimidade, afinidade e conforto;
- limites de seguranca basicos;
- lista de espera e intencao de assinatura;
- integracao OpenAI opcional via `OPENAI_API_KEY`.

## Configuracao

Copie `.env.example` para `.env` na raiz do projeto e ajuste os valores.

```powershell
copy .env.example .env
```

Depois instale dependencias e prepare o banco:

```powershell
pnpm install
pnpm db:generate
pnpm db:push
```

## Rodar

```powershell
pnpm dev
```

API:

```text
http://127.0.0.1:3333
```

Frontend:

```text
http://127.0.0.1:5173
```

Sem `OPENAI_API_KEY`, a API usa respostas locais de fallback e ainda grava mensagens, memoria e relacionamento.
