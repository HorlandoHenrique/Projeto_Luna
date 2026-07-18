# Luna MVP Frontend

Frontend estático inicial do Projeto Luna. Não há framework, build, pacote instalado ou fonte externa obrigatória.

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
|-- scripts/
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
- assinatura simulada.

O mobile continua responsivo, mas não é o foco visual principal.

## Imagem da Luna

A interface usa `assets/luna-site-profile-wide.jpg` no painel principal e `assets/Luna_avatar.png` no avatar do chat. O avatar vem de `Luna_visual/00_canon/Luna_avatar.png`. O SVG antigo continua na pasta apenas como placeholder de segurança.

## Cadastro E Login

O frontend possui um fluxo de conta para o MVP estático:

- criar conta própria do site com nome, e-mail, senha, confirmação de senha, maioridade, aceite de termos/privacidade e opt-in de novidades;
- entrar com a conta criada na mesma sessão do navegador;
- sair da sessão visual;
- continuar com Google como alternativa.

Nesta fase, o cadastro próprio não salva senha em texto e não cria usuário real. Os dados usados para a simulação ficam apenas em `sessionStorage`.

Os requisitos de conta agora e futuros estão em `ACCOUNT_REQUIREMENTS.md`.

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

Sem esse Client ID, o botão mostra apenas o aviso de configuração. Nesta fase estática, o frontend exibe nome/foto do Google na sessão do navegador, mas ainda não cria usuário real, sessão de servidor, banco de dados ou verificação backend do token.

## Limites Desta Fase

Este frontend não deve implementar:

- backend;
- autenticação real;
- pagamento real;
- banco de dados;
- IA;
- memória persistente.

O comportamento atual do chat é apenas uma simulação local para testar a sensação da interface.
