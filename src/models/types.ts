/**
 * Definição de tipos e interfaces para o aplicativo de gerenciamento de manutenção de veículos
 */

// Tipos de usuário
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    token?: string;
}

// Dados de autenticação
export interface AuthData {
    usuario: Usuario | null;
    isLoading: boolean;
    isSignout: boolean;
    error: string | null;
}

// Dados de execução de manutenção
export interface Execucao {
    id: string;
    data: string; // ISO date string
    local: string;
    placa: string;
    km: number;
    tecnico: string;
    cliente: string;
    fotos: Midia[];
    videos: Midia[];
    status: 'pendente' | 'enviado' | 'alterado';
    sincronizado: boolean;
    dataCriacao: string; // ISO date string
    dataAtualizacao: string; // ISO date string
}

// Tipo para mídia (fotos e vídeos)
export interface Midia {
    id: string;
    uri: string;
    tipo: 'foto' | 'video';
    descricao?: string;
    localPath?: string; // Caminho local para armazenamento offline
    remoteUrl?: string; // URL remota após sincronização
}

// Estado de sincronização
export interface SyncState {
    isSyncing: boolean;
    lastSyncDate: string | null;
    pendingItems: number;
    isOnline: boolean;
    error: string | null;
}

// Credenciais de login
export interface LoginCredentials {
    email: string;
    senha: string;
}

// Dados de registro de usuário
export interface RegisterData extends LoginCredentials {
    nome: string;
    confirmarSenha: string;
}