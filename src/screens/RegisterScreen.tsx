import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const RegisterScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const { signUp, state, clearError } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Limpar erro ao montar o componente
    useEffect(() => {
        clearError();
    }, []);

    // Mostrar erro se houver
    useEffect(() => {
        if (state.error) {
            Alert.alert('Erro', state.error);
        }
    }, [state.error]);

    const handleRegister = async () => {
        // Validação básica
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        // Validação de email simples
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Erro', 'Por favor, insira um email válido');
            return;
        }

        // Validação de senha
        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        await signUp({ nome, email, senha, confirmarSenha });
    };

    const navigateToLogin = () => {
        router.push('/login');
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={styles.titleContainer}>
                        <View style={styles.titleTextContainer}>
                            <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>
                            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                                Cadastre-se para gerenciar suas manutenções
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                        placeholder="Nome completo"
                        placeholderTextColor={colors.tabIconDefault}
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                        placeholder="Email"
                        placeholderTextColor={colors.tabIconDefault}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                        placeholder="Senha"
                        placeholderTextColor={colors.tabIconDefault}
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />
                    <TextInput
                        style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                        placeholder="Confirmar senha"
                        placeholderTextColor={colors.tabIconDefault}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleRegister}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink} onPress={navigateToLogin}>
                        <Text style={[styles.loginText, { color: colors.tabIconDefault }]}>
                            Já tem uma conta? <Text style={{ color: colors.tint }}>Faça login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Text = ({ style, ...props }: any) => {
    const colorScheme = useColorScheme();
    const defaultStyle = { color: Colors[colorScheme ?? 'light'].text };
    return <TextInput {...props} style={[defaultStyle, style]} editable={false} />
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: 'center',
    },
    titleTextContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
    },
});

export default RegisterScreen;