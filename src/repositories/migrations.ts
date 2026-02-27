import { database } from './database';

// Bump para forçar reseed quando os dados de desenvolvimento mudarem
const ITEMS_SEED_VERSION = '2';
const CHARS_SEED_VERSION = '3';

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
        name: 'Kharsek',
        world: 'Yonabra',
        vocation: 'Elite Knight',
        level: 2012,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'O Primeiro a Cruzar os Portões — Level 999',
        story_content: `Kharsek é, sem dúvida, o personagem mais lendário da história de Tibia. Criado em 2004 no mundo Gladera (hoje Yonabra), ele carrega o título de "Guardian of Tibia" — uma honra que reflete seu papel icônico na comunidade.\n\nDurante anos, Kharsek se manteve no topo do ranking como o knight de maior level do jogo. Mas foi em 2016 que seu nome se tornou verdadeiramente imortal: Kharsek se tornou o primeiro jogador a alcançar o level 999 em Tibia.\n\nO que tornou esse feito ainda mais especial foi a existência da Door of Perdition, uma porta misteriosa que existia desde os primórdios do jogo e só podia ser aberta por personagens level 999. Por mais de uma década, a comunidade especulou sobre o que havia do outro lado. Kharsek foi o primeiro a descobrir.\n\nAo cruzar a porta, Kharsek revelou a Hallowed Tome of Knowledge e desbloqueou uma cadeia de quests que culminou na obtenção do Dawnport Guard Outfit — um conteúdo que a CipSoft havia escondido por anos, esperando que alguém fosse dedicado o suficiente para alcançá-lo.\n\nMembro da guild Silent Academy, Kharsek é Premium Account e continua ativo, agora no mundo Yonabra. Seu legado não é apenas sobre números — é sobre a prova de que a perseverança pode superar qualquer barreira, real ou virtual.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Warrior_Male_Addon_3.gif',
        created_at: '2024-06-15T00:00:00Z',
      },
      {
        id: 'char-2',
        user_token: 'TS-f47ac10b-58cc',
        name: 'Bobeek',
        world: 'Bona',
        vocation: 'Elder Druid',
        level: 2984,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'O Druid Mais Forte — Uma Lenda de Bona',
        story_content: `Bobeek é uma lenda viva de Tibia. Criado em 2007 no mundo Bona, ele se tornou o Elder Druid mais famoso do jogo, alcançando um level que poucos acreditavam ser possível para essa vocação.\n\nO que diferencia Bobeek de outros jogadores de alto nível é sua dedicação quase obsessiva à eficiência. Enquanto muitos druids se contentam em ser "apenas healers", Bobeek transformou o druid em uma máquina de experiência, dominando técnicas de hunting que redefiniram o meta da vocação.\n\nBobeek é casado no jogo com Goraca, um Master Sorcerer igualmente lendário do mesmo mundo. Juntos, eles formam a dupla mais poderosa de Bona — e possivelmente de todo o Tibia. Ambos são membros da guild Hill, onde ostentam o título de King.\n\nConhecido também como streamer na Twitch (twitch.tv/bobeek), Bobeek compartilha suas hunts com milhares de espectadores, tornando-se uma referência para druids de todos os níveis.\n\nSua Premium Account está ativa desde a criação do personagem, e ele nunca parou de jogar. Para Bobeek, Tibia não é apenas um hobby — é uma vocação de vida, no sentido mais literal da palavra.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Druid_Male_Addon_3.gif',
        created_at: '2024-09-22T00:00:00Z',
      },
      {
        id: 'char-3',
        user_token: 'TS-f47ac10b-58cc',
        name: 'Goraca',
        world: 'Bona',
        vocation: 'Master Sorcerer',
        level: 2980,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'A Tempestade Arcana de Bona',
        story_content: `Goraca é o Master Sorcerer mais famoso de Tibia. Criado em 2007 no mundo Bona, seu nome se tornou sinônimo de poder mágico absoluto.\n\nO que torna Goraca especial não é apenas seu level estratosférico — é a maneira como ele joga. Goraca redefiniu o que significa ser sorcerer em Tibia, desenvolvendo estratégias de hunt que maximizam o dano mágico enquanto mantêm a sobrevivência. Suas técnicas de "full box" — atrair o máximo de monstros e destruí-los simultaneamente com magias de área — são estudadas e imitadas por jogadores do mundo inteiro.\n\nCasado no jogo com Bobeek, o Elder Druid lendário, Goraca forma uma dupla que domina o ranking de Bona há anos. Ambos ostentam o título de King na guild Hill, a guild mais poderosa do servidor.\n\nGoraca também é Premium Account desde 2007, uma sequência de quase duas décadas de jogo ininterrupto. Para muitos jogadores, ver Goraca no ranking é como ver o Everest no horizonte — uma referência imutável de grandeza.\n\nSeu legado vai além dos números: Goraca provou que sorcerers podem competir com qualquer vocação nos mais altos níveis do jogo.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Mage_Male_Addon_3.gif',
        created_at: '2025-01-10T00:00:00Z',
      },
      {
        id: 'char-4',
        user_token: 'TS-a1b2c3d4-0001',
        name: 'Taghor',
        world: 'Antica',
        vocation: 'Royal Paladin',
        level: 122,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'O Sábio de Antica — Guardião da História',
        story_content: `Taghor não é o jogador mais forte de Tibia. Seu level é modesto comparado às estrelas modernas do jogo. Mas Taghor é algo mais raro e valioso: ele é uma testemunha viva da história.\n\nCriado em 2001 no mundo Antica — o servidor mais antigo do Tibia —, Taghor é membro da lendária guild Satori e carrega o título de "Sage of Tibia". Poucos personagens no jogo carregam esse título, e cada um deles é uma relíquia de uma era que a maioria dos jogadores atuais nunca conheceu.\n\nTaghor é mais conhecido como o líder da Alliance of Free Tibians, uma aliança que organizou a famosa Tibianic Exhibition em Antica. Essa exposição reuniu alguns dos itens mais raros do jogo — incluindo Warlord Swords, Blessed Shields e Horned Helmets — em uma exibição pública que atraiu jogadores de todo o servidor.\n\nMas a contribuição mais duradoura de Taghor é o poema que carrega em seu character comment — um manifesto poético sobre a liberdade no mundo virtual:\n\n"O brave warriors of Tibia, let not the shadow of tyranny fall upon these digital lands. Let freedom ring from every castle wall."\n\nTaghor é a prova de que Tibia não é apenas sobre levels e loot. É sobre comunidade, história e legado.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Assassin_Male_Addon_3.gif',
        created_at: '2024-08-05T00:00:00Z',
      },
      {
        id: 'char-5',
        user_token: 'TS-a1b2c3d4-0002',
        name: 'Lightbringer',
        world: 'Antica',
        vocation: 'Paladin',
        level: 79,
        is_verified: 1,
        is_highlighted: 1,
        highlight_until: '2027-12-31T00:00:00Z',
        story_title: 'O Portador da Luz — Lenda dos Red Rose',
        story_content: `Lightbringer é um dos personagens mais icônicos da história de Tibia. Com apenas level 79 e uma Free Account, ele pode parecer insignificante pelos padrões modernos. Mas nos anais de Tibia, poucos nomes carregam tanto peso.\n\nCriado no mundo Antica, Lightbringer foi o líder da Red Rose — uma das guilds mais antigas e influentes da história do jogo. A Red Rose não era apenas uma guild de combate; era uma instituição. Sob a liderança de Lightbringer, a guild promoveu eventos, protegeu jogadores novos e estabeleceu um código de honra que inspirou centenas de outras guilds.\n\nMas o feito mais famoso de Lightbringer está ligado a um item: o Blessed Shield. Quando Elleshar vendeu seu Blessed Shield para Muesli — com a promessa de nunca revendê-lo —, e Muesli quebrou essa promessa ao leiloá-lo, Lightbringer foi um dos licitantes. E venceu.\n\nA imagem de Lightbringer empunhando o Blessed Shield se tornou uma das fotos mais compartilhadas da história de Tibia. O escudo não era apenas um item — era um símbolo de que os itens mais valiosos do jogo estavam nas mãos de quem os merecia.\n\nLightbringer também é um Demonslayer com 1.035 demons abatidos, um feito impressionante para a época. Seu personagem pode estar parado no tempo em level 79, mas sua lenda é eterna.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Assassin_Male_Addon_3.gif',
        created_at: '2025-02-01T00:00:00Z',
      },
      {
        id: 'char-6',
        user_token: 'TS-a1b2c3d4-0003',
        name: 'Elleshar',
        world: 'Antica',
        vocation: 'Sorcerer',
        level: 51,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'O Guardião Esquecido — O Primeiro Blessed Shield',
        story_content: `Elleshar é um nome que a maioria dos jogadores modernos de Tibia desconhece. E isso é uma injustiça histórica.\n\nCriado em 2001 no mundo Antica, Elleshar carrega o título de "Warden of Tibia" — um título concedido apenas a um punhado de jogadores na história do jogo. Membro da guild Satori, a mesma de Taghor e Pandorax, Elleshar faz parte de uma geração de jogadores que literalmente ajudou a construir Tibia.\n\nSua contribuição mais notável não foi em combate, mas em arte. Elleshar ajudou com os gráficos do jogo nos seus primórdios, contribuindo para o visual que definiria Tibia por anos. Em reconhecimento, os Deuses Criadores (a própria CipSoft) lhe concederam um presente que mudaria a história: o primeiro Blessed Shield.\n\nO Blessed Shield era o escudo com a maior defesa do jogo — defense 50 na época (reduzido para 40 no Update 7.0). Era um item que não podia ser obtido por nenhum jogador, em nenhuma quest, de nenhuma criatura. Era único.\n\nElleshar eventualmente vendeu o escudo para Muesli com uma condição: nunca revendê-lo. Muesli quebrou a promessa, e o escudo acabou nas mãos de Lightbringer. Mas a história começa com Elleshar — o guardião esquecido que recebeu dos deuses a relíquia mais valiosa de Tibia.\n\nSeu character comment resume tudo: "Long forgotten." Mas para quem conhece a história, Elleshar jamais será esquecido.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Mage_Male_Addon_3.gif',
        created_at: '2025-01-20T00:00:00Z',
      },
      {
        id: 'char-7',
        user_token: 'TS-a1b2c3d4-0004',
        name: 'Rei de Lutabra',
        world: 'Lutabra',
        vocation: 'Elite Knight',
        level: 177,
        is_verified: 1,
        is_highlighted: 0,
        highlight_until: null,
        story_title: 'O Rei Colecionador — Blessed Shield por 12 Bilhões',
        story_content: `Em Tibia, poucos nomes carregam tanto significado quanto "Rei de Lutabra". No mundo que leva seu nome — Lutabra —, ele não é apenas um jogador. É uma instituição.\n\nCriado como um Elite Knight, Rei de Lutabra é o líder da guild Reino, a guild dominante do servidor. Mas o que o tornou verdadeiramente famoso não foram suas conquistas em combate — foi sua obsessão por colecionar os itens mais raros do jogo.\n\nO capítulo mais espetacular de sua história aconteceu em 15 de junho de 2022, quando Rei de Lutabra comprou um Blessed Shield de Karr Chaos (do mundo Nathquata) por 12 bilhões de gold coins. Doze bilhões. Foi uma das maiores transações da história de Tibia, e consolidou Rei de Lutabra como um dos maiores colecionadores do jogo.\n\nO Blessed Shield que ele adquiriu não é apenas um item com defense 40. É uma peça de história — um dos pouquíssimos escudos abençoados pelos deuses que ainda existem em circulação.\n\nPara Rei de Lutabra, cada item raro conta uma história. E ele quer possuir todas elas.`,
        avatar_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Warrior_Male_Addon_3.gif',
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
