# 🚀 Tibia Stories App — Plano de Execução

> **Versão:** 1.0
> **Data:** 25/02/2026
> **Pré-requisitos:** Ler `architecture.md` (padrões) e `general-plan.md` (especificações).
> **Regra geral:** Cada fase só inicia quando a anterior estiver completa e funcional.

---

## Índice de Fases

| Fase | Nome                          | Depende de | Arquivos | Status |
| ---- | ----------------------------- | ---------- | -------- | ------ |
| 0    | Setup do Projeto              | —          | 6        | ✅     |
| 1    | Fundação (theme, types, DB)   | 0          | 14       | ✅     |
| 2    | Componentes Base              | 1          | 11       | ✅     |
| 3    | Shell de Navegação            | 2          | 5        | ✅     |
| 4    | Feature: Itens                | 3          | 9        | ✅     |
| 5    | Feature: Chars (leitura)      | 3          | 9        | ✅     |
| 6    | Feature: Depot (Home)         | 4, 5       | 4        | ✅     |
| 7    | Firebase + Auth               | 3          | 9+       | ✅     |
| 8    | Feature: Conta + Meus Chars   | 7          | 7        | ⬜     |
| 9    | Feature: Exiva + Vínculo      | 8          | 6        | ⬜     |
| 10   | Feature: Editar História      | 9          | 3        | ⬜     |
| 11   | Sync Firebase ↔ SQLite        | 10         | 4        | ⬜     |
| 12   | Feature: Destaque + Compra    | 11         | 5        | ⬜     |
| 13   | Anúncios (AdMob)              | 3          | 2        | ⬜     |
| 14   | Polimento & Build             | 1–13       | 5+       | ⬜     |

---

## Fase 0 — Setup do Projeto

**Objetivo:** Criar o projeto Expo, instalar todas as dependências e configurar ferramentas.

**Depende de:** Nada.

### Passo a passo

1. Criar projeto Expo na raiz (ao lado da pasta `prototype/`):
   ```bash
   npx create-expo-app@latest . --template blank-typescript
   ```
   > ⚠️ O projeto já tem `prototype/` e `.md` files. O comando deve adicionar os arquivos Expo sem sobrescrever.

2. Instalar TODAS as dependências (ver `architecture.md` seção 2.1):
   ```bash
   # Navegação
   npm install @react-navigation/native @react-navigation/material-top-tabs @react-navigation/native-stack react-native-pager-view react-native-screens react-native-safe-area-context

   # State
   npm install zustand

   # Banco
   npm install expo-sqlite

   # Firebase
   npm install @react-native-firebase/app @react-native-firebase/firestore @react-native-firebase/auth

   # Login Social
   npm install @react-native-google-signin/google-signin expo-apple-authentication

   # Monetização
   npm install react-native-google-mobile-ads expo-in-app-purchases

   # UI
   npm install expo-font expo-splash-screen expo-linear-gradient react-native-reanimated react-native-gesture-handler expo-clipboard

   # Tooling
   npm install -D babel-plugin-module-resolver
   ```

3. Remover Expo Router se vier instalado por padrão:
   ```bash
   npm uninstall expo-router
   ```
   > Motivo: Usamos React Navigation 7 diretamente (`architecture.md` seção 4.2).

### Arquivos a criar/configurar

| #  | Arquivo               | Ação    | Referência                           |
| -- | --------------------- | ------- | ------------------------------------ |
| 01 | `babel.config.js`     | Editar  | `architecture.md` seção 14.1         |
| 02 | `tsconfig.json`       | Editar  | `architecture.md` seção 14.2         |
| 03 | `app.json`            | Editar  | `architecture.md` seção 14.3         |
| 04 | `eas.json`            | Criar   | `general-plan.md` seção 13.3         |
| 05 | `.gitignore`          | Editar  | Adicionar `google-services.json`, `GoogleService-Info.plist` |
| 06 | `App.tsx`             | Editar  | Placeholder mínimo (será completado na Fase 3) |

### Critério de "done"

- [ ] `npx expo start` roda sem erros
- [ ] `@/` path alias funciona (import de teste)
- [ ] TypeScript strict sem erros de compilação
- [ ] Pasta `prototype/` permanece intocada

---

## Fase 1 — Fundação (Theme, Types, DB, Constants)

**Objetivo:** Criar a camada de fundação que TODAS as features usarão. Nenhum componente visual ainda.

**Depende de:** Fase 0.

### Arquivos a criar (na ordem)

| #  | Arquivo                             | Referência                                        |
| -- | ----------------------------------- | ------------------------------------------------- |
| 01 | `src/theme/index.ts`                | `architecture.md` seção 9.1 (copiar tokens completos) |
| 02 | `src/types/item.ts`                 | `architecture.md` seção 11.1                      |
| 03 | `src/types/character.ts`            | `architecture.md` seção 11.2                      |
| 04 | `src/types/auth.ts`                 | `architecture.md` seção 11.3                      |
| 05 | `src/types/market.ts`               | `architecture.md` seção 11.4                      |
| 06 | `src/types/tibiaData.ts`            | `architecture.md` seção 11.5                      |
| 07 | `src/types/index.ts`                | Re-exports de todos os types acima                |
| 08 | `src/constants/app.ts`              | Textos fixos imersivos — ver `general-plan.md` seção 8.2 (todos os textos entre aspas) |
| 09 | `src/constants/vocations.ts`        | Lista: EK, RP, ED, MS, MO com cores e labels     |
| 10 | `src/constants/rarities.ts`         | Legendary, Very Rare, Rare com cores              |
| 11 | `src/constants/firebase.ts`         | Collection names: 'characters', 'highlight_payments', 'users' |
| 12 | `src/repositories/database.ts`      | `architecture.md` seção 8.2                       |
| 13 | `src/repositories/migrations.ts`    | `architecture.md` seção 8.3 + DDL de `general-plan.md` seção 5.1 |
| 14 | `src/utils/tokenGenerator.ts`       | Gera UUID v4 com prefixo `TS-`                    |

