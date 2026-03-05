import type { Character } from '@/types/character';

/**
 * Verifica se char é elegível para destaque.
 * Requisitos: verificado e com história publicada (RN-06).
 * Chars já em destaque podem comprar novamente para estender (RN-07).
 */
export function canHighlight(char: Character): { eligible: boolean; reason?: string } {
    if (!char.is_verified) {
        return { eligible: false, reason: 'Char não está verificado.' };
    }
    if (!char.story_content) {
        return { eligible: false, reason: 'Char não possui história publicada.' };
    }
    return { eligible: true };
}

/**
 * Calcula data de expiração (purchaseDate + durationDays).
 */
export function calculateHighlightExpiry(purchaseDate: Date, durationDays: number): Date {
    const expiry = new Date(purchaseDate.getTime());
    expiry.setDate(expiry.getDate() + durationDays);
    return expiry;
}

/**
 * Calcula data de expiração considerando destaque existente.
 * Se já tem destaque ativo, estende a partir do max(highlight_until, now).
 * Se não tem, soma a partir de now.
 */
export function calculateExtendedExpiry(currentHighlightUntil: string | null, durationDays: number): Date {
    const now = new Date();
    let baseDate = now;

    if (currentHighlightUntil) {
        const existingUntil = new Date(currentHighlightUntil);
        if (existingUntil.getTime() > now.getTime()) {
            baseDate = existingUntil;
        }
    }

    return calculateHighlightExpiry(baseDate, durationDays);
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
