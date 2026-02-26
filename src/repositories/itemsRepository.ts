import { database } from './database';
import type { Item } from '@/types/item';

export function getAllItems(): Item[] {
    return database.getAllSync<Item>('SELECT * FROM items ORDER BY name');
}

export function getItemById(id: number): Item | null {
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

export function seedItems(items: Omit<Item, 'id' | 'created_at' | 'updated_at'>[]): void {
    for (const item of items) {
        database.runSync(
            'INSERT INTO items (name, image_url, rarity, history, myths) VALUES (?, ?, ?, ?, ?)',
            [item.name, item.image_url ?? null, item.rarity, item.history ?? null, item.myths ?? null],
        );
    }
}
