import { create } from 'zustand';
import type { Character } from '@/types/character';
import { fetchCharactersByUser, createCharacter, checkCharacterExists, updateCharacter } from '@/services/firestoreService';
import { getCharsByUserToken, upsertCharacter, getCharById } from '@/repositories/charsRepository';
import { fetchCharacter } from '@/services/tibiaDataService';
import { isTokenInComment } from '@/rules/verificationRules';
import { useAuthStore } from '@/stores/useAuthStore';

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
        } catch (err) {
            console.error('[loadMyChars] Firestore query failed:', err);
            // Fallback: lê do SQLite local
            try {
                const localChars = getCharsByUserToken(userToken);
                set({ myChars: localChars, isLoading: false });
            } catch (localErr) {
                console.error('[loadMyChars] SQLite fallback failed:', localErr);
                set({ myChars: [], isLoading: false, error: 'Erro ao carregar seus chars.' });
            }
        }
    },

    // Busca char na TibiaData API, cria no Firestore e sincroniza localmente
    addChar: async (name: string) => {
        set({ isLoading: true, error: null });
        try {
            const tibiaChar = await fetchCharacter(name);
            if (!tibiaChar) {
                set({ isLoading: false, error: 'Char não encontrado na API.' });
                throw new Error('Char não encontrado');
            }

            // Verifica existência no Firestore
            const existing = await checkCharacterExists(tibiaChar.name);
            if (existing?.is_verified) {
                set({ isLoading: false, error: 'Este char já está vinculado a outra conta.' });
                throw new Error('Char já vinculado');
            }

            const now = new Date().toISOString();
            const currentUserToken = useAuthStore.getState().userToken;
            const charData = {
                user_token: currentUserToken,
                name: tibiaChar.name,
                world: tibiaChar.world,
                vocation: tibiaChar.vocation,
                level: tibiaChar.level,
                is_verified: false,
                is_highlighted: false,
                highlight_until: null,
                story_title: null,
                story_content: null,
                avatar_url: null,
                created_at: now,
                updated_at: now,
            };

            const docId = await createCharacter(charData);
            const char: Character = { id: docId, ...charData };
            upsertCharacter(char);

            set((state) => ({
                myChars: [...state.myChars, char],
                isLoading: false,
            }));
            return char;
        } catch (err) {
            set({ isLoading: false });
            throw err;
        }
    },

    // Quest de Vínculo: verifica token no comment via TibiaData API
    verifyChar: async (charId: string) => {
        set({ isLoading: true, error: null });
        try {
            const char = getCharById(charId);
            if (!char) {
                set({ isLoading: false, error: 'Char não encontrado localmente.' });
                return false;
            }

            const tibiaChar = await fetchCharacter(char.name);
            if (!tibiaChar) {
                set({ isLoading: false, error: 'Não foi possível buscar o char na API.' });
                return false;
            }

            const userToken = char.user_token;
            if (!userToken) {
                set({ isLoading: false, error: 'Token de usuário não encontrado.' });
                return false;
            }

            const found = isTokenInComment(tibiaChar.comment, userToken);
            if (!found) {
                set({ isLoading: false, error: '❌ Token não encontrado no comment.' });
                return false;
            }

            // Atualiza Firestore + SQLite
            const now = new Date().toISOString();
            await updateCharacter(charId, { is_verified: true, updated_at: now });
            upsertCharacter({ ...char, is_verified: true, updated_at: now });

            // Atualiza store local
            set((state) => ({
                myChars: state.myChars.map((c) =>
                    c.id === charId ? { ...c, is_verified: true, updated_at: now } : c,
                ),
                isLoading: false,
            }));
            return true;
        } catch {
            set({ isLoading: false, error: 'Erro ao verificar o char.' });
            return false;
        }
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
