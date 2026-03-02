/**
 * Hook useCharVerify — orquestra o fluxo completo da Quest de Vínculo.
 * Referência: architecture.md seção 13.5
 */

import { useState, useCallback } from 'react';
import { fetchCharacter } from '@/services/tibiaDataService';
import { updateCharacter } from '@/services/firestoreService';
import { upsertCharacter, getCharById } from '@/repositories/charsRepository';
import { isTokenInComment } from '@/rules/verificationRules';
import { useMyCharsStore } from '@/stores/useMyCharsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { requireOnline } from '@/services/syncService';
import { APP_TEXTS } from '@/constants/app';

interface UseCharVerifyReturn {
    verify: (charId: string, charName: string) => Promise<boolean>;
    isVerifying: boolean;
    isSuccess: boolean;
    error: string | null;
    reset: () => void;
}

export function useCharVerify(): UseCharVerifyReturn {
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userToken = useAuthStore((s) => s.userToken);
    const loadMyChars = useMyCharsStore((s) => s.loadMyChars);

    const verify = useCallback(
        async (charId: string, charName: string): Promise<boolean> => {
            setIsVerifying(true);
            setError(null);
            setIsSuccess(false);

            try {
                requireOnline();

                if (!userToken) {
                    setError('Token de usuário não encontrado. Faça login novamente.');
                    setIsVerifying(false);
                    return false;
                }

                // 1. Busca char na TibiaData API
                const tibiaChar = await fetchCharacter(charName);
                if (!tibiaChar) {
                    setError('Não foi possível buscar o char na API. Tente novamente.');
                    setIsVerifying(false);
                    return false;
                }

                // 2. Verifica se o comment contém o token
                const found = isTokenInComment(tibiaChar.comment, userToken);
                if (!found) {
                    setError('❌ Token não encontrado no comment. Verifique o comment em tibia.com.');
                    setIsVerifying(false);
                    return false;
                }

                // 3. Atualiza no Firestore
                const now = new Date().toISOString();
                await updateCharacter(charId, {
                    is_verified: true,
                    updated_at: now,
                });

                // 4. Atualiza no SQLite local
                const localChar = getCharById(charId);
                if (localChar) {
                    upsertCharacter({
                        ...localChar,
                        is_verified: true,
                        updated_at: now,
                    });
                }

                // 5. Recarrega store
                await loadMyChars(userToken);

                setIsSuccess(true);
                setIsVerifying(false);
                return true;
            } catch {
                setError('Erro ao verificar o char. Tente novamente.');
                setIsVerifying(false);
                return false;
            }
        },
        [userToken, loadMyChars],
    );

    const reset = useCallback(() => {
        setIsVerifying(false);
        setIsSuccess(false);
        setError(null);
    }, []);

    return { verify, isVerifying, isSuccess, error, reset };
}
