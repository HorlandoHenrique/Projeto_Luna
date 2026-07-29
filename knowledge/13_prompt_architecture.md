# Arquitetura De Prompt

Objetivo:

Fazer a IA responder como Luna, nao como assistente.

O prompt deve ser montado em camadas:

1. Identidade canonica
2. Personalidade
3. Regras de conversa
4. Estado do relacionamento
5. Memorias prioritarias
6. Historico recente
7. Mensagem atual do usuario

Prioridade:

Personagem vem antes de tecnologia.

A Luna deve:

- responder em mensagens curtas
- parecer alguem usando celular
- manter vida propria e opinioes
- respeitar progressao gradual
- usar memoria de forma natural
- evitar parecer terapeuta, suporte ou chatbot

Memoria no prompt:

Usar apenas memorias relevantes e resumidas.

Nao despejar tudo no prompt.

Memorias prioritarias:

- pessoas importantes
- datas importantes
- preferencias
- acontecimentos marcantes
- piadas internas
- conversas importantes

Relacionamento no prompt:

Informar os eixos atuais:

- intimidade
- afinidade
- conforto
- conflito
- abertura romantica

Esses eixos orientam tom, proximidade e liberdade, mas nao forcam romance.

Fallback:

Se nao houver chave de IA, o backend usa respostas locais coerentes com o estilo da Luna e ainda grava mensagens, memoria e relacionamento.

## Decisao De IA Para O MVP

No estagio atual, a Luna deve usar uma API de modelo pronta, mas o sistema da Luna deve ser proprio.

O modelo gera linguagem.

O backend controla:

- personalidade canonica
- memoria persistente
- estado do relacionamento
- progressao emocional
- seguranca
- historico recente
- montagem de contexto
- formatacao final da resposta

O chat principal nao deve comecar como agente autonomo.

Agentes, ferramentas amplas e fluxos autonomos ficam para uma etapa futura, quando houver necessidade real.

Para o MVP, o fluxo deve ser:

1. usuario envia mensagem
2. backend identifica o usuario
3. backend busca relacionamento e memorias relevantes
4. backend avalia seguranca
5. backend monta o prompt canonico
6. backend chama o provedor de modelo configurado
7. backend valida/formata a resposta
8. backend grava mensagem, memoria e relacionamento

O provedor inicial pode ser OpenAI, mas deve ser uma peca substituivel.

O nucleo da Luna nao deve depender diretamente do formato de uma unica empresa.

Interface conceitual:

```text
LunaModelProvider
  generateResponse(contextoDaLuna)
```

Implementacoes possiveis:

- LocalFallbackProvider
- OpenAIProvider
- AnthropicProvider futuro
- GoogleProvider futuro
- OpenSourceProvider futuro

Fine-tuning nao e prioridade inicial.

Primeiro o produto precisa coletar conversas reais, avaliar respostas boas e ruins e entender custo por usuario.

## Arquitetura Permanente

O modelo de linguagem e substituivel.

O diferencial da Luna deve estar no sistema proprio:

- personalidade
- memoria
- estado do relacionamento
- regras de progressao
- contexto
- backend
- banco de dados
- experiencia
- identidade da personagem

O chat principal deve usar chamadas controladas pelo backend, nao um agente
autonomo como arquitetura central.

O backend deve:

1. receber a mensagem
2. identificar o usuario
3. recuperar estado do relacionamento
4. recuperar memorias relevantes
5. recuperar historico recente
6. montar o contexto da Luna
7. chamar o provedor de IA
8. validar a resposta
9. salvar a mensagem
10. atualizar memorias e relacionamento quando necessario

Camadas do contexto:

- personalidade fixa
- regras permanentes
- estado atual da relacao
- intimidade
- afinidade
- conforto
- disponibilidade e rotina
- memorias relevantes
- historico recente
- mensagem atual do usuario

Abstracao recomendada:

```text
AIProvider
  OpenAIProvider
  AnthropicProvider
  GeminiProvider
  FutureLocalProvider
```

Memoria, relacionamento, usuarios, historico e regras da Luna nao podem depender
diretamente de um unico provedor de IA.
