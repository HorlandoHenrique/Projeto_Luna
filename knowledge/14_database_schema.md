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