### Regras

- `theme/index.ts` deve conter TODOS os tokens do `architecture.md` seção 9.1.
- Cores do header/tab são `#8B2020` (gradiente `#A02828 → #8B2020 → #6E1818`). **NÃO MUDAR.**
- DDL das tabelas deve bater EXATAMENTE com `general-plan.md` seção 5.1.
- `constants/app.ts` deve conter todos os textos imersivos das telas (ver seção 8.2 do general-plan — copiar strings exatas entre aspas).

### Critério de "done"

- [ ] `theme/index.ts` exporta objeto `theme` com todas as cores, fontes, spacings, radius, shadows, borders
- [ ] Todos os types compilam sem erro
- [ ] `database.ts` abre SQLite com WAL mode
- [ ] `migrations.ts` cria as 3 tabelas (items, characters, user_config)
- [ ] `tokenGenerator.ts` gera tokens no formato `TS-xxxxxxxx`
- [ ] Nenhum arquivo importa React, Zustand ou Firebase

---

## Fase 2 — Componentes Base

**Objetivo:** Criar os 11 componentes atômicos reutilizáveis. Nenhuma lógica de negócio.

**Depende de:** Fase 1 (precisa do `theme/index.ts`).

### Arquivos a criar (na ordem)

| #  | Arquivo                                    | Descrição                                      |
| -- | ------------------------------------------ | ---------------------------------------------- |
| 01 | `src/components/base/TibiaText.tsx`        | Variantes: title, body, caption, muted         |
| 02 | `src/components/base/TibiaButton.tsx`      | Variantes: primary, secondary, outline, glow   |
| 03 | `src/components/base/TibiaPanel.tsx`       | Container com borda medieval dupla             |
| 04 | `src/components/base/TibiaInput.tsx`       | Input field estilizado                         |
| 05 | `src/components/base/TibiaBadge.tsx`       | Badge (raridade, vocação, status)              |
| 06 | `src/components/base/TibiaDivider.tsx`     | Divisor ornamental ✦ ✦ ✦                       |
| 07 | `src/components/base/TibiaHeader.tsx`      | Header de seção (faixa dourada)                |
| 08 | `src/components/base/TibiaIcon.tsx`        | Wrapper para ícones PNG com tintColor          |
| 09 | `src/components/base/TibiaImage.tsx`       | Imagem com borda estilizada                    |
| 10 | `src/components/base/TibiaLoading.tsx`     | Spinner/loading temático                       |
| 11 | `src/components/base/TibiaEmpty.tsx`       | Estado vazio com mensagem imersiva             |

### Regras

- Seguir EXATAMENTE o template da `architecture.md` seção 10.1.
- Props interface → Componente funcional → `StyleSheet.create` (theme tokens) → `export default React.memo`.
- **Zero** imports de stores, services, repositories.
- **Zero** inline styles. Tudo via `theme`.
- **Zero cores hex/rgb hardcoded** nos componentes — toda cor DEVE vir de `theme.colors.*`. Se a cor não existir no theme, **primeiro adicione o token em `theme/index.ts`** e depois referencie. Nunca usar `'#XXXXXX'` direto no StyleSheet ou variantStyles.
- Props apenas primitivas (string, number, boolean, callback).
- Visual de referência: `prototype/styles.css` (paleta, bordas, fontes). Ao portar cores do CSS, criar o token correspondente no theme.

### Critério de "done"

- [ ] 11 arquivos em `src/components/base/`
- [ ] Todos exportam com `React.memo`
- [ ] Todos usam apenas `theme` para estilos
- [ ] Nenhum importa store ou service
- [ ] Compilam sem erros TypeScript

---

## Fase 3 — Shell de Navegação

**Objetivo:** Montar a estrutura de navegação com telas placeholder. O app deve abrir e navegar entre as 4 tabs.

**Depende de:** Fase 2 (precisa dos componentes base para o header/tabs).

### Arquivos a criar

