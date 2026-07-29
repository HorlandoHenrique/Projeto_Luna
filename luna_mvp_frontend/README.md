# Luna Frontend

Frontend atual do Projeto Luna. Ele pode rodar sozinho para desenvolvimento
privado e tenta usar o backend local quando disponível.

A interface pública não deve exibir funções simuladas, informações internas ou
estados que ainda não possuem sistema real por trás.

## Arquivos Principais

```text
luna_mvp_frontend/
|-- assets/
|   |-- luna/
|   |   |-- canon/
|   |   `-- experiments/
|   `-- luna-placeholder.svg
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
- menu de usuário, estatísticas locais e suporte inicial;
- `DEBUG_UI` para contadores e simulações internas;
- login exibido apenas com API configurada ou em modo interno;
- assinatura visual restrita ao modo interno;
- integração opcional com backend para histórico, memória e relacionamento.

O mobile continua responsivo, mas não é o foco visual principal.

## Imagem da Luna

A interface usa imagens em `assets/luna/canon/` como canônicas temporárias. O
SVG antigo continua na pasta apenas como placeholder de segurança. Imagens de
teste devem ficar em `assets/luna/experiments/` e não entram automaticamente no
site.

## Cadastro E Login

Cadastro e login só devem aparecer para o usuário comum quando houver API
configurada. Em desenvolvimento, `DEBUG_UI` pode mostrar o fluxo visual para
testes internos.

Quando o backend está rodando, o cadastro cria usuário real no SQLite local.
Sem backend, o fluxo visual deve permanecer oculto fora de `DEBUG_UI`.

Os requisitos de conta agora e futuros estão em `ACCOUNT_REQUIREMENTS.md`.

## Assinatura

Assinatura, planos, preços, cartão e Pix não devem aparecer na interface pública
enquanto não houver pagamento real e benefício implementado.

O fluxo visual permanece apenas para desenvolvimento interno com `DEBUG_UI`.
Ele não salva número de cartão, CVV, CPF ou dados de Pix.

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

Ainda não há pagamento real, produção pública ampla, painel administrativo ou
treinamento/fine-tuning. A IA depende de `OPENAI_API_KEY`; sem chave, o backend
usa fallback local para desenvolvimento e testes privados.
