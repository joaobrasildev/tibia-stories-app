/**
 * Verification Rules — Quest de Vínculo.
 * Funções puras: zero imports de React, Zustand, SQLite ou Firebase.
 * Referência: architecture.md seção 6.1
 */

import type { TibiaCharacter } from '@/types/tibiaData';
import type { Character } from '@/types/character';

/**
 * Verifica se o comment do char contém o token do usuário.
 */
export function isTokenInComment(comment: string, token: string): boolean {
    if (!comment || !token) return false;
    return comment.toLowerCase().includes(token.toLowerCase());
}

/**
 * Gera mensagem de status da quest.
 */
export function getVerificationStatus(isVerified: boolean): string {
    return isVerified ? '✅ Vinculado' : '⏳ Pendente';
}

/**
 * Verifica se pode iniciar quest de vínculo.
 * - Char deve existir na API.
 * - Char não pode já estar vinculado a outro usuário.
 */
export function canStartVerification(
    char: TibiaCharacter,
    existingChars: Character[],
): { allowed: boolean; reason?: string } {
    if (!char.name) {
        return { allowed: false, reason: 'Char não encontrado na API.' };
    }

    const alreadyLinked = existingChars.find(
        (c) => c.name.toLowerCase() === char.name.toLowerCase() && c.is_verified,
    );

    if (alreadyLinked) {
        return {
            allowed: false,
            reason: 'Este char já está vinculado a uma conta.',
        };
    }

    return { allowed: true };
}
