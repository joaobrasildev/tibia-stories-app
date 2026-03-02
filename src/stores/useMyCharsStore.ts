import { create } from 'zustand';
import type { Character } from '@/types/character';
import { fetchCharactersByUser, updateCharacter } from '@/services/firestoreService';
import { getCharsByUserToken, upsertCharacter, getCharById } from '@/repositories/charsRepository';
import { fetchCharacter } from '@/services/tibiaDataService';
import { isTokenInComment } from '@/rules/verificationRules';
import { useCharsStore } from '@/stores/useCharsStore';
import { requireOnline } from '@/services/syncService';

interface MyCharsState {
    myChars: Character[];
    isLoading: boolean;
    error: string | null;
    // actions
    loadMyChars: (userToken: string) => Promise<void>;
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

    // Fase 10: Salva história do char (Firestore → SQLite write-through)
    saveStory: async (charId: string, title: string, content: string) => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();

            const char = getCharById(charId);
            if (!char) {
                set({ isLoading: false, error: 'Char não encontrado localmente.' });
                return;
            }

            if (!char.is_verified) {
                set({ isLoading: false, error: 'Char precisa estar vinculado para editar a história.' });
                return;
            }

            const now = new Date().toISOString();
            const updates = { story_title: title, story_content: content, updated_at: now };

            // Write-through: Firestore (fonte da verdade) → SQLite local
            await updateCharacter(charId, updates);
            const updatedChar: Character = { ...char, ...updates };
            upsertCharacter(updatedChar);

            // Atualiza store local (myChars)
            set((state) => ({
                myChars: state.myChars.map((c) =>
                    c.id === charId ? updatedChar : c,
                ),
                isLoading: false,
            }));

            // Recarrega lista pública para refletir a nova história
            useCharsStore.getState().loadChars();
        } catch {
            set({ isLoading: false, error: 'Erro ao salvar história. Verifique sua conexão.' });
        }
    },

    // Stub — será implementado na Fase 12 (Destaque + Compra)
    purchaseHighlight: async (_charId: string) => {
        throw new Error('Será implementado na Fase 12');
    },

    clearError: () => set({ error: null }),
}));