| #  | Arquivo                                     | Referência                             |
| -- | ------------------------------------------- | -------------------------------------- |
| 01 | `src/stores/useAppStore.ts`                 | `architecture.md` seção 5.2 (AppState) |
| 02 | `src/navigation/TopTabNavigator.tsx`        | `architecture.md` seção 4.4            |
| 03 | `src/navigation/AppNavigator.tsx`           | `architecture.md` seção 4.1            |
| 04 | `src/components/composed/AppHeader.tsx`     | Header fixo "⚔ TIBIA STORIES ⚔" (#8B2020) |
| 05 | `App.tsx`                                   | Entry point: SafeAreaProvider + AppNavigator |

### Telas placeholder (temporárias, serão substituídas nas fases seguintes)

Criar arquivos mínimos para as 4 telas de tab:
- `src/screens/DepotScreen.tsx` → `<TibiaText>Depot</TibiaText>`
- `src/screens/ItemsScreen.tsx` → `<TibiaText>Itens</TibiaText>`
- `src/screens/CharsScreen.tsx` → `<TibiaText>Chars</TibiaText>`
- `src/screens/AccountScreen.tsx` → `<TibiaText>Conta</TibiaText>`

### Regras

- Tabs na posição **bottom** com `tabBarPosition: 'bottom'`.
- Tab bar com `backgroundColor: theme.colors.headerBg` (#8B2020).
- Ícones: usar os PNGs de `assets/icons/` (copiar de `prototype/icons/`). Conta usa emoji ⚙️.
- Indicador dourado no topo da tab bar.
- Swipe entre tabs habilitado.
- AppNavigator: NativeStack com TopTabNavigator como tela principal + stacks para detalhe.
- Ver layout ASCII em `architecture.md` seção 4.3.

### Critério de "done"

- [ ] App abre e mostra header "⚔ TIBIA STORIES ⚔" em vermelho escuro
- [ ] 4 tabs visíveis no rodapé: Depot, Itens, Chars, Conta
- [ ] Cada tab com ícone correto (PNG para 3 primeiras, emoji para Conta)
- [ ] Swipe entre tabs funciona
- [ ] Tab ativa com destaque visual (indicador dourado)
- [ ] Fontes MedievalSharp e Martel carregadas

---

## Fase 4 — Feature: Itens (Leitura Local)

**Objetivo:** Implementar a listagem de itens + detalhe. Dados vêm do SQLite (seed). Zero Firebase.

**Depende de:** Fase 3.

### Arquivos a criar

| #  | Arquivo                                         | Referência                                   |
| -- | ----------------------------------------------- | -------------------------------------------- |
| 01 | `src/repositories/itemsRepository.ts`           | `architecture.md` seção 8.4                  |
| 02 | `src/rules/itemRules.ts`                        | `architecture.md` seção 6.1 (itemRules)      |
| 03 | `src/rules/formatRules.ts`                      | `architecture.md` seção 6.1 (formatRules)    |
| 04 | `src/stores/useItemsStore.ts`                   | `architecture.md` seção 5.2 (ItemsState)     |
| 05 | `src/components/composed/ItemCard.tsx`           | `architecture.md` seção 10.2 (template)      |
| 06 | `src/components/composed/ItemSearchBar.tsx`      | Busca + filtro raridade + ordenação           |
| 07 | `src/components/composed/RarityFilter.tsx`       | Botões toggle: Todos / Legendary / Very Rare / Rare |
| 08 | `src/screens/ItemsScreen.tsx`                    | `architecture.md` seção 10.3 (template) + `general-plan.md` seção 8.2 (Tela 2) |
| 09 | `src/screens/ItemDetailScreen.tsx`               | `general-plan.md` seção 8.2 (Tela 2.1) — Origem + Mitos |

### Seed de dados

Adicionar em `src/repositories/migrations.ts` (função `seedItemsIfEmpty`):
- Os 12 itens do `prototype/data.js` com nome, raridade, história e mitos.
- Ver `general-plan.md` seção 14 para a lista completa.

### Regras

- `ItemsScreen` lê store com seletores granulares (`architecture.md` seção 10.3).
- Filtros/sort usam `itemRules.ts` (funções puras, sem React).
- Busca por nome: placeholder `"Buscar item por nome..."`.
- Filtro por raridade: Todos / 🟠 Legendary / 🟣 Very Rare / 🔵 Rare.
- Ordenação: A→Z, Z→A, Raridade ↓, Raridade ↑.
- Estado vazio: `"Nenhum item encontrado..."`.
- Navegação: clicar no card → push para `ItemDetailScreen`.
- `ItemDetailScreen`: imagem, nome, badge raridade, seção Origem, seção Mitos.

### Critério de "done"

- [ ] Tab "Itens" exibe lista de 12 itens com nome + badge de raridade
- [ ] Busca por nome funciona
- [ ] Filtro por raridade funciona (toggle buttons)
- [ ] Ordenação funciona (4 opções)
- [ ] Estado vazio exibe mensagem imersiva
- [ ] Clicar em item → abre tela de detalhe com Origem e Mitos
- [ ] Botão voltar no detalhe → retorna para lista
- [ ] Dados vêm do SQLite (seed)

---

## Fase 5 — Feature: Chars (Leitura)

**Objetivo:** Implementar a listagem de chars + história. Dados vêm do SQLite (mock seed para desenvolvimento).

**Depende de:** Fase 3.

### Arquivos a criar

| #  | Arquivo                                          | Referência                                  |
| -- | ------------------------------------------------ | ------------------------------------------- |
| 01 | `src/repositories/charsRepository.ts`            | `architecture.md` seção 8.5                 |
| 02 | `src/rules/charRules.ts`                         | `architecture.md` seção 6.1 (charRules)     |
| 03 | `src/stores/useCharsStore.ts`                    | `architecture.md` seção 5.2 (CharsState)    |
| 04 | `src/components/composed/CharCard.tsx`            | `architecture.md` seção 10.2                |
| 05 | `src/components/composed/CharSearchBar.tsx`       | Busca "exiva" + filtro vocação/mundo        |
| 06 | `src/components/composed/VocationFilter.tsx`      | Botões: Todos / EK / RP / ED / MS / MO      |
| 07 | `src/components/composed/SortSelector.tsx`        | Dropdown: A-Z, Z-A, Level ↓, Level ↑        |
| 08 | `src/screens/CharsScreen.tsx`                     | `general-plan.md` seção 8.2 (Tela 3)       |
| 09 | `src/screens/CharStoryScreen.tsx`                 | `general-plan.md` seção 8.2 (Tela 3.1)     |

### Seed de dados (desenvolvimento)

Adicionar seed temporário de chars em `migrations.ts`:
- Os 7 personagens do `prototype/data.js` (EK, MS, RP, ED, MO).
- Esse seed será removido quando o sync Firebase estiver pronto (Fase 11).

### Regras

- Busca com placeholder imersivo: `exiva "nome"...`.
- Filtros por vocação (EK, RP, ED, MS, MO) e por mundo.
- Ordenação: A-Z, Z-A, Level ↓, Level ↑.
- Estado vazio: `"Nenhum char encontrado..."`.
- Só exibe chars com `is_verified = 1` E `story_content IS NOT NULL`.
- `CharStoryScreen`: avatar, nome, badges (vocação, nível, mundo), título, história completa, data.
- Navegação: card → push `CharStoryScreen`.

### Critério de "done"

- [ ] Tab "Chars" exibe lista de chars com nome, nível, vocação, mundo
- [ ] Busca "exiva" funciona
- [ ] Filtro por vocação funciona (incluindo Monk/MO)
- [ ] Filtro por mundo funciona
- [ ] Ordenação funciona (nome e level)
- [ ] Clicar em char → abre história completa
- [ ] Botão voltar → retorna para lista

---

## Fase 6 — Feature: Depot (Home)

**Objetivo:** Implementar a tela principal com chars em destaque e histórias recentes.

**Depende de:** Fase 4, Fase 5 (precisa de CharCard, charsStore, charsRepository).

### Arquivos a criar

| #  | Arquivo                                               | Referência                              |
| -- | ----------------------------------------------------- | --------------------------------------- |
| 01 | `src/components/composed/HighlightedCharCard.tsx`     | Card com glow dourado e estrela         |
| 02 | `src/screens/DepotScreen.tsx`                          | `general-plan.md` seção 8.2 (Tela 1)   |
| 03 | `src/rules/highlightRules.ts`                          | `architecture.md` seção 6.1             |
| 04 | `src/utils/dateUtils.ts`                               | Helpers de data e expiração             |

### Regras

- Seção **"⭐ Chars em Destaque"**: chars com `is_highlighted = 1` e `highlight_until >= now`.
- Se não houver destaques: `"Nenhum char em destaque no momento..."`.
- Seção **"Histórias Recentes"**: 3 chars mais recentes (por `created_at`).
- Cards de destaque usam `HighlightedCharCard` (glow dourado).
- Cards recentes usam `CharCard` normal.
- Clicar em qualquer card → push `CharStoryScreen`.
- `highlightRules.isHighlightActive()` verifica expiração.
- `highlightRules.filterActiveHighlights()` filtra lista.

### Critério de "done"

- [ ] Tab "Depot" exibe seção de destaques com glow dourado
- [ ] Exibe seção "Histórias Recentes" com 3 chars
- [ ] Estado vazio para destaques funciona
- [ ] Cards clicáveis navegam para história

---

## Fase 7 — Firebase + Autenticação

**Objetivo:** Configurar Firebase (JS SDK) via `.env`, implementar login completo (e-mail + Google + Apple).

**Depende de:** Fase 3 (shell de navegação).

> ✅ Esta fase usa o **Firebase JS SDK** (modular v10), que funciona com Expo Go e sem Dev Client.
> Os pacotes nativos (`@react-native-firebase/*`) foram removidos em favor do SDK JS.

### Pré-requisitos manuais (fora do código)

1. Criar projeto no [Firebase Console](https://console.firebase.google.com).
2. Registrar um **Web app** no projeto (para obter as config keys do JS SDK).
3. Habilitar Authentication → Sign-in providers: **Email/Password**, **Google**, **Apple**.
4. Criar Firestore database (modo teste inicialmente).
5. No [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials:
   - Criar OAuth 2.0 Client ID tipo **Web application** → copiar `GOOGLE_WEB_CLIENT_ID`.
   - Criar OAuth 2.0 Client ID tipo **iOS** → copiar `GOOGLE_IOS_CLIENT_ID`.
6. Preencher o arquivo **`.env`** na raiz do projeto com os valores obtidos acima.
   - Referência: `.env.example` (já commitado no git).

### Passo 0 — Instalar dependências

```bash
# Firebase JS SDK (modular)
npm install firebase

# Persistência de auth em React Native
npm install @react-native-async-storage/async-storage

# Google Sign-In via OAuth (Expo managed)
npm install expo-auth-session expo-crypto expo-web-browser
```

### Passo 1 — Configurar `.env`

O arquivo `.env` (já criado na raiz, ignorado pelo git) contém:

```
# Firebase JS SDK Config
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

# Google Sign-In OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
```

> **Como funciona:** O Expo (SDK 49+) lê automaticamente o `.env` no build/start e injeta variáveis `EXPO_PUBLIC_*` via `process.env`. Não precisa de `app.config.ts` para isso.

### Arquivos a criar

| #  | Arquivo                                            | Referência / Descrição                                         |
| -- | -------------------------------------------------- | -------------------------------------------------------------- |
| 01 | `src/config/firebaseConfig.ts`                     | Lê `process.env.EXPO_PUBLIC_*` e exporta `firebaseConfig` obj  |
| 02 | `src/services/firebaseService.ts`                  | `initializeApp(config)`, `getAuth()`, `getFirestore()`         |
| 03 | `src/services/authService.ts`                      | Login email, Google (expo-auth-session), Apple, logout, reset  |
| 04 | `src/rules/authRules.ts`                           | `architecture.md` seção 6.1 (validações puras)                |
| 05 | `src/stores/useAuthStore.ts`                       | `architecture.md` seção 5.2 (AuthState)                       |
| 06 | `src/components/composed/SocialLoginButtons.tsx`   | Botões Google + Apple (props only, sem store)                  |
| 07 | `src/screens/LoginScreen.tsx`                      | `general-plan.md` seção 8.2 (Tela 4.0a)                      |
| 08 | `src/screens/RegisterScreen.tsx`                   | `general-plan.md` seção 8.2 (Tela 4.0b)                      |
| 09 | `src/repositories/userConfigRepository.ts`         | `architecture.md` seção 8.6                                    |

### Detalhes de implementação

#### `src/config/firebaseConfig.ts`
```typescript
// Lê as variáveis de ambiente EXPO_PUBLIC_* injetadas pelo Expo
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};
```

#### `src/services/firebaseService.ts`
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '@/config/firebaseConfig';

// Inicializa Firebase App (singleton)
// Inicializa Auth com persistência via AsyncStorage
// Inicializa Firestore
// Exporta instâncias: app, auth, db
```

#### `src/services/authService.ts`
```typescript
// signInWithEmailAndPassword (Firebase Auth JS SDK)
// createUserWithEmailAndPassword (Firebase Auth JS SDK)
// Google Sign-In via expo-auth-session:
//   1. useAuthRequest() com Google.useAuthRequest({ webClientId, iosClientId })
//   2. Recebe id_token → GoogleAuthProvider.credential(id_token)
//   3. signInWithCredential(auth, credential)
// Apple Sign-In via expo-apple-authentication:
//   1. AppleAuthentication.signInAsync() → recebe identityToken + nonce
//   2. OAuthProvider.credential('apple.com', id_token, nonce)
//   3. signInWithCredential(auth, credential)
// signOut, sendPasswordResetEmail
// ensureUserToken(uid): busca/cria token TS-xxx no Firestore (collection 'users')
```

### Regras

- **LoginScreen**: E-mail + Senha + "Entrar" + "Esqueceu a senha?" + Google + Apple + "Criar Conta".
- **RegisterScreen**: Nome (opcional) + E-mail + Senha + Confirmar + "Criar Conta" + Google + Apple + "Já tem conta?".
- `authRules.ts`: funções puras de validação (e-mail, senha, match). **Zero** Firebase imports.
- `authService.ts`: wrapper do Firebase Auth JS SDK (login, register, social, logout, resetPassword, ensureUserToken).
- `useAuthStore.ts`: user, userToken, isLoggedIn + actions que chamam authService.
- Após login/registro bem-sucedido: `authService.ensureUserToken(uid)` → cria/busca token UUID no Firestore.
- Feedback de login: `"✅ Login realizado com sucesso! Entrando em mainland..."`.
- Feedback de registro: `"✅ Conta criada com sucesso!"`.
- Textos exatos: ver `general-plan.md` seção 8.2 (Telas 4.0a e 4.0b).
- Consultar protótipo (`prototype/app.js`) para layout e estrutura visual das telas de login/registro.

### Critério de "done"

- [ ] `.env` preenchido com valores reais do Firebase Console
- [ ] Firebase inicializa sem erros (`firebaseService.ts` + `firebaseConfig.ts`)
- [ ] Login com e-mail/senha funciona
- [ ] Registro com e-mail/senha funciona
- [ ] Login com Google funciona (via expo-auth-session)
- [ ] Login com Apple funciona (iOS, via expo-apple-authentication)
- [ ] "Esqueceu a senha?" envia e-mail de reset
- [ ] Após login, `useAuthStore` tem user + userToken
- [ ] Token UUID (TS-xxx) é criado no Firestore (collection `users`) vinculado ao uid
- [ ] Auth persiste entre reinícios do app (AsyncStorage)
- [ ] Logout limpa estado
- [ ] Validações (authRules) impedem submit de form inválido
- [ ] Funciona no Expo Go (sem Dev Client)

---

## ⚠️ Ajustes de Tema — Padrões Visuais Consolidados (pós Fase 7)

> **Estas decisões foram ajustadas manualmente pelo usuário e são INVIOLÁVEIS.**
> Qualquer tela ou componente criado a partir daqui DEVE seguir estes padrões.

### 1. Headers de Stack Screens (NativeStack)

Todas as telas que usam `headerShown: true` no `AppNavigator.tsx` devem seguir:

```typescript
options={{
    headerShown: true,
    headerTitle: 'Nome da Tela',
    headerStyle: {
        backgroundColor: theme.colors.headerBg,      // '#8B2020' — vermelho escuro
    },
    headerTintColor: theme.colors.textOnHeader,       // '#FFF2DB' — creme claro
    headerTitleStyle: {
        fontFamily: theme.fonts.title,                // MedievalSharp
        fontSize: theme.fontSizes.lg,                 // 16
    },
}}
```

**Regras:**
- `headerStyle.backgroundColor` → sempre `theme.colors.headerBg` (`#8B2020`).
- `headerTintColor` → sempre `theme.colors.textOnHeader` (`#FFF2DB`). Isso controla a cor da seta de voltar E do título.
- `headerTitleStyle.fontFamily` → sempre `theme.fonts.title` (MedievalSharp).
- **NÃO usar** `theme.colors.panel`, `theme.colors.textPrimary` ou qualquer outra cor para headers de stack.

### 2. Background de Telas (ScrollView / View raiz)

Todas as telas, containers e navigators usam `theme.colors.panel` (`#FFF2DB`) como background, **nunca** `theme.colors.background` (`#FFFFFF`).

Isso inclui:
- `ScrollView` / `View` raiz de todas as screens.
- `contentStyle` do `Stack.Navigator` no `AppNavigator.tsx`.
- Container do `TopTabNavigator.tsx`.

```typescript
scrollView: {
    flex: 1,
    backgroundColor: theme.colors.panel,   // '#FFF2DB' — pergaminho
},
// OU para telas sem scroll:
container: {
    flex: 1,
    backgroundColor: theme.colors.panel,
},
```

**Única exceção:** `TibiaInput` usa `theme.colors.background` (`#FFFFFF`) no campo de input, pois o branco garante contraste para digitação. Isso é intencional e **não deve ser alterado**.

### 3. AppHeader (Header fixo do app)

- Gradiente removido: as 3 cores do `LinearGradient` são `theme.colors.headerBg` (cor sólida `#8B2020`).
- `borderTop` decorativo está comentado/removido.
- **NÃO restaurar** o gradiente (`headerGradientStart`/`headerGradientEnd`) nem o `borderTop` sem instrução explícita do usuário.

### 4. Resumo rápido de tokens de referência

| Contexto                    | Token                            | Valor     |
| --------------------------- | -------------------------------- | --------- |
| Header stack bg             | `theme.colors.headerBg`          | `#8B2020` |
| Header stack text/seta      | `theme.colors.textOnHeader`      | `#FFF2DB` |
| Header stack font           | `theme.fonts.title`              | MedievalSharp |
| Background de telas         | `theme.colors.panel`             | `#FFF2DB` |
| AppHeader (bar fixa)        | `theme.colors.headerBg` (sólido) | `#8B2020` |

---

## Fase 8 — Feature: Conta + Meus Chars

**Objetivo:** Implementar a tela Conta completa com lista de "Meus Chars" e ações.

**Depende de:** Fase 7 (precisa de auth).

### Arquivos a criar

| #  | Arquivo                                          | Referência                               |
| -- | ------------------------------------------------ | ---------------------------------------- |
| 01 | `src/stores/useMyCharsStore.ts`                  | `architecture.md` seção 5.2 (MyCharsState) |
| 02 | `src/components/composed/TokenDisplay.tsx`       | Token UUID com botão copiar               |
| 03 | `src/components/composed/MyCharItem.tsx`         | Item de char com status + botões de ação |
| 04 | `src/screens/AccountScreen.tsx`                  | `general-plan.md` seção 8.2 (Tela 4)    |
| 05 | `src/services/firestoreService.ts`               | `architecture.md` seção 7.5 (início — apenas reads) |
| 06 | `src/utils/textUtils.ts`                         | Helpers de texto (truncate, capitalize)  |
| 07 | `src/hooks/useInitApp.ts`                        | `architecture.md` seção 12 (boot flow parcial — até onde possível) |

### Regras

- **⚠️ Seguir os padrões da seção "Ajustes de Tema" acima** — headers com `headerBg` + `textOnHeader`, backgrounds com `theme.colors.panel`.
- **Não logado**: exibe tela de login (redireciona para `LoginScreen`).
- **Logado**: exibe seções:
  1. **"🔑 Meu Token de Verificação"**: `TokenDisplay` com token e botão copiar.
  2. **"⚔️ Meus Chars"**: Lista dos chars do usuário com status (✅ Vinculado / ⏳ Pendente).
  3. Cada char com botões: Vincular, Escrever, Editar, ⭐.
  4. Botão **"➕ Adicionar Char"**.
  5. Seção **"ℹ️ Sobre o App"**.
  6. Botão **"Sair"** (logout).
- Estado vazio (sem chars): `"Nenhum char vinculado"`.
- `MyCharItem` recebe props primitivas (nome, status, callbacks).
- `useMyCharsStore` busca chars do Firestore filtrados por `user_token`.
- Textos exatos: `general-plan.md` seção 8.2 (Tela 4).

### Critério de "done"

- [ ] Conta mostra login se não logado
- [ ] Conta mostra token + meus chars se logado
- [ ] Token com botão copiar funciona
- [ ] Lista de chars do usuário exibe status
- [ ] Botão "Adicionar Char" navega para AddCharScreen (placeholder por enquanto)
- [ ] Botão "Sair" faz logout e volta para tela de login
- [ ] Sobre o App exibe versão

---

## Fase 9 — Feature: Exiva (Adicionar Char) + Quest de Vínculo

**Objetivo:** Implementar busca de char na TibiaData API e vinculação por token.

**Depende de:** Fase 8.

### Arquivos a criar

| #  | Arquivo                                          | Referência                                  |
| -- | ------------------------------------------------ | ------------------------------------------- |
| 01 | `src/services/tibiaDataService.ts`               | `architecture.md` seção 7.6                 |
| 02 | `src/rules/verificationRules.ts`                 | `architecture.md` seção 6.1                 |
| 03 | `src/hooks/useCharVerify.ts`                     | `architecture.md` seção — hook do fluxo     |
| 04 | `src/components/composed/QuestSteps.tsx`         | Painel com instruções da quest              |
| 05 | `src/screens/AddCharScreen.tsx`                  | `general-plan.md` seção 8.2 (Tela 4.1)     |
| 06 | `src/screens/VerifyCharScreen.tsx`               | `general-plan.md` seção 8.2 (Tela 4.2)     |

### Regras

- **⚠️ Seguir os padrões da seção "Ajustes de Tema"** — headers com `headerBg` + `textOnHeader`, backgrounds com `theme.colors.panel`.
- **AddCharScreen ("Exiva — Localizar Char")**:
  - Input: nome do char. Placeholder: `"Ex: Bubble, Kharsek..."`.
  - Botão `"🔍 Exiva!"`.
  - Chama `tibiaDataService.fetchCharacter(name)` → `GET https://api.tibiadata.com/v4/character/{name}`.
  - Se encontrado: painel "✅ Char Localizado" com nome, nível, vocação, mundo.
  - Botão "➕ Adicionar & Vincular" → salva no Firestore + navega para `VerifyCharScreen`.
  - Erro: `"⚠️ Char não encontrado. Verifique o nick e tente novamente."`.
  - Nota: `"ℹ️ O nome deve ser exatamente como aparece em tibia.com."`.
  - Ver `general-plan.md` seção 8.2 (Tela 4.1) para textos exatos.

- **VerifyCharScreen ("Quest de Vínculo")**:
  - Exibe token do usuário em destaque + botão copiar.
  - `QuestSteps` com 5 instruções da quest.
  - Botão "✅ Vincular Agora".
  - Chama `tibiaDataService.fetchCharacter()` → `verificationRules.isTokenInComment()`.
  - Sucesso: `"✅ Personagem vinculado com sucesso!"`.
  - Falha: `"❌ Token não encontrado no comment."`.
  - Aviso: `"⏳ A quest pode levar até 5 minutos..."`.
  - Nota pós-vínculo: `"ℹ️ Após o fim da quest, você pode remover a runa do comment."`.
  - Ver `general-plan.md` seção 8.2 (Tela 4.2) e seção 4.2 para textos exatos.

- **verificationRules.ts**: funções puras. `isTokenInComment(comment, token)` retorna boolean.
- **useCharVerify.ts**: orquestra o fluxo (busca API → verifica token → atualiza Firestore/SQLite).
- Ver fluxo completo em `architecture.md` seção 13.4 e 13.5.

### Critério de "done"

- [ ] "Exiva" busca char real na TibiaData API
- [ ] Exibe dados do char encontrado (nome, nível, vocação, mundo)
- [ ] Char é salvo no Firestore como não vinculado
- [ ] Quest de Vínculo exibe token + instruções
- [ ] Botão copiar token funciona
- [ ] "Vincular Agora" verifica token no comment via API
- [ ] Sucesso: char marcado como vinculado no Firestore + SQLite
- [ ] Falha: mensagem de erro amigável

---

## Fase 10 — Feature: Editar História

**Objetivo:** Permitir escrever/editar história de um char vinculado.

**Depende de:** Fase 9 (char precisa estar vinculado).

### Arquivos a criar

| #  | Arquivo                                      | Referência                              |
| -- | -------------------------------------------- | --------------------------------------- |
| 01 | `src/screens/EditStoryScreen.tsx`            | `general-plan.md` seção 8.2 (Tela 4.3) |
| 02 | Atualizar `src/services/firestoreService.ts` | Adicionar `updateCharacter` (write)     |
| 03 | Atualizar `src/repositories/charsRepository.ts` | Adicionar `upsertCharacter`          |

### Regras
- **⚠️ Seguir os padrões da seção "Ajustes de Tema"** — headers com `headerBg` + `textOnHeader`, backgrounds com `theme.colors.panel`.- Campo "Título da História": placeholder `"Ex: A Lenda de Antica..."`.
- Campo "Sua História" (textarea): placeholder `"Conte as aventuras do seu char..."`.
- Nota: `"✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser."`.
- Botão "💾 Salvar História".
- Feedback: `"✅ História salva com sucesso! Seu char agora aparece nas Histórias dos Aventureiros."`.
- Write-through: Firestore → SQLite local.
- Char deve estar vinculado (RN-01 em `general-plan.md` seção 11.1).
- Ver textos exatos em `general-plan.md` seção 8.2 (Tela 4.3).
- Ver fluxo em `architecture.md` seção 13.6.

### Critério de "done"

- [ ] Tela abre com dados existentes (se editando)
- [ ] Salva título + conteúdo no Firestore
- [ ] Atualiza SQLite local
- [ ] Char aparece na aba Chars (lista pública) após salvar
- [ ] Validação: não permite salvar se char não vinculado
- [ ] Feedback de sucesso

---

## Fase 11 — Sync Firebase ↔ SQLite

**Objetivo:** Implementar sincronização completa e o boot flow final.

**Depende de:** Fase 10 (todas as features de escrita no Firestore devem estar prontas).

### Arquivos a criar/atualizar

| #  | Arquivo                                      | Referência                                |
| -- | -------------------------------------------- | ----------------------------------------- |
| 01 | `src/services/syncService.ts`                | `architecture.md` seção 7.7 (inclui `startConnectivityListener` e `requireOnline`) |
| 02 | `src/services/initService.ts`                | `architecture.md` seção 7.2 e 12         |
| 03 | `src/hooks/useSync.ts`                       | Hook de sync (pull-to-refresh)            |
| 04 | Atualizar `src/hooks/useInitApp.ts`          | Boot flow completo (10 passos + passo 4.5 conectividade) |
| 05 | `src/components/composed/OfflineBanner.tsx`   | Banner "Modo offline" visível quando `isOnline === false` |

### Regras

- **Boot flow** segue EXATAMENTE os 10 passos da `architecture.md` seção 12 (incluindo passo 4.5: `startConnectivityListener`).
- **Listener de conectividade**: `syncService.startConnectivityListener()` usa `@react-native-community/netinfo` para atualizar `useAppStore.isOnline` em tempo real. Iniciado no boot flow (passo 4.5).
- **Banner "Modo offline"**: `OfflineBanner` (composed/) lê `useAppStore.isOnline` e exibe banner persistente no topo da tela enquanto offline. Desaparece automaticamente ao reconectar. Renderizado no `AppNavigator` ou `TopTabNavigator`, acima do conteúdo.
- **Sync na abertura**: Firestore → SQLite (upsert por ID, `updated_at` resolve conflitos).
- **Write-through**: toda escrita vai para Firestore E SQLite.
- **Offline (leitura)**: usa dados locais do SQLite (app funciona sem internet para leitura). Ver `general-plan.md` seção 6.3 e regras RN-16 a RN-20.
- **Offline (escrita)**: BLOQUEADA. Todo dado deve ser criado no Firebase primeiro. `syncService.requireOnline()` deve ser chamado antes de qualquer operação de escrita. Exibir `"⚠️ Sem conexão com a internet. Conecte-se para realizar esta ação."` se offline.
- **Sem fila offline**: Não há queue/retry de escritas. O usuário reconecta e tenta novamente.
- **Pull-to-refresh**: disponível em DepotScreen e CharsScreen para re-sync manual.
- **Expiração de destaques**: `charsRepository.expireHighlights()` no boot.
- Ver estratégia completa em `general-plan.md` seção 6.

### Critério de "done"

- [ ] Boot flow executa 10 passos na ordem
- [ ] App abre com splash até boot completo
- [ ] Sync Firestore → SQLite funciona na abertura
- [ ] Dados de chars criados por outros usuários aparecem após sync
- [ ] App funciona offline para leitura (dados do SQLite)
- [ ] Listener de conectividade atualiza `isOnline` em tempo real (NetInfo)
- [ ] Banner "Modo offline" aparece quando sem conexão e desaparece ao reconectar
- [ ] Operações de escrita exibem erro amigável se offline (`requireOnline()`)
- [ ] Nenhum dado é criado localmente — tudo passa pelo Firebase primeiro
- [ ] Destaques expirados são removidos no boot
- [ ] Pull-to-refresh atualiza dados

---

## Fase 12 — Feature: Destaque + Compra (In-App Purchase)

**Objetivo:** Implementar compra de destaque via IAP das stores.

**Depende de:** Fase 11 (sync precisa estar funcionando).

### Arquivos a criar

| #  | Arquivo                                        | Referência                                |
| -- | ---------------------------------------------- | ----------------------------------------- |
| 01 | `src/services/purchaseService.ts`              | `architecture.md` seção 7.9              |
| 02 | `src/screens/HighlightScreen.tsx`              | `general-plan.md` seção 8.2 (Tela 4.4)  |
| 03 | Atualizar `src/rules/highlightRules.ts`        | Adicionar `canHighlight`, `calculateHighlightExpiry` |
| 04 | Atualizar `src/services/firestoreService.ts`   | Adicionar `createHighlightPayment`       |
| 05 | Atualizar `src/repositories/charsRepository.ts` | Adicionar `updateHighlightStatus`       |

### Regras

- **⚠️ Seguir os padrões da seção "Ajustes de Tema"** — headers com `headerBg` + `textOnHeader`, backgrounds com `theme.colors.panel`.
- **Elegibilidade** (`highlightRules.canHighlight`): char vinculado + tem história (RN-06).
- **Preço**: R$ 5,00 por 7 dias.
- **Produto consumível** (pode comprar múltiplas vezes).
- Botão com glow dourado: `"⭐ Comprar Destaque — R$ 5,00"`.
- Após compra: `is_highlighted = 1`, `highlight_until = now + 7 dias`.
- Registra em `highlight_payments` no Firestore.
- Feedback: `"✅ Compra realizada com sucesso! Seu personagem está em destaque na Home por 7 dias."`.
- Textos exatos: `general-plan.md` seção 8.2 (Tela 4.4).
- Fluxo: `architecture.md` seção 13.7.

### Critério de "done"

- [ ] Tela exibe info do destaque + preço
- [ ] Validação de elegibilidade (vinculado + história)
- [ ] IAP da store é acionado ao clicar no botão
- [ ] Após compra: char aparece na Depot com glow
- [ ] Pagamento registrado no Firestore
- [ ] Botão desabilitado se não elegível (com mensagem)

---

## Fase 13 — Anúncios (AdMob)

**Objetivo:** Adicionar banner AdMob fixo na parte inferior (acima da tab bar).

**Depende de:** Fase 3 (shell de navegação).

> Pode ser feita em paralelo com as Fases 4–12.

### Arquivos a criar

| #  | Arquivo                                     | Referência                            |
| -- | ------------------------------------------- | ------------------------------------- |
| 01 | `src/services/adService.ts`                 | `architecture.md` seção 7.8           |
| 02 | `src/components/composed/AdBanner.tsx`       | Banner encapsulado                    |

### Regras

- Banner **adaptive** (tamanho se ajusta à largura).
- Posição: acima da tab bar, abaixo do conteúdo.
- IDs de teste durante desenvolvimento. IDs de produção no build final.
- `AdBanner` encapsula `react-native-google-mobile-ads` — nenhuma outra parte do app importa a lib diretamente.
- Renderizado no `AppNavigator` ou `TopTabNavigator`, entre conteúdo e tabs.
- Ver `general-plan.md` seção 9.1.

### Critério de "done"

- [ ] Banner de teste visível em todas as telas
- [ ] Posição correta (acima da tab bar)
- [ ] Não atrapalha scroll do conteúdo

---

## Fase 14 — Polimento & Build de Produção

**Objetivo:** Finalizar detalhes visuais, tratamento de erros, e gerar builds.

**Depende de:** Fases 1–13 completas.

### Tarefas

| #  | Tarefa                                               | Referência                                |
| -- | ---------------------------------------------------- | ----------------------------------------- |
| 01 | Splash screen temática (#8B2020)                     | `app.json` splash config                  |
| 02 | Ícone do app (1024x1024)                             | Asset design                              |
| 03 | Animações de transição entre telas                   | React Navigation screenOptions            |
| 04 | Tratamento de erros de rede (try/catch + mensagens)  | Todas as telas com chamadas externas      |
| 05 | Loading states em todas as telas                     | `TibiaLoading` component                  |
| 06 | Firestore Security Rules de produção                 | `architecture.md` seção 17               |
| 07 | Trocar IDs de anúncio para produção                  | `adService.ts`                            |
| 08 | Testes em dispositivo real Android                   | EAS development build                     |
| 09 | Testes em dispositivo real iOS                       | EAS development build                     |
| 10 | Política de Privacidade (URL pública)                | Requisito das stores                      |
| 11 | Build de produção Android                            | `eas build --platform android --profile production` |
| 12 | Build de produção iOS                                | `eas build --platform ios --profile production`     |
| 13 | Submit para Google Play                              | `eas submit --platform android`           |
| 14 | Submit para Apple Store                              | `eas submit --platform ios`               |

### Critério de "done"

- [ ] Splash screen aparece no boot
- [ ] Ícone personalizado nas stores
- [ ] Todos os fluxos funcionam end-to-end em device real
- [ ] Nenhum erro de TypeScript
- [ ] Build de produção gerado com sucesso
- [ ] App publicado nas stores

---

## Referência Rápida: Onde Encontrar Cada Info

| Preciso saber...                      | Arquivo                        | Seção      |
| ------------------------------------- | ------------------------------ | ---------- |
| Cores, fontes, espaçamentos          | `architecture.md`              | 9.1        |
| Textos exatos das telas              | `general-plan.md`              | 8.2        |
| Terminologia imersiva (glossário)    | `general-plan.md`              | 18         |
| Template de componente base          | `architecture.md`              | 10.1       |
| Template de componente composed      | `architecture.md`              | 10.2       |
| Template de screen                   | `architecture.md`              | 10.3       |
| Interface das stores                 | `architecture.md`              | 5.2        |
| Assinaturas das rules                | `architecture.md`              | 6          |
| Assinaturas dos services             | `architecture.md`              | 7          |
| Assinaturas dos repositories         | `architecture.md`              | 8          |
| Estrutura de pastas completa         | `architecture.md`              | 3          |
| DDL das tabelas SQLite               | `general-plan.md`              | 5.1        |
| Collections do Firestore             | `general-plan.md`              | 5.2        |
| Regras de negócio                    | `general-plan.md`              | 11         |
| Fluxos do usuário                    | `general-plan.md`              | 12         |
| Boot flow (10 passos)                | `architecture.md`              | 12         |
| Fluxos de dados por feature          | `architecture.md`              | 13         |
| Navegação (stack + tabs)             | `architecture.md`              | 4          |
| Configs (babel, tsconfig, app.json)  | `architecture.md`              | 14         |
| Dependências (npm install)           | `architecture.md`              | 2.1        |
| Firestore Security Rules             | `architecture.md`              | 17         |
| Dados mock (itens e chars)           | `prototype/data.js`            | —          |
| Visual de referência                 | `prototype/` (rodar na 8080)   | —          |

---

> **Como usar este plano:** Ao iniciar cada fase, o agent deve ler APENAS as seções referenciadas nos campos "Referência" da tabela de arquivos, em vez de carregar os documentos inteiros. Isso economiza contexto e mantém o foco.
