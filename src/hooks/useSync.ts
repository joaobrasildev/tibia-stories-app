/**
 * Hook useSync — pull-to-refresh reutilizável.
 * Referência: execution-plan.md Fase 11, Passo 3
 *
 * Usado em DepotScreen e CharsScreen para re-sync manual.
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { syncFromFirestore } from '@/services/syncService';
import { useAppStore } from '@/stores/useAppStore';
import { useCharsStore } from '@/stores/useCharsStore';

export function useSync(): { isSyncing: boolean; onRefresh: () => Promise<void> } {
    const isSyncing = useAppStore((s) => s.isSyncing);

    const onRefresh = useCallback(async () => {
        try {
            await syncFromFirestore();
            useCharsStore.getState().loadChars();
        } catch {
            Alert.alert(
                'Erro de sincronização',
                'Não foi possível atualizar os dados. Verifique sua conexão e tente novamente.',
            );
        }
    }, []);

    return { isSyncing, onRefresh };
}
