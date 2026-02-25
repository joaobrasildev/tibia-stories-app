import type { ItemRarity } from '@/types/item';

export interface RarityInfo {
    key: ItemRarity;
    label: string;
    emoji: string;
    color: string;
    order: number;
}

export const RARITIES: RarityInfo[] = [
    { key: 'Legendary', label: 'Legendary', emoji: '🟠', color: '#FF8C00', order: 3 },
    { key: 'Very Rare', label: 'Very Rare', emoji: '🟣', color: '#9B59B6', order: 2 },
    { key: 'Rare', label: 'Rare', emoji: '🔵', color: '#3498DB', order: 1 },
];

export function getRarityInfo(rarity: string): RarityInfo | undefined {
    return RARITIES.find((r) => r.key === rarity);
}

export function getRarityColor(rarity: string): string {
    const info = getRarityInfo(rarity);
    return info?.color ?? '#3498DB';
}

export function getRarityOrder(rarity: string): number {
    const info = getRarityInfo(rarity);
    return info?.order ?? 0;
}
