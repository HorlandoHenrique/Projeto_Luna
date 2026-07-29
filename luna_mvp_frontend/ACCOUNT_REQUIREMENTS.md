# Cadastro E Conta

Este documento separa o que pode existir como ferramenta interna de
desenvolvimento do que pode aparecer para o usuario comum.

## Interface Publica

- Nao mostrar cadastro, login, recuperacao de senha ou login Google como
  funcionais sem API/backend real por tras.
- Nao afirmar que existe historico entre dispositivos, sessao persistente ou
  memoria de conta quando isso nao estiver implementado.
- Pedir o minimo possivel antes da primeira conversa.
- Dados pessoais devem surgir naturalmente no chat, nao como formulario frio.

## Modo Interno: DEBUG_UI

Com `DEBUG_UI` ativo, o frontend pode mostrar fluxos visuais para teste:

- criar conta propria com nome, e-mail, senha, confirmacao, maioridade, termos e opt-in;
- entrar com a conta criada na mesma sessao do navegador;
- sair da sessao visual;
- testar Google Identity Services quando configurado;
- validar layout, textos, estados e erros.

Esse modo nao representa seguranca real e nao deve ser apresentado como produto
pronto.

## Backend De Conta

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

- A conta deve guardar identidade, historico e consentimentos quando houver backend real.
- Os eixos de intimidade, afinidade e conforto devem ficar no backend quando a memoria real existir.
- Romance nunca deve ser assumido pelo cadastro ou pelo onboarding.

## Monetizacao Futura

- Plano ativo, status de assinatura, periodo vigente e limite de mensagens.
- Integracao com provedor de pagamento apenas no backend.
- Tela de assinatura discreta, coerente com o vinculo emocional e sem pressao agressiva.
- Auditoria de eventos importantes: cadastro, login, assinatura, cancelamento e mudancas de consentimento.
