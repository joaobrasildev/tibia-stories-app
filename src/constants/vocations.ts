import type { Vocation, VocationAbbr } from '@/types/character';
import { theme } from '@/theme';

export interface VocationInfo {
    full: Vocation;
    abbr: VocationAbbr;
    label: string;
    color: string;
}

export const VOCATIONS: VocationInfo[] = [
    { full: 'Elite Knight', abbr: 'EK', label: 'EK', color: theme.colors.badgeEK },
    { full: 'Royal Paladin', abbr: 'RP', label: 'RP', color: theme.colors.badgeRP },
    { full: 'Elder Druid', abbr: 'ED', label: 'ED', color: theme.colors.badgeED },
    { full: 'Master Sorcerer', abbr: 'MS', label: 'MS', color: theme.colors.badgeMS },
    { full: 'Monk', abbr: 'MO', label: 'MO', color: theme.colors.badgeMO },
    { full: 'Knight', abbr: 'EK', label: 'EK', color: theme.colors.badgeEK },
    { full: 'Paladin', abbr: 'RP', label: 'RP', color: theme.colors.badgeRP },
    { full: 'Druid', abbr: 'ED', label: 'ED', color: theme.colors.badgeED },
    { full: 'Sorcerer', abbr: 'MS', label: 'MS', color: theme.colors.badgeMS },
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
    return info?.color ?? theme.colors.badgeMO;
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
