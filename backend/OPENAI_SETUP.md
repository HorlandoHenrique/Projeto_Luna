# OpenAI Setup

O backend da Luna funciona sem chave, usando fallback local.

A Luna nao deve depender diretamente de um provedor especifico. O backend usa uma camada interna de provedor de modelo:

- `local`: respostas locais de MVP, sem custo de API;
- `openai`: chamada normal pela Responses API, sem agente autonomo no chat principal.

Para ativar IA real:

1. Crie uma conta em `https://platform.openai.com/`.
2. Abra o painel de API keys.
3. Crie uma chave de API.
4. Copie `.env.example` para `.env`.
5. Preencha:

```text
LUNA_MODEL_PROVIDER="openai"
OPENAI_API_KEY="sua_chave_aqui"
OPENAI_MODEL="gpt-5.6-luna"
OPENAI_MAX_OUTPUT_TOKENS=220
```

Nunca commitar `.env`.

Para voltar ao modo sem custo:

```text
LUNA_MODEL_PROVIDER="local"
OPENAI_API_KEY=""
```

## Custo

A API da OpenAI e cobrada por uso. O valor depende do modelo e da quantidade de tokens de entrada/saida.

Para desenvolvimento, use um modelo eficiente e configure limites de gasto no painel da OpenAI.

Pela documentacao atual da OpenAI, `gpt-5.6-luna` e indicado para workloads eficientes e de alto volume, enquanto `gpt-5.6-terra` equilibra custo e qualidade e `gpt-5.6-sol` prioriza capacidade maxima.
