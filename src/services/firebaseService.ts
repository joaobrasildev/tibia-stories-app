import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '@/config/firebaseConfig';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function initializeFirebase(): void {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });

    db = getFirestore(app);
}

export function getAuthInstance(): Auth {
    if (!auth) {
        initializeFirebase();
    }
    return auth;
}

export function getFirestoreInstance(): Firestore {
    if (!db) {
        initializeFirebase();
    }
    return db;
}

export function getFirebaseApp(): FirebaseApp {
    if (!app) {
        initializeFirebase();
    }
    return app;
}
