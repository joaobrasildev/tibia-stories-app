import type { Vocation, VocationAbbr } from '@/types/character';

export interface VocationInfo {
    full: Vocation;
    abbr: VocationAbbr;
    label: string;
    color: string;
}

export const VOCATIONS: VocationInfo[] = [
    { full: 'Elite Knight', abbr: 'EK', label: 'EK', color: '#C0392B' },
    { full: 'Royal Paladin', abbr: 'RP', label: 'RP', color: '#27AE60' },
    { full: 'Elder Druid', abbr: 'ED', label: 'ED', color: '#8E44AD' },
    { full: 'Master Sorcerer', abbr: 'MS', label: 'MS', color: '#2980B9' },
    { full: 'Monk', abbr: 'MO', label: 'MO', color: '#D4A66A' },
];

export function getVocationInfo(vocation: string): VocationInfo | undefined {
    return VOCATIONS.find(
        (v) => v.full === vocation || v.abbr === vocation,
    );
}

export function getVocationAbbr(vocation: string): VocationAbbr {
    const info = getVocationInfo(vocation);
    return info?.abbr ?? 'EK';
}

export function getVocationColor(vocation: string): string {
    const info = getVocationInfo(vocation);
    return info?.color ?? '#D4A66A';
}
