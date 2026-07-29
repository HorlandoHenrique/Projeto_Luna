# Projeto Luna

Projeto de personagem virtual brasileira. A prioridade é fazer a Luna parecer
uma pessoa consistente, humana e reconhecível antes de adicionar tecnologia
pesada ou abrir o produto ao público.

## Estrutura

```text
Projeto_Luna/
|-- AGENTS.md
|-- README.md
|-- package.json
|-- backend/
|   |-- prisma/
|   `-- src/
|-- knowledge/
|-- Luna_visual/
|   |-- 00_canon/
|   |-- 01_Luna_References/
|   `-- 02_Luna_Ambient_References/
`-- luna_mvp_frontend/
    |-- assets/
    |-- scripts/
    |-- styles/
    |-- index.html
    `-- README.md
```

> A pasta `luna_mvp_frontend` foi mantida por segurança, porque já existe no histórico do projeto. Internamente, ela representa o frontend estático atual.

## Frontend Atual

O frontend é um site desktop-first feito com HTML, CSS e JavaScript. Ele roda
sozinho para desenvolvimento privado e pode usar a API local quando configurada.
A interface pública não deve expor informações internas, simulações ou funções
que ainda não possuem sistema real por trás.

Ele contém:

- cabeçalho horizontal com nome Luna, menu e acesso condicional;
- seção principal em duas colunas, pensada primeiro para notebook e desktop;
- tema escuro quente, sem brilho artificial e sem aparência de aplicativo mobile;
- painel esquerdo com foto grande da Luna, carrossel e apresentação curta;
- painel direito com chat amplo e campo de envio;
- foto da Luna derivada dos arquivos canônicos e referências visuais;
- modo interno `DEBUG_UI` para contadores, simulações e informações técnicas;
- integração opcional com API local para conta, chat, memória e relacionamento.

## Backend Atual

O backend inicial fica em `backend/` e usa:

- Node.js com Fastify;
- Prisma Client;
- SQLite local;
- cadastro e login por e-mail/senha;
- login Google preparado por `GOOGLE_CLIENT_ID`;
- chat persistente;
- memória básica heurística;
- progressão de intimidade, afinidade e conforto;
- limites de segurança básicos;
- lista de espera/intenção de assinatura;
- IA via OpenAI quando `OPENAI_API_KEY` estiver configurada.

Sem chave da OpenAI, o backend usa respostas locais de fallback, mas ainda grava histórico, memórias e relacionamento.

## Luna Visual

A pasta `Luna_visual` guarda os materiais visuais oficiais e referências da personagem:

- `00_canon/`: character sheet, regras visuais e imagens canônicas principais;
- `01_Luna_References/`: referências de rosto/cabelo/expressão da Luna;
- `02_Luna_Ambient_References/`: referências de ambiente e rotina.

## Cadastro E Login

Cadastro e login só devem aparecer na interface pública quando houver sistema
real por trás. O frontend mantém fluxos visuais apenas para `DEBUG_UI` ou para
quando a API local estiver configurada.

Os requisitos atuais e futuros de conta estão em `luna_mvp_frontend/ACCOUNT_REQUIREMENTS.md`.

## Assinatura

Monetização não deve aparecer como funcional enquanto não houver pagamento real
e benefício implementado. Fluxos visuais de assinatura ficam restritos ao modo
interno de desenvolvimento.

Os requisitos atuais e futuros de assinatura estão em `luna_mvp_frontend/SUBSCRIPTION_REQUIREMENTS.md`.

## Login Com Google

O login com Google fica preparado para a etapa de conta real. Para testes
locais, configure um OAuth 2.0 Client ID do tipo `Web application` e coloque o
valor em `luna_mvp_frontend/scripts/auth-config.js`.

Para testes locais, autorize estes origins no Google Cloud:

```text
http://localhost
http://localhost:5173
```

Sem backend/API configurado, a interface pública não deve exibir esse fluxo.

## Como Rodar Localmente

Frontend sem backend:

1. Abra `luna_mvp_frontend/index.html` no navegador.

Opção com servidor local:

```powershell
cd C:\Projeto_Luna\luna_mvp_frontend
python -m http.server 5173
```

Se `python` não estiver no PATH, tente:

```powershell
py -m http.server 5173
```

Depois acesse:

```text
http://localhost:5173
```

Backend e frontend juntos:

```powershell
copy .env.example .env
pnpm install
pnpm db:generate
pnpm db:push
pnpm dev
```

API:

```text
http://127.0.0.1:3333
```

## O Que Ainda Não Existe

- Pagamento real.
- Produção/hospedagem.
- Treinamento ou fine-tuning.
- Painel administrativo.

## Próxima Etapa Recomendada

Configurar `OPENAI_API_KEY`, testar o prompt canônico em conversas reais e ajustar a memória seletiva antes de pensar em treinamento/fine-tuning.
