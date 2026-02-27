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
    { full: 'Knight', abbr: 'EK', label: 'EK', color: '#C0392B' },
    { full: 'Paladin', abbr: 'RP', label: 'RP', color: '#27AE60' },
    { full: 'Druid', abbr: 'ED', label: 'ED', color: '#8E44AD' },
    { full: 'Sorcerer', abbr: 'MS', label: 'MS', color: '#2980B9' },
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

// Imagens de outfit (male, addon 1+2) do Tibia Wiki — uma por vocação
const VOCATION_OUTFIT_URLS: Record<VocationAbbr, string> = {
    EK: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Warrior_Male_Addon_3.gif',
    RP: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Assassin_Male_Addon_3.gif',
    ED: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Druid_Male_Addon_3.gif',
    MS: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Mage_Male_Addon_3.gif',
    MO: 'https://tibia.fandom.com/wiki/Special:FilePath/Outfit_Monk_Male_Addon_3.gif',
};

export function getVocationOutfitUrl(vocation: string): string {
    const abbr = getVocationAbbr(vocation);
    return VOCATION_OUTFIT_URLS[abbr];
}
