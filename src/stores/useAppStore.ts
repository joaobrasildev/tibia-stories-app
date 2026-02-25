import { create } from 'zustand';

interface AppState {
    isReady: boolean;
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncAt: string | null;
    // actions
    setReady: (ready: boolean) => void;
    setOnline: (online: boolean) => void;
    setSyncing: (syncing: boolean) => void;
    setLastSync: (timestamp: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isReady: false,
    isOnline: true,
    isSyncing: false,
    lastSyncAt: null,

    setReady: (ready) => set({ isReady: ready }),
    setOnline: (online) => set({ isOnline: online }),
    setSyncing: (syncing) => set({ isSyncing: syncing }),
    setLastSync: (timestamp) => set({ lastSyncAt: timestamp }),
}));
