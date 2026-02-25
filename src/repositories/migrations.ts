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

    const seedItems = [
        { name: 'Golden Armor', rarity: 'Legendary' },
        { name: 'Magic Plate Armor', rarity: 'Rare' },
        { name: 'Blessed Shield', rarity: 'Legendary' },
        { name: "Ferumbras' Hat", rarity: 'Very Rare' },
        { name: 'Thunder Hammer', rarity: 'Legendary' },
        { name: 'Demon Helmet', rarity: 'Rare' },
        { name: 'Horned Helmet', rarity: 'Legendary' },
        { name: 'Winged Helmet', rarity: 'Legendary' },
        { name: 'Dragon Scale Mail', rarity: 'Rare' },
        { name: 'Havoc Blade', rarity: 'Very Rare' },
        { name: 'Annihilation Bear', rarity: 'Legendary' },
        { name: 'Warlord Sword', rarity: 'Rare' },
        { name: 'Great Shield', rarity: 'Very Rare' },
        { name: 'Pair of Soft Boots', rarity: 'Rare' },
        { name: 'Surprise Bag', rarity: 'Rare' },
    ];

    for (const item of seedItems) {
        database.runSync(
            'INSERT INTO items (name, rarity) VALUES (?, ?)',
            [item.name, item.rarity],
        );
    }
}
