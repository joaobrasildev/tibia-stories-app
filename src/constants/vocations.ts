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

// Imagens de outfit (male, addon 1+2) — assets locais (animated GIF, 4 frames)
import type { ImageSourcePropType } from 'react-native';

const VOCATION_OUTFIT_ASSETS: Record<VocationAbbr, ImageSourcePropType> = {
    EK: require('../../assets/outfits/ek.gif'),
    RP: require('../../assets/outfits/rp.gif'),
    ED: require('../../assets/outfits/ed.gif'),
    MS: require('../../assets/outfits/ms.gif'),
    MO: require('../../assets/outfits/mo.gif'),
};

export function getVocationOutfitSource(vocation: string): ImageSourcePropType {
    const abbr = getVocationAbbr(vocation);
    return VOCATION_OUTFIT_ASSETS[abbr];
}
