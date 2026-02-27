import { database } from './database';

// Bump para forçar reseed quando os dados de desenvolvimento mudarem
const ITEMS_SEED_VERSION = '2';
const CHARS_SEED_VERSION = '1';

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

  // Seed de chars (desenvolvimento — será removido na Fase 11)
  seedCharsIfEmpty();
}

function seedItemsIfEmpty(): void {
  const stored = database.getFirstSync<{ value: string }>(
    "SELECT value FROM user_config WHERE key = 'items_seed_version'",
  );
  if (stored && stored.value === ITEMS_SEED_VERSION) return;

  // Limpa dados antigos antes de re-semear
  database.execSync('DELETE FROM items');

  const seedItems: { name: string; image_url: string; rarity: string; history: string; myths: string }[] = [
    {
      name: 'Golden Armor',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Golden_Armor.gif',
      rarity: 'Rare',
      history: `A Golden Armor é uma armadura encantada com armor 14 e peso de 80.00 oz, restrita a knights e paladins. Seu flavor text diz: "It's an enchanted armor." Faz parte do Golden Set.\n\nÉ obtida através da Behemoth Quest, e também pode surgir ao desoxidar uma Slightly Rusted Armor — uma mecânica que surpreendeu muitos jogadores quando descoberta. Desde o Update 8.4, passou a ser exclusiva de knights e paladins.\n\nÉ dropada por criaturas poderosas como Falcon Knight, Ferumbras, Juggernaut, Warlock, entre outras. Seu valor de mercado gira entre 20,000 e 32,000 gold coins.`,
      myths: `📜 A Restrição de Vocação: Antes do Update 8.4, a Golden Armor podia ser usada por qualquer vocação, o que a tornava muito mais disputada. A restrição a knights e paladins mudou completamente a dinâmica de mercado.\n\n📜 O Segredo da Ferrugem: Poucos sabem que é possível obter uma Golden Armor ao desoxidar uma Slightly Rusted Armor — um item aparentemente inútil. Essa mecânica escondida faz da Golden Armor um dos itens com a origem mais curiosa do jogo.\n\n📜 Golden Set: A Golden Armor é parte do Golden Set, um dos conjuntos temáticos mais clássicos de Tibia, representando o luxo e a riqueza do mundo medieval do jogo.`,
    },
    {
      name: 'Magic Plate Armor',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Magic_Plate_Armor.gif',
      rarity: 'Rare',
      history: `A Magic Plate Armor (MPA) é uma das armaduras mais icônicas de Tibia, com armor 17 e peso de 85.00 oz. Também conhecida como "e-plate" (Enchanted Plate Armor), é restrita a knights e paladins desde o Christmas Update 2008.\n\nFoi implementada no Update 3.0, sendo uma das armaduras mais antigas do jogo. É dropada por criaturas lendárias como Demon, Ferumbras, Morgaroth e Orshabaal, entre outras.\n\nSeu valor de mercado varia entre 90,000 e 150,000 gold coins, consolidando-a como um item acessível mas extremamente respeitado pela comunidade.`,
      myths: `📜 A Nerf do Update 7.0: Originalmente, a MPA tinha armor 18, mas teve seu valor reduzido para 17 com o Update 7.0 — uma mudança que gerou debates acalorados na comunidade.\n\n📜 De Enchanted a Magic: O apelido "e-plate" vem de "Enchanted Plate Armor", o nome pelo qual muitos veteranos ainda se referem ao item. O nome oficial sempre foi Magic Plate Armor, mas a comunidade nunca abandonou o apelido original.\n\n📜 Restrição Tardia: Até o Christmas Update 2008, a MPA podia ser usada por todas as vocações. Quando a CipSoft restringiu o uso a knights e paladins, magos que dependiam da armadura tiveram que repensar todo seu equipamento.`,
    },
    {
      name: "Ferumbras' Hat",
      image_url: "https://tibia.fandom.com/wiki/Special:FilePath/Ferumbras'_Hat.gif",
      rarity: 'Very Rare',
      history: `O Ferumbras' Hat é a prova material de que o arquimago mais temido de Tibia foi derrotado — pelo menos por enquanto. Com armor 1 e peso de apenas 8.50 oz, seu flavor text diz: "It is the proof that Ferumbras has fallen. For now. The Edron Academy should be interested in this."\n\nImplementado no Update 7.8, é dropado por Ferumbras e Ferumbras Mortal Shell. É um dos itens mais caros que ainda é obtível no jogo, com valor estimado entre 1,300,000,000 e 1,500,000,000 gold coins.\n\nAlém do prestígio, o chapéu é necessário para um addon dos Mage Outfits (masculino) e Summoner Outfits (feminino), tornando-o desejado tanto por colecionadores quanto por jogadores que buscam completar seus outfits.`,
      myths: `📜 A Prova da Queda: O flavor text do item conta uma história por si só — "It is the proof that Ferumbras has fallen. For now." A frase "por enquanto" sugere que Ferumbras sempre volta, e de fato ele é revivido periodicamente no jogo.\n\n📜 A Edron Academy: O flavor text menciona que a Edron Academy deveria se interessar pelo chapéu, sugerindo uma conexão entre o item e a lore da academia de magia de Edron, um dos centros de conhecimento arcano de Tibia.\n\n📜 Bilhões em Gold: Com valor acima de 1 bilhão de gold coins, o Ferumbras' Hat é um dos itens mais caros ainda obtíveis no jogo. Cada queda de Ferumbras é um evento que mobiliza dezenas de jogadores de alto nível.`,
    },
    {
      name: 'Thunder Hammer',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Thunder_Hammer.gif',
      rarity: 'Legendary',
      history: `O Thunder Hammer é uma club weapon lendária com attack 49, defense 35 (+1) e peso de 125.00 oz, requerendo level 85 para uso. Seu flavor text diz: "It is blessed by the gods of Tibia." É dropado por Morgaroth, Orshabaal e Morshabaal.\n\nO primeiro jogador a lootar um Thunder Hammer foi Elahrion Avessar, no mundo Elysia. No passado, apenas três exemplares existiam em todo o Tibia — tornando-o uma das armas mais raras já vistas no jogo.\n\nFoi durante muito tempo uma das melhores club weapons one-handed disponíveis, e seu valor de mercado gira entre 60,000,000 e 70,000,000 gold coins.`,
      myths: `📜 Os Três Originais: Dos três Thunder Hammers originais, cada um tem uma história única. Um foi recompensa no mundo Eternia, junto com um Golden Helmet, por reportar um bug de segurança. Outro foi presente dos deuses ao responsável pela convenção real de Tibia em 2002 — mais tarde dado a Pytru como presente de Natal.\n\n📜 O Escândalo de Warrax: O terceiro Thunder Hammer foi obtido ilegalmente por Warrax através da Behemoth Quest one-shot, usando seu GM comprado, Ender Speaker of the Dead. Após a deleção de Warrax, o martelo foi vendido, mas o comprador perdeu tudo — inclusive seu depot — quando a CipSoft o encontrou.\n\n📜 Khundahamar — A Lenda Anã: Segundo a lore do World of Tibia: "Nos tempos de pavor, os melhores ferreiros anões foram mantidos cativos pelas forças de Blog. Kazrad Rockfist, um herói anão, os libertou. Seu martelo foi abençoado pelos deuses, e com um único golpe poderoso ele destruiu as portas de aço. Os anões chamam este artefato de Khundahamar — 'libertador'."`,
    },
    {
      name: 'Blessed Shield',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Blessed_Shield.gif',
      rarity: 'Legendary',
      history: `O Blessed Shield possui defense 40 e pesa 68.00 oz. Seu flavor text diz: "The shield grants divine protection." Este escudo excepcional não é obtível normalmente no jogo — é concedido exclusivamente como presente dos Deuses.\n\nFoi presenteado algumas vezes pelos Deuses Criadores a jogadores que consideraram dignos. Após anos de incerteza sobre sua existência, o lendário escudo ressurgiu em Antica.\n\nAté o Summer Update 2018, o Blessed Shield detinha a maior defesa entre todos os escudos do jogo, um recorde que manteve por mais de uma década.`,
      myths: `📜 O Primeiro de Antica: O primeiro Blessed Shield em Antica foi um presente dos deuses para Elleshar, em reconhecimento por sua contribuição aos gráficos do jogo. Elleshar vendeu o escudo para Muesli com a promessa de nunca revendê-lo — promessa que foi quebrada quando Muesli o leiloou.\n\n📜 O Leilão Lendário: Entre os licitantes estavam Yi, Slayn e Lightbringer, que acabou comprando o escudo. A imagem de Lightbringer com seu Blessed Shield se tornou uma das fotos mais icônicas da história de Tibia.\n\n📜 A Nerf Original: Inicialmente, o Blessed Shield tinha defense 50, reduzido para 40 com o Update 7.0. Mesmo após a nerf, permaneceu como o escudo mais forte do jogo por anos.\n\n📜 12 Bilhões: Em 15 de junho de 2022, um Blessed Shield foi vendido via Market por Karr Chaos (Nathquata) para Rei de Lutabra por 12 bilhões de gold coins — uma das maiores transações da história de Tibia.`,
    },
    {
      name: 'Demon Helmet',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Demon_Helmet.gif',
      rarity: 'Rare',
      history: `O Demon Helmet possui armor 10 e pesa 29.50 oz. Seu flavor text sussurra: "You hear an evil whispering from inside." Embora tenha sido superado pelo Zaoan Helmet em termos de defesa pura, continua sendo uma excelente opção para magos que priorizam proteção.\n\nÉ obtido através da Demon Helmet Quest. Também é dropado por Lloyd e Madareth. Seu valor de mercado varia entre 30,000 e 55,000 gold coins.\n\nImplementado no Update 6.0, o Demon Helmet é um dos capacetes mais reconhecíveis de Tibia, com seu design demoníaco inconfundível.`,
      myths: `📜 A Mudança de Quest: O Demon Helmet era extremamente raro antes que a quest de Demon Legs fosse convertida na atual Demon Helmet Quest. Antes disso, não está claro como era obtido — provavelmente através de spawns únicos ou presentes dos Deuses.\n\n📜 O Sussurro do Mal: O flavor text "You hear an evil whispering from inside" é um dos mais atmosféricos do jogo, sugerindo que o capacete ainda carrega a essência demoníaca de seus criadores.\n\n📜 Escolha de Magos: Apesar de superado pelo Zaoan Helmet, o Demon Helmet permanece popular entre magos que buscam defesa extra, especialmente em situações de PvP onde cada ponto de armor conta.`,
    },
    {
      name: 'Horned Helmet',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Horned_Helmet.gif',
      rarity: 'Legendary',
      history: `O Horned Helmet possui armor 11 e pesa 51.00 oz. Implementado no Update 6.0, é um item de colecionador sem igual. Seu valor estimado varia entre 600,000,000 e 750,000,000 gold coins.\n\nO Horned Helmet surgiu nos tempos em que o mapa de Tibia era resetado a cada 4-6 meses. Ele aparecia como spawn na área que hoje é a Bright Sword Quest, abaixo do Outlaw Camp. Com a implementação de world transfers, alguns jogadores conseguiram distribuí-lo entre vários mundos.\n\nHoje, o capacete é um item sem preço para colecionadores, existindo em poucos exemplares espalhados por mundos como Antica, Premia, Secura, Isara, Lunara e Amera.`,
      myths: `📜 O Spawn do Map Reset: Nos primórdios de Tibia, o mapa era resetado periodicamente (a cada 4-6 meses), e itens raros respawnavam em locais específicos. O Horned Helmet era um desses spawns, na área que hoje abriga a Bright Sword Quest sob o Outlaw Camp.\n\n📜 Relíquia de Múltiplos Mundos: Graças às world transfers, o Horned Helmet existe em vários servidores. Cada exemplar tem uma história própria — alguns passaram por dezenas de donos ao longo de mais de duas décadas.\n\n📜 O Capacete Inalcançável: Um Horned Helmet pode ser visto na Treasure Room do Amazon Camp em Venore, mas é completamente inalcançável — servindo como uma provocação eterna aos jogadores que passam por ali.`,
    },
    {
      name: 'Warlord Sword',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Warlord_Sword.gif',
      rarity: 'Legendary',
      history: `A Warlord Sword é uma two-handed sword com attack 53, defense 38 e peso de 64.00 oz, requerendo level 120 e vocação knight. Seu flavor text diz: "Strong powers flow in this magic sword."\n\nÉ um dos itens mais raros do jogo, com pouquíssimos exemplares existindo em todos os mundos. Não possui drop confirmado — nenhuma criatura a dropa atualmente.\n\nPode ser vista abaixo do NPC A Sweaty Cyclops em Ab'Dendriel, e também na Morguthis Treasure Room. Se você falar com o cyclops e disser "warlord sword", ele pedirá materiais para forjá-la — mas esses materiais permanecem desconhecidos até hoje.`,
      myths: `📜 O Mistério do Cyclops: A Sweaty Cyclops em Ab'Dendriel oferece forjar uma Warlord Sword se você trouxer os materiais certos. Após mais de 20 anos, ninguém descobriu quais são esses materiais — ou se a quest é sequer completável.\n\n📜 Stats Originais: A Warlord Sword já teve attack 62 e defense 40, valores absurdamente altos. A nerf reduziu seus stats, mas não diminuiu seu status lendário.\n\n📜 A Tibianic Exhibition: Um dos poucos exemplares conhecidos da Warlord Sword foi exibido na famosa Tibianic Exhibition em Antica, organizada pela Alliance of Free Tibians liderada por Taghor — um evento que reuniu os itens mais raros do jogo em uma exposição pública.\n\n📜 Após a Magic Longsword: Historicamente, a Warlord Sword era considerada a segunda melhor espada de Tibia, atrás apenas da Magic Longsword — outro item lendário praticamente inexistente.`,
    },
    {
      name: 'Dragon Scale Mail',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Dragon_Scale_Mail.gif',
      rarity: 'Rare',
      history: `A Dragon Scale Mail possui armor 15 e pesa 114.00 oz, sendo restrita a knights e paladins. Implementada no Update 5.1, é uma das armaduras mais antigas do jogo.\n\nFaz parte do Dragon Set e é necessária para um addon dos Wizard Outfits. É dropada por criaturas dracônicas como Dragon Lord, Frost Dragon, Demodras, Chizzoron the Distorter, entre outras.\n\nSeu valor de mercado gira entre 40,000 e 60,000 gold coins, e pode ser vendida a Rashid.`,
      myths: `📜 Uma das Mais Antigas: A Dragon Scale Mail é uma das armaduras mais antigas de Tibia, existindo desde o Update 5.1. Sua longevidade no jogo a torna um verdadeiro fóssil vivo da história de Tibia.\n\n📜 O Sprite Antigo: Durante o Christmas Update 2004 (Update 7.4), o sprite da Dragon Scale Mail foi completamente redesenhado. O modelo antigo se parecia com uma Elven Mail — um visual muito diferente do que conhecemos hoje.\n\n📜 Dragon Set: A armadura faz parte do Dragon Set, um dos conjuntos temáticos do jogo que celebra as criaturas mais emblemáticas de Tibia — os dragões. Completar o set é um rito de passagem para muitos knights.`,
    },
    {
      name: 'Great Shield',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Great_Shield.gif',
      rarity: 'Very Rare',
      history: `O Great Shield possui defense 38 e pesa 84.00 oz. Seu flavor text revela: "The shield is made of dragon scales." Faz parte do Full Set.\n\nExiste desde quase o início de Tibia, quando o único servidor se chamava simplesmente "Tibia" — o que hoje é Antica. O primeiro Great Shield conhecido foi de Cressir, em Antica.\n\nAtualmente é dropado por bosses como Ferumbras, Ferumbras Mortal Shell, Massacre, Morgaroth, Razzagorn e Soul of Dragonking Zyrtarch. Seu valor varia entre 30,000,000 e 50,000,000 gold coins.`,
      myths: `📜 O Drop Removido dos Dragon Lords: Por um breve período, Dragon Lords dropavam o Great Shield. Lootar um era mais difícil que conseguir uma Dragon Scale Mail. Na época, só existiam três spawns de Dragon Lord — Plains of Havoc, Thais e Deeper Fibula — e os levels mais altos eram por volta de 50. O drop foi removido porque o valor e a defesa do escudo foram considerados excessivos.\n\n📜 A Nerf Histórica: Originalmente, o Great Shield tinha defense 42, reduzido para 38 com o Update 7.0. Mesmo após a nerf, continuou sendo um dos escudos mais poderosos do jogo.\n\n📜 Sprite Redesenhado: O visual do Great Shield foi alterado durante o Christmas Update 2004 (Update 7.4). O modelo antigo era completamente diferente do atual — um redesign que pegou muitos jogadores de surpresa.\n\n📜 Pode ser visto na Treasure Room do Imperador Kruzak em Kazordoon e também no tesouro do Maze of Lost Souls.`,
    },
    {
      name: 'Pair of Soft Boots',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Pair_of_Soft_Boots.gif',
      rarity: 'Rare',
      history: `As Soft Boots são botas com regeneração acelerada, pesando apenas 8.00 oz. Regeneram 3 HP e 12 MP a cada 6 segundos durante 240 minutos (4 horas), totalizando 7,200 HP e 28,800 MP recuperados.\n\nSão obtidas através da Pits of Inferno Quest. Quando completamente usadas, se transformam em Worn Soft Boots, que podem ser recarregadas. Seu valor varia entre 500,000 e 850,000 gold coins.\n\nAs Soft Boots são especialmente úteis em resting areas, onde a regeneração é dobrada se o reward streak for 6 ou maior, recuperando 6 HP e 24 MP a cada 6 segundos.`,
      myths: `📜 Implementada Mas Inobtível: Embora as Soft Boots tenham sido implementadas no Christmas Update 2002 (Update 7.1), elas só se tornaram obtíveis após o Christmas Update 2006 (Update 7.9) — quatro anos de existência como item fantasma.\n\n📜 A Revolução dos Magos: As Soft Boots mudaram completamente o meta de magos em Tibia. Um promoted mage usando Soft Boots e comendo food pode produzir 129 SDs, 324 GFBs ou 1,230 HMMs em 4 horas — tornando o craft de runas significativamente mais lucrativo.\n\n📜 Visuais Idênticas: As Soft Boots têm exatamente a mesma aparência das Boots of Waterwalking — um detalhe que já causou confusão em inúmeras negociações entre jogadores.\n\n📜 Na Casa do Papai Noel: Um par de Soft Boots pode ser visto decorando a Santa's House no mundo Vega.`,
    },
    {
      name: 'Winged Helmet',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Winged_Helmet.gif',
      rarity: 'Legendary',
      history: `O Winged Helmet possui armor 10 e pesa apenas 12.00 oz. Seu flavor text diz: "It's the Helmet of Hermes." Implementado no Update 3.1, é um dos itens mais antigos e raros de todo o Tibia.\n\nÉ um item extremamente raro — mesmo tendo sido ilegalmente duplicado há muito tempo, existem cerca de 10 exemplares, originalmente todos em Antica. Seu valor estimado varia entre 8,000,000,000 e 11,000,000,000 gold coins.\n\nPode ser visto na Morguthis Treasure Room e na Treasure Room de Pythius The Rotten.`,
      myths: `📜 O Spawn do Farol: Nos tempos em que só Thais existia, o Winged Helmet spawnava uma vez por map reset (a cada ~6 meses) em um baú no Thais Lighthouse, onde hoje fica a Dark Shield Quest.\n\n📜 O Capacete de Hermes: Ao contrário da crença popular, o Winged Helmet nunca concedeu velocidade, proteção suprema ou qualquer atributo especial além de sua defesa. O nome "Helmet of Hermes" sempre foi puramente temático.\n\n📜 A Duplicação Ilegal: Há muito tempo, o Winged Helmet foi ilegalmente duplicado, aumentando o número de exemplares em circulação. Mesmo assim, continua sendo um dos itens mais raros do jogo.\n\n📜 Venda Histórica no Bazaar: Em fevereiro de 2025, um Winged Helmet foi vendido em Antica através do bazaar de personagens por 217,626 Tibia Coins — uma das maiores transações já registradas na plataforma.`,
    },
  ];

  for (const item of seedItems) {
    database.runSync(
      'INSERT INTO items (name, image_url, rarity, history, myths) VALUES (?, ?, ?, ?, ?)',
      [item.name, item.image_url, item.rarity, item.history, item.myths],
    );
  }

  // Salva versão do seed
  database.runSync(
    "INSERT OR REPLACE INTO user_config (key, value) VALUES ('items_seed_version', ?)",
    [ITEMS_SEED_VERSION],
  );
}

