/**
 * Serviço de API para comunicação com o backend
 * Inicialmente implementado com funções mockadas para desenvolvimento
 */

import { Execucao, LoginCredentials, RegisterData, Usuario } from '../models/types';

// Simulação de delay para simular chamadas de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mockados para desenvolvimento
const mockUsuarios: Usuario[] = [
    {
        id: '1',
        nome: 'Usuário Teste',
        email: 'teste@exemplo.com',
        token: 'token-fake-123',
    },
];

const mockExecucoes: Execucao[] = [
    {
        id: '1',
        data: new Date().toISOString(),
        local: 'São Paulo, SP',
        placa: 'ABC1234',
        km: 15000,
        tecnico: 'João Silva',
        cliente: 'Empresa XYZ',
        fotos: [
            {
                id: '1',
                uri: 'https://example.com/foto1.jpg',
                tipo: 'foto',
                descricao: 'Foto da placa',
            },
        ],
        videos: [],
        status: 'enviado',
        sincronizado: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
    },
];

/**
 * Classe de serviço para API
 */
export class ApiService {
    // URL base da API (será substituída pela URL real em produção)
    private baseUrl = 'https://api.exemplo.com';
    private token: string | null = null;

    /**
     * Define o token de autenticação para requisições
     */
    setToken(token: string) {
        this.token = token;
    }

    /**
     * Remove o token de autenticação
     */
    clearToken() {
        this.token = null;
    }

    /**
     * Realiza login do usuário
     */
    async login(credentials: LoginCredentials): Promise<{ usuario: Usuario; token: string }> {
        // Simulação de chamada à API
        await delay(1000);

        const usuario = mockUsuarios.find(u => u.email === credentials.email);

        if (usuario && credentials.senha === '123456') {
            return { usuario, token: 'token-fake-123' };
        }

        throw new Error('Credenciais inválidas');
    }

    /**
     * Registra um novo usuário
     */
    async register(data: RegisterData): Promise<{ usuario: Usuario; token: string }> {
        // Simulação de chamada à API
        await delay(1000);

        // Verificar se email já existe
        if (mockUsuarios.some(u => u.email === data.email)) {
            throw new Error('Email já cadastrado');
        }

        // Criar novo usuário
        const novoUsuario: Usuario = {
            id: String(mockUsuarios.length + 1),
            nome: data.nome,
            email: data.email,
            token: `token-fake-${mockUsuarios.length + 1}`,
        };

        // Adicionar à lista mockada (em produção, seria enviado ao backend)
        mockUsuarios.push(novoUsuario);

        return { usuario: novoUsuario, token: novoUsuario.token || 'token-fake-novo' };
    }

    /**
     * Busca lista de execuções
     */
    async getExecucoes(): Promise<Execucao[]> {
        // Simulação de chamada à API
        await delay(800);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        return mockExecucoes;
    }

    /**
     * Busca uma execução pelo ID
     */
    async getExecucaoById(id: string): Promise<Execucao> {
        // Simulação de chamada à API
        await delay(500);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        const execucao = mockExecucoes.find(e => e.id === id);
        if (!execucao) {
            throw new Error('Execução não encontrada');
        }

        return execucao;
    }

    /**
     * Cria uma nova execução
     */
    async createExecucao(execucao: Omit<Execucao, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<Execucao> {
        // Simulação de chamada à API
        await delay(1200);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        // Criar nova execução
        const novaExecucao: Execucao = {
            ...execucao,
            id: String(mockExecucoes.length + 1),
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString(),
        };

        // Adicionar à lista mockada (em produção, seria enviado ao backend)
        mockExecucoes.push(novaExecucao);

        return novaExecucao;
    }

    /**
     * Atualiza uma execução existente
     */
    async updateExecucao(id: string, execucao: Partial<Execucao>): Promise<Execucao> {
        // Simulação de chamada à API
        await delay(1000);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        // Buscar execução
        const index = mockExecucoes.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error('Execução não encontrada');
        }

        // Atualizar execução
        const execucaoAtualizada: Execucao = {
            ...mockExecucoes[index],
            ...execucao,
            dataAtualizacao: new Date().toISOString(),
        };

        // Substituir na lista mockada
        mockExecucoes[index] = execucaoAtualizada;

        return execucaoAtualizada;
    }

    /**
     * Remove uma execução
     */
    async deleteExecucao(id: string): Promise<void> {
        // Simulação de chamada à API
        await delay(800);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        // Buscar execução
        const index = mockExecucoes.findIndex(e => e.id === id);
        if (index === -1) {
            throw new Error('Execução não encontrada');
        }

        // Remover da lista mockada
        mockExecucoes.splice(index, 1);
    }

    /**
     * Upload de mídia (foto ou vídeo)
     */
    async uploadMidia(file: { uri: string; type: string; name: string }): Promise<{ url: string }> {
        // Simulação de chamada à API
        await delay(1500);

        // Verificar autenticação
        if (!this.token) {
            throw new Error('Não autorizado');
        }

        // Simular URL de mídia enviada
        return { url: `https://example.com/media/${Date.now()}.jpg` };
    }
}

// Exportar instância única do serviço
export const apiService = new ApiService();