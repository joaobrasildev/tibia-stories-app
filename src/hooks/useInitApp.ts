import { useEffect, useRef } from 'react';
import { openDatabase } from '@/repositories/database';
import { runMigrations } from '@/repositories/migrations';
import { getUserToken, setUserToken } from '@/repositories/userConfigRepository';
import { initializeFirebase } from '@/services/firebaseService';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useItemsStore } from '@/stores/useItemsStore';
import { useCharsStore } from '@/stores/useCharsStore';
import { expireHighlights } from '@/repositories/charsRepository';
import { startConnectivityListener, syncIfOnline } from '@/services/syncService';
import { initializeAds } from '@/services/adService';
import { generateToken } from '@/utils/tokenGenerator';

/**
 * Hook de inicialização do app — orquestra o boot flow.
 * Referência: architecture.md seção 12
 *
 * Fase 11: boot flow completo com 10 passos + passo 4.5 (connectivity listener).
 */
export function useInitApp(): { isReady: boolean } {
    const isReady = useAppStore((s) => s.isReady);
    const authUnsubRef = useRef<(() => void) | null>(null);
    const netUnsubRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        let mounted = true;

        async function boot() {
            try {
                // Passo 1: Abrir banco SQLite (WAL mode)
                openDatabase();

                // Passo 2: Executar migrations + seed de itens
                runMigrations();

                // Passo 3: Carregar config local (user_token)
                let localToken = getUserToken();
                if (!localToken) {
                    localToken = generateToken();
                    setUserToken(localToken);
                }
                useAuthStore.getState().setUserToken(localToken);

                // Passo 4: Inicializar Firebase
                initializeFirebase();

                // Passo 4.5: Iniciar listener de conectividade
                netUnsubRef.current = startConnectivityListener();

                // Passo 5: Verificar auth state (Firebase Auth onAuthStateChanged)
                authUnsubRef.current = useAuthStore.getState().initAuthListener();

                // Passo 6: Sync Firebase → SQLite (se online)
                await syncIfOnline();

                // Passo 6.5: Inicializar SDK de anúncios (AdMob)
                try {
                    await initializeAds();
                } catch (adError) {
                    console.warn('[useInitApp] AdMob init failed (non-blocking):', adError);
                }

                // Passo 7: Carregar itens do SQLite → store
                useItemsStore.getState().loadItems();

                // Passo 8: Carregar chars do SQLite → store
                useCharsStore.getState().loadChars();

                // Passo 9: Verificar destaques expirados (local)
                expireHighlights();

                // Passo 10: Sinalizar app pronto
                if (mounted) {
                    useAppStore.getState().setReady(true);
                }
            } catch (error) {
                console.error('[useInitApp] Boot flow error:', error);
                // Mesmo com erro, libera a UI para não travar no splash
                if (mounted) {
                    useAppStore.getState().setReady(true);
                }
            }
        }

        boot();

        return () => {
            mounted = false;
            // Cleanup: unsubscribe do auth listener
            if (authUnsubRef.current) {
                authUnsubRef.current();
                authUnsubRef.current = null;
            }
            // Cleanup: unsubscribe do connectivity listener
            if (netUnsubRef.current) {
                netUnsubRef.current();
                netUnsubRef.current = null;
            }
        };
    }, []);

    return { isReady };
}
