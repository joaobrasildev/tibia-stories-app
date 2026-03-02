/**
 * TibiaData API v4 Service — buscar char e verificar token.
 * Referência: architecture.md seção 7.6
 */

import type { TibiaDataResponse, TibiaCharacter } from '@/types/tibiaData';

const BASE_URL = 'https://api.tibiadata.com/v4';

/**
 * Busca dados de um personagem pelo nome na TibiaData API.
 * Retorna null se o char não existir ou se houver erro de rede.
 */
export async function fetchCharacter(name: string): Promise<TibiaCharacter | null> {
    try {
        const encodedName = encodeURIComponent(name.trim());
        const response = await fetch(`${BASE_URL}/character/${encodedName}`);

        if (!response.ok) {
            return null;
        }

        const data: TibiaDataResponse = await response.json();

        // TibiaData retorna name vazio se o char não existir
        if (!data.character?.character?.name) {
            return null;
        }

        return data.character.character;
    } catch {
        return null;
    }
}

/**
 * Verifica se o comment do char contém o token do usuário.
 * Faz uma chamada à API e checa o campo comment.
 */
export async function verifyCharacterToken(name: string, token: string): Promise<boolean> {
    const char = await fetchCharacter(name);
    if (!char) return false;
    return char.comment.toLowerCase().includes(token.toLowerCase());
}
