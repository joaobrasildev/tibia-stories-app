/**
 * Purchase Service — Encapsula expo-in-app-purchases.
 * Referência: architecture.md seção 7.9
 *
 * 3 produtos consumíveis de destaque:
 * - ts_highlight_7d   (R$ 5,00 / 7 dias)
 * - ts_highlight_30d  (R$ 15,00 / 30 dias)
 * - ts_highlight_365d (R$ 100,00 / 365 dias)
 *
 * ⚠️ Usa dynamic import para evitar crash de "Cannot find native module
 *    ExpoInAppPurchases" em ambientes sem o módulo nativo (Expo Go, simulador).
 */

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

// ── Lazy-loaded IAP module ─────────────────────────────────

type IAPModule = typeof import('expo-in-app-purchases');

let _iapModule: IAPModule | null = null;
let _iapLoadError: string | null = null;

/**
 * Carrega o módulo IAP sob demanda.
 * Se o módulo nativo não estiver disponível (Expo Go, simulador sem StoreKit),
 * retorna null e guarda a mensagem de erro.
 */
async function getIAPModule(): Promise<IAPModule | null> {
    if (_iapModule) return _iapModule;
    if (_iapLoadError) return null;

    try {
        const mod = await import('expo-in-app-purchases');
        // Valida se o módulo nativo está realmente disponível
        if (typeof mod.connectAsync !== 'function') {
            throw new Error('Módulo nativo ExpoInAppPurchases não disponível.');
        }
        _iapModule = mod;
        return _iapModule;
    } catch (err) {
        _iapLoadError =
            err instanceof Error
                ? err.message
                : 'Módulo de compras não disponível neste dispositivo.';
        console.warn('[purchaseService] IAP module unavailable:', _iapLoadError);
        return null;
    }
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

let isConnected = false;

// ── Helpers ────────────────────────────────────────────────

function unavailableResult(error?: string): PurchaseResult {
    return {
        success: false,
        transactionId: '',
        error: error ?? _iapLoadError ?? 'Compras não disponíveis neste dispositivo.',
    };
}

// ── Init ───────────────────────────────────────────────────

/**
 * Inicializa conexão com a store de IAP.
 * Deve ser chamado uma vez ao abrir a tela de destaque.
 * Se o módulo nativo não existir, falha silenciosamente.
 */
export async function initializePurchases(): Promise<void> {
    if (isConnected) return;

    const iap = await getIAPModule();
    if (!iap) return;

    await iap.connectAsync();
    isConnected = true;
}

/**
 * Desconecta da store de IAP.
 */
export async function cleanupPurchases(): Promise<void> {
    if (!isConnected) return;

    const iap = await getIAPModule();
    if (!iap) return;

    await iap.disconnectAsync();
    isConnected = false;
}

/**
 * Retorna true se o módulo IAP está disponível no runtime atual.
 */
export async function isIAPAvailable(): Promise<boolean> {
    const iap = await getIAPModule();
    return iap !== null;
}

// ── Products ───────────────────────────────────────────────

/**
 * Busca detalhes do produto na store pelo plano.
 */
export async function getHighlightProduct(plan: HighlightPlan): Promise<unknown | null> {
    const iap = await getIAPModule();
    if (!iap) return null;

    const planInfo = getPlanInfo(plan);
    const { responseCode, results } = await iap.getProductsAsync([planInfo.productId]);

    if (responseCode === iap.IAPResponseCode.OK && results && results.length > 0) {
        return results[0];
    }
    return null;
}

// ── Purchase ───────────────────────────────────────────────

/**
 * Executa compra do plano de destaque selecionado.
 * Retorna uma Promise que resolve quando a compra é finalizada.
 * Se IAP não estiver disponível, retorna erro amigável sem crash.
 */
export async function purchaseHighlight(plan: HighlightPlan): Promise<PurchaseResult> {
    const iap = await getIAPModule();
    if (!iap) return unavailableResult();

    const planInfo = getPlanInfo(plan);

    return new Promise((resolve) => {
        iap.setPurchaseListener(async ({ responseCode, results }) => {
            if (responseCode === iap.IAPResponseCode.OK && results) {
                const purchase = results.find(
                    (p) => p.productId === planInfo.productId,
                );

                if (purchase) {
                    if (
                        purchase.purchaseState === iap.InAppPurchaseState.PURCHASED &&
                        !purchase.acknowledged
                    ) {
                        // Finaliza transação como consumível (pode comprar novamente)
                        await iap.finishTransactionAsync(purchase, true);

                        resolve({
                            success: true,
                            transactionId: purchase.orderId,
                        });
                        return;
                    }
                }
            }

            if (responseCode === iap.IAPResponseCode.USER_CANCELED) {
                resolve({
                    success: false,
                    transactionId: '',
                    error: 'Compra cancelada.',
                });
                return;
            }

            resolve({
                success: false,
                transactionId: '',
                error: 'Erro ao processar a compra. Tente novamente.',
            });
        });

        // Inicia fluxo de compra na store
        iap.purchaseItemAsync(planInfo.productId).catch((err: Error) => {
            resolve({
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
