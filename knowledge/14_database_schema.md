# Esquema De Banco

Banco inicial:

SQLite local via Prisma.

Motivo:

Permite desenvolver rapido, versionar schema e migrar depois para Postgres sem reescrever o produto.

Entidades iniciais:

User:

- cadastro proprio
- login Google
- nome exibido
- e-mail
- avatar
- preferencias de conta

Conversation:

- conversa principal do usuario com Luna
- historico persistente

Message:

- mensagens do usuario
- mensagens da Luna
- metadados de seguranca, tom e IA usada
- provedor/modelo usado na resposta, quando houver IA externa

Memory:

- memoria basica do usuario
- tipo
- rotulo
- conteudo resumido
- prioridade
- confianca
- mensagem de origem

RelationshipState:

- intimidade
- afinidade
- conforto
- confianca
- conflito
- abertura romantica
- contador de mensagens
- resumo do relacionamento

SafetyEvent:

- eventos de seguranca detectados
- tipo
- severidade
- trecho relevante

WaitlistEntry:

- lista de espera
- nome
- e-mail
- origem

SubscriptionIntent:

- intencao visual de assinatura
- plano
- metodo de pagamento
- status

Diretriz:

O banco deve preservar historico e continuidade sem transformar a Luna em memoria perfeita.

Detalhes triviais podem ser ignorados.

Dados importantes podem ser lembrados quando fizerem sentido para uma relacao humana.

## Evolucao Futura

O banco deve permitir trocar o provedor de modelo sem perder historico.

Metadados de mensagem podem registrar:

- provedor
- modelo
- id da resposta externa
- erro de IA, se houver fallback
- tom usado
- evento de seguranca associado

Isso ajuda a comparar custo, latencia e qualidade quando a Luna passar do fallback local para OpenAI ou outro provedor.

## Memoria E Provedor

A memoria pertence ao backend e ao banco de dados da Luna.

Nao depender da memoria nativa de um modelo ou plataforma externa.

O backend decide:

- o que lembrar
- o que esquecer
- o que recuperar
- quando atualizar
- quanto contexto enviar
- quais memorias sao relevantes para a conversa

O banco deve preservar historico, memorias e relacionamento de forma
independente do provedor de IA usado no momento.
