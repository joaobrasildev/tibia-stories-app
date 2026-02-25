/**
 * Gera um token UUID v4 com prefixo TS-.
 * Formato: TS-xxxxxxxx (8 caracteres hex aleatórios)
 *
 * Função pura — zero imports de React, Zustand, SQLite ou Firebase.
 */
export function generateToken(): string {
    const hex = '0123456789abcdef';
    let result = 'TS-';
    for (let i = 0; i < 8; i++) {
        result += hex[Math.floor(Math.random() * 16)];
    }
    return result;
}
