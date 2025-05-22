import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Execucao } from '../models/types';

interface ExecucaoCardProps {
    execucao: Execucao;
    onPress: (execucao: Execucao) => void;
}

/**
 * Componente para exibir um card de execução na listagem
 */
export const ExecucaoCard: React.FC<ExecucaoCardProps> = ({ execucao, onPress }) => {
    const colorScheme = useColorScheme();
    const tintColor = Colors[colorScheme ?? 'light'].tint;

    // Formatar data para exibição
    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    // Ícone de status baseado na sincronização
    const renderStatusIcon = () => {
        if (execucao.sincronizado) {
            return <IconSymbol name="checkmark.circle.fill" size={20} color="green" />;
        } else {
            return <IconSymbol name="arrow.clockwise.circle" size={20} color="orange" />;
        }
    };

    return (
        <TouchableOpacity onPress={() => onPress(execucao)}>
            <ThemedView style={styles.card}>
                <View style={styles.header}>
                    <ThemedText type="defaultSemiBold" style={styles.placa}>
                        {execucao.placa}
                    </ThemedText>
                    <View style={styles.statusContainer}>
                        {renderStatusIcon()}
                        <ThemedText style={styles.statusText}>
                            {execucao.sincronizado ? 'Enviado' : 'Pendente'}
                        </ThemedText>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <IconSymbol name="calendar" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>{formatarData(execucao.data)}</ThemedText>
                    </View>
                    <View style={styles.infoItem}>
                        <IconSymbol name="location.fill" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>{execucao.local}</ThemedText>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <IconSymbol name="person.fill" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>{execucao.cliente}</ThemedText>
                    </View>
                    <View style={styles.infoItem}>
                        <IconSymbol name="wrench.fill" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>{execucao.tecnico}</ThemedText>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <IconSymbol name="gauge" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>{execucao.km} km</ThemedText>
                    </View>
                    <View style={styles.infoItem}>
                        <IconSymbol name="photo" size={16} color={tintColor} />
                        <ThemedText style={styles.infoText}>
                            {execucao.fotos.length} fotos / {execucao.videos.length} vídeos
                        </ThemedText>
                    </View>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    placa: {
        fontSize: 18,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 4,
        fontSize: 14,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        marginLeft: 6,
        fontSize: 14,
    },
});