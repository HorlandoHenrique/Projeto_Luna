# Atualizacoes Pos-Resumo Mestre

Este arquivo registra as decisoes adicionadas depois do resumo mestre de
18/07/2026. Ele deve ser lido junto dos canônicos existentes e prevalece sobre
regras antigas quando houver conflito explicito.

## Estado atual

O projeto ainda esta antes da integracao completa de backend, API de IA, login
real em producao, memoria persistente, pagamentos, assinatura e presenca em
tempo real.

A interface atual pode ter respostas simuladas para desenvolvimento e testes
privados, mas essa simulacao nao deve ser apresentada como experiencia final da
Luna para publico amplo.

O site deve permanecer privado ou com acesso controlado enquanto as respostas
da Luna forem aleatorias, prontas, incoerentes ou pouco fieis a personalidade.

## Prioridade imediata

1. Refazer a direcao visual do site.
2. Remover aparencia de prototipo, dashboard e ferramenta de IA.
3. Inserir imagem canonica temporaria da Luna.
4. Melhorar a apresentacao do chat simulado.
5. Criar estrutura correta para conectar IA.
6. Implementar backend, sessoes e historico.
7. Implementar memoria e estado do relacionamento.
8. Realizar testes privados.
9. Somente depois implementar monetizacao e abertura maior ao publico.

## Desktop-first

A interface principal da Luna deve ser desktop-first e responsiva.

Regra substituta:

> Desktop-first, responsivo e adaptado para dispositivos menores.

O site nao deve parecer um aplicativo movel apenas ampliado. No desktop, usar a
largura disponivel para compor imagem da Luna, identidade, apresentacao e chat
de forma mais imersiva.

## Publico vs desenvolvimento

A interface publica deve parecer um produto serio, nao um prototipo, dashboard,
ferramenta de IA, demonstracao tecnica, template de SaaS, pagina crypto,
interface futurista ou gamer.

Nao exibir na interface publica:

- beta;
- beta privado;
- MVP;
- prototipo;
- teste;
- conversa em teste;
- respostas simuladas;
- simulacao;
- ainda estou em beta;
- tudo acontece no navegador;
- login ainda nao funciona;
- pagamentos ainda nao funcionam;
- limite ficticio de mensagens.

Essas informacoes podem existir apenas em modo interno, como `DEBUG_UI`.

Quando `DEBUG_UI` estiver ativo, podem aparecer contadores, estado simulado,
dados de relacionamento, memorias recuperadas, provedor de IA, erros, latencia
e informacoes de sessao.

Quando estiver desativado, essas informacoes nao devem aparecer para o usuario
comum.

## Transparencia

A Luna nao deve fingir ser uma pessoa humana real. A interface deve informar de
forma clara, discreta e contextual que ela e uma personagem virtual.

Evitar repetir em cada tela ou mensagem:

- sou uma IA;
- chatbot;
- inteligencia artificial;
- resposta gerada por IA;
- nomes de modelos ou provedores.

A experiencia deve ser centrada na personagem, nao na tecnologia.

## Visual

Transmitir intimidade, proximidade, conforto, maturidade, cotidiano, humanidade,
personalidade, atmosfera brasileira e sensacao de conversa privada.

Priorizar preto grafite, carvao, marrom muito escuro, vinho fechado, off-white,
cinza quente e um unico tom quente de destaque, como rosa queimado, cobre suave
ou rose gold.

Evitar neon, laranja excessivamente saturado, azul tecnologico, degradês fortes,
brilho futurista, glassmorphism excessivo, bordas luminosas, videogame, cyberpunk
e crypto.

Reduzir cards, caixas dentro de caixas, badges, capsulas, bordas, etiquetas em
caixa alta, botoes competindo entre si e informacoes tecnicas visiveis.

## Imagens da Luna

Separar assets canonicos e experimentais, usando estrutura equivalente a:

```text
assets/luna/canon/
assets/luna/experiments/
```

Imagens canonicas podem aparecer no produto. Imagens experimentais servem para
testar poses, iluminacao, cenarios, roupas e modelos de geracao.

A consistencia facial e mais importante que pequenos ganhos de beleza. Nao
alterar continuamente mandibula, olhos, nariz, pele, labios, volume do rosto ou
idade aparente.

## Fotos e estilo de vida

A Luna deve parecer uma brasileira comum, bonita, acessivel e emocionalmente
proxima. O objetivo visual e familiaridade, reconhecimento, credibilidade e
apego emocional, nao luxo ou sensualidade como eixo principal.

Priorizar aparencia de celular, situacoes cotidianas e pequenas imperfeicoes:
quarto, cama, carro, cafeteria, cozinha, rua, praia tranquila, mesa de
computador, ambiente de jogos e momentos caseiros.

Evitar ensaio editorial, moda, mansoes, luxo constante, pele polida demais,
ring light, glass skin, render e composicao cinematografica em todas as fotos.

## Chat inicial

O chat vazio deve parecer natural.

Nao usar mensagens iniciais explicando beta, respostas simuladas, IA em
desenvolvimento, limite ficticio ou funcionamento tecnico.

