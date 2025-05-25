import { useSync } from '@/src/contexts/SyncContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ExecucaoCard } from '@/src/components/ExecucaoCard';
import { Execucao } from '@/src/models/types';
import { StorageService } from '@/src/services/storageService';

export default function DashboardScreen() {
  const [execucoes, setExecucoes] = useState<Execucao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state: syncState, sincronizarExecucoes } = useSync();

  // Carregar execuções ao montar o componente
  useEffect(() => {
    carregarExecucoes();
  }, []);

  // Função para carregar execuções do armazenamento local
  const carregarExecucoes = async () => {
    setIsLoading(true);
    try {
      const dados = await StorageService.obterExecucoes();
      setExecucoes(dados);
    } catch (error) {
      console.error('Erro ao carregar execuções:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para navegar para a tela de detalhes da execução
  const navegarParaDetalhes = (execucao: Execucao) => {
    // Implementação futura: navegação para detalhes
    console.log('Navegar para detalhes:', execucao.id);
  };

  // Função para navegar para a tela de nova execução
  const navegarParaNovaExecucao = () => {
    router.push('/nova-execucao');
  };

  // Função para sincronizar execuções pendentes
  const sincronizar = async () => {
    await sincronizarExecucoes();
    carregarExecucoes(); // Recarregar após sincronização
  };

  // Renderizar item da lista
  const renderItem = ({ item }: { item: Execucao }) => (
    <ExecucaoCard execucao={item} onPress={navegarParaDetalhes} />
  );

  // Renderizar mensagem quando não há execuções
  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol name="doc.text" size={50} color="#ccc" />
      <ThemedText style={styles.emptyText}>
        Nenhuma execução encontrada
      </ThemedText>
      <ThemedText>
        Clique no botão + para adicionar uma nova execução
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Execuções</ThemedText>
        <TouchableOpacity onPress={sincronizar} disabled={!syncState.isOnline || syncState.isSyncing}>
          <ThemedView style={styles.syncButton}>
            <IconSymbol
              name="arrow.clockwise"
              size={20}
              color={syncState.isOnline ? '#007AFF' : '#ccc'}
            />
            {syncState.isSyncing && (
              <ThemedText style={styles.syncText}>Sincronizando...</ThemedText>
            )}
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {syncState.pendingItems > 0 && (
        <ThemedView style={styles.pendingBanner}>
          <IconSymbol name="exclamationmark.circle" size={16} color="#FF9500" />
          <ThemedText style={styles.pendingText}>
            {syncState.pendingItems} {syncState.pendingItems === 1 ? 'execução pendente' : 'execuções pendentes'} de sincronização
          </ThemedText>
        </ThemedView>
      )}

      <FlatList
        data={execucoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={carregarExecucoes}
        ListEmptyComponent={renderEmpty}
      />

      <TouchableOpacity style={styles.fab} onPress={navegarParaNovaExecucao}>
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  syncText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  pendingText: {
    marginLeft: 8,
    color: '#996300',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
});
