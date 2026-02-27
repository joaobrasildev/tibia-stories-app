/**
 * Helpers de data e expiração.
 * Funções puras — zero imports de React, Zustand ou Firebase.
 */

/**
 * Formata data ISO para formato legível pt-BR (ex: "25 de fevereiro de 2026").
 */
export function formatDatePtBr(isoDate: string): string {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Formata data ISO para formato curto pt-BR (ex: "25/02/2026").
 */
export function formatDateShort(isoDate: string): string {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Retorna string relativa (ex: "há 2 dias", "há 1 hora").
 */
export function timeAgo(isoDate: string): string {
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diffMs = now - then;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? 'há 1 dia' : `há ${days} dias`;
    if (hours > 0) return hours === 1 ? 'há 1 hora' : `há ${hours} horas`;
    if (minutes > 0) return minutes === 1 ? 'há 1 minuto' : `há ${minutes} minutos`;
    return 'agora';
}

/**
 * Calcula dias restantes de um destaque.
 * Retorna 0 se já expirou.
 */
export function daysRemaining(highlightUntil: string | null): number {
    if (!highlightUntil) return 0;
    const until = new Date(highlightUntil).getTime();
    const now = Date.now();
    if (until <= now) return 0;
    return Math.ceil((until - now) / (1000 * 60 * 60 * 24));
}

/**
 * Retorna a data/hora atual em formato ISO (UTC).
 */
export function nowISO(): string {
    return new Date().toISOString();
}
