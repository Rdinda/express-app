import { Execucao, SyncState } from '@/src/models/types'; // Added Execucao
import { StorageService } from '@/src/services/storageService';
import NetInfo from '@react-native-community/netinfo';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer } from 'react'; // Added useCallback

// Definição das ações do reducer
type SyncAction =
    | { type: 'SET_CONNECTIVITY'; isOnline: boolean } // Corrected: isConnected to isOnline
    | { type: 'SET_SYNCING'; isSyncing: boolean }
    | { type: 'SYNC_SUCCESS'; lastSyncDate: string }
    | { type: 'SYNC_ERROR'; error: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_PENDING_COUNT'; count: number };

// Estado inicial de sincronização
const initialState: SyncState = {
    isSyncing: false,
    isOnline: false, // Assuming default connectivity is offline
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
                isSyncing: false, // Also set isSyncing to false on success
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
    }
};

// Definição do contexto de sincronização
type SyncContextType = {
    state: SyncState;
    sincronizarExecucoes: () => Promise<void>;
    atualizarPendingCount: () => Promise<void>;
    clearError: () => void;
};

// Criação do Contexto
const SyncContext = createContext<SyncContextType | undefined>(undefined);

// Props do Provider
type SyncProviderProps = {
    children: ReactNode;
};

// Componente Provider
export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(syncReducer, initialState);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, [dispatch]);

    const atualizarPendingCount = useCallback(async () => {
        try {
            const count = await StorageService.obterContagemPendentes();
            dispatch({ type: 'SET_PENDING_COUNT', count });
        } catch (error) {
            console.error("Error fetching pending count:", error);
            dispatch({ type: 'SYNC_ERROR', error: 'Failed to fetch pending count' });
        }
    }, [dispatch]);

    const sincronizarExecucoes = useCallback(async () => {
        if (!state.isOnline || state.isSyncing) {
            console.log('Sync skipped: Offline or already syncing.', { isOnline: state.isOnline, isSyncing: state.isSyncing });
            return;
        }

        dispatch({ type: 'SET_SYNCING', isSyncing: true });
        console.log('Starting synchronization...');

        try {
            const todasExecucoes: Execucao[] = await StorageService.obterExecucoes();
            const pendentes = todasExecucoes.filter(
                (e: Execucao) => !e.sincronizado || e.status === 'pendente' || e.status === 'alterado'
            );

            if (pendentes.length === 0) {
                console.log('No pending items to sync.');
                // dispatch({ type: 'SET_SYNCING', isSyncing: false }); // Handled by finally
                return;
            }

            console.log(`Syncing ${pendentes.length} items...`);
            for (const execucao of pendentes) {
                console.log(`Attempting to sync item: ${execucao.id}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                await StorageService.atualizarStatusSincronizacao(execucao.id, true); // True for success
                console.log('Execução sincronizada:', execucao.id);
            }

            dispatch({ type: 'SYNC_SUCCESS', lastSyncDate: new Date().toISOString() });
            await atualizarPendingCount();
            console.log('Synchronization successful.');

        } catch (error) {
            console.error('Erro durante sincronização:', error);
            dispatch({
                type: 'SYNC_ERROR',
                error: (error instanceof Error ? error.message : 'Erro desconhecido durante a sincronização')
            });
        } finally {
            dispatch({ type: 'SET_SYNCING', isSyncing: false });
            console.log('Synchronization process finished.');
        }
    }, [state.isOnline, state.isSyncing, dispatch, atualizarPendingCount]);

    // Effect for initial data load (e.g., pending count)
    useEffect(() => {
        atualizarPendingCount();
    }, [atualizarPendingCount]); // Updated dependency

    // Effect for network connectivity
    useEffect(() => {
        // Fetch initial network state
        NetInfo.fetch().then(netState => {
            dispatch({ type: 'SET_CONNECTIVITY', isOnline: !!(netState.isConnected && netState.isInternetReachable) });
        });

        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(netState => {
            dispatch({ type: 'SET_CONNECTIVITY', isOnline: !!(netState.isConnected && netState.isInternetReachable) });
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    // Effect for automatic synchronization trigger
    useEffect(() => {
        if (state.isOnline && state.pendingItems > 0 && !state.isSyncing) {
            console.log('Auto-sync triggered.');
            sincronizarExecucoes();
        }
    }, [state.isOnline, state.pendingItems, state.isSyncing, sincronizarExecucoes]);

    return (
        <SyncContext.Provider value={{ state, sincronizarExecucoes, atualizarPendingCount, clearError }}>
            {children}
        </SyncContext.Provider>
    );
};

// Hook customizado para usar o SyncContext
export const useSync = () => {
    const context = useContext(SyncContext);
    if (context === undefined) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
};
