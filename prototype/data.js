/* ============================================================
   TIBIA STORIES — DADOS MOCKADOS DO PROTÓTIPO
   ============================================================ */

// Token do usuário mockado
const USER_TOKEN = 'TS-f47ac10b-58cc';

// ===== ITENS RAROS =====
const ITEMS = [
    {
        id: 1,
        name: 'Golden Armor',
        emoji: '🛡️',
        rarity: 'Legendary',
        history: `A Golden Armor é um dos itens mais lendários de toda a história de Tibia. Forjada nos tempos antigos pelos ferreiros dos deuses, dizem que apenas três exemplares foram criados.

O primeiro relato de uma Golden Armor apareceu no ano de 2003, quando um jogador de Antica afirmou tê-la obtido de um baú escondido nas profundezas de uma dungeon secreta. Porém, a CipSoft nunca confirmou oficialmente como o item entrava no jogo.

Por muito tempo, a Golden Armor foi considerada o item mais valioso do jogo inteiro, com seu preço atingindo cifras astronômicas em negociações entre jogadores veteranos. Sua defesa não é a melhor do jogo, mas seu status de raridade a tornou um símbolo de prestígio absoluto.`,
        myths: `🔮 Mito do Baú Secreto: Muitos jogadores acreditavam que existia um baú escondido em uma sala secreta abaixo do templo de Thais, acessível apenas em noites de lua cheia no jogo. Nunca foi comprovado.

🔮 Mito do NPC Esquecido: Uma lenda popular dizia que um NPC removido do jogo em 2002 vendia a Golden Armor por um preço absurdo de 100.000 gold coins. Alguns jogadores juram ter visto esse NPC, mas não há registros.

🔮 Mito da Quest Impossível: Dizem que existia uma quest envolvendo 10 itens raros diferentes que, quando combinados em um ritual no Ferumbras' Citadel, gerariam uma Golden Armor. Jamais confirmado pela CipSoft.`
    },
    {
        id: 2,
        name: 'Magic Plate Armor',
        emoji: '⚔️',
        rarity: 'Rare',
        history: `A Magic Plate Armor (MPA) é uma das armaduras mais icônicas e desejadas de Tibia. Desde os primórdios do jogo, ela representou o auge do equipamento defensivo para cavaleiros.

Introduzida nas primeiras versões do jogo, a MPA era extremamente rara e só podia ser obtida como drop de criaturas muito poderosas como Demon e Dragon Lord. Na época, conseguir uma MPA era considerado um feito extraordinário.

Com o passar dos anos e as atualizações do jogo, a MPA se tornou mais acessível, mas nunca perdeu seu status de item clássico. Para muitos jogadores veteranos, vestir uma MPA pela primeira vez é uma das memórias mais marcantes de sua jornada no Tibia.`,
        myths: `🔮 Mito da MPA Encantada: Alguns jogadores antigos contavam que existia uma versão "Enchanted Magic Plate Armor" com atributos superiores, dropad apenas por um Demon específico que aparecia uma vez por mês.

🔮 Mito do Preço Original: Reza a lenda que no Tibia Beta, a MPA podia ser comprada de um NPC por apenas 500 gold coins, e os jogadores que a compraram naquela época ficaram milionários depois.`
    },
    {
        id: 3,
        name: 'Ferumbras\' Hat',
        emoji: '🎩',
        rarity: 'Very Rare',
        history: `O Ferumbras' Hat é o chapéu do arquimago mais temido de Tibia: Ferumbras. Este item é obtido ao derrotar o próprio Ferumbras em sua cidadela, uma das batalhas mais épicas e difíceis do jogo.

Ferumbras é considerado o boss mais icônico de Tibia. Sua cidadela, localizada nas Zao Steppe, é um labirinto mortal repleto de criaturas poderosas. Derrotá-lo requer dezenas de jogadores bem equipados e coordenados.

O chapéu em si não possui os melhores atributos do jogo, mas carrega consigo o prestígio de ter enfrentado e vencido o maior vilão de Tibia. É um troféu que poucos podem ostentar.`,
        myths: `🔮 Mito do Poder Oculto: Alguns jogadores acreditam que o Ferumbras' Hat possui um atributo secreto que aumenta o dano mágico em 5%, mas que não aparece nas estatísticas visíveis do item.

🔮 Mito da Maldição: Uma lenda urbana diz que jogadores que equipam o Ferumbras' Hat por muito tempo começam a ter "azar" no jogo, sofrendo mais mortes e drops ruins. Seria a maldição do arquimago.

🔮 Mito do Respawn Secreto: Dizem que existe uma forma de invocar Ferumbras fora de sua cidadela, usando uma combinação secreta de itens no altar de Kazordoon.`
    },
    {
        id: 4,
        name: 'Thunder Hammer',
        emoji: '🔨',
        rarity: 'Legendary',
        history: `O Thunder Hammer é uma das armas mais raras e poderosas já vistas em Tibia. Pouquíssimas unidades existem em todos os servidores combinados, tornando-a uma verdadeira relíquia.

A arma teria sido criada pelos deuses do trovão como instrumento de destruição. Seu poder é tão grande que dizem que cada golpe ecoa como um trovão pelas terras de Tibia.

Historicamente, o Thunder Hammer apareceu em circulação em poucos servidores antigos, e as negociações por ele envolveram quantias absurdas de gold e até mesmo trocas por contas inteiras.`,
        myths: `🔮 Mito do Drop Removido: A crença mais popular é que o Thunder Hammer era drop de uma criatura que foi removida do jogo, e por isso não há mais formas de obtê-lo.

🔮 Mito do Ferreiro Celestial: Uma lenda conta que existe um NPC ferreiro escondido acima das nuvens de Tibia que pode forjar o Thunder Hammer se você trouxer 3 relâmpagos cristalizados — itens que ninguém jamais encontrou.`
    },
    {
        id: 5,
        name: 'Blessed Shield',
        emoji: '🛡️',
        rarity: 'Legendary',
        history: `O Blessed Shield é considerado por muitos como o escudo definitivo de Tibia. Com a maior defesa do jogo entre os escudos, ele é o sonho de todo cavaleiro.

Sua origem remonta às primeiras eras de Tibia, quando os deuses abençoaram um escudo comum com poder divino para proteger os heróis mortais das forças do mal. Apenas os guerreiros mais dignos poderiam empunhá-lo.

Existem apenas alguns Blessed Shields em circulação nos servidores mais antigos, e cada um deles carrega uma história rica de negociações, disputas e aventuras.`,
        myths: `🔮 Mito da Benção Divina: Jogadores acreditavam que para obter o Blessed Shield era necessário completar uma quest secreta envolvendo todos os templos de Tibia, rezando em cada altar em uma ordem específica.

🔮 Mito do Escudo Indestrutível: Uma lenda diz que o Blessed Shield nunca perde durabilidade e que, se dropado no chão, ele não desaparece — ficando ali para sempre até alguém pegá-lo.`
    },
    {
        id: 6,
        name: 'Demon Helmet',
        emoji: '👹',
        rarity: 'Rare',
        history: `O Demon Helmet é um dos capacetes mais desejados de Tibia, obtido como drop dos temíveis Demons. Forjado nas profundezas do inferno, este capacete carrega a essência das criaturas mais malignas do jogo.

Nos primórdios de Tibia, encontrar um Demon era uma experiência aterrorizante. Poucos jogadores tinham nível e equipamento para enfrentá-los, e conseguir um Demon Helmet como drop era motivo de celebração em todo o servidor.

O design do capacete, com seus chifres demoníacos, tornou-se um ícone visual do jogo e é instantaneamente reconhecível por qualquer jogador de Tibia.`,
        myths: `🔮 Mito do Set Completo: Dizem que se um jogador equipar todos os itens "Demon" ao mesmo tempo (Helmet, Armor, Legs), ele recebe um buff secreto de resistência a fogo de 50%.

🔮 Mito do Demon King: Uma lenda fala de um Demon King escondido no nível mais profundo do inferno de Tibia que sempre dropa um Demon Helmet quando derrotado, mas ninguém conseguiu chegar até ele.`
    },
    {
        id: 7,
        name: 'Horned Helmet',
        emoji: '🪖',
        rarity: 'Legendary',
        history: `O Horned Helmet é um dos itens mais antigos e raros de Tibia. Sua existência data dos primeiros anos do jogo, quando Tibia ainda era um mundo pequeno e misterioso.

Este capacete viking com chifres imponentes é um símbolo de uma era perdida de Tibia. Pouquíssimos existem, e cada um é tratado como uma peça de museu virtual.

A história do Horned Helmet está entrelaçada com a história dos primeiros jogadores de Tibia, aqueles que desbravaram o mundo quando tudo era novo e desconhecido.`,
        myths: `🔮 Mito do Viking Fantasma: Jogadores contam que em certas noites, um NPC fantasma de um guerreiro viking aparece nas ruínas ao norte de Carlin e oferece o Horned Helmet em troca de uma quest que ninguém conseguiu completar.

🔮 Mito da Ilha Perdida: Existe uma suposta ilha inacessível no mapa de Tibia onde todos os itens removidos do jogo ficam guardados, incluindo o Horned Helmet em abundância.`
    },
    {
        id: 8,
        name: 'Warlord Sword',
        emoji: '⚔️',
        rarity: 'Rare',
        history: `A Warlord Sword foi durante muitos anos a espada mais poderosa de Tibia. Todo guerreiro sonhava em empunhar esta arma lendária que representava o auge do poder bélico.

Obtida como drop raro de criaturas poderosas, a Warlord Sword era sinônimo de status e poder. Jogadores que a possuíam eram respeitados e temidos em igual medida.

Com as atualizações do jogo, novas armas mais fortes foram introduzidas, mas a Warlord Sword mantém seu lugar no panteão dos itens clássicos de Tibia como um símbolo de uma era dourada.`,
        myths: `🔮 Mito da Forja Ancestral: Dizia-se que era possível forjar uma Warlord Sword usando 100 Demon Bones, 50 Dragon Scales e um Ruby Necklace no forno da Kazordoon. Ninguém jamais conseguiu.

🔮 Mito do Dano Secreto: Alguns jogadores veteranos juravam que a Warlord Sword causava dano extra contra dragões, um atributo oculto que não aparecia nas estatísticas.`
    },
    {
        id: 9,
        name: 'Dragon Scale Mail',
        emoji: '🐉',
        rarity: 'Rare',
        history: `A Dragon Scale Mail é uma armadura forjada a partir das escamas de dragões ancestrais. Cada escama foi cuidadosamente selecionada e encaixada por mestres ferreiros para criar uma proteção quase impenetrável.

Esta armadura representa a combinação perfeita entre a força bruta dos dragões e a habilidade artesanal dos mortais. Sua resistência ao fogo é lendária, e dizem que o portador pode sentir o calor das escamas pulsando como se a armadura estivesse viva.

Nos servidores mais antigos, a Dragon Scale Mail era considerada a melhor armadura para enfrentar dragões, criando um ciclo poético: usar a força dos dragões contra eles mesmos.`,
        myths: `🔮 Mito do Dragão Ancestral: Uma lenda diz que se você equipar a Dragon Scale Mail e visitar o covil do Grande Dragão sob as montanhas de Edron, ele não te atacará por reconhecer as escamas de seus ancestrais.

🔮 Mito da Armadura Viva: Alguns jogadores relataram que a Dragon Scale Mail "esquenta" quando há um dragão por perto, servindo como um detector natural dessas criaturas.`
    },
    {
        id: 10,
        name: 'Great Shield',
        emoji: '🛡️',
        rarity: 'Very Rare',
        history: `O Great Shield é um escudo massivo e impressionante, feito para os guerreiros mais robustos de Tibia. Seu tamanho é tão grande que dizem que pode abrigar um halfling inteiro atrás dele.

Este escudo foi forjado em uma era em que os conflitos eram resolvidos em batalhas monumentais entre exércitos. Os generais mais poderosos empunhavam Great Shields como símbolo de sua autoridade no campo de batalha.

Hoje, o Great Shield é um item de colecionador, valorizado tanto por sua defesa excepcional quanto por sua raridade nos servidores ativos.`,
        myths: `🔮 Mito do Escudo dos Gigantes: Dizem que o Great Shield foi originalmente feito para ser usado por gigantes, e que uma versão ainda maior — o "Colossal Shield" — existe escondida em algum lugar do jogo.

🔮 Mito da Muralha Viva: Uma lenda conta que se quatro cavaleiros com Great Shields ficarem em formação quadrada, eles criam uma barreira mágica que bloqueia todos os projéteis.`
    },
    {
        id: 11,
        name: 'Pair of Soft Boots',
        emoji: '👢',
        rarity: 'Rare',
        history: `As Soft Boots são um dos itens mais funcionais e desejados de Tibia. Diferente de outros itens raros que são valorizados pela defesa ou ataque, as Soft Boots são especiais pela sua habilidade de regenerar mana automaticamente.

Introduzidas como um item revolucionário, as Soft Boots mudaram completamente a forma como magos jogavam Tibia. A regeneração constante de mana permitia sessões de caça muito mais longas e eficientes.

As Soft Boots se tornaram parte essencial do kit de qualquer mago sério, e sua demanda sempre esteve entre as mais altas do jogo.`,
        myths: `🔮 Mito das Soft Boots Infinitas: Alguns jogadores acreditavam que existia uma versão especial das Soft Boots que nunca perdia carga, supostamente obtida completando uma quest secreta em Ab'Dendriel.

🔮 Mito do Sapateiro Élfico: Uma lenda fala de um NPC sapateiro élfico escondido que pode "melhorar" suas Soft Boots para regenerar tanto vida quanto mana, mas cobrava 1 milhão de gold pelo serviço.`
    },
    {
        id: 12,
        name: 'Winged Helmet',
        emoji: '🪽',
        rarity: 'Legendary',
        history: `O Winged Helmet é uma das peças mais raras e misteriosas de Tibia. Com suas asas decorativas, este capacete evoca a imagem dos mensageiros dos deuses — rápidos, divinos e inalcançáveis.

Apenas um punhado de Winged Helmets existe nos servidores de Tibia, e cada um deles carrega décadas de história. As transações envolvendo este item movimentaram fortunas e geraram disputas memoráveis.

Para muitos, o Winged Helmet é o item que melhor representa a essência de Tibia: mistério, raridade e a eterna busca por algo que poucos jamais alcançarão.`,
        myths: `🔮 Mito do Voo: A crença mais persistente é que o Winged Helmet originalmente permitia ao jogador voar sobre o mapa, mas essa habilidade foi removida por ser "overpowered demais".

🔮 Mito de Hermes: Dizem que se equipar o Winged Helmet junto com Boots of Haste, o jogador se move mais rápido do que qualquer montaria do jogo — quase invisível pelo mapa.`
    }
];

