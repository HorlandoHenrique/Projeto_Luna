# Projeto Luna

MVP inicial de um chat com personagem virtual. A prioridade do projeto é fazer a Luna parecer uma pessoa consistente, humana e reconhecível antes de adicionar tecnologia pesada.

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

O frontend é um site desktop-first feito com HTML, CSS e JavaScript. Ele ainda funciona em modo visual quando o backend não está rodando, mas agora tenta usar a API local para conta, chat, memória, relacionamento e assinatura visual.

Ele contém:

- cabeçalho horizontal com nome Luna, status beta, cadastro próprio simulado, login com Google opcional e assinatura visual com cartão/Pix;
- seção principal em duas colunas, pensada primeiro para notebook e desktop;
- tema escuro quente, sem brilho artificial e sem aparência de aplicativo mobile;
- painel esquerdo com foto grande da Luna e apresentação curta;
- painel direito com chat amplo, contador de mensagens e campo de envio;
- foto da Luna derivada dos arquivos canônicos de `Luna_visual/00_canon/`;
- respostas simuladas locais;
- integração opcional com API local;
- estado visual quando o limite de mensagens está acabando.

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

O frontend possui cadastro próprio simulado para o MVP estático: nome, e-mail, senha, confirmação de senha, maioridade, aceite de termos/privacidade e opt-in de novidades. Ele também permite entrar novamente com a conta criada na mesma sessão do navegador.

Esse fluxo não salva senha em texto e não cria usuário real. Ele existe para testar a experiência de conta antes do backend.

Os requisitos atuais e futuros de conta estão em `luna_mvp_frontend/ACCOUNT_REQUIREMENTS.md`.

## Assinatura

O frontend possui um espaço de assinatura simulado acionado pelo botão `Assinar`. Ele permite escolher plano mensal ou anual e alternar entre cartão de crédito e Pix.

Nenhum pagamento real é processado nesta fase. O fluxo existe para testar a experiência e preparar os requisitos antes da integração com backend e provedor de pagamento.

Os requisitos atuais e futuros de assinatura estão em `luna_mvp_frontend/SUBSCRIPTION_REQUIREMENTS.md`.

## Login Com Google

O frontend já possui integração com Google Identity Services no navegador. Para o botão funcionar, configure um OAuth 2.0 Client ID do tipo `Web application` e coloque o valor em `luna_mvp_frontend/scripts/auth-config.js`.

Para testes locais, autorize estes origins no Google Cloud:

```text
http://localhost
http://localhost:5173
```

Nesta fase, o login exibe nome/foto do usuário na sessão do navegador. A verificação segura do token, usuário real, sessão de servidor e persistência ficam para a etapa de backend.

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
