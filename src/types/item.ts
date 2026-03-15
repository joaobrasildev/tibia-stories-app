export type ItemRarity = 'Legendary' | 'Very Rare' | 'Rare';

export interface Item {
    id: string;
    name: string;
    image_url: string | null;
    rarity: ItemRarity;
    summary: string | null;
    origin: string | null;
    lore: string | null;
    myths: string | null;
    sources: string | null;
    created_at: string;
    updated_at: string;
}

export type ItemSort = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';

export interface ItemFilter {
    searchQuery: string;
    rarity: ItemRarity | 'all';
}
