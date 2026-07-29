# Projeto Luna - Diretrizes para agentes

## Objetivo do produto

Luna e uma personagem virtual brasileira centrada em conversas naturais,
personalidade consistente, memoria seletiva e vinculo construido gradualmente.

A experiencia deve parecer centrada em uma personagem, nao em tecnologia.

## Direcao visual

- Humana, intima, cotidiana e contemporanea.
- Escura e quente, sem aparencia futurista.
- Poucos cards, poucas bordas e um unico tom de destaque.
- Evitar estetica generica de IA, dashboard, crypto, gamer ou SaaS corporativo.
- A Luna deve ser o principal elemento visual.
- Priorizar legibilidade, espaco e hierarquia.
- O site atual e desktop-first e responsivo; a experiencia principal deve ser
  planejada para desktop, mantendo boa adaptacao em tablets e celulares.

## Restricoes de produto

- Nao inventar funcionalidades.
- Nao afirmar que existe memoria quando ela nao estiver implementada.
- Nao afirmar que pagamentos ou assinaturas funcionam sem integracao real.
- Nao utilizar status online falso, visto por ultimo falso ou presenca falsa.
- Nao exibir indicador real de digitacao quando ele for apenas simulacao,
  exceto em modo interno de desenvolvimento.
- Nao incluir numeros falsos de usuarios, avaliacoes ou depoimentos.
- Nao esconder de maneira enganosa que Luna e uma personagem virtual.
- Nao exibir informacoes internas de beta, MVP ou simulacao na producao.
- Nao mostrar como funcional login, cadastro, recuperacao de senha,
  pagamento, assinatura, memoria persistente ou relacionamento calculado
  enquanto nao houver sistema real por tras.

## Publico vs desenvolvimento

- Separar completamente a experiencia publica da Luna das ferramentas internas.
- Informacoes tecnicas e simuladas devem ficar atras de `DEBUG_UI`.
- Com `DEBUG_UI` ativo, podem aparecer contadores, estado simulado, dados de
  relacionamento, memorias recuperadas, provedor de IA, erros, latencia e dados
  de sessao.
- Com `DEBUG_UI` desativado, essas informacoes nao devem aparecer para o
  usuario comum.
- O site deve permanecer privado ou com acesso controlado enquanto a conversa
  ainda nao representar fielmente a personalidade da Luna.

## Interface

- Desktop-first, responsiva e adaptada para dispositivos menores.
- HTML semantico.
- Acessivel por teclado.
- Respeitar `prefers-reduced-motion`.
- Evitar dependencias pesadas sem necessidade.
- Reutilizar componentes e tokens visuais.
- Nao reescrever arquivos inteiros quando uma refatoracao menor for suficiente.
- A interface nao deve parecer prototipo, painel administrativo, ferramenta de
  IA, dashboard de startup, SaaS corporativo, crypto, futurista ou gamer.

## Arquitetura

- O chat principal deve ser controlado pelo backend.
- O modelo de IA deve ser substituivel; o produto real e o sistema da Luna:
  personalidade, memoria, relacionamento, contexto, seguranca e experiencia.
- Nao usar agente autonomo como arquitetura central do chat no MVP.
- A chave de API nunca deve ser exposta no frontend.
- Memoria, relacionamento e historico pertencem ao backend e ao banco de dados
  da Luna, nao a memoria nativa de um provedor externo.

## Antes de implementar

1. Inspecionar a estrutura do projeto.
2. Identificar os arquivos relevantes.
3. Consultar `knowledge/` antes de alterar comportamento, visual ou canon.
4. Propor um plano curto.
5. Preservar o que ja funciona.
6. Implementar.
7. Verificar console, responsividade, interacoes e acessibilidade basica.

## Canonicos do projeto

Arquivos mais importantes:

- `knowledge/02_product.md`
- `knowledge/03_character_identity.md`
- `knowledge/04_visual_bible.md`
- `knowledge/05_personality_bible.md`
- `knowledge/06_relationship_system.md`
- `knowledge/08_conversation_rules.md`
- `knowledge/09_mvp_roadmap.md`
- `knowledge/13_prompt_architecture.md`
- `knowledge/18_post_master_updates.md`

Nao alterar sem decisao explicita:

- Aparencia canonica da Luna.
- Personalidade canonica.
- Sistema de intimidade, afinidade e conforto.
- Diretrizes de progressao emocional.
- Tom humano, brasileiro e nao assistencial.
- Rosto oficial, olhos, sardas, cabelo, tom moreno-claro quente e colar.

## Criterios de conclusao

- A mudanca respeita a Luna como personagem central.
- Nao cria funcao falsa para o usuario comum.
- Nao revela informacao interna fora de `DEBUG_UI`.
- Funciona em desktop, notebook, tablet e celular.
- Nao introduz erros de console.
- O que mudou foi informado claramente ao usuario.
