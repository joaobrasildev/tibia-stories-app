import { create } from 'zustand';
import type { Character } from '@/types/character';
import { fetchCharactersByUser } from '@/services/firestoreService';
import { getCharsByUserToken, upsertCharacter } from '@/repositories/charsRepository';

interface MyCharsState {
    myChars: Character[];
    isLoading: boolean;
    error: string | null;
    // actions
    loadMyChars: (userToken: string) => Promise<void>;
    addChar: (name: string) => Promise<Character>;
    verifyChar: (charId: string) => Promise<boolean>;
    saveStory: (charId: string, title: string, content: string) => Promise<void>;
    purchaseHighlight: (charId: string) => Promise<void>;
    clearError: () => void;
}

export const useMyCharsStore = create<MyCharsState>((set, get) => ({
    myChars: [],
    isLoading: false,
    error: null,

    loadMyChars: async (userToken: string) => {
        set({ isLoading: true, error: null });
        try {
            // Tenta buscar do Firestore (fonte da verdade)
            const chars = await fetchCharactersByUser(userToken);

            // Sincroniza localmente no SQLite
            for (const char of chars) {
                upsertCharacter(char);
            }

            set({ myChars: chars, isLoading: false });
        } catch {
            // Fallback: lê do SQLite local
            try {
                const localChars = getCharsByUserToken(userToken);
                set({ myChars: localChars, isLoading: false });
            } catch {
                set({ myChars: [], isLoading: false, error: 'Erro ao carregar seus chars.' });
            }
        }
    },

    // Stub — será implementado na Fase 9 (Exiva + TibiaData API)
    addChar: async (_name: string) => {
        throw new Error('Será implementado na Fase 9');
    },

    // Stub — será implementado na Fase 9 (Quest de Vínculo)
    verifyChar: async (_charId: string) => {
        throw new Error('Será implementado na Fase 9');
    },

    // Stub — será implementado na Fase 10 (Editar História)
    saveStory: async (_charId: string, _title: string, _content: string) => {
        throw new Error('Será implementado na Fase 10');
    },

    // Stub — será implementado na Fase 12 (Destaque + Compra)
    purchaseHighlight: async (_charId: string) => {
        throw new Error('Será implementado na Fase 12');
    },

    clearError: () => set({ error: null }),
}));
