export type Vocation = 'Elite Knight' | 'Royal Paladin' | 'Elder Druid' | 'Master Sorcerer' | 'Monk' | 'Knight' | 'Paladin' | 'Druid' | 'Sorcerer';
export type VocationAbbr = 'EK' | 'RP' | 'ED' | 'MS' | 'MO';

export interface Character {
    id: string;
    user_token: string | null;
    name: string;
    world: string;
    vocation: string;
    level: number;
    is_verified: boolean;
    is_highlighted: boolean;
    highlight_until: string | null;
    story_title: string | null;
    story_content: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export type CharSort = 'name-asc' | 'name-desc' | 'level-asc' | 'level-desc';

export interface CharFilter {
    searchQuery: string;
    vocation: Vocation | 'all';
    world: string | 'all';
}
