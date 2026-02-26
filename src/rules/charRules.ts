import type { Character, CharFilter, CharSort, Vocation } from '@/types/character';
import { getVocationAbbr } from '@/constants/vocations';

export function filterChars(chars: Character[], filter: CharFilter): Character[] {
    let result = chars;

    // Filter by search query (name or world)
    if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        result = result.filter(
            (c) =>
                c.name.toLowerCase().includes(query) ||
                c.world.toLowerCase().includes(query),
        );
    }

    // Filter by vocation
    if (filter.vocation !== 'all') {
        result = result.filter((c) => c.vocation === filter.vocation);
    }

    // Filter by world
    if (filter.world !== 'all') {
        result = result.filter((c) => c.world === filter.world);
    }

    return result;
}

export function sortChars(chars: Character[], sort: CharSort): Character[] {
    const sorted = [...chars];

    switch (sort) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'level-desc':
            return sorted.sort((a, b) => b.level - a.level);
        case 'level-asc':
            return sorted.sort((a, b) => a.level - b.level);
        default:
            return sorted;
    }
}

export function validateCharName(name: string): { valid: boolean; error?: string } {
    const trimmed = name.trim();
    if (!trimmed) {
        return { valid: false, error: 'Nome do char não pode ser vazio' };
    }
    if (trimmed.length < 2) {
        return { valid: false, error: 'Nome muito curto (mínimo 2 caracteres)' };
    }
    if (trimmed.length > 30) {
        return { valid: false, error: 'Nome muito longo (máximo 30 caracteres)' };
    }
    return { valid: true };
}

export function vocationToAbbr(vocation: string): string {
    return getVocationAbbr(vocation);
}
