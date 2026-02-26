import { create } from 'zustand';
import type { Item, ItemRarity, ItemSort } from '@/types/item';
import { getAllItems } from '@/repositories/itemsRepository';
import { filterItems, sortItems } from '@/rules/itemRules';

interface ItemsState {
    items: Item[];
    filteredItems: Item[];
    searchQuery: string;
    rarityFilter: ItemRarity | 'all';
    sort: ItemSort;
    selectedItem: Item | null;
    // actions
    loadItems: () => void;
    setSearchQuery: (q: string) => void;
    setRarityFilter: (r: ItemRarity | 'all') => void;
    setSort: (s: ItemSort) => void;
    selectItem: (item: Item | null) => void;
    applyFilters: () => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
    items: [],
    filteredItems: [],
    searchQuery: '',
    rarityFilter: 'all',
    sort: 'name-asc',
    selectedItem: null,

    loadItems: () => {
        const items = getAllItems();
        set({ items });
        get().applyFilters();
    },

    setSearchQuery: (q) => {
        set({ searchQuery: q });
        get().applyFilters();
    },

    setRarityFilter: (r) => {
        set({ rarityFilter: r });
        get().applyFilters();
    },

    setSort: (s) => {
        set({ sort: s });
        get().applyFilters();
    },

    selectItem: (item) => set({ selectedItem: item }),

    applyFilters: () => {
        const { items, searchQuery, rarityFilter, sort } = get();
        const filtered = filterItems(items, { searchQuery, rarity: rarityFilter });
        const sorted = sortItems(filtered, sort);
        set({ filteredItems: sorted });
    },
}));
