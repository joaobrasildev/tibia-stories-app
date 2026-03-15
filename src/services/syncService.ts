/**
 * Sync Service — Sincronização Firebase ↔ SQLite + conectividade.
 * Referência: architecture.md seção 7.7
 *
 * Fase 11: sync completo, connectivity listener, requireOnline guard.
 */

import NetInfo from '@react-native-community/netinfo';
import { fetchAllCharacters, fetchAllItems } from '@/services/firestoreService';
import { upsertCharacter } from '@/repositories/charsRepository';
import { upsertItem } from '@/repositories/itemsRepository';
import { useAppStore } from '@/stores/useAppStore';

// ── Sync ───────────────────────────────────────────────────

/**
 * Sync completo: Firestore → SQLite.
 * Busca todos os chars verificados do Firestore e faz upsert no SQLite.
 * `updated_at` resolve conflitos (mais recente vence via INSERT OR REPLACE).
 */
export async function syncFromFirestore(): Promise<void> {
    const { setSyncing, setLastSync } = useAppStore.getState();
    setSyncing(true);

    try {
        const [characters, items] = await Promise.all([
            fetchAllCharacters(),
            fetchAllItems(),
        ]);

        for (const char of characters) {
            upsertCharacter(char);
        }

        for (const item of items) {
            upsertItem(item);
        }

        setLastSync(new Date().toISOString());
    } catch (error) {
        console.error('[syncFromFirestore] Sync failed:', error);
        // Não relança — o app continua com dados locais
    } finally {
        setSyncing(false);
    }
}

/**
 * Sync condicional: só executa se online.
 * Chamado no boot flow (passo 6).
 */
export async function syncIfOnline(): Promise<void> {
    const isOnline = await checkConnectivity();
    if (isOnline) {
        await syncFromFirestore();
    }
}

// ── Conectividade ──────────────────────────────────────────

/**
 * Verificação pontual de conectividade (não listener).
 * Usa NetInfo.fetch() e atualiza useAppStore.isOnline.
 */
export async function checkConnectivity(): Promise<boolean> {
    try {
        const state = await NetInfo.fetch();
        const isConnected = state.isConnected === true;
        useAppStore.getState().setOnline(isConnected);
        return isConnected;
    } catch {
        useAppStore.getState().setOnline(false);
        return false;
    }
}

/**
 * Inicia listener contínuo de conectividade via NetInfo.
 * Atualiza useAppStore.isOnline em tempo real.
 * Deve ser chamado UMA VEZ no boot flow (passo 4.5).
 * Retorna unsubscribe para cleanup.
 *
 * NÃO faz sync automático ao reconectar — o usuário usa pull-to-refresh.
 */
export function startConnectivityListener(): () => void {
    const unsubscribe = NetInfo.addEventListener((state) => {
        useAppStore.getState().setOnline(state.isConnected === true);
    });
    return unsubscribe;
}

/**
 * Guard de conectividade — lança erro se offline.
 * Deve ser chamado no início de TODA operação de escrita.
 * Lê useAppStore.isOnline (atualizado em tempo real pelo listener).
 */
export function requireOnline(): void {
    const { isOnline } = useAppStore.getState();
    if (!isOnline) {
        throw new Error(
            '⚠️ Sem conexão com a internet. Conecte-se para realizar esta ação.',
        );
    }
}
