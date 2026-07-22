# Luna MVP Frontend

Frontend inicial do Projeto Luna. Ele pode rodar sozinho em modo visual, mas agora tenta usar o backend local quando disponível.

## Arquivos Principais

```text
luna_mvp_frontend/
|-- assets/
|   |-- Luna_avatar.png
|   |-- luna-placeholder.svg
|   |-- luna-site-avatar.jpg
|   |-- luna-site-profile-wide.jpg
|   `-- luna-site-profile.jpg
|-- ACCOUNT_REQUIREMENTS.md
|-- SUBSCRIPTION_REQUIREMENTS.md
|-- scripts/
|   |-- api-client.js
|   |-- api-config.js
|   |-- auth-config.js
|   `-- app.js
|-- styles/
|   `-- main.css
`-- index.html
```

## Como Rodar

Abra `index.html` diretamente no navegador.

Ou rode um servidor local:

```powershell
cd C:\Projeto_Luna\luna_mvp_frontend
python -m http.server 5173
```

Se necessário:

```powershell
py -m http.server 5173
```

Acesse `http://localhost:5173`.

## Interface

A tela atual é um site desktop-first:

- header horizontal;
- painel visual da Luna;
- painel de chat amplo;
- tema escuro quente;
- contador de mensagens;
- cadastro próprio simulado, entrada simulada e login com Google opcional;
- assinatura simulada com cartão de crédito e Pix visuais;
- integração opcional com backend para histórico, memória e relacionamento.

O mobile continua responsivo, mas não é o foco visual principal.

## Imagem da Luna

A interface usa `assets/luna-site-profile-wide.jpg` no painel principal e `assets/Luna_avatar.png` no avatar do chat. O avatar vem de `Luna_visual/00_canon/Luna_avatar.png`. O SVG antigo continua na pasta apenas como placeholder de segurança.

## Cadastro E Login

O frontend possui um fluxo de conta para o MVP estático:

- criar conta própria do site com nome, e-mail, senha, confirmação de senha, maioridade, aceite de termos/privacidade e opt-in de novidades;
- entrar com a conta criada na mesma sessão do navegador;
- sair da sessão visual;
- continuar com Google como alternativa.

Quando o backend está rodando, o cadastro cria usuário real no SQLite local. Sem backend, o fluxo visual antigo continua usando `sessionStorage`.

Os requisitos de conta agora e futuros estão em `ACCOUNT_REQUIREMENTS.md`.

## Assinatura

O botão `Assinar` abre um espaço de assinatura visual com plano mensal, plano anual, cartão de crédito e Pix.

Nesta fase, nenhum pagamento é processado. O frontend valida os campos, marca uma assinatura de teste na sessão do navegador e pode salvar uma intenção de assinatura no backend. Ele não salva número de cartão, CVV, CPF ou dados de Pix.

Os requisitos de assinatura agora e futuros estão em `SUBSCRIPTION_REQUIREMENTS.md`.

## Login Com Google

O frontend usa Google Identity Services no navegador. Para ativar o botão:

1. Crie um OAuth 2.0 Client ID do tipo `Web application` no Google Cloud.
2. Em `Authorized JavaScript origins`, adicione:

```text
http://localhost
http://localhost:5173
```

3. Copie o Client ID e cole em `scripts/auth-config.js`:

```js
window.LUNA_AUTH_CONFIG = {
  googleClientId: "SEU_CLIENT_ID.apps.googleusercontent.com"
};
```

Sem esse Client ID, o botão mostra apenas o aviso de configuração. Quando o backend está rodando e `GOOGLE_CLIENT_ID` está configurado no `.env`, o token também é validado no servidor.

## Backend Local

Endpoint padrão:

```text
http://127.0.0.1:3333
```

Configuração do endpoint:

```text
luna_mvp_frontend/scripts/api-config.js
```

## Limites Desta Fase

Ainda não há pagamento real, produção, painel administrativo ou treinamento/fine-tuning. A IA depende de `OPENAI_API_KEY`; sem chave, o backend usa fallback local.
