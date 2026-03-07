/**
 * Purchase Service — Encapsula react-native-iap.
 * Referência: architecture.md seção 7.9
 *
 * 3 produtos consumíveis de destaque:
 * - ts_highlight_7d   (R$ 5,00 / 7 dias)
 * - ts_highlight_30d  (R$ 15,00 / 30 dias)
 * - ts_highlight_365d (R$ 100,00 / 365 dias)
 *
 * ⚠️ Usa try/catch na inicialização para evitar crash se o módulo nativo
 *    não estiver disponível (Expo Go, simulador sem StoreKit).
 */

import { Platform } from 'react-native';
import {
    initConnection,
    endConnection,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    purchaseUpdatedListener,
    purchaseErrorListener,
    ErrorCode,
    type Purchase,
    type PurchaseError,
    type EventSubscription,
} from 'react-native-iap';
import type { HighlightPlan } from '@/types/market';

// ── Types ──────────────────────────────────────────────────

export interface HighlightPlanInfo {
    plan: HighlightPlan;
    durationDays: number;
    priceBrl: number;
    label: string;
    productId: string;
}

export interface PurchaseResult {
    success: boolean;
    transactionId: string;
    error?: string;
}

// ── Plans ──────────────────────────────────────────────────

const HIGHLIGHT_PLANS: HighlightPlanInfo[] = [
    {
        plan: '7d',
        durationDays: 7,
        priceBrl: 5.0,
        label: '7 dias — R$ 5,00',
        productId: 'ts_highlight_7d',
    },
    {
        plan: '30d',
        durationDays: 30,
        priceBrl: 15.0,
        label: '30 dias — R$ 15,00',
        productId: 'ts_highlight_30d',
    },
    {
        plan: '365d',
        durationDays: 365,
        priceBrl: 100.0,
        label: '365 dias — R$ 100,00',
        productId: 'ts_highlight_365d',
    },
];

/**
 * Retorna os 3 planos de destaque disponíveis.
 */
export function getHighlightPlans(): HighlightPlanInfo[] {
    return HIGHLIGHT_PLANS;
}

/**
 * Retorna info de um plano específico.
 */
export function getPlanInfo(plan: HighlightPlan): HighlightPlanInfo {
    const info = HIGHLIGHT_PLANS.find((p) => p.plan === plan);
    if (!info) throw new Error(`Plano inválido: ${plan}`);
    return info;
}

// ── State ──────────────────────────────────────────────────

let _connected = false;
let _available = true;
let _purchaseUpdateSub: EventSubscription | null = null;
let _purchaseErrorSub: EventSubscription | null = null;

// ── Init ───────────────────────────────────────────────────

/**
 * Inicializa conexão com a store de IAP.
 * Deve ser chamado uma vez ao abrir a tela de destaque.
 * Se o módulo nativo não existir, falha silenciosamente.
 */
export async function initializePurchases(): Promise<void> {
    if (_connected) return;

    try {
        await initConnection();
        _connected = true;
        _available = true;
    } catch (err) {
        console.warn('[purchaseService] IAP init failed:', err);
        _available = false;
    }
}

/**
 * Desconecta da store de IAP e remove listeners.
 */
export async function cleanupPurchases(): Promise<void> {
    _purchaseUpdateSub?.remove();
    _purchaseUpdateSub = null;
    _purchaseErrorSub?.remove();
    _purchaseErrorSub = null;

    if (!_connected) return;

    try {
        await endConnection();
    } catch (err) {
        console.warn('[purchaseService] IAP cleanup failed:', err);
    }
    _connected = false;
}

/**
 * Retorna true se o módulo IAP está disponível no runtime atual.
 */
export async function isIAPAvailable(): Promise<boolean> {
    if (_connected) return true;

    try {
        await initConnection();
        _connected = true;
        _available = true;
        return true;
    } catch {
        _available = false;
        return false;
    }
}

// ── Products ───────────────────────────────────────────────

/**
 * Busca detalhes dos produtos na store.
 */
export async function getHighlightProducts(): Promise<unknown[]> {
    if (!_connected) return [];

    try {
        const productIds = HIGHLIGHT_PLANS.map((p) => p.productId);
        const products = await fetchProducts({
            skus: productIds,
            type: 'in-app',
        });
        return products ?? [];
    } catch (err) {
        console.warn('[purchaseService] Failed to fetch products:', err);
        return [];
    }
}

// ── Purchase ───────────────────────────────────────────────

/**
 * Executa compra do plano de destaque selecionado.
 * Retorna uma Promise que resolve quando a compra é finalizada.
 * Se IAP não estiver disponível, retorna erro amigável sem crash.
 */
export async function purchaseHighlight(plan: HighlightPlan): Promise<PurchaseResult> {
    if (!_connected || !_available) {
        return {
            success: false,
            transactionId: '',
            error: 'Compras não disponíveis neste dispositivo.',
        };
    }

    const planInfo = getPlanInfo(plan);

    return new Promise<PurchaseResult>((resolve) => {
        let resolved = false;

        const safeResolve = (result: PurchaseResult) => {
            if (resolved) return;
            resolved = true;
            _purchaseUpdateSub?.remove();
            _purchaseUpdateSub = null;
            _purchaseErrorSub?.remove();
            _purchaseErrorSub = null;
            resolve(result);
        };

        // Listener de compra bem-sucedida
        _purchaseUpdateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
            if (purchase.productId !== planInfo.productId) return;

            try {
                // Finaliza a transação (consumível — pode comprar novamente)
                await finishTransaction({ purchase, isConsumable: true });

                const txId =
                    purchase.transactionId ??
                    purchase.purchaseToken ??
                    '';

                safeResolve({
                    success: true,
                    transactionId: txId,
                });
            } catch (err) {
                safeResolve({
                    success: false,
                    transactionId: '',
                    error: 'Erro ao finalizar transação.',
                });
            }
        });

        // Listener de erro
        _purchaseErrorSub = purchaseErrorListener((error: PurchaseError) => {
            if (error.code === ErrorCode.UserCancelled) {
                safeResolve({
                    success: false,
                    transactionId: '',
                    error: 'Compra cancelada.',
                });
            } else {
                safeResolve({
                    success: false,
                    transactionId: '',
                    error: error.message || 'Erro ao processar a compra. Tente novamente.',
                });
            }
        });

        // Inicia fluxo de compra na store
        const purchaseRequest =
            Platform.OS === 'ios'
                ? requestPurchase({
                    type: 'in-app',
                    request: {
                        apple: { sku: planInfo.productId },
                    },
                })
                : requestPurchase({
                    type: 'in-app',
                    request: {
                        google: { skus: [planInfo.productId] },
                    },
                });

        purchaseRequest.catch((err: Error) => {
            safeResolve({
                success: false,
                transactionId: '',
                error: err.message || 'Erro ao iniciar compra.',
            });
        });
    });
}

/**
 * Validação básica de receipt.
 * Placeholder para validação server-side futura.
 */
export async function validateReceipt(_receipt: string): Promise<boolean> {
    // TODO: Implementar validação server-side quando backend estiver pronto.
    return true;
}
