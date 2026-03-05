export type HighlightPlan = '7d' | '30d' | '365d';

export interface HighlightPayment {
    id: string;
    character_id: string;
    user_token: string;
    platform: 'android' | 'ios';
    transaction_id: string;
    plan: HighlightPlan;
    amount_brl: number;
    duration_days: number;
    purchased_at: string;
    expires_at: string;
    status: 'active' | 'expired';
}

export type PurchaseStatus = 'idle' | 'purchasing' | 'validating' | 'success' | 'error';
