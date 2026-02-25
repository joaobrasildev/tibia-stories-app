export interface HighlightPayment {
    id: string;
    character_id: string;
    user_token: string;
    platform: 'android' | 'ios';
    transaction_id: string;
    amount_brl: number;
    purchased_at: string;
    expires_at: string;
    status: 'active' | 'expired';
}

export type PurchaseStatus = 'idle' | 'purchasing' | 'validating' | 'success' | 'error';
