/**
 * Type augmentation for firebase/auth in React Native.
 *
 * Firebase v12 exports `getReactNativePersistence` only under the
 * "react-native" package.json condition (resolved by Metro at runtime).
 * TypeScript's default resolution picks the browser types which don't
 * include it, so we declare it here as a module augmentation.
 */
import type { Persistence } from '@firebase/auth';

declare module 'firebase/auth' {
    interface ReactNativeAsyncStorage {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        removeItem(key: string): Promise<void>;
    }

    export function getReactNativePersistence(
        storage: ReactNativeAsyncStorage,
    ): Persistence;
}
