import { create } from 'zustand';
import type { Character, Vocation, CharSort } from '@/types/character';
import { getAllVerifiedCharsWithStory, getHighlightedChars, getRecentChars, getDistinctWorlds } from '@/repositories/charsRepository';
import { filterChars, sortChars } from '@/rules/charRules';

interface CharsState {
    chars: Character[];
    filteredChars: Character[];
    highlightedChars: Character[];
    recentChars: Character[];
    worlds: string[];
    searchQuery: string;
    vocationFilter: Vocation | 'all';
    worldFilter: string | 'all';
    sort: CharSort;
    selectedChar: Character | null;
    // actions
    loadChars: () => void;
    setSearchQuery: (q: string) => void;
    setVocationFilter: (v: Vocation | 'all') => void;
    setWorldFilter: (w: string | 'all') => void;
    setSort: (s: CharSort) => void;
    selectChar: (char: Character | null) => void;
    applyFilters: () => void;
}

export const useCharsStore = create<CharsState>((set, get) => ({
    chars: [],
    filteredChars: [],
    highlightedChars: [],
    recentChars: [],
    worlds: [],
    searchQuery: '',
    vocationFilter: 'all',
    worldFilter: 'all',
    sort: 'name-asc',
    selectedChar: null,

    loadChars: () => {
        const chars = getAllVerifiedCharsWithStory();
        const highlighted = getHighlightedChars();
        const recent = getRecentChars(3);
        const worlds = getDistinctWorlds();
        set({ chars, highlightedChars: highlighted, recentChars: recent, worlds });
        get().applyFilters();
    },

    setSearchQuery: (q) => {
        set({ searchQuery: q });
        get().applyFilters();
    },

    setVocationFilter: (v) => {
        set({ vocationFilter: v });
        get().applyFilters();
    },

    setWorldFilter: (w) => {
        set({ worldFilter: w });
        get().applyFilters();
    },

    setSort: (s) => {
        set({ sort: s });
        get().applyFilters();
    },

    selectChar: (char) => set({ selectedChar: char }),

    applyFilters: () => {
        const { chars, searchQuery, vocationFilter, worldFilter, sort } = get();
        const filtered = filterChars(chars, {
            searchQuery,
            vocation: vocationFilter,
            world: worldFilter,
        });
        const sorted = sortChars(filtered, sort);
        set({ filteredChars: sorted });
    },
}));
