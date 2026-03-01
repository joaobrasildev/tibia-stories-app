/**
 * Firestore Service — CRUD para collections do app.
 * Referência: architecture.md seção 7.5
 *
 * Fase 8: apenas reads + getUserToken/saveUserToken.
 * Writes de characters serão implementados nas fases 9-12.
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/services/firebaseService';
import { FIREBASE_COLLECTIONS } from '@/constants/firebase';
import type { Character } from '@/types/character';
import type { HighlightPayment } from '@/types/market';

// ── Helpers ────────────────────────────────────────────────

function getCollection(name: string) {
    return collection(getFirestoreInstance(), name);
}

function getDocRef(collectionName: string, id: string) {
    return doc(getFirestoreInstance(), collectionName, id);
}

function mapDocToCharacter(docSnap: any): Character {
    const data = docSnap.data();
    return {
        id: docSnap.id,
        user_token: data.user_token ?? null,
        name: data.name ?? '',
        world: data.world ?? '',
        vocation: data.vocation ?? '',
        level: data.level ?? 0,
        is_verified: data.is_verified ?? false,
        is_highlighted: data.is_highlighted ?? false,
        highlight_until: data.highlight_until ?? null,
        story_title: data.story_title ?? null,
        story_content: data.story_content ?? null,
        avatar_url: data.avatar_url ?? null,
        created_at: data.created_at ?? '',
        updated_at: data.updated_at ?? '',
    };
}

// ── Characters ─────────────────────────────────────────────

export async function fetchAllCharacters(): Promise<Character[]> {
    const q = query(
        getCollection(FIREBASE_COLLECTIONS.characters),
        where('is_verified', '==', true),
        orderBy('updated_at', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToCharacter);
}

export async function fetchCharactersByUser(userToken: string): Promise<Character[]> {
    const q = query(
        getCollection(FIREBASE_COLLECTIONS.characters),
        where('user_token', '==', userToken),
        orderBy('created_at', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToCharacter);
}

export async function checkCharacterExists(name: string): Promise<Character | null> {
    const q = query(
        getCollection(FIREBASE_COLLECTIONS.characters),
        where('name', '==', name),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapDocToCharacter(snapshot.docs[0]);
}

export async function createCharacter(char: Omit<Character, 'id'>): Promise<string> {
    const docRef = await addDoc(
        getCollection(FIREBASE_COLLECTIONS.characters),
        char,
    );
    return docRef.id;
}

export async function updateCharacter(id: string, data: Partial<Character>): Promise<void> {
    const docRef = getDocRef(FIREBASE_COLLECTIONS.characters, id);
    await updateDoc(docRef, data);
}

// ── Highlight Payments ─────────────────────────────────────

export async function createHighlightPayment(
    payment: Omit<HighlightPayment, 'id'>,
): Promise<string> {
    const docRef = await addDoc(
        getCollection(FIREBASE_COLLECTIONS.highlightPayments),
        payment,
    );
    return docRef.id;
}

export async function fetchActiveHighlights(): Promise<Character[]> {
    const now = new Date().toISOString();
    const q = query(
        getCollection(FIREBASE_COLLECTIONS.characters),
        where('is_highlighted', '==', true),
        where('highlight_until', '>=', now),
        orderBy('highlight_until', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToCharacter);
}

// ── User Tokens ────────────────────────────────────────────

export async function getUserToken(uid: string): Promise<string | null> {
    const docRef = getDocRef(FIREBASE_COLLECTIONS.users, uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return (data.userToken as string) ?? null;
}

export async function saveUserToken(uid: string, token: string): Promise<void> {
    const docRef = getDocRef(FIREBASE_COLLECTIONS.users, uid);
    await setDoc(
        docRef,
        { userToken: token, uid, updatedAt: new Date().toISOString() },
        { merge: true },
    );
}