// ===== PERSONAGENS EM DESTAQUE (MOCK) =====
const HIGHLIGHTED_CHARACTERS = [
    {
        id: 1,
        name: 'Eternal Flame',
        world: 'Antica',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 1250,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'A Chama que Nunca se Apaga',
        storyContent: `Minha jornada começou em 2005, quando eu era apenas um garoto curioso que descobriu Tibia através de um amigo na escola. Criei meu personagem em Antica, o servidor mais antigo e populoso, sem saber que aquele dia mudaria minha vida.

Os primeiros dias foram de pura descoberta. Morri para ratos em Rookgaard mais vezes do que gostaria de admitir. Mas cada morte era uma lição, cada nível conquistado era uma vitória épica.

Quando finalmente cheguei ao mainland, o mundo se abriu diante dos meus olhos. Thais era uma cidade imensa e cheia de vida. Jogadores corriam de um lado para o outro, merchants gritavam seus preços no depot, e eu ali, um cavaleiro nível 8, olhando tudo com admiração.

A primeira vez que enfrentei um Dragon foi inesquecível. Eu tinha nível 45 e um grupo de amigos da guild me convenceu a ir para a Darashia Dragon Lair. Meu coração disparou quando vi aquela criatura enorme cuspindo fogo. Sobrevivi — por pouco — e a partir daquele dia, eu sabia que queria ser o cavaleiro mais forte de Antica.

Ao longo dos anos, participei de guerras entre guilds, explorei dungeons misteriosas, e fiz amizades que duram até hoje. Tibia não é apenas um jogo para mim — é uma segunda casa, um lugar onde forjei memórias que carregarei para sempre.

Hoje, com nível 1250, olho para trás e vejo cada cicatriz, cada conquista, cada momento de desespero e triunfo. A chama do meu personagem nunca se apagou, e enquanto Tibia existir, ela continuará ardendo.`,
        avatarEmoji: '🔥',
        createdAt: '2024-06-15'
    },
    {
        id: 2,
        name: 'Shadow Weaver',
        world: 'Secura',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 980,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'Flechas na Escuridão',
        storyContent: `Eles dizem que paladinos são a vocação mais versátil de Tibia. Concordo. Mas ser versátil não significa ser fácil.

Criei Shadow Weaver em 2010, quando já era veterano no jogo. Queria um desafio diferente — e encontrei. A vida de um paladino é solitária. Enquanto cavaleiros formam frontlines e magos devastam hordas, nós ficamos nas sombras, calculando cada flecha, cada passo.

Minha história mais marcante aconteceu durante uma war contra a guild "Dark Legion" em Secura. Éramos superados em número 3 para 1. A maioria do nosso time havia sido eliminada, e eu era um dos últimos de pé.

Me escondi em uma passagem estreita da dungeon e, um por um, embosquei os inimigos que entravam. Foram 47 kills naquela noite. Quando o sol virtual nasceu, a Dark Legion havia recuado, e meu nome estava gravado na história de Secura.

Desde aquele dia, me tornei conhecido como o "Fantasma de Secura" — você nunca me vê, mas minhas flechas sempre encontram o alvo.`,
        avatarEmoji: '🏹',
        createdAt: '2024-09-22'
    },
    {
        id: 3,
        name: 'Arcane Tempest',
        world: 'Luminera',
        vocation: 'Master Sorcerer',
        vocShort: 'MS',
        level: 1100,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'O Mago da Tempestade',
        storyContent: `Fogo. Gelo. Energia. Morte. Os quatro elementos da destruição, e eu os domino todos.

Comecei como um simples sorcerer em Luminera em 2012. O que me atraiu para esta vocação foi a promessa de poder puro — a capacidade de destruir hordas inteiras de inimigos com um único feitiço.

A realidade foi mais dura do que eu esperava. Sorcerers são frágeis como cristal nos níveis baixos. Morri incontáveis vezes antes de aprender a arte de posicionar-me, de controlar o ritmo da batalha, de saber quando atacar e quando recuar.

O ponto de virada foi quando aprendi o "Rage of the Skies". A primeira vez que lancei esse feitiço em um grupo de 30 monstros e vi todos caírem simultaneamente... foi como ser um deus por um instante.

Hoje sou respeitado como um dos sorcerers mais fortes de Luminera. Mas nunca esqueço de onde vim: um mago nível 8 em Rookgaard, tentando matar um rato com uma varinha que fazia menos dano que um tapa.`,
        avatarEmoji: '⚡',
        createdAt: '2025-01-10'
    }
];

// ===== TODOS OS PERSONAGENS COM HISTÓRIA =====
const ALL_CHARACTERS = [
    ...HIGHLIGHTED_CHARACTERS,
    {
        id: 4,
        name: 'Emerald Healer',
        world: 'Antica',
        vocation: 'Elder Druid',
        vocShort: 'ED',
        level: 870,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'A Guardiã da Floresta',
        storyContent: `Sempre me disseram que druidas são apenas "curandeiros". Que nosso papel é ficar atrás do time, spammando "exura sio" e rezando para ninguém morrer. Eles estão errados.

Sou Emerald Healer, e esta é a história de como uma druid mudou o destino de guerras inteiras em Antica.

Comecei minha jornada em 2008. Na época, druids eram subvalorizados. Todos queriam ser sorcerers pelo dano, ou knights pela resistência. Mas eu vi algo que outros não viam: o poder de manter um exército inteiro vivo.

Minha fama começou na Grande Guerra de Antica de 2015, quando nossa guild estava à beira da derrota. Os knights caíam, os paladinos ficavam sem munição, os sorcerers sem mana. Mas eu mantive todos vivos. Por três horas seguidas, minha mana nunca zerou, meus heals nunca falharam.

Quando a poeira baixou, tínhamos vencido. E todos sabiam: a vitória tinha um nome, e era o meu.`,
        avatarEmoji: '🌿',
        createdAt: '2024-08-05'
    },
    {
        id: 5,
        name: 'Blazing Fury',
        world: 'Quintera',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 750,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Do Rook ao Inferno',
        storyContent: `Minha história não é de glória. É de teimosia.

Comecei Tibia em 2014 sem saber absolutamente nada. Não falava inglês, não conhecia ninguém no jogo, e escolhi ser knight porque a descrição dizia "é a vocação mais fácil para iniciantes". Mentira.

Passei meses morrendo. Para trolls, para cyclops, para aquelas malditas amazonas em Venore. Meu level ia e voltava como maré. Mas eu nunca desisti.

O momento que definiu minha jornada foi quando, no level 150, decidi ir sozinho para a Inquisiton Quest. Todo mundo disse que era impossível solo. Levei 4 horas, morri 6 vezes, gastei toda minha gold em potions. Mas completei.

Desde aquele dia, "impossível" deixou de existir no meu vocabulário. Se existe um desafio em Tibia, eu vou enfrentar — mesmo que leve 100 tentativas.`,
        avatarEmoji: '🔥',
        createdAt: '2025-02-01'
    },
    {
        id: 6,
        name: 'Moonlit Arrow',
        world: 'Premia',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 620,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Caçadora da Lua',
        storyContent: `Em Premia, as noites são mais perigosas que os dias. Pelo menos era o que eu acreditava quando era novata.

Criei Moonlit Arrow numa madrugada de insônia em 2016. O nome veio naturalmente — eu estava olhando pela janela, vi a lua, e pensei: "quero ser como uma flecha guiada pela luz da lua. Silenciosa, precisa, inevitável."

Minha história é sobre paciência. Paladinos não são sobre força bruta ou magia devastadora. Somos sobre precisão. Cada flecha conta, cada passo é calculado.

Me especializei em caçar bosses raros. Conheço os spawns, os timers, os patterns de todos os bosses de Premia. Sou a primeira a chegar e a última a sair.

Já encontrei itens que muitos jogadores só viram em screenshots. E cada um deles tem uma história, uma noite acordada, uma batalha silenciosa sob a luz da lua.`,
        avatarEmoji: '🌙',
        createdAt: '2025-01-20'
    },
    {
        id: 7,
        name: 'Iron Fist Zara',
        world: 'Antica',
        vocation: 'Monk',
        vocShort: 'MO',
        level: 410,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Punhos de Ferro',
        storyContent: `Quando a vocação Monk chegou a Tibia, muitos riram. "Lutar sem arma? Sem magia? Boa sorte." Eu fui a primeira a provar que estavam errados.

Sou Iron Fist Zara, e minha arma é meu próprio corpo.

Criei minha Monk no primeiro dia que a vocação foi liberada. Enquanto todos testavam builds e reclamavam da falta de dano, eu estudava. Cada combo, cada esquiva, cada timing de contra-ataque.

O segredo do Monk não é força bruta — é ritmo. É sentir o momento exato de desviar, o frame perfeito para contra-atacar. É uma dança, não uma briga.

Minha fama veio quando venci um Elite Knight level 800 num duelo em Antica. Ele ria antes da luta. Não ria mais quando acordou no templo.

Desde então, carrego o título com orgulho: a primeira Monk a provar que os punhos são mais letais que qualquer lâmina.`,
        avatarEmoji: '🥋',
        createdAt: '2025-12-10'
    }
];

// ===== PERSONAGENS DO USUÁRIO (MINHA CONTA) =====
const MY_CHARACTERS = [
    {
        id: 101,
        name: 'Dark Crusader',
        world: 'Antica',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 450,
        isVerified: true,
        hasStory: true,
        storyTitle: 'O Cruzado das Sombras'
    },
    {
        id: 102,
        name: 'Frost Mage',
        world: 'Secura',
        vocation: 'Master Sorcerer',
        vocShort: 'MS',
        level: 320,
        isVerified: true,
        hasStory: false,
        storyTitle: null
    },
    {
        id: 103,
        name: 'Wild Hunter',
        world: 'Luminera',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 180,
        isVerified: false,
        hasStory: false,
        storyTitle: null
    }
];
