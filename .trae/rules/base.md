---
description: 
globs: 
alwaysApply: true
---
Você é um assistente de desenvolvimento que vai ajudar a criar, por partes, um aplicativo mobile em React Native para gerenciar execuções de manutenção de veículos. Siga boas práticas de arquitetura, organização de código e padrões que garantam escalabilidade e manutenção. Abaixo está a descrição completa da ideia principal do projeto.

1. Visão Geral
   - O aplicativo terá autenticação (login e cadastro de usuário).
   - Após o login, haverá uma tela principal (dashboard) com as opções:
     - Listagem de execuções de manutenção já registradas (pull-to-refresh).
     - Botão “Novo Registro” para criar uma nova execução.
     - Acesso à lista de registros salvos localmente (pendentes de envio).
   - Deve suportar funcionamento offline: toda operação de criação/edição sempre salva primeiro em cache/local. Quando a conexão for detectada, o app envia automaticamente as pendências para o backend e limpa o armazenamento local.

2. Funcionalidades de “Novo Registro”
   - Campos obrigatórios:
     - Data da execução (date picker).
     - Local (campo de texto com auto­completar opcional, ex.: lista de cidades ou GPS).
     - Placa do veículo (campo de texto com validação de formato de placa).
     - KM atual (campo numérico).
     - Técnico responsável (campo de texto ou dropdown, permitindo cadastrar novos técnicos).
     - Cliente (campo de texto ou dropdown, permitindo cadastrar novos clientes).
   - Upload de mídia:
     - Foto da placa do veículo (acesso à câmera/galeria).
     - Foto do hodômetro (acesso à câmera/galeria).
     - Possibilidade de adicionar **quantas fotos** adicionais forem necessárias (ex.: defeitos, peças trocadas).
     - Possibilidade de adicionar **quantos vídeos** forem necessários (ex.: registro de ruído, funcionamento).
   - Botão “Salvar”:  
     - Ao tocar em “Salvar”, deve-se gravar o registro em armazenamento local (Cache ou SQLite/AsyncStorage), definindo seu status como “pendente”.
     - Se estiver online, enviar imediatamente para a API RESTful/GraphQL. Caso o envio seja bem-sucedido, remover a versão local.
     - Se estiver offline, exibir mensagem “Sem conexão. Registro salvo localmente e será enviado quando possível.”  

3. Fluxo Offline e Sincronização Automática
   - Toda vez que o app for aberto ou receber evento de reconexão (listener de rede), verificar pendências salvas localmente.
   - Para cada pendência:
     1. Tentar envio para o backend.
     2. Se sucesso, remover o registro do armazenamento local.
     3. Se falha (timeout ou erro HTTP), manter no storage e exibir notificação interna (toast) indicando falha de sincronização, para tentar novamente mais tarde.
   - Toda leitura de lista (execuções existentes) deve usar cache local primeiro, depois atualizar dados da nuvem e atualizar o cache.

4. Tela de “Registros Pendentes” (Local)
   - Deve existir uma página específica (“Pendências” ou “Offline”) que lista somente os registros que estão salvos localmente e ainda não sincronizados.
   - Para cada item nessa lista, mostrar:
     - Data, Placa, Cliente e status (“Aguardando envio” ou “Reenvio falhou”).
     - Botão “Tentar Enviar Agora” para reprocessar manualmente o envio daquele registro individual.
     - Opção de excluir manualmente o registro local (com confirmação) caso não queira enviar mais.
   - Ao sincronizar automaticamente, esses registros sumirão da lista e aparecerão na lista geral de execuções (ao serem recarregados do backend).

5. Tela Principal (Dashboard)
   - Mostrar lista paginada/infinite scroll das execuções que já estão no servidor, ordenadas por data (mais recente primeiro).
   - Cada item exibe, no mínimo: Data, Placa, Cliente, Técnico e um ícone indicando se possui fotos/vídeos anexados.
   - Campo de busca ou filtro por placa, cliente ou data.
   - Possibilidade de tocar em um item para visualizar detalhes completos (incluindo imagens/vídeos em galeria).

