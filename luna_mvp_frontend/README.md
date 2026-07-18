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
|-- scripts/
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
- login e assinatura simulados.

O mobile continua responsivo, mas não é o foco visual principal.

## Imagem da Luna

A interface usa `assets/luna-site-profile-wide.jpg` no painel principal e `assets/Luna_avatar.png` no avatar do chat. O avatar vem de `Luna_visual/00_canon/Luna_avatar.png`. O SVG antigo continua na pasta apenas como placeholder de segurança.

## Limites Desta Fase

Este frontend não deve implementar:

- backend;
- login real;
- pagamento real;
- banco de dados;
- IA;
- memória persistente.

O comportamento atual do chat é apenas uma simulação local para testar a sensação da interface.
