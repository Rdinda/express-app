# Dependências Necessárias para o Projeto

Para implementar o aplicativo de gerenciamento de manutenção de veículos conforme especificado, será necessário instalar as seguintes dependências:

## Dependências Principais

```bash
npm install @react-native-async-storage/async-storage @react-native-community/netinfo
npm install @reduxjs/toolkit react-redux redux-persist
npm install react-native-image-picker
npm install react-native-sqlite-storage
npm install axios
```

## Descrição das Dependências

### Gerenciamento de Estado e Persistência
- **@react-native-async-storage/async-storage**: Para armazenamento local de dados simples
- **@reduxjs/toolkit**: Para gerenciamento centralizado de estado
- **react-redux**: Integração do Redux com React
- **redux-persist**: Para persistência do estado Redux

### Conectividade e API
- **@react-native-community/netinfo**: Para detecção de conectividade
- **axios**: Para requisições HTTP

### Mídia e Armazenamento
- **react-native-image-picker**: Para captura de fotos e vídeos
- **react-native-sqlite-storage**: Para armazenamento local de dados complexos

## Instalação

Execute os comandos acima no terminal para instalar todas as dependências necessárias para o projeto.

## Próximos Passos

1. Instalar as dependências listadas acima
2. Configurar o Redux Toolkit para gerenciamento de estado
3. Implementar o serviço de persistência local com AsyncStorage e SQLite
4. Desenvolver os componentes de UI para o dashboard e formulários