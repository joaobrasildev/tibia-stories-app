import type { Item, ItemFilter, ItemSort, ItemRarity } from '@/types/item';

const RARITY_ORDER: Record<string, number> = {
    'Legendary': 3,
    'Very Rare': 2,
    'Rare': 1,
};

export function filterItems(items: Item[], filter: ItemFilter): Item[] {
    let result = items;

    // Filter by rarity
    if (filter.rarity !== 'all') {
        result = result.filter((item) => item.rarity === filter.rarity);
    }

    // Filter by search query
    if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        result = result.filter((item) =>
            item.name.toLowerCase().includes(query),
        );
    }

    return result;
}

export function sortItems(items: Item[], sort: ItemSort): Item[] {
    const sorted = [...items];

    switch (sort) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'rarity-desc':
            return sorted.sort(
                (a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0),
            );
        case 'rarity-asc':
            return sorted.sort(
                (a, b) => (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0),
            );
        default:
            return sorted;
    }
}

export function getRarityLabel(rarity: ItemRarity): string {
    return `★ ${rarity}`;
}
