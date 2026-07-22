# OpenAI Setup

O backend da Luna funciona sem chave, usando fallback local.

Para ativar IA real:

1. Crie uma conta em `https://platform.openai.com/`.
2. Abra o painel de API keys.
3. Crie uma chave de API.
4. Copie `.env.example` para `.env`.
5. Preencha:

```text
OPENAI_API_KEY="sua_chave_aqui"
OPENAI_MODEL="gpt-5.4-mini"
```

Nunca commitar `.env`.

## Custo

A API da OpenAI e cobrada por uso. O valor depende do modelo e da quantidade de tokens de entrada/saida.

Para desenvolvimento, use um modelo menor e configure limites de gasto no painel da OpenAI.
