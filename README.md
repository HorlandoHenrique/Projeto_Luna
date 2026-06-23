# Projeto Luna

MVP inicial de um chat com personagem virtual. A prioridade do projeto é fazer a Luna parecer uma pessoa consistente, humana e reconhecível antes de adicionar tecnologia pesada.

## Estrutura

```text
Projeto_Luna/
|-- AGENTS.md
|-- README.md
|-- knowledge/
`-- luna_mvp_frontend/
    |-- assets/
    |-- scripts/
    |-- styles/
    |-- index.html
    `-- README.md
```

> A pasta `luna_mvp_frontend` foi mantida por segurança, porque já existe no histórico do projeto. Internamente, ela representa o frontend estático atual.

## Frontend Atual

O frontend é um site desktop-first, estático, feito apenas com HTML, CSS e JavaScript. Ele não exige instalação de pacotes nem fonte externa.

Ele contém:

- cabeçalho horizontal com nome Luna, status beta, login visual e assinatura visual;
- seção principal em duas colunas, pensada primeiro para notebook e desktop;
- tema escuro quente, sem brilho artificial e sem aparência de aplicativo mobile;
- painel esquerdo com foto grande da Luna e apresentação curta;
- painel direito com chat amplo, contador de mensagens e campo de envio;
- respostas simuladas locais;
- estado visual quando o limite de mensagens está acabando.

## Como Rodar Localmente

Opção simples:

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

## O Que Ainda Não Existe

- Backend.
- Banco de dados.
- Autenticação real.
- Pagamento real.
- Integração com IA.
- Memória persistente.

## Próxima Etapa Recomendada

Validar o redesign desktop em navegador real, ajustar detalhes de texto e espaçamento, e só depois iniciar a fundação técnica de backend, autenticação, memória e IA.
