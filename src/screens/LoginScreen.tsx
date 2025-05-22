import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { signIn, state, clearError } = useAuth();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    // Limpar erro ao montar o componente
    React.useEffect(() => {
        clearError();
    }, []);

    // Mostrar erro se houver
    React.useEffect(() => {
        if (state.error) {
            Alert.alert('Erro', state.error);
        }
    }, [state.error]);

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }
        await signIn({ email, senha });
    };

    const navigateToRegister = () => {
        router.push('/register');
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
                            <Text style={[styles.title, { color: colors.text }]}>Manutenção Veicular</Text>
                            <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
                                Gerencie suas execuções de manutenção
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.formContainer}>
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

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleLogin}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.registerLink} onPress={navigateToRegister}>
                        <Text style={[styles.registerText, { color: colors.tabIconDefault }]}>
                            Não tem uma conta? <Text style={{ color: colors.tint }}>Cadastre-se</Text>
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
    registerLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
    },
});

export default LoginScreen;