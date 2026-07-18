# Assinatura e Pagamento

Este documento separa o espaco de assinatura visual do MVP do que precisa existir quando o Projeto Luna validar pagamento real.

## Agora: MVP Frontend

- Abrir um espaco de assinatura ao clicar em `Assinar` ou no botao premium.
- Mostrar planos mensal e anual.
- Aceitar visualmente cartao de credito e Pix.
- Validar campos obrigatorios no navegador.
- Marcar assinatura de teste ativa apenas na sessao do navegador.
- Nao processar pagamento real.
- Nao enviar dados para servidor.
- Nao salvar numero de cartao, CVV, CPF ou dados de Pix.

## Campos Do MVP

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
