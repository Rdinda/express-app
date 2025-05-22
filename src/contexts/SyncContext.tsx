import { SyncState } from '../models/types';

// Definição das ações do reducer
type SyncAction =
    | {
        isOnline: boolean; type: 'SET_CONNECTIVITY'; isConnected: boolean
    }
    | { type: 'SET_SYNCING'; isSyncing: boolean }
    | { type: 'SYNC_SUCCESS'; lastSyncDate: string }
    | { type: 'SYNC_ERROR'; error: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_PENDING_COUNT'; count: number };

// Estado inicial de sincronização
const initialState: SyncState = {
    isSyncing: false,
    isOnline: false,
    lastSyncDate: null,
    pendingItems: 0,
    error: null,
};

// Reducer para gerenciar o estado de sincronização
const syncReducer = (state: SyncState, action: SyncAction): SyncState => {
    switch (action.type) {
        case 'SET_CONNECTIVITY':
            return {
                ...state,
                isOnline: action.isOnline,
            };
        case 'SET_SYNCING':
            return {
                ...state,
                isSyncing: action.isSyncing,
            };
        case 'SYNC_SUCCESS':
            return {
                ...state,
                lastSyncDate: action.lastSyncDate,
                error: null,
            };
        case 'SYNC_ERROR':
            return {
                ...state,
                error: action.error,
                isSyncing: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'SET_PENDING_COUNT':
            return {
                ...state,
                pendingItems: action.count,
            };
        default:
            return state;
    };

    // Definição do contexto de sincronização
    type SyncContextType = {
        state: SyncState;
        sincronizarExecucoes: () => Promise<void>;
        atualizarPendingCount: () => Promise<void>;
        clearError: () => void;
    };

}
