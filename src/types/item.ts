export type ItemRarity = 'Legendary' | 'Very Rare' | 'Rare';

export interface Item {
    id: number;
    name: string;
    image_url: string | null;
    rarity: ItemRarity;
    history: string | null;
    myths: string | null;
    created_at: string;
    updated_at: string;
}

export type ItemSort = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';

export interface ItemFilter {
    searchQuery: string;
    rarity: ItemRarity | 'all';
}
