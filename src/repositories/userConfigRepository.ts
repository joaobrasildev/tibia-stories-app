import { database } from '@/repositories/database';

export function getValue(key: string): string | null {
    const row = database.getFirstSync<{ value: string }>(
        'SELECT value FROM user_config WHERE key = ?',
        [key],
    );
    return row?.value ?? null;
}

export function setValue(key: string, value: string): void {
    database.runSync(
        'INSERT OR REPLACE INTO user_config (key, value) VALUES (?, ?)',
        [key, value],
    );
}

export function getUserToken(): string | null {
    return getValue('user_token');
}

export function setUserToken(token: string): void {
    setValue('user_token', token);
}

export function getLastSyncTimestamp(): string | null {
    return getValue('last_sync_at');
}

export function setLastSyncTimestamp(timestamp: string): void {
    setValue('last_sync_at', timestamp);
}