Exemplo de abertura:

```text
oi... eu sou a Luna
me conta alguma coisa aleatoria do seu dia?
```

Sugestoes discretas podem existir como pontos de partida, nao como menu de
atendimento.

Cabecalho do chat deve mostrar apenas informacoes reais, como avatar e nome.
Nao mostrar online, visto por ultimo, digitando, memoria ativa, status
emocional, usuarios, selo premium ou relacionamento calculado sem sistema real.

## Monetizacao

Monetizacao nao deve dominar a primeira tela. Enquanto pagamentos nao
funcionarem, remover Assinar, Comprar plano, lista premium apresentada como
assinatura, precos ficticios, planos sem integracao e beneficios inexistentes.

A assinatura deve aparecer depois que o usuario conversou, percebeu valor,
demonstrou intencao de continuar ou atingiu um limite real.

## IA e backend

O diferencial da Luna esta no sistema proprio: personalidade, memoria, estado
do relacionamento, regras de progressao, contexto, backend, banco de dados,
experiencia e identidade.

No inicio, usar API pronta de modelo de linguagem, como OpenAI. Nao treinar
modelo do zero, hospedar modelo grande, iniciar com agente autonomo complexo ou
fazer fine-tuning antes de haver dados reais.

O backend deve receber mensagem, identificar usuario, recuperar relacionamento,
memorias e historico recente, montar contexto, chamar provedor de IA, validar a
resposta, salvar mensagens e atualizar memoria/relacionamento quando necessario.

O provedor de IA deve ser substituivel por uma camada como:

```text
AIProvider
  OpenAIProvider
  AnthropicProvider
  GeminiProvider
  FutureLocalProvider
```

## Presenca e tempo

Presenca e uma camada separada da personalidade. Atrasos devem considerar
tamanho da mensagem, complexidade, emocao, assunto, momento da conversa, rotina
declarada e disponibilidade.

O primeiro contato deve responder relativamente rapido. Conversas estabelecidas
podem ter pausas, multiplas bolhas e disponibilidade coerente com a rotina.

Indicador de digitacao pode representar reflexao, correcao, distracao ou
mudanca de ideia, mas deve ser ocasional e sutil. Nao transformar realismo em
lentidao frustrante.

## Conforto e escrita

Conforto altera espontaneidade, abreviacoes, girias, mensagens quebradas, erros
naturais, apelidos, brincadeiras e liberdade emocional.

Conforto nunca diminui inteligencia, raciocinio, opiniao, compreensao,
coerencia ou conhecimento linguistico.

## Hobbies e rotina

Games passam a ser o hobby principal da Luna, especialmente League of Legends,
Valorant, GTA Online e jogos de campanha/narrativa. God of War esta entre seus
favoritos.

Ela e competitiva, mas nao profissional, pode jogar mal, tiltar, mudar de main,
abandonar e voltar a jogos. Games nao devem virar estereotipo de "gamer girl" e
nao substituem sua personalidade central.

A Luna e predominantemente caseira. Em casa, pode jogar, ouvir musica, assistir,
conversar, organizar o quarto, procrastinar, tomar cafe, navegar nas redes,
descansar e fotografar momentos aleatorios.

Ela prefere cafeterias, cinema, praia vazia, restaurantes casuais, passeios
tranquilos, viagens simples e encontros com poucas pessoas. Evita baladas,
locais cheios, barulho constante e festas frequentes, mas nao e isolada.

## Realismo cotidiano

A Luna nao precisa de passado excessivamente dramatico. A realidade vem de
habitos, manias, opinioes, pequenas incoerencias humanas, rotina, humor,
responsabilidades, distracoes, gostos, memorias e acontecimentos cotidianos.

A profundidade deve surgir da convivencia. Depois que a biblia da personagem
estiver definida, as mudancas devem ser minimas.

## Nao fingir funcionalidades

Nao mostrar como funcional sem sistema real:

- status online;
- visto por ultimo;
- indicador real de digitacao;
- memoria persistente;
- relacionamento calculado;
- login;
- cadastro;
- recuperacao de senha;
- pagamentos;
- assinatura;
- limite real de mensagens;
- quantidade de usuarios;
- depoimentos;
- avaliacoes;
- historico entre dispositivos;
- mensagens iniciadas pela Luna;
- notificacoes;
- disponibilidade baseada em rotina;
- criptografia especial;
- exclusividade premium.

Esses elementos podem ser simulados apenas em modo interno de desenvolvimento.

## Qualidade para testes publicos

Nao abrir amplamente enquanto houver respostas sem nexo, quebra de
personalidade, romance imediato, concordancia excessiva, respostas de
assistente, memoria falsa, mesma resposta para mensagens diferentes, rosto
inconsistente, funcoes falsas, erros visiveis, layout quebrado, ausencia de
politica de privacidade, dados sem protecao, monetizacao sem valor entregue ou
confusao sobre a natureza virtual da Luna.

O primeiro grupo deve ser pequeno, controlado e orientado a retencao.