function seedCharsIfEmpty(): void {
  const stored = database.getFirstSync<{ value: string }>(
    "SELECT value FROM user_config WHERE key = 'chars_seed_version'",
  );
  if (stored && stored.value === CHARS_SEED_VERSION) return;

  // Limpa dados antigos antes de re-semear
  database.execSync('DELETE FROM characters');

  const seedChars: {
    id: string;
    user_token: string;
    name: string;
    world: string;
    vocation: string;
    level: number;
    is_verified: number;
    is_highlighted: number;
    highlight_until: string | null;
    story_title: string;
    story_content: string;
    avatar_url: string;
    created_at: string;
  }[] = [
      {
        id: 'char-1',
        user_token: 'TS-f47ac10b-58cc',
        name: 'Eternal Flame',
        world: 'Antica',
        vocation: 'Elite Knight',
        level: 1250,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'A Chama que Nunca se Apaga',
        story_content: `Minha jornada começou em 2005, quando eu era apenas um garoto curioso que descobriu Tibia através de um amigo na escola. Criei meu personagem em Antica, o servidor mais antigo e populoso, sem saber que aquele dia mudaria minha vida.\n\nOs primeiros dias foram de pura descoberta. Morri para ratos em Rookgaard mais vezes do que gostaria de admitir. Mas cada morte era uma lição, cada nível conquistado era uma vitória épica.\n\nQuando finalmente cheguei ao mainland, o mundo se abriu diante dos meus olhos. Thais era uma cidade imensa e cheia de vida. Jogadores corriam de um lado para o outro, merchants gritavam seus preços no depot, e eu ali, um cavaleiro nível 8, olhando tudo com admiração.\n\nA primeira vez que enfrentei um Dragon foi inesquecível. Eu tinha nível 45 e um grupo de amigos da guild me convenceu a ir para a Darashia Dragon Lair. Meu coração disparou quando vi aquela criatura enorme cuspindo fogo. Sobrevivi — por pouco — e a partir daquele dia, eu sabia que queria ser o cavaleiro mais forte de Antica.\n\nAo longo dos anos, participei de guerras entre guilds, explorei dungeons misteriosas, e fiz amizades que duram até hoje. Tibia não é apenas um jogo para mim — é uma segunda casa, um lugar onde forjei memórias que carregarei para sempre.\n\nHoje, com nível 1250, olho para trás e vejo cada cicatriz, cada conquista, cada momento de desespero e triunfo. A chama do meu personagem nunca se apagou, e enquanto Tibia existir, ela continuará ardendo.`,
        avatar_url: '🔥',
        created_at: '2024-06-15T00:00:00Z',
      },
      {
        id: 'char-2',
        user_token: 'TS-f47ac10b-58cc',
        name: 'Shadow Weaver',
        world: 'Secura',
        vocation: 'Royal Paladin',
        level: 980,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'Flechas na Escuridão',
        story_content: `Eles dizem que paladinos são a vocação mais versátil de Tibia. Concordo. Mas ser versátil não significa ser fácil.\n\nCriei Shadow Weaver em 2010, quando já era veterano no jogo. Queria um desafio diferente — e encontrei. A vida de um paladino é solitária. Enquanto cavaleiros formam frontlines e magos devastam hordas, nós ficamos nas sombras, calculando cada flecha, cada passo.\n\nMinha história mais marcante aconteceu durante uma war contra a guild "Dark Legion" em Secura. Éramos superados em número 3 para 1. A maioria do nosso time havia sido eliminada, e eu era um dos últimos de pé.\n\nMe escondi em uma passagem estreita da dungeon e, um por um, embosquei os inimigos que entravam. Foram 47 kills naquela noite. Quando o sol virtual nasceu, a Dark Legion havia recuado, e meu nome estava gravado na história de Secura.\n\nDesde aquele dia, me tornei conhecido como o "Fantasma de Secura" — você nunca me vê, mas minhas flechas sempre encontram o alvo.`,
        avatar_url: '🏹',
        created_at: '2024-09-22T00:00:00Z',
      },
      {
        id: 'char-3',
        user_token: 'TS-f47ac10b-58cc',
        name: 'Arcane Tempest',
        world: 'Luminera',
        vocation: 'Master Sorcerer',
        level: 1100,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'O Mago da Tempestade',
        story_content: `Fogo. Gelo. Energia. Morte. Os quatro elementos da destruição, e eu os domino todos.\n\nComecei como um simples sorcerer em Luminera em 2012. O que me atraiu para esta vocação foi a promessa de poder puro — a capacidade de destruir hordas inteiras de inimigos com um único feitiço.\n\nA realidade foi mais dura do que eu esperava. Sorcerers são frágeis como cristal nos níveis baixos. Morri incontáveis vezes antes de aprender a arte de posicionar-me, de controlar o ritmo da batalha, de saber quando atacar e quando recuar.\n\nO ponto de virada foi quando aprendi o "Rage of the Skies". A primeira vez que lancei esse feitiço em um grupo de 30 monstros e vi todos caírem simultaneamente... foi como ser um deus por um instante.\n\nHoje sou respeitado como um dos sorcerers mais fortes de Luminera. Mas nunca esqueço de onde vim: um mago nível 8 em Rookgaard, tentando matar um rato com uma varinha que fazia menos dano que um tapa.`,
        avatar_url: '⚡',
        created_at: '2025-01-10T00:00:00Z',
      },
      {
        id: 'char-4',
        user_token: 'TS-a1b2c3d4-0001',
        name: 'Emerald Healer',
        world: 'Antica',
        vocation: 'Elder Druid',
        level: 870,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'A Guardiã da Floresta',
        story_content: `Sempre me disseram que druidas são apenas "curandeiros". Que nosso papel é ficar atrás do time, spammando "exura sio" e rezando para ninguém morrer. Eles estão errados.\n\nSou Emerald Healer, e esta é a história de como uma druid mudou o destino de guerras inteiras em Antica.\n\nComecei minha jornada em 2008. Na época, druids eram subvalorizados. Todos queriam ser sorcerers pelo dano, ou knights pela resistência. Mas eu vi algo que outros não viam: o poder de manter um exército inteiro vivo.\n\nMinha fama começou na Grande Guerra de Antica de 2015, quando nossa guild estava à beira da derrota. Os knights caíam, os paladinos ficavam sem munição, os sorcerers sem mana. Mas eu mantive todos vivos. Por três horas seguidas, minha mana nunca zerou, meus heals nunca falharam.\n\nQuando a poeira baixou, tínhamos vencido. E todos sabiam: a vitória tinha um nome, e era o meu.`,
        avatar_url: '🌿',
        created_at: '2024-08-05T00:00:00Z',
      },
      {
        id: 'char-5',
        user_token: 'TS-a1b2c3d4-0002',
        name: 'Blazing Fury',
        world: 'Quintera',
        vocation: 'Elite Knight',
        level: 750,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'Do Rook ao Inferno',
        story_content: `Minha história não é de glória. É de teimosia.\n\nComecei Tibia em 2014 sem saber absolutamente nada. Não falava inglês, não conhecia ninguém no jogo, e escolhi ser knight porque a descrição dizia "é a vocação mais fácil para iniciantes". Mentira.\n\nPassei meses morrendo. Para trolls, para cyclops, para aquelas malditas amazonas em Venore. Meu level ia e voltava como maré. Mas eu nunca desisti.\n\nO momento que definiu minha jornada foi quando, no level 150, decidi ir sozinho para a Inquisiton Quest. Todo mundo disse que era impossível solo. Levei 4 horas, morri 6 vezes, gastei toda minha gold em potions. Mas completei.\n\nDesde aquele dia, "impossível" deixou de existir no meu vocabulário. Se existe um desafio em Tibia, eu vou enfrentar — mesmo que leve 100 tentativas.`,
        avatar_url: '🔥',
        created_at: '2025-02-01T00:00:00Z',
      },
      {
        id: 'char-6',
        user_token: 'TS-a1b2c3d4-0003',
        name: 'Moonlit Arrow',
        world: 'Premia',
        vocation: 'Royal Paladin',
        level: 620,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'Caçadora da Lua',
        story_content: `Em Premia, as noites são mais perigosas que os dias. Pelo menos era o que eu acreditava quando era novata.\n\nCriei Moonlit Arrow numa madrugada de insônia em 2016. O nome veio naturalmente — eu estava olhando pela janela, vi a lua, e pensei: "quero ser como uma flecha guiada pela luz da lua. Silenciosa, precisa, inevitável."\n\nMinha história é sobre paciência. Paladinos não são sobre força bruta ou magia devastadora. Somos sobre precisão. Cada flecha conta, cada passo é calculado.\n\nMe especializei em caçar bosses raros. Conheço os spawns, os timers, os patterns de todos os bosses de Premia. Sou a primeira a chegar e a última a sair.\n\nJá encontrei itens que muitos jogadores só viram em screenshots. E cada um deles tem uma história, uma noite acordada, uma batalha silenciosa sob a luz da lua.`,
        avatar_url: '🌙',
        created_at: '2025-01-20T00:00:00Z',
      },
      {
        id: 'char-7',
        user_token: 'TS-a1b2c3d4-0004',
        name: 'Iron Fist Zara',
        world: 'Antica',
        vocation: 'Monk',
        level: 410,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'Punhos de Ferro',
        story_content: `Quando a vocação Monk chegou a Tibia, muitos riram. "Lutar sem arma? Sem magia? Boa sorte." Eu fui a primeira a provar que estavam errados.\n\nSou Iron Fist Zara, e minha arma é meu próprio corpo.\n\nCriei minha Monk no primeiro dia que a vocação foi liberada. Enquanto todos testavam builds e reclamavam da falta de dano, eu estudava. Cada combo, cada esquiva, cada timing de contra-ataque.\n\nO segredo do Monk não é força bruta — é ritmo. É sentir o momento exato de desviar, o frame perfeito para contra-atacar. É uma dança, não uma briga.\n\nMinha fama veio quando venci um Elite Knight level 800 num duelo em Antica. Ele ria antes da luta. Não ria mais quando acordou no templo.\n\nDesde então, carrego o título com orgulho: a primeira Monk a provar que os punhos são mais letais que qualquer lâmina.`,
        avatar_url: '🥋',
        created_at: '2025-12-10T00:00:00Z',
      },
    ];

  for (const char of seedChars) {
    database.runSync(
      `INSERT INTO characters (id, user_token, name, world, vocation, level, is_verified, is_highlighted, highlight_until, story_title, story_content, avatar_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        char.id,
        char.user_token,
        char.name,
        char.world,
        char.vocation,
        char.level,
        char.is_verified,
        char.is_highlighted,
        char.highlight_until,
        char.story_title,
        char.story_content,
        char.avatar_url,
        char.created_at,
      ],
    );
  }

  // Salva versão do seed
  database.runSync(
    "INSERT OR REPLACE INTO user_config (key, value) VALUES ('chars_seed_version', ?)",
    [CHARS_SEED_VERSION],
  );
}
