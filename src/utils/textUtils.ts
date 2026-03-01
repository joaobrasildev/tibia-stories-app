/**
 * Helpers de texto — funções puras, zero dependências React.
 */

/**
 * Trunca texto no comprimento máximo, adicionando "..." se necessário.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Primeira letra maiúscula, restante inalterado.
 */
export function capitalize(text: string): string {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitaliza cada palavra do texto.
 */
export function capitalizeWords(text: string): string {
    return text
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ');
}

/**
 * Remove espaços extras e normaliza whitespace.
 */
export function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}
