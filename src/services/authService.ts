import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
    signInWithCredential,
    GoogleAuthProvider,
    OAuthProvider,
    type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuthInstance, getFirestoreInstance } from '@/services/firebaseService';
import { FIREBASE_COLLECTIONS } from '@/constants/firebase';
import type { User } from '@/types/auth';
import { generateToken } from '@/utils/tokenGenerator';

function mapFirebaseUser(fbUser: FirebaseUser, provider: User['provider']): User {
    return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        provider,
    };
}

function detectProvider(fbUser: FirebaseUser): User['provider'] {
    const providerId = fbUser.providerData[0]?.providerId;
    if (providerId === 'google.com') return 'google';
    if (providerId === 'apple.com') return 'apple';
    return 'email';
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
    const auth = getAuthInstance();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(result.user, 'email');
}

export async function registerWithEmail(
    email: string,
    password: string,
    displayName?: string,
): Promise<User> {
    const auth = getAuthInstance();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
        await updateProfile(result.user, { displayName });
    }

    return mapFirebaseUser(result.user, 'email');
}

export async function loginWithGoogleCredential(idToken: string): Promise<User> {
    const auth = getAuthInstance();
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return mapFirebaseUser(result.user, 'google');
}

export async function loginWithAppleCredential(
    idToken: string,
    nonce: string,
): Promise<User> {
    const auth = getAuthInstance();
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({ idToken, rawNonce: nonce });
    const result = await signInWithCredential(auth, credential);
    return mapFirebaseUser(result.user, 'apple');
}

export async function logout(): Promise<void> {
    const auth = getAuthInstance();
    await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
    const auth = getAuthInstance();
    await sendPasswordResetEmail(auth, email);
}

export function subscribeToAuthState(
    callback: (user: User | null) => void,
): () => void {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
            callback(mapFirebaseUser(fbUser, detectProvider(fbUser)));
        } else {
            callback(null);
        }
    });
}

export async function ensureUserToken(uid: string): Promise<string> {
    const db = getFirestoreInstance();
    const userRef = doc(db, FIREBASE_COLLECTIONS.users, uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.userToken) {
            return data.userToken as string;
        }
    }

    const newToken = generateToken();
    await setDoc(userRef, { userToken: newToken, uid, createdAt: new Date().toISOString() }, { merge: true });
    return newToken;
}
