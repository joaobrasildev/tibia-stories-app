import { database } from './database';

// Bump para forçar reseed quando os dados de desenvolvimento mudarem
const ITEMS_SEED_VERSION = '5';
const CHARS_SEED_VERSION = '4';

// Bump quando o schema mudar (ALTER TABLEs incrementais)
const SCHEMA_VERSION = 2;

function getTableColumns(table: string): Set<string> {
  const rows = database.getAllSync<{ name: string }>(`PRAGMA table_info(${table})`);
  return new Set(rows.map((r) => r.name));
}

function addColumnIfMissing(table: string, column: string, definition: string, existing: Set<string>): void {
  if (!existing.has(column)) {
    database.execSync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function runSchemaMigrations(): void {
  // user_config precisa existir antes de tudo
  database.execSync(`
    CREATE TABLE IF NOT EXISTS user_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  const stored = database.getFirstSync<{ value: string }>(
    "SELECT value FROM user_config WHERE key = 'schema_version'",
  );
  const currentVersion = stored ? parseInt(stored.value, 10) : 0;
  if (currentVersion >= SCHEMA_VERSION) return;

  // --- Tabela items ---
  database.execSync(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image_url TEXT,
      rarity TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const itemCols = getTableColumns('items');
  addColumnIfMissing('items', 'summary', 'TEXT', itemCols);
  addColumnIfMissing('items', 'origin', 'TEXT', itemCols);
  addColumnIfMissing('items', 'lore', 'TEXT', itemCols);
  addColumnIfMissing('items', 'myths', 'TEXT', itemCols);
  addColumnIfMissing('items', 'sources', 'TEXT', itemCols);

  // --- Tabela characters ---
  database.execSync(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const charCols = getTableColumns('characters');
  addColumnIfMissing('characters', 'user_token', 'TEXT', charCols);
  addColumnIfMissing('characters', 'world', 'TEXT', charCols);
  addColumnIfMissing('characters', 'vocation', 'TEXT', charCols);
  addColumnIfMissing('characters', 'level', 'INTEGER DEFAULT 0', charCols);
  addColumnIfMissing('characters', 'is_verified', 'INTEGER DEFAULT 0', charCols);
  addColumnIfMissing('characters', 'is_highlighted', 'INTEGER DEFAULT 0', charCols);
  addColumnIfMissing('characters', 'highlight_until', 'TEXT', charCols);
  addColumnIfMissing('characters', 'story_title', 'TEXT', charCols);
  addColumnIfMissing('characters', 'story_content', 'TEXT', charCols);
  addColumnIfMissing('characters', 'avatar_url', 'TEXT', charCols);

  // Salva versão do schema
  database.runSync(
    "INSERT OR REPLACE INTO user_config (key, value) VALUES ('schema_version', ?)",
    [String(SCHEMA_VERSION)],
  );
}

export function runMigrations(): void {
  try {
    runSchemaMigrations();
    seedItemsIfEmpty();
    seedCharsIfEmpty();
  } catch {
    // DB corrompido — recria tudo do zero
    database.execSync('DROP TABLE IF EXISTS items');
    database.execSync('DROP TABLE IF EXISTS characters');
    database.execSync('DROP TABLE IF EXISTS user_config');
    runSchemaMigrations();
    seedItemsIfEmpty();
    seedCharsIfEmpty();
  }
}

function seedItemsIfEmpty(): void {
  const stored = database.getFirstSync<{ value: string }>(
    "SELECT value FROM user_config WHERE key = 'items_seed_version'",
  );
  if (stored && stored.value === ITEMS_SEED_VERSION) return;

  // Limpa dados antigos antes de re-semear
  database.execSync('DELETE FROM items');

  const seedItems: { id: string; name: string; image_url: string; rarity: string; summary: string; origin: string; lore: string; myths: string; sources: string }[] = [
    {
      id: 'thunder-hammer',
      name: 'Thunder Hammer',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Thunder_Hammer.gif',
      rarity: 'Legendary',
      summary: `Uma das armas mais icônicas da história de Tibia. Introduzido na versão 6.4 (2001), foi considerado a club mais poderosa de uma mão. Seus atributos — attack 49, defense 35 (+1) — o tornaram extremamente desejado e raro.`,
      origin: `Durante os primeiros anos do Tibia, existiam apenas alguns Thunder Hammers. A história desses primeiros martelos envolve eventos especiais, recompensas da CipSoft e até exploits.\n\nEm 2002, ocorreu uma convenção de Tibia em Viena. O jogador Patryn, que ajudou a organizar o evento, recebeu um Thunder Hammer como presente dos desenvolvedores. Posteriormente, o martelo foi dado de presente para Pytru como presente de Natal no mesmo ano.\n\nOutro Thunder Hammer foi entregue pela CipSoft ao jogador Krin, no servidor Eternia, como recompensa por reportar bugs importantes de segurança do jogo.\n\nUm episódio controverso envolveu o jogador Warrax, de Antica, que utilizou um exploit na Behemoth Quest com auxílio de um GM comprado chamado Ender Speaker of the Dead. Após a descoberta, Warrax foi deletado e o Thunder Hammer confiscado.\n\nNo servidor Premia, quando foi criado, a CipSoft realizou um evento especial em 16 de junho de 2002. Um demon apareceu em Darashia e um grupo de aventureiros o derrotou. Segundo relato de Karrchaos (Morak em Premia), vários jogadores morreram durante a batalha. O loot incluía um Thunder Hammer, que foi posteriormente vendido em Antica por uma coleção de itens raros incluindo Golden Helmet, E-Plate, Giant Swords, Steel Boots, Demon Shield, grandes quantidades de runas e dinheiro.\n\nEm 26 de agosto de 2005, o boss mundial Orshabaal apareceu no servidor Elysia. O jogador Elahrion Avessar conseguiu lootar um Thunder Hammer — o primeiro de um boss mundial. Segundo relato dele: "Gritei na vida real quando vi o loot."\n\nDesde então, o item passou a dropar raramente de bosses como Orshabaal, Morgaroth, Ghazbaran e Ferumbras. O Thunder Hammer tornou-se símbolo de status e peça de coleção, com exemplares exibidos em casas famosas no Tibia — incluindo uma residência em Thais onde o item ficou exposto junto com uma Silver Mace. Seu valor de mercado gira entre 60,000,000 e 70,000,000 gold coins.`,
      lore: `Seu flavor text diz: "It is blessed by the gods of Tibia." Existe uma lore associada ao martelo que remonta aos anões de Tibia.\n\nSegundo a narrativa preservada em wikis da comunidade: nos tempos de pavor, anões mestres ferreiros foram capturados por forças ligadas aos cyclops e forçados a ensinar seus segredos de metalurgia. Um herói anão chamado Kazrad Rockfist libertou os prisioneiros. Durante a fuga, ele recebeu ajuda divina — seu martelo foi abençoado pelos deuses, e com um único golpe poderoso ele destruiu as portas de aço da prisão.\n\nOs anões chamam este artefato de Khundahamar — "libertador". Entre os humanos, ficou conhecido como Thunder Hammer.`,
      myths: `📜 Quest Secreta da Basilisk: Um dos maiores mitos dizia que existia uma quest secreta envolvendo uma Basilisk gigante. Segundo a lenda, o martelo de Thor teria sido roubado e jogado nas profundezas do subsolo, guardado por uma serpente gigantesca. Jogadores passaram anos tentando encontrar essa sala secreta. Nunca foi comprovada.\n\n📜 Ligação com Thor: Por causa do nome "Thunder Hammer", muitos acreditavam que o item era inspirado diretamente no Mjölnir, o martelo do deus Thor. A teoria dizia que o item seria parte de uma quest mitológica ligada a divindades nórdicas dentro do universo de Tibia. Embora a inspiração seja plausível, nunca houve confirmação oficial.\n\n📜 O Martelo Perdido nas Minas: Outro mito dizia que o Thunder Hammer estava escondido em alguma mina subterrânea protegida por cyclops ou dwarves, baseado na história do Khundahamar. Nunca foi encontrada quest ligada a isso.\n\n📜 Fake da Sala da Cobra: Uma das fakes mais famosas da comunidade mostrou um jogador supostamente entrando em uma sala secreta guardada por uma cobra gigante. A imagem circulou por anos, mas foi confirmada como fake.`,
      sources: 'TibiaWiki (Fandom), TibiaWiki Brasil, Portal Tibia, Tibia Mistérios Database, TibiaQA',
    },
    {
      id: 'blessed-shield',
      name: 'Blessed Shield',
      image_url: 'https://tibia.fandom.com/wiki/Special:FilePath/Blessed_Shield.gif',
      rarity: 'Legendary',
      summary: `Introduzido no início do Tibia (1999). Não possui drop de criatura e nunca teve método de obtenção via gameplay. Foi concedido manualmente pela CipSoft ao jogador Elleshar como recompensa por contribuição gráfica ao jogo.`,
      origin: `Nos primeiros anos do Tibia (1997–2000), a CipSoft contou com ajuda da comunidade para produzir gráficos do jogo. Jogadores com habilidades de design ajudavam a criar equipamentos, criaturas e elementos de cenário. Como recompensa, alguns receberam itens únicos.\n\nO Blessed Shield foi entregue ao jogador Elleshar por sua contribuição significativa na criação de gráficos. Esse foi o primeiro Blessed Shield existente no jogo.\n\nOriginalmente o escudo tinha defense 50, reduzido para 40 no patch 7.0 (2002). Mesmo após o nerf, permaneceu durante anos como o escudo com maior defesa do Tibia.\n\nElleshar vendeu o escudo para Muecil por aproximadamente 130k gold — uma quantia absurda na época — com a condição de que nunca fosse revendido.\n\nAnos depois, Muecil quebrou a promessa e colocou o Blessed Shield em leilão público. O preço subiu para 5 milhões de gold + itens raros. O vencedor foi Lightbringer, um dos maiores colecionadores de rares da época.\n\nLightbringer manteve o escudo em sua coleção, mas posteriormente o vendeu. O comprador teria feito uma oferta "que ninguém poderia superar" — esse episódio se tornou uma das histórias mais famosas do Tibia.\n\nCom o passar dos anos, o escudo mudou de mãos várias vezes. Entre os donos documentados estão: Elleshar → Muecil → Lightbringer → Gryphee → Lost Planegazer, entre outros colecionadores. Em determinado momento, o dono foi banido, gerando medo de que o item desaparecesse — mas foi transferido antes da exclusão da conta.\n\nEm 15 de junho de 2022, um Blessed Shield foi vendido via Market por Karr Chaos (Nathquata) para Rei de Lutabra por 12 bilhões de gold coins — uma das maiores transações da história de Tibia.\n\nO Blessed Shield se tornou um símbolo de raridade extrema, história do Tibia, economia do jogo e colecionismo de rares.`,
      lore: `Seu flavor text diz: "The shield grants divine protection." A descrição sugere uma conexão com o deus Banor e o conceito de proteção divina dentro do universo de Tibia. O significado mítico do escudo vai além de seus atributos — representa a bênção dos próprios deuses criadores.`,
      myths: `📜 Drop de Monstros: Alguns jogadores acreditavam que o Blessed Shield poderia dropar de Morgaroth, Demon ou Ferumbras. Na realidade, nenhuma criatura dropa o item.\n\n📜 Quest Secreta de Banor: Outro mito dizia que o escudo poderia ser obtido em uma quest secreta ligada ao deus Banor. Nunca houve confirmação dessa quest.\n\n📜 Existência de Vários Blessed Shields: Rumores afirmam que existem 2 ou 3 Blessed Shields, mas historicamente a comunidade considera que apenas um foi confirmado publicamente.\n\n📜 Proteção Divina: A descrição "The shield grants divine protection" levou jogadores a acreditar que o item poderia reduzir dano mágico, proteger contra ataques de demon ou impedir morte em PvP. Nunca houve evidência disso.\n\n📜 Escudo Sagrado contra Demônios: Outra crença popular era que o escudo era especialmente eficaz contra criaturas demoníacas, oferecendo proteção adicional em combate contra demons. Nunca foi confirmado.\n\n📜 O Blessed Shield em Hellgate: Screenshots dentro da Hellgate Treasure Room levaram muitos a acreditar que existia uma quest secreta ligada ao lugar. Na verdade, eram apenas exibições feitas por jogadores.`,
      sources: 'TibiaWiki (Fandom), Tibia Light, TibiaQA, TibiaWiki Brasil, Portal Tibia',
    },
    {
      id: 'chayennes-magical-key',
      name: "Chayenne's Magical Key",
      image_url: "https://tibia.fandom.com/wiki/Special:FilePath/Chayenne's_Magical_Key.gif",
      rarity: 'Very Rare',
      summary: `Adicionada na versão 9.44 (janeiro de 2012), distribuída durante as comemorações do 15º aniversário do Tibia. Sua utilidade foi publicamente revelada em agosto de 2012, com o jogador Dragenas (Secura) entre os primeiros a desvendar o mistério.`,
      origin: `Em 13 de janeiro de 2012, a Chayenne's Magical Key foi adicionada ao jogo na versão 9.44, obtida como loot do monstro especial Chayenne durante o evento do 15º aniversário.\n\nEm 16 de agosto de 2012, a Community Manager Chayenne anunciou sua saída da equipe e confirmou que a chave "leva a algum lugar", reacendendo as buscas. Em 19 de agosto de 2012, o jogador Dragenas (Secura) foi um dos primeiros a desvendar o local e postou screenshots da descoberta.\n\nEm 20 de agosto de 2012, a CipSoft anunciou o Chayenne's Farewell Contest. Três vencedores — Abiston, Azurai e Jinxz — receberam uma chave cada.\n\nA comunidade criou threads massivas de cooperação (uma no Otland chegou a 1.900+ posts) para dividir pistas e hipóteses. Ao contrário de quests lineares, a busca pela utilidade da chave exigiu leitura de textos in-game, teste de hipóteses e sincronização de condições de mapa — o que a transformou numa caça intelectual e colaborativa que marcou a comunidade. Alguns relatos no Otland afirmam que "levou 9 meses para resolver", embora os registros datados indiquem que a solução pública veio poucos dias após a despedida de Chayenne.\n\nPor ser rara e existir apenas em Yellow BattlEye worlds originalmente, a chave é altamente valorizada no mercado, com preços históricos na casa de dezenas de milhões de gold coins.`,
      lore: `A descrição do item diz: "No one really knows where it leads to, but the dragon graveyard might reveal the secret — or not." Essa pista levou jogadores a focarem em áreas dracônicas de Ankrahmun e Draconia.\n\nOs jogadores encontraram um livro chamado "Key to Magic" dentro de uma caixa no topo da pirâmide em Draconia, cujos versos continham pistas para manipular paredes mágicas e switches. A mecânica exigia ir ao dragon lair mais ao norte de Ankrahmun, limpar todo o respawn (Dragons, Dragon Lords, Fire Elementals), encontrar o piso cinza com um Fire Field sobre ele e pedras escondendo uma alavanca. Usando Destroy Field para remover o Fire Field e ativando a alavanca, uma magic wall ao sul desaparecia revelando um teleporte para o Chayenne's Realm. Era necessário ter tanto o livro Key to Magic quanto a Chayenne's Magical Key no inventário.\n\nA quest concede uma Beach Backpack contendo itens como Music Box, Blue Rose e Dracoyle Statue, além de desbloquear acesso ao Chayenne's Realm. A Music Box é usada para domar certos mounts com 100% de sucesso.`,
      myths: `📜 A Chave Não Teria Propósito: Muitos jogadores acreditavam que a chave era apenas um item decorativo sem utilidade. Esse mito foi desmentido pela própria Chayenne, que confirmou que havia uso.\n\n📜 Music Box Domestica Qualquer Criatura: Meio-mito — a Music Box funciona somente em uma lista específica de criaturas (montarias favoritas de Chayenne) e é consumida no processo, mas tem taxa de sucesso 100% nas que suporta.`,
      sources: 'TibiaWiki (Fandom), TibiaWiki Brasil, OTLand, Tibia.com, TibiaPedia',
    },
  ];

  for (const item of seedItems) {
    database.runSync(
      'INSERT INTO items (id, name, image_url, rarity, summary, origin, lore, myths, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [item.id, item.name, item.image_url, item.rarity, item.summary, item.origin, item.lore, item.myths, item.sources],
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
