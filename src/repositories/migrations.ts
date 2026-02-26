import { database } from './database';

export function runMigrations(): void {
  // Tabela items (somente leitura, seed pelo dev)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT,
      rarity TEXT NOT NULL,
      history TEXT,
      myths TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela characters (sincronizada do Firestore)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_token TEXT,
      name TEXT NOT NULL,
      world TEXT,
      vocation TEXT,
      level INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_highlighted INTEGER DEFAULT 0,
      highlight_until TEXT,
      story_title TEXT,
      story_content TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela user_config (chave-valor)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS user_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed de itens (somente se tabela estiver vazia)
  seedItemsIfEmpty();
}

function seedItemsIfEmpty(): void {
  const result = database.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM items',
  );
  if (result && result.count > 0) return;

  const seedItems: { name: string; rarity: string; history: string; myths: string }[] = [
    {
      name: 'Golden Armor',
      rarity: 'Legendary',
      history: `A Golden Armor é um dos itens mais lendários de toda a história de Tibia. Forjada nos tempos antigos pelos ferreiros dos deuses, dizem que apenas três exemplares foram criados.\n\nO primeiro relato de uma Golden Armor apareceu no ano de 2003, quando um jogador de Antica afirmou tê-la obtido de um baú escondido nas profundezas de uma dungeon secreta. Porém, a CipSoft nunca confirmou oficialmente como o item entrava no jogo.\n\nPor muito tempo, a Golden Armor foi considerada o item mais valioso do jogo inteiro, com seu preço atingindo cifras astronômicas em negociações entre jogadores veteranos. Sua defesa não é a melhor do jogo, mas seu status de raridade a tornou um símbolo de prestígio absoluto.`,
      myths: `🔮 Mito do Baú Secreto: Muitos jogadores acreditavam que existia um baú escondido em uma sala secreta abaixo do templo de Thais, acessível apenas em noites de lua cheia no jogo. Nunca foi comprovado.\n\n🔮 Mito do NPC Esquecido: Uma lenda popular dizia que um NPC removido do jogo em 2002 vendia a Golden Armor por um preço absurdo de 100.000 gold coins. Alguns jogadores juram ter visto esse NPC, mas não há registros.\n\n🔮 Mito da Quest Impossível: Dizem que existia uma quest envolvendo 10 itens raros diferentes que, quando combinados em um ritual no Ferumbras' Citadel, gerariam uma Golden Armor. Jamais confirmado pela CipSoft.`,
    },
    {
      name: 'Magic Plate Armor',
      rarity: 'Rare',
      history: `A Magic Plate Armor (MPA) é uma das armaduras mais icônicas e desejadas de Tibia. Desde os primórdios do jogo, ela representou o auge do equipamento defensivo para cavaleiros.\n\nIntroduzida nas primeiras versões do jogo, a MPA era extremamente rara e só podia ser obtida como drop de criaturas muito poderosas como Demon e Dragon Lord. Na época, conseguir uma MPA era considerado um feito extraordinário.\n\nCom o passar dos anos e as atualizações do jogo, a MPA se tornou mais acessível, mas nunca perdeu seu status de item clássico. Para muitos jogadores veteranos, vestir uma MPA pela primeira vez é uma das memórias mais marcantes de sua jornada no Tibia.`,
      myths: `🔮 Mito da MPA Encantada: Alguns jogadores antigos contavam que existia uma versão "Enchanted Magic Plate Armor" com atributos superiores, dropad apenas por um Demon específico que aparecia uma vez por mês.\n\n🔮 Mito do Preço Original: Reza a lenda que no Tibia Beta, a MPA podia ser comprada de um NPC por apenas 500 gold coins, e os jogadores que a compraram naquela época ficaram milionários depois.`,
    },
    {
      name: "Ferumbras' Hat",
      rarity: 'Very Rare',
      history: `O Ferumbras' Hat é o chapéu do arquimago mais temido de Tibia: Ferumbras. Este item é obtido ao derrotar o próprio Ferumbras em sua cidadela, uma das batalhas mais épicas e difíceis do jogo.\n\nFerumbras é considerado o boss mais icônico de Tibia. Sua cidadela, localizada nas Zao Steppe, é um labirinto mortal repleto de criaturas poderosas. Derrotá-lo requer dezenas de jogadores bem equipados e coordenados.\n\nO chapéu em si não possui os melhores atributos do jogo, mas carrega consigo o prestígio de ter enfrentado e vencido o maior vilão de Tibia. É um troféu que poucos podem ostentar.`,
      myths: `🔮 Mito do Poder Oculto: Alguns jogadores acreditam que o Ferumbras' Hat possui um atributo secreto que aumenta o dano mágico em 5%, mas que não aparece nas estatísticas visíveis do item.\n\n🔮 Mito da Maldição: Uma lenda urbana diz que jogadores que equipam o Ferumbras' Hat por muito tempo começam a ter "azar" no jogo, sofrendo mais mortes e drops ruins. Seria a maldição do arquimago.\n\n🔮 Mito do Respawn Secreto: Dizem que existe uma forma de invocar Ferumbras fora de sua cidadela, usando uma combinação secreta de itens no altar de Kazordoon.`,
    },
    {
      name: 'Thunder Hammer',
      rarity: 'Legendary',
      history: `O Thunder Hammer é uma das armas mais raras e poderosas já vistas em Tibia. Pouquíssimas unidades existem em todos os servidores combinados, tornando-a uma verdadeira relíquia.\n\nA arma teria sido criada pelos deuses do trovão como instrumento de destruição. Seu poder é tão grande que dizem que cada golpe ecoa como um trovão pelas terras de Tibia.\n\nHistoricamente, o Thunder Hammer apareceu em circulação em poucos servidores antigos, e as negociações por ele envolveram quantias absurdas de gold e até mesmo trocas por contas inteiras.`,
      myths: `🔮 Mito do Drop Removido: A crença mais popular é que o Thunder Hammer era drop de uma criatura que foi removida do jogo, e por isso não há mais formas de obtê-lo.\n\n🔮 Mito do Ferreiro Celestial: Uma lenda conta que existe um NPC ferreiro escondido acima das nuvens de Tibia que pode forjar o Thunder Hammer se você trouxer 3 relâmpagos cristalizados — itens que ninguém jamais encontrou.`,
    },
    {
      name: 'Blessed Shield',
      rarity: 'Legendary',
      history: `O Blessed Shield é considerado por muitos como o escudo definitivo de Tibia. Com a maior defesa do jogo entre os escudos, ele é o sonho de todo cavaleiro.\n\nSua origem remonta às primeiras eras de Tibia, quando os deuses abençoaram um escudo comum com poder divino para proteger os heróis mortais das forças do mal. Apenas os guerreiros mais dignos poderiam empunhá-lo.\n\nExistem apenas alguns Blessed Shields em circulação nos servidores mais antigos, e cada um deles carrega uma história rica de negociações, disputas e aventuras.`,
      myths: `🔮 Mito da Benção Divina: Jogadores acreditavam que para obter o Blessed Shield era necessário completar uma quest secreta envolvendo todos os templos de Tibia, rezando em cada altar em uma ordem específica.\n\n🔮 Mito do Escudo Indestrutível: Uma lenda diz que o Blessed Shield nunca perde durabilidade e que, se dropado no chão, ele não desaparece — ficando ali para sempre até alguém pegá-lo.`,
    },
    {
      name: 'Demon Helmet',
      rarity: 'Rare',
      history: `O Demon Helmet é um dos capacetes mais desejados de Tibia, obtido como drop dos temíveis Demons. Forjado nas profundezas do inferno, este capacete carrega a essência das criaturas mais malignas do jogo.\n\nNos primórdios de Tibia, encontrar um Demon era uma experiência aterrorizante. Poucos jogadores tinham nível e equipamento para enfrentá-los, e conseguir um Demon Helmet como drop era motivo de celebração em todo o servidor.\n\nO design do capacete, com seus chifres demoníacos, tornou-se um ícone visual do jogo e é instantaneamente reconhecível por qualquer jogador de Tibia.`,
      myths: `🔮 Mito do Set Completo: Dizem que se um jogador equipar todos os itens "Demon" ao mesmo tempo (Helmet, Armor, Legs), ele recebe um buff secreto de resistência a fogo de 50%.\n\n🔮 Mito do Demon King: Uma lenda fala de um Demon King escondido no nível mais profundo do inferno de Tibia que sempre dropa um Demon Helmet quando derrotado, mas ninguém conseguiu chegar até ele.`,
    },
    {
      name: 'Horned Helmet',
      rarity: 'Legendary',
      history: `O Horned Helmet é um dos itens mais antigos e raros de Tibia. Sua existência data dos primeiros anos do jogo, quando Tibia ainda era um mundo pequeno e misterioso.\n\nEste capacete viking com chifres imponentes é um símbolo de uma era perdida de Tibia. Pouquíssimos existem, e cada um é tratado como uma peça de museu virtual.\n\nA história do Horned Helmet está entrelaçada com a história dos primeiros jogadores de Tibia, aqueles que desbravaram o mundo quando tudo era novo e desconhecido.`,
      myths: `🔮 Mito do Viking Fantasma: Jogadores contam que em certas noites, um NPC fantasma de um guerreiro viking aparece nas ruínas ao norte de Carlin e oferece o Horned Helmet em troca de uma quest que ninguém conseguiu completar.\n\n🔮 Mito da Ilha Perdida: Existe uma suposta ilha inacessível no mapa de Tibia onde todos os itens removidos do jogo ficam guardados, incluindo o Horned Helmet em abundância.`,
    },
    {
      name: 'Warlord Sword',
      rarity: 'Rare',
      history: `A Warlord Sword foi durante muitos anos a espada mais poderosa de Tibia. Todo guerreiro sonhava em empunhar esta arma lendária que representava o auge do poder bélico.\n\nObtida como drop raro de criaturas poderosas, a Warlord Sword era sinônimo de status e poder. Jogadores que a possuíam eram respeitados e temidos em igual medida.\n\nCom as atualizações do jogo, novas armas mais fortes foram introduzidas, mas a Warlord Sword mantém seu lugar no panteão dos itens clássicos de Tibia como um símbolo de uma era dourada.`,
      myths: `🔮 Mito da Forja Ancestral: Dizia-se que era possível forjar uma Warlord Sword usando 100 Demon Bones, 50 Dragon Scales e um Ruby Necklace no forno da Kazordoon. Ninguém jamais conseguiu.\n\n🔮 Mito do Dano Secreto: Alguns jogadores veteranos juravam que a Warlord Sword causava dano extra contra dragões, um atributo oculto que não aparecia nas estatísticas.`,
    },
    {
      name: 'Dragon Scale Mail',
      rarity: 'Rare',
      history: `A Dragon Scale Mail é uma armadura forjada a partir das escamas de dragões ancestrais. Cada escama foi cuidadosamente selecionada e encaixada por mestres ferreiros para criar uma proteção quase impenetrável.\n\nEsta armadura representa a combinação perfeita entre a força bruta dos dragões e a habilidade artesanal dos mortais. Sua resistência ao fogo é lendária, e dizem que o portador pode sentir o calor das escamas pulsando como se a armadura estivesse viva.\n\nNos servidores mais antigos, a Dragon Scale Mail era considerada a melhor armadura para enfrentar dragões, criando um ciclo poético: usar a força dos dragões contra eles mesmos.`,
      myths: `🔮 Mito do Dragão Ancestral: Uma lenda diz que se você equipar a Dragon Scale Mail e visitar o covil do Grande Dragão sob as montanhas de Edron, ele não te atacará por reconhecer as escamas de seus ancestrais.\n\n🔮 Mito da Armadura Viva: Alguns jogadores relataram que a Dragon Scale Mail "esquenta" quando há um dragão por perto, servindo como um detector natural dessas criaturas.`,
    },
    {
      name: 'Great Shield',
      rarity: 'Very Rare',
      history: `O Great Shield é um escudo massivo e impressionante, feito para os guerreiros mais robustos de Tibia. Seu tamanho é tão grande que dizem que pode abrigar um halfling inteiro atrás dele.\n\nEste escudo foi forjado em uma era em que os conflitos eram resolvidos em batalhas monumentais entre exércitos. Os generais mais poderosos empunhavam Great Shields como símbolo de sua autoridade no campo de batalha.\n\nHoje, o Great Shield é um item de colecionador, valorizado tanto por sua defesa excepcional quanto por sua raridade nos servidores ativos.`,
      myths: `🔮 Mito do Escudo dos Gigantes: Dizem que o Great Shield foi originalmente feito para ser usado por gigantes, e que uma versão ainda maior — o "Colossal Shield" — existe escondida em algum lugar do jogo.\n\n🔮 Mito da Muralha Viva: Uma lenda conta que se quatro cavaleiros com Great Shields ficarem em formação quadrada, eles criam uma barreira mágica que bloqueia todos os projéteis.`,
    },
    {
      name: 'Pair of Soft Boots',
      rarity: 'Rare',
      history: `As Soft Boots são um dos itens mais funcionais e desejados de Tibia. Diferente de outros itens raros que são valorizados pela defesa ou ataque, as Soft Boots são especiais pela sua habilidade de regenerar mana automaticamente.\n\nIntroduzidas como um item revolucionário, as Soft Boots mudaram completamente a forma como magos jogavam Tibia. A regeneração constante de mana permitia sessões de caça muito mais longas e eficientes.\n\nAs Soft Boots se tornaram parte essencial do kit de qualquer mago sério, e sua demanda sempre esteve entre as mais altas do jogo.`,
      myths: `🔮 Mito das Soft Boots Infinitas: Alguns jogadores acreditavam que existia uma versão especial das Soft Boots que nunca perdia carga, supostamente obtida completando uma quest secreta em Ab'Dendriel.\n\n🔮 Mito do Sapateiro Élfico: Uma lenda fala de um NPC sapateiro élfico escondido que pode "melhorar" suas Soft Boots para regenerar tanto vida quanto mana, mas cobrava 1 milhão de gold pelo serviço.`,
    },
    {
      name: 'Winged Helmet',
      rarity: 'Legendary',
      history: `O Winged Helmet é uma das peças mais raras e misteriosas de Tibia. Com suas asas decorativas, este capacete evoca a imagem dos mensageiros dos deuses — rápidos, divinos e inalcançáveis.\n\nApenas um punhado de Winged Helmets existe nos servidores de Tibia, e cada um deles carrega décadas de história. As transações envolvendo este item movimentaram fortunas e geraram disputas memoráveis.\n\nPara muitos, o Winged Helmet é o item que melhor representa a essência de Tibia: mistério, raridade e a eterna busca por algo que poucos jamais alcançarão.`,
      myths: `🔮 Mito do Voo: A crença mais persistente é que o Winged Helmet originalmente permitia ao jogador voar sobre o mapa, mas essa habilidade foi removida por ser "overpowered demais".\n\n🔮 Mito de Hermes: Dizem que se equipar o Winged Helmet junto com Boots of Haste, o jogador se move mais rápido do que qualquer montaria do jogo — quase invisível pelo mapa.`,
    },
  ];

  for (const item of seedItems) {
    database.runSync(
      'INSERT INTO items (name, rarity, history, myths) VALUES (?, ?, ?, ?)',
      [item.name, item.rarity, item.history, item.myths],
    );
  }
}
