# Assinatura E Pagamento

Este documento separa o que pode existir em desenvolvimento interno do que pode
aparecer para o usuario comum.

## Interface Publica

Enquanto pagamentos nao estiverem funcionando, remover da interface publica:

- Assinar;
- Comprar plano;
- lista premium apresentada como assinatura;
- precos ficticios;
- planos sem integracao;
- beneficios que ainda nao existem.

A monetizacao deve aparecer apenas depois que o usuario percebeu valor, existe
limite real ou ha intencao clara de continuidade.

## Modo Interno: DEBUG_UI

Com `DEBUG_UI` ativo, o frontend pode manter um fluxo visual para testar:

- modal de assinatura;
- escolha de plano;
- campos de cartao;
- campos de Pix;
- validacao visual;
- intencao de assinatura.

Esse fluxo nao processa pagamento real e nao deve ser mostrado como produto
pronto.

## Campos De Teste Interno

Cartao:

- nome no cartao;
- numero do cartao;
- validade;
- CVV;
- CPF do titular.

Pix:

- nome;
- e-mail;
- CPF;
- codigo copia e cola visual.

## Backend Futuro

- Integrar provedor de pagamento real com checkout seguro.
- Criar cliente, assinatura, fatura, metodo de pagamento e eventos de webhook.
- Confirmar status do pagamento no servidor antes de liberar limites premium.
- Guardar apenas identificadores seguros do provedor, nunca dados completos de cartao.
- Suportar pagamento aprovado, pendente, recusado, vencido, cancelado e estornado.
- Implementar nota fiscal, renovacao, cancelamento e troca de plano quando necessario.

## Produto E Relacao

- A assinatura deve ser discreta, sem pressao agressiva.
- A oferta deve reforcar continuidade da conversa, nao prometer romance.
- Premium pode liberar mais mensagens, prioridade em testes e recursos futuros de memoria.
- Memoria persistente premium deve exigir consentimento separado.