6. Boas Práticas e Arquitetura
   - **State Management**: usar Context API ou Redux (p.ex. Redux Toolkit) para centralizar estado de autenticação, registros e controle de pendências.
   - **Navegação**: usar React Navigation (stack + tabs) para organizar telas (login, dashboard, novo registro, pendências, detalhes).
   - **Persistência Local**: usar AsyncStorage ou SQLite (via expo-sqlite ou react-native-sqlite-storage) para armazenar JSON dos registros e metadados de sincronização. Implementar camada de Data Access (repositório) para abstrair operação de leitura/gravação.
   - **Comunicação com Backend**: usar Axios ou fetch com interceptors para checar token de autenticação e gerenciar erros de rede. Definir serviço/API layer separado de componentes de UI.
   - **Upload de Mídia**: usar bibliotecas como react-native-image-picker para capturar imagens/vídeos e armazenar URIs locais em cache até o envio. Quando for enviar, converter para multipart/form-data para API.
   - **Cache de Recursos**: para imagens de execução já enviadas, usar react-query ou SWR ou mesmo um cache manual, salvando URIs locais em cache e exibindo placeholders ao carregar.
   - **Offline Detection**: usar NetInfo (React Native Community) para detectar mudanças de conectividade e disparar tentativas de sincronização.
   - **Design Responsivo**: aplicar StyleSheet ou bibliotecas de UI como React Native Paper ou NativeBase para consistência. Garantir acessibilidade (tamanhos, contraste).
   - **Estrutura de Pastas Sugerida**:
     ```
     /src
       /api         # chamadas ao backend (serviços REST/GraphQL)
       /components  # componentes reutilizáveis (botões, inputs, cards)
       /contexts    # providers de estado (AuthContext, SyncContext)
       /hooks       # custom hooks (useAuth, useSync, useOffline)
       /models      # interfaces/Tipos TypeScript (Registro, Usuario, Cliente, Tecnico)
       /navigation  # configuração de rotas (React Navigation)
       /screens     # telas (LoginScreen, Dashboard, NovoRegistro, Pendencias, Detalhes)
       /services    # lógica de persistência local (AsyncStorage, SQLite)
       /utils       # utilitários (formatadores de data, validadores de placa)
       /assets      # imagens estáticas, ícones
     ```
   - **Controle de Versões e Build**: configurar ESLint + Prettier para padronização de código. Configurar CI/CD básico (GitHub Actions, Bitrise ou App Center) para builds automáticas e testes unitários.

**Instruções de Particionamento do Trabalho**
1. **Parte 1: Autenticação e Navegação Básica**
   - Implementar telas de Login e Cadastro.
   - Configurar React Navigation com rota pública (Login) e rota protegida (Dashboard).
   - Mockar chamadas de API no início (pode usar JSON Server ou serviços de mock).

2. **Parte 2: Layout do Dashboard e Tela de Listagem**
   - Construir Dashboard com Tab Navigator: “Execuções” e “Pendências”.
   - Tela “Execuções”: lista estática de execuções mockadas (nome, data, placa).  
   - Tela “Pendências”: lista vazia (placeholder “Nenhuma pendência”).

3. **Parte 3: Formulário de Novo Registro**
   - Criar componente de formulário com todos os campos listados.
   - Integrar react-native-image-picker para capturar fotos e vídeos.  
   - Armazenar temporariamente em estado local (useState) antes de salvar.

4. **Parte 4: Persistência Local e Envio**
   - Implementar camada de serviço para salvar registros em AsyncStorage/SQLite com status “pendente”.
   - Ao salvar, atualizar lista de pendências dinamicamente.  
   - Configurar NetInfo para detectar conexão e despachar envio automático ao backend (ainda mockado).  
   - Após ‘envio’, remover do armazenamento local.

5. **Parte 5: Integração Real com Backend**
   - Construir (ou conectar a) API RESTful de verdade para autenticação, CRUD de execuções, upload de mídia.
   - Ajustar serviços de API para usar URLs reais, tratar erros e tokens.
   - Fazer testes end‑to‑end de fluxo: login → novo registro offline → reconexão → sincronia → listagem de execuções.

6. **Parte 6: Cache de Imagens e Otimizações**
   - Implementar cache de miniaturas de fotos para exibição rápida em listas.
   - Ajustar performance das listas (FlatList com keyExtractor, memoização de itens).
   - Colocar indicadores de loading, esqueleto na lista, toast para sucessos/erros.

7. **Parte 7: Detalhes Avançados e Evolução**
   - Tela de detalhes da execução: exibir galeria de fotos e vídeos salvos enviados.
   - Filtros e busca avançada na lista principal.
   - Permitir edição de registros já enviados (com fluxo de edição offline/online).
   - Relatórios exportáveis (PDF, CSV) dos registros.
   - Internacionalização (i18n) para suportar outros idiomas.
   - Monitoramento de erros (Sentry) e analytics de uso.

Cada parte deve ser entregue como um pull request independente, contendo:
- Código limpo e organizado seguindo padrões definidos.
- Testes unitários para componentes e serviços críticos.
- Documentação sucinta (README.md atualizado, comentários relevantes e instruções de setup).

Ao finalizar cada parte, escreva um breve resumo (2–3 parágrafos) dos pontos abordados, decisões de arquitetura e próximos passos.

