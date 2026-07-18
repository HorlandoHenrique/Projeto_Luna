# Cadastro e Conta

Este documento separa o que o MVP estatico pode simular agora do que precisa existir quando o Projeto Luna tiver backend real.

## Agora: MVP Frontend

- Criar conta propria do site com nome, e-mail, senha, confirmacao de senha, maioridade, aceite de termos/privacidade e opt-in de novidades.
- Entrar com a conta criada na mesma sessao do navegador.
- Manter a opcao de entrar com Google como alternativa.
- Mostrar estado logado no header com chip de usuario e acao de sair.
- Nao salvar senha em texto no navegador.
- Usar apenas verificador demonstrativo em `sessionStorage`, sem seguranca real.
- Nao criar usuario real, sessao real, banco de dados, pagamento real, IA ou memoria persistente.

## Proxima Fase: Backend De Conta

- Cadastro real com e-mail unico e senha hasheada no servidor.
- Verificacao de e-mail antes de liberar recursos sensiveis.
- Login com sessao segura em cookie `HttpOnly`, renovacao de sessao e logout em todos os dispositivos.
- Recuperacao de senha por e-mail com token temporario.
- Vinculo entre conta propria e provedores externos, como Google.
- Rate limit, protecao contra abuso e validacao server-side de todos os campos.

## Privacidade E Memoria

- Consentimento separado para memoria persistente da Luna.
- Historico de consentimentos com data, versao dos termos e origem.
- Exportacao e exclusao de dados da conta.
- Controles para apagar conversas, memorias e preferencias.
- Memoria imperfeita por design: a Luna deve reter o que importa emocionalmente sem parecer uma base de dados perfeita.

## Relacionamento E Produto

- O cadastro deve pedir o minimo necessario antes da primeira conversa.
- Dados mais pessoais devem surgir naturalmente no chat, nao como formulario frio.
- A conta deve guardar identidade, limites de mensagens, assinatura, historico e consentimentos.
- Os eixos de intimidade, afinidade e conforto devem ficar no backend quando a memoria real existir.
- Romance nunca deve ser assumido pelo cadastro ou pelo onboarding.

## Monetizacao Futura

- Plano ativo, status de assinatura, periodo vigente e limite de mensagens.
- Integracao com provedor de pagamento apenas no backend.
- Tela de assinatura discreta, coerente com o vinculo emocional e sem pressao agressiva.
- Auditoria de eventos importantes: cadastro, login, assinatura, cancelamento e mudancas de consentimento.
