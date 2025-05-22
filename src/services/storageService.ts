/**
 * Serviço para gerenciamento de armazenamento local das execuções
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Execucao } from '../models/types';

export class StorageService {
    private static EXECUCOES_KEY = '@execucoes';

    /**
     * Salva uma execução no armazenamento local
     * @param execucao Execução a ser salva
     */
    static async salvarExecucao(execucao: Execucao): Promise<void> {
        try {
            // Buscar execuções existentes
            const execucoes = await this.obterExecucoes();

            // Verificar se a execução já existe (para atualização)
            const index = execucoes.findIndex(e => e.id === execucao.id);

            if (index >= 0) {
                // Atualizar execução existente
                execucoes[index] = execucao;
            } else {
                // Adicionar nova execução
                execucoes.push(execucao);
            }

            // Salvar lista atualizada
            await AsyncStorage.setItem(this.EXECUCOES_KEY, JSON.stringify(execucoes));
        } catch (error) {
            console.error('Erro ao salvar execução:', error);
            throw new Error('Não foi possível salvar a execução');
        }
    }

    /**
     * Obtém todas as execuções do armazenamento local
     * @returns Lista de execuções
     */
    static async obterExecucoes(): Promise<Execucao[]> {
        try {
            const execucoesString = await AsyncStorage.getItem(this.EXECUCOES_KEY);
            return execucoesString ? JSON.parse(execucoesString) : [];
        } catch (error) {
            console.error('Erro ao obter execuções:', error);
            return [];
        }
    }

    /**
     * Obtém uma execução específica pelo ID
     * @param id ID da execução
     * @returns Execução encontrada ou null
     */
    static async obterExecucaoPorId(id: string): Promise<Execucao | null> {
        try {
            const execucoes = await this.obterExecucoes();
            return execucoes.find(e => e.id === id) || null;
        } catch (error) {
            console.error('Erro ao obter execução por ID:', error);
            return null;
        }
    }

    /**
     * Remove uma execução do armazenamento local
     * @param id ID da execução a ser removida
     */
    static async removerExecucao(id: string): Promise<void> {
        try {
            const execucoes = await this.obterExecucoes();
            const novasExecucoes = execucoes.filter(e => e.id !== id);
            await AsyncStorage.setItem(this.EXECUCOES_KEY, JSON.stringify(novasExecucoes));
        } catch (error) {
            console.error('Erro ao remover execução:', error);
            throw new Error('Não foi possível remover a execução');
        }
    }

    /**
     * Atualiza o status de sincronização de uma execução
     * @param id ID da execução
     * @param sincronizado Status de sincronização
     */
    static async atualizarStatusSincronizacao(id: string, sincronizado: boolean): Promise<void> {
        try {
            const execucoes = await this.obterExecucoes();
            const index = execucoes.findIndex(e => e.id === id);

            if (index >= 0) {
                execucoes[index].sincronizado = sincronizado;
                execucoes[index].status = sincronizado ? 'enviado' : 'pendente';
                await AsyncStorage.setItem(this.EXECUCOES_KEY, JSON.stringify(execucoes));
            }
        } catch (error) {
            console.error('Erro ao atualizar status de sincronização:', error);
            throw new Error('Não foi possível atualizar o status de sincronização');
        }
    }

    /**
     * Obtém a contagem de execuções pendentes de sincronização
     * @returns Número de execuções pendentes
     */
    static async obterContagemPendentes(): Promise<number> {
        try {
            const execucoes = await this.obterExecucoes();
            return execucoes.filter(e => !e.sincronizado).length;
        } catch (error) {
            console.error('Erro ao obter contagem de pendentes:', error);
            return 0;
        }
    }
}