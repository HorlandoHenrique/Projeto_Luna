# Luna MVP Frontend

Frontend estático inicial do Projeto Luna. Não há framework, build, pacote instalado ou fonte externa obrigatória.

## Arquivos Principais

```text
luna_mvp_frontend/
|-- assets/
|   `-- luna-placeholder.svg
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

## Trocar a Imagem da Luna

Substitua `assets/luna-placeholder.svg` por uma imagem final mantendo o mesmo nome, ou altere o caminho no `index.html`.

## Limites Desta Fase

Este frontend não deve implementar:

- backend;
- login real;
- pagamento real;
- banco de dados;
- IA;
- memória persistente.

O comportamento atual do chat é apenas uma simulação local para testar a sensação da interface.
