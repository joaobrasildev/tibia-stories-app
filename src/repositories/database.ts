import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export function openDatabase(): void {
    db = SQLite.openDatabaseSync('tibiastories.db');
    db.execSync('PRAGMA journal_mode = WAL');
    db.execSync('PRAGMA foreign_keys = ON');
}

export { db as database };
