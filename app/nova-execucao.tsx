import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Execucao } from '@/src/models/types';
import { StorageService } from '@/src/services/storageService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

/**
 * Tela para registro de nova execução de manutenção
 */
export default function NovaExecucaoScreen() {
    // Estado para os campos do formulário
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [placa, setPlaca] = useState('');
    const [km, setKm] = useState('');
    const [tecnico, setTecnico] = useState('');
    const [cliente, setCliente] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { state: syncState, atualizarPendingCount } = useSync();

    // Função para validar o formulário
    const validarFormulario = () => {
        if (!data) return 'Data é obrigatória';
        if (!local) return 'Local é obrigatório';
        if (!placa) return 'Placa é obrigatória';
        if (!km) return 'Quilometragem é obrigatória';
        if (!tecnico) return 'Técnico é obrigatório';
        if (!cliente) return 'Cliente é obrigatório';
        return null;
    };

    // Função para formatar a placa (ABC1234 ou ABC-1234)
    const formatarPlaca = (texto: string) => {
        // Remove caracteres não alfanuméricos
        const placaLimpa = texto.replace(/[^a-zA-Z0-9]/g, '');

        // Formata para o padrão ABC1234 ou ABC-1234
        if (placaLimpa.length > 3) {
            return `${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3)}`;
        }
        return placaLimpa;
    };

    // Função para salvar a execução
    const salvarExecucao = async () => {
        const erro = validarFormulario();
        if (erro) {
            Alert.alert('Erro', erro);
            return;
        }

        setIsLoading(true);

        try {
            // Criar objeto de execução
            const novaExecucao: Execucao = {
                id: uuidv4(),
                data: new Date(data).toISOString(),
                local,
                placa: placa.toUpperCase(),
                km: parseInt(km, 10),
                tecnico,
                cliente,
                fotos: [],
                videos: [],
                status: 'pendente',
                sincronizado: false,
                dataCriacao: new Date().toISOString(),
                dataAtualizacao: new Date().toISOString(),
            };

            // Salvar no armazenamento local
            await StorageService.salvarExecucao(novaExecucao);

            // Atualizar contagem de pendentes
            await atualizarPendingCount();

            // Tentar sincronizar se estiver conectado
            if (syncState.isConnected) {
                // Aqui poderia chamar a função de sincronização
            }

            Alert.alert(
                'Sucesso',
                'Execução registrada com sucesso!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Erro ao salvar execução:', error);
            Alert.alert('Erro', 'Não foi possível salvar a execução. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ThemedView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#007AFF" />
                </TouchableOpacity>
                <ThemedText type="title">Nova Execução</ThemedText>
                <View style={{ width: 40 }} />
            </ThemedView>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Data</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={data}
                        onChangeText={setData}
                        placeholder="DD/MM/AAAA"
                        keyboardType="numbers-and-punctuation"
                    />
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Local</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={local}
                        onChangeText={setLocal}
                        placeholder="Cidade, Estado"
                    />
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Placa</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={placa}
                        onChangeText={(text) => setPlaca(formatarPlaca(text))}
                        placeholder="ABC-1234"
                        autoCapitalize="characters"
                        maxLength={8}
                    />
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Quilometragem</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={km}
                        onChangeText={setKm}
                        placeholder="0"
                        keyboardType="numeric"
                    />
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Técnico</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={tecnico}
                        onChangeText={setTecnico}
                        placeholder="Nome do técnico"
                    />
                </ThemedView>

                <ThemedView style={styles.formGroup}>
                    <ThemedText style={styles.label}>Cliente</ThemedText>
                    <TextInput
                        style={styles.input}
                        value={cliente}
                        onChangeText={setCliente}
                        placeholder="Nome do cliente"
                    />
                </ThemedView>

                <ThemedView style={styles.mediaSection}>
                    <ThemedText style={styles.mediaSectionTitle}>Fotos e Vídeos</ThemedText>
                    <ThemedText style={styles.mediaSectionSubtitle}>
                        Funcionalidade de captura de fotos e vídeos será implementada em breve.
                    </ThemedText>
                </ThemedView>

                <TouchableOpacity
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                    onPress={salvarExecucao}
                    disabled={isLoading}
                >
                    <ThemedText style={styles.saveButtonText}>
                        {isLoading ? 'Salvando...' : 'Salvar Execução'}
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    mediaSection: {
        marginTop: 16,
        marginBottom: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        borderStyle: 'dashed',
    },
    mediaSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    mediaSectionSubtitle: {
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});

export const useSync = () => {
    const [state, setState] = useState({ isConnected: false });

    // Lógica para verificar a conexão e atualizar o estado
    useEffect(() => {
        const checkConnection = () => {
            // Lógica para verificar a conexão
            setState({ isConnected: true }); // Exemplo
        };

        checkConnection();
    }, []);

    const atualizarPendingCount = async () => {
        // Lógica para atualizar a contagem de pendentes
    };

    return { state, atualizarPendingCount };
};