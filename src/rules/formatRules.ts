import type { ItemRarity } from '@/types/item';
import { getRarityColor } from '@/constants/rarities';
import { getVocationInfo } from '@/constants/vocations';

export function formatLevel(level: number): string {
    return `Level ${level}`;
}

export function formatRelativeDate(date: string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSeconds < 60) return 'agora mesmo';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffWeeks === 1) return 'há 1 semana';
    if (diffWeeks < 4) return `há ${diffWeeks} semanas`;
    if (diffMonths === 1) return 'há 1 mês';
    if (diffMonths < 12) return `há ${diffMonths} meses`;

    return target.toLocaleDateString('pt-BR');
}

export function formatVocation(vocation: string): { abbr: string; color: string } {
    const info = getVocationInfo(vocation);
    return {
        abbr: info?.abbr ?? vocation,
        color: info?.color ?? '#D4A66A',
    };
}

export function formatRarity(rarity: ItemRarity): { label: string; color: string } {
    return {
        label: rarity,
        color: getRarityColor(rarity),
    };
}
