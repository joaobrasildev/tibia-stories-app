import type { Character } from '@/types/character';

const HIGHLIGHT_DURATION_DAYS = 7;

/**
 * Verifica se char é elegível para destaque.
 * Requisitos: verificado, com história publicada, não já em destaque ativo.
 */
export function canHighlight(char: Character): { eligible: boolean; reason?: string } {
    if (!char.is_verified) {
        return { eligible: false, reason: 'Char não está verificado.' };
    }
    if (!char.story_content) {
        return { eligible: false, reason: 'Char não possui história publicada.' };
    }
    if (isHighlightActive(char.highlight_until)) {
        return { eligible: false, reason: 'Char já está em destaque.' };
    }
    return { eligible: true };
}

/**
 * Calcula data de expiração (purchaseDate + 7 dias).
 */
export function calculateHighlightExpiry(purchaseDate: Date): Date {
    const expiry = new Date(purchaseDate.getTime());
    expiry.setDate(expiry.getDate() + HIGHLIGHT_DURATION_DAYS);
    return expiry;
}

/**
 * Verifica se destaque ainda é válido (highlight_until >= now).
 */
export function isHighlightActive(highlightUntil: string | null): boolean {
    if (!highlightUntil) return false;
    const until = new Date(highlightUntil);
    return until.getTime() >= Date.now();
}

/**
 * Filtra chars com destaque ativo (is_highlighted = true && highlight_until >= now).
 */
export function filterActiveHighlights(chars: Character[]): Character[] {
    return chars.filter(
        (c) => c.is_highlighted && isHighlightActive(c.highlight_until),
    );
}
