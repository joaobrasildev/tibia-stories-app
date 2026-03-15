import { database } from './database';
import type { Item } from '@/types/item';

export function getAllItems(): Item[] {
    return database.getAllSync<Item>('SELECT * FROM items ORDER BY name');
}

export function getItemById(id: string): Item | null {
    return database.getFirstSync<Item>(
        'SELECT * FROM items WHERE id = ?',
        [id],
    );
}

export function getItemsByRarity(rarity: string): Item[] {
    return database.getAllSync<Item>(
        'SELECT * FROM items WHERE rarity = ? ORDER BY name',
        [rarity],
    );
}

export function getItemCount(): number {
    const result = database.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM items',
    );
    return result?.count ?? 0;
}

export function seedItems(items: Omit<Item, 'created_at' | 'updated_at'>[]): void {
    for (const item of items) {
        database.runSync(
            'INSERT INTO items (id, name, image_url, rarity, summary, origin, lore, myths, sources) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [item.id, item.name, item.image_url ?? null, item.rarity, item.summary ?? null, item.origin ?? null, item.lore ?? null, item.myths ?? null, item.sources ?? null],
        );
    }
}

export function upsertItem(item: Item): void {
    database.runSync(
        `INSERT OR REPLACE INTO items (id, name, image_url, rarity, summary, origin, lore, myths, sources, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.name, item.image_url ?? null, item.rarity, item.summary ?? null, item.origin ?? null, item.lore ?? null, item.myths ?? null, item.sources ?? null, item.created_at, item.updated_at],
    );
}
