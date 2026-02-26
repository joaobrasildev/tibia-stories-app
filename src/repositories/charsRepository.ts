import { database } from './database';
import type { Character } from '@/types/character';

interface CharacterRow {
    id: string;
    user_token: string | null;
    name: string;
    world: string;
    vocation: string;
    level: number;
    is_verified: number;
    is_highlighted: number;
    highlight_until: string | null;
    story_title: string | null;
    story_content: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

function mapRowToCharacter(row: CharacterRow): Character {
    return {
        ...row,
        is_verified: row.is_verified === 1,
        is_highlighted: row.is_highlighted === 1,
    };
}

export function getAllVerifiedCharsWithStory(): Character[] {
    const rows = database.getAllSync<CharacterRow>(
        'SELECT * FROM characters WHERE is_verified = 1 AND story_content IS NOT NULL ORDER BY created_at DESC',
    );
    return rows.map(mapRowToCharacter);
}

export function getHighlightedChars(): Character[] {
    const rows = database.getAllSync<CharacterRow>(
        "SELECT * FROM characters WHERE is_highlighted = 1 AND highlight_until >= datetime('now') ORDER BY created_at DESC",
    );
    return rows.map(mapRowToCharacter);
}

export function getRecentChars(limit: number): Character[] {
    const rows = database.getAllSync<CharacterRow>(
        'SELECT * FROM characters WHERE is_verified = 1 AND story_content IS NOT NULL ORDER BY created_at DESC LIMIT ?',
        [limit],
    );
    return rows.map(mapRowToCharacter);
}

export function getCharById(id: string): Character | null {
    const row = database.getFirstSync<CharacterRow>(
        'SELECT * FROM characters WHERE id = ?',
        [id],
    );
    return row ? mapRowToCharacter(row) : null;
}

export function getCharsByUserToken(userToken: string): Character[] {
    const rows = database.getAllSync<CharacterRow>(
        'SELECT * FROM characters WHERE user_token = ? ORDER BY name',
        [userToken],
    );
    return rows.map(mapRowToCharacter);
}

export function upsertCharacter(char: Character): void {
    database.runSync(
        `INSERT OR REPLACE INTO characters (
            id, user_token, name, world, vocation, level,
            is_verified, is_highlighted, highlight_until,
            story_title, story_content, avatar_url,
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            char.id,
            char.user_token,
            char.name,
            char.world,
            char.vocation,
            char.level,
            char.is_verified ? 1 : 0,
            char.is_highlighted ? 1 : 0,
            char.highlight_until,
            char.story_title,
            char.story_content,
            char.avatar_url,
            char.created_at,
            char.updated_at,
        ],
    );
}

export function updateHighlightStatus(id: string, highlighted: boolean, until: string | null): void {
    database.runSync(
        'UPDATE characters SET is_highlighted = ?, highlight_until = ?, updated_at = datetime(\'now\') WHERE id = ?',
        [highlighted ? 1 : 0, until, id],
    );
}

export function expireHighlights(): number {
    const result = database.runSync(
        "UPDATE characters SET is_highlighted = 0 WHERE is_highlighted = 1 AND highlight_until < datetime('now')",
    );
    return result.changes;
}

export function getDistinctWorlds(): string[] {
    const rows = database.getAllSync<{ world: string }>(
        'SELECT DISTINCT world FROM characters WHERE is_verified = 1 AND story_content IS NOT NULL ORDER BY world',
    );
    return rows.map((r) => r.world);
}
