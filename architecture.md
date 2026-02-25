# 🏗️ Tibia Stories App — Arquitetura Técnica

> **Versão:** 1.0  
> **Data:** 25/02/2026  
> **Base:** Arquitetura replicada do [compensa-app](https://github.com/joaobrasildev/compensa-app), adaptada para as necessidades do Tibia Stories.

---

## 1. Princípios Fundamentais

Toda a arquitetura segue os mesmos princípios do compensa-app:

| #  | Princípio                        | Descrição                                                                              |
| -- | -------------------------------- | -------------------------------------------------------------------------------------- |
| P1 | **Camadas separadas**            | Screens → Stores → Repositories/Services. Rules isoladas como funções puras.           |
| P2 | **Zero inline styles**           | Todo estilo vem de `theme/index.ts`. Nunca `style={{ color: 'red' }}`.                 |
| P3 | **Componentes puros**            | base/ recebe apenas props primitivas. Nenhum componente acessa store diretamente.       |
| P4 | **Stores granulares**            | Screens lêem stores com seletores granulares. Components nunca lêem stores.             |
| P5 | **Rules = funções puras**        | Zero imports de React, Zustand ou SQLite. Testáveis unitariamente.                     |
| P6 | **React.memo em tudo**           | Todos os componentes base/ e composed/ exportam com `React.memo`.                      |
| P7 | **Path alias @/**                | Imports absolutos via `@/` → `src/`. Nunca `../../../`.                                |
| P8 | **Naming estrito**               | `PascalCase.tsx` (componentes), `camelCase.ts` (lógica), `useXxxStore.ts` (stores).    |
| P9 | **Boot flow orquestrado**        | Inicialização sequencial no `initService.ts` antes de liberar UI.                      |

---

## 2. Stack Tecnológica

| Camada               | Tecnologia                                              | Nota                                                     |
| -------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Framework Mobile     | **React Native ~0.76** + **Expo SDK 52+**               | Managed → Dev Client quando necessário                   |
| Linguagem            | **TypeScript** (strict mode)                            | `tsconfig.json` com `strict: true`                       |
| Navegação            | **React Navigation 7** (Material Top Tabs)              | ⚠️ NÃO usa Expo Router. Mesmo padrão do compensa-app.   |
| State Management     | **Zustand 5.x**                                        | Stores com seletores granulares, sem Context API          |
| Banco Local          | **expo-sqlite** (sync API, WAL mode)                   | Mesmo padrão do compensa-app                              |
| Banco Remoto         | **Firebase Firestore** (plano Spark gratuito)           | 🆕 Não existe no compensa-app                            |
| Autenticação         | **Firebase Auth** (e-mail/senha + Google + Apple)       | 🆕 Não existe no compensa-app                            |
| API Externa          | **TibiaData API v4** (pública, sem chave)               | 🆕 Endpoint `/v4/character/{name}`                       |
| Anúncios             | **react-native-google-mobile-ads**                      | Mesmo do compensa-app                                     |
| Pagamento In-App     | **expo-in-app-purchases**                               | 🆕 Produto consumível (destaque R$5/7dias)               |
| Fontes               | **expo-font** (MedievalSharp + Martel)                  | Carregadas no boot flow                                   |
| Build/Deploy         | **EAS Build + EAS Submit**                              | Google Play + Apple Store                                 |

### 2.1 Dependências Principais

```
# Core
expo ~52
react-native ~0.76
typescript ~5.x

# Navegação (React Navigation 7 — NÃO Expo Router)
@react-navigation/native
@react-navigation/material-top-tabs
@react-navigation/native-stack
react-native-pager-view
react-native-screens
react-native-safe-area-context

# State Management
zustand ~5.x

# Banco Local
expo-sqlite ~15

# Firebase
@react-native-firebase/app
@react-native-firebase/firestore
@react-native-firebase/auth

# Login Social
@react-native-google-signin/google-signin
expo-apple-authentication

# Monetização
react-native-google-mobile-ads
expo-in-app-purchases

# UI & Fonts
expo-font
expo-splash-screen
expo-linear-gradient
react-native-reanimated
react-native-gesture-handler
expo-clipboard

# Path Alias
babel-plugin-module-resolver
```

---

## 3. Estrutura de Pastas

```
tibia-stories-app/
│
├── prototype/                          # ❌ NÃO TOCAR — Protótipo HTML5 (Fase 0)
│   ├── index.html
│   ├── styles.css
│   ├── data.js
│   ├── app.js
│   └── icons/
│
├── src/
│   ├── theme/
│   │   └── index.ts                   # Design tokens (cores, fontes, spacing, radius, shadows)
│   │
│   ├── components/
│   │   ├── base/                      # Componentes atômicos (props primitivas, React.memo)
│   │   │   ├── TibiaText.tsx          # Texto com variantes (title, body, caption, muted)
│   │   │   ├── TibiaButton.tsx        # Botão com variantes (primary, secondary, outline, glow)
│   │   │   ├── TibiaPanel.tsx         # Container com borda medieval dupla
│   │   │   ├── TibiaInput.tsx         # Input field estilizado
│   │   │   ├── TibiaBadge.tsx         # Badge (raridade, vocação, status)
│   │   │   ├── TibiaDivider.tsx       # Divisor ornamental (✦ ✦ ✦)
│   │   │   ├── TibiaHeader.tsx        # Header de seção interno (faixa dourada)
│   │   │   ├── TibiaIcon.tsx          # Wrapper para ícones (PNG/SVG)
│   │   │   ├── TibiaImage.tsx         # Imagem com borda estilizada
│   │   │   ├── TibiaLoading.tsx       # Spinner/loading temático
│   │   │   └── TibiaEmpty.tsx         # Estado vazio com mensagem imersiva
│   │   │
│   │   └── composed/                  # Componentes compostos (usam base/, React.memo)
│   │       ├── CharCard.tsx           # Card de char (listas)
│   │       ├── ItemCard.tsx           # Card de item (listas)
│   │       ├── CharStoryView.tsx      # Visualização completa da história do char
│   │       ├── ItemDetailView.tsx     # Visualização completa do detalhe do item
│   │       ├── TokenDisplay.tsx       # Token UUID com botão copiar
│   │       ├── CharSearchBar.tsx      # Barra de busca "exiva" com filtros
│   │       ├── ItemSearchBar.tsx      # Barra de busca de itens com filtros
│   │       ├── VocationFilter.tsx     # Filtro por vocação (EK, RP, ED, MS, MO)
│   │       ├── RarityFilter.tsx       # Filtro por raridade (Legendary, Very Rare, Rare)
│   │       ├── SortSelector.tsx       # Dropdown de ordenação
│   │       ├── MyCharItem.tsx         # Item de char na lista "Meus Chars" (com ações)
│   │       ├── HighlightedCharCard.tsx # Card de char em destaque (glow dourado)
│   │       ├── QuestSteps.tsx         # Painel com instruções da Quest de Vínculo
│   │       ├── SocialLoginButtons.tsx # Botões Google + Apple
│   │       ├── AdBanner.tsx           # Banner AdMob encapsulado
│   │       └── AppHeader.tsx          # Header fixo "⚔ TIBIA STORIES ⚔"
│   │
│   ├── screens/
│   │   ├── DepotScreen.tsx            # Tab 1 — Chars em Destaque + Histórias Recentes
│   │   ├── ItemsScreen.tsx            # Tab 2 — Itens Lendários & Raros
│   │   ├── CharsScreen.tsx            # Tab 3 — Todas as Histórias
│   │   ├── AccountScreen.tsx          # Tab 4 — Conta (logado vs não logado)
│   │   ├── ItemDetailScreen.tsx       # Stack — Detalhe do Item (Origem + Mitos)
│   │   ├── CharStoryScreen.tsx        # Stack — História completa do Char
│   │   ├── LoginScreen.tsx            # Stack — Login (e-mail + social)
│   │   ├── RegisterScreen.tsx         # Stack — Criar Conta
│   │   ├── AddCharScreen.tsx          # Stack — Exiva — Localizar Char
│   │   ├── VerifyCharScreen.tsx       # Stack — Quest de Vínculo
│   │   ├── EditStoryScreen.tsx        # Stack — Editar História do Char
│   │   └── HighlightScreen.tsx        # Stack — Comprar Destaque
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx           # Root: condicional (loading → tabs/stack)
│   │   ├── TopTabNavigator.tsx        # Material Top Tabs (Depot, Itens, Chars, Conta)
│   │   └── linking.ts                 # Deep linking config (opcional)
│   │
│   ├── stores/
│   │   ├── useItemsStore.ts           # Itens: lista, filtros, ordenação, item selecionado
│   │   ├── useCharsStore.ts           # Chars: lista, filtros, destaques, histórias recentes
│   │   ├── useAuthStore.ts            # 🆕 Auth: user, token, isLoggedIn, login/logout
│   │   ├── useMyCharsStore.ts         # 🆕 Meus chars: lista própria, status de vínculo
│   │   └── useAppStore.ts             # App: isReady, isOnline, isSyncing, lastSync
│   │
│   ├── rules/
│   │   ├── verificationRules.ts       # Quest de Vínculo: validar token no comment
│   │   ├── highlightRules.ts          # Destaque: verificar elegibilidade, calcular expiração
│   │   ├── charRules.ts               # Char: validar nome, filtrar lista, ordenar
│   │   ├── itemRules.ts               # Item: filtrar por raridade, ordenar lista
│   │   ├── authRules.ts               # 🆕 Auth: validar e-mail, senha, regras de registro
│   │   └── formatRules.ts             # Formatação: datas, níveis, vocação, badges
│   │
│   ├── services/
│   │   ├── initService.ts             # Boot flow orquestrado (5+ passos)
│   │   ├── firebaseService.ts         # 🆕 Config + init Firebase (app, firestore, auth)
│   │   ├── firestoreService.ts        # 🆕 CRUD Firestore (characters, highlight_payments)
│   │   ├── authService.ts             # 🆕 Firebase Auth (login, register, social, logout)
│   │   ├── tibiaDataService.ts        # 🆕 TibiaData API v4 (buscar char, validar token)
│   │   ├── syncService.ts             # 🆕 Sincronização Firebase ↔ SQLite
│   │   ├── adService.ts               # AdMob config e helpers
│   │   └── purchaseService.ts         # 🆕 In-App Purchase (destaque)
│   │
│   ├── repositories/
│   │   ├── database.ts                # Abertura, WAL mode, migrations
│   │   ├── itemsRepository.ts         # CRUD SQLite tabela items
│   │   ├── charsRepository.ts         # CRUD SQLite tabela characters
│   │   ├── userConfigRepository.ts    # SQLite tabela user_config (token, prefs)
│   │   └── migrations.ts              # DDL: CREATE TABLE, ALTER TABLE, seeds
│   │
│   ├── hooks/
│   │   ├── useInitApp.ts              # Orquestra boot flow e seta isReady
│   │   ├── useCharVerify.ts           # Fluxo completo da Quest de Vínculo
│   │   └── useSync.ts                 # 🆕 Hook de sincronização Firebase ↔ SQLite
│   │
│   ├── types/
│   │   ├── index.ts                   # Re-exports de todos os types
│   │   ├── item.ts                    # Item, ItemRarity, ItemFilter, ItemSort
│   │   ├── character.ts               # Character, Vocation, CharFilter, CharSort
│   │   ├── auth.ts                    # 🆕 User, AuthState, LoginCredentials
│   │   ├── market.ts                  # 🆕 HighlightPayment, PurchaseStatus
│   │   └── tibiaData.ts               # TibiaDataResponse, TibiaCharacter
│   │
│   ├── constants/
│   │   ├── app.ts                     # Nome do app, versão, textos imersivos fixos
│   │   ├── vocations.ts               # Lista de vocações (EK, RP, ED, MS, MO)
│   │   ├── rarities.ts               # Raridades e suas cores
│   │   └── firebase.ts               # 🆕 Collection names, config keys
│   │
│   └── utils/
│       ├── tokenGenerator.ts          # Gera UUID v4 com prefixo TS-
│       ├── dateUtils.ts               # Formatação de datas, cálculo de expiração
│       └── textUtils.ts               # Helpers de texto (truncate, capitalize)
│
├── assets/
│   ├── fonts/
│   │   ├── MedievalSharp-Regular.ttf
│   │   ├── Martel-Regular.ttf
│   │   ├── Martel-Bold.ttf
│   │   └── Martel-SemiBold.ttf
│   ├── images/
│   │   ├── logo.png
│   │   ├── splash.png
│   │   └── icon.png
│   ├── icons/                         # Ícones das tabs (Flaticon PNGs)
│   │   ├── castle.png                 # Depot
│   │   ├── armor.png                  # Itens
│   │   └── history-book.png           # Chars
│   └── items/                         # Sprites dos itens do Tibia
│       ├── golden-armor.png
│       └── ...
│
├── App.tsx                            # Entry point: providers + AppNavigator
├── app.json                           # Expo config
├── eas.json                           # EAS Build config
├── babel.config.js                    # module-resolver (@/ → src/)
├── tsconfig.json                      # strict, paths @/* → src/*
├── google-services.json               # Firebase Android
├── GoogleService-Info.plist           # Firebase iOS
├── package.json
│
├── general-plan.md                    # Plano geral v1.1
├── change-text-plan.md                # Glossário de terminologia Tibia
└── architecture.md                    # Este documento
```

---

## 4. Navegação (React Navigation 7)

### 4.1 Estrutura

```
AppNavigator (NativeStackNavigator)
│
├── [isReady = false] → SplashScreen (loading do boot flow)
│
├── TopTabNavigator (MaterialTopTabNavigator — swipeable)
│   ├── Depot      → DepotScreen        (icons/castle.png)
│   ├── Itens      → ItemsScreen        (icons/armor.png)
│   ├── Chars      → CharsScreen        (icons/history-book.png)
│   └── Conta      → AccountScreen      (⚙️ emoji)
│
├── ItemDetail     → ItemDetailScreen    (stack push)
├── CharStory      → CharStoryScreen     (stack push)
├── Login          → LoginScreen         (stack push)
├── Register       → RegisterScreen      (stack push)
├── AddChar        → AddCharScreen       (stack push)
├── VerifyChar     → VerifyCharScreen     (stack push)
├── EditStory      → EditStoryScreen     (stack push)
└── Highlight      → HighlightScreen     (stack push)
```

### 4.2 Por que React Navigation e NÃO Expo Router

| Critério                 | Expo Router               | React Navigation 7 (escolhido)       |
| ------------------------ | ------------------------- | ------------------------------------- |
| Controle de navegação    | Limitado pelo file-system | Total controle programático           |
| Material Top Tabs swipe  | Suporte parcial           | Suporte nativo completo               |
| Padrão compensa-app      | ❌                         | ✅ Mesmo padrão                       |
| Customização de header   | Via config                | Via `screenOptions` com total controle |
| Tab bar no rodapé + swipe| Workaround                | Nativo                                |

### 4.3 TopTabNavigator — Posicionamento

As tabs usam `tabBarPosition: 'bottom'` com o AdBanner renderizado logo acima:

```
┌──────────────────────────────┐
│  ⚔ ═══ TIBIA STORIES ═══ ⚔ │  ← AppHeader (fixo, #8B2020)
├──────────────────────────────┤
│                              │
│      Conteúdo da Tab         │  ← Screen content (scroll)
│      (Depot/Itens/Chars/     │
│       Conta)                 │
│                              │
├──────────────────────────────┤
│   [═══ BANNER ADMOB ═════]  │  ← AdBanner
├──────────────────────────────┤
│ 🏰Depot  ⚔Itens  📖Chars ⚙ │  ← TopTabs (bottom, #8B2020)
└──────────────────────────────┘
```

### 4.4 Configuração das Tabs

```typescript
// navigation/TopTabNavigator.tsx

const Tab = createMaterialTopTabNavigator();

<Tab.Navigator
  tabBarPosition="bottom"
  screenOptions={{
    swipeEnabled: true,
    tabBarStyle: {
      backgroundColor: theme.colors.headerBg,  // #8B2020
    },
    tabBarActiveTintColor: theme.colors.tabActive,
    tabBarInactiveTintColor: theme.colors.tabInactive,
    tabBarIndicatorStyle: {
      backgroundColor: theme.colors.gold,
      height: 3,
      top: 0,  // indicador no topo da tab bar
    },
    tabBarShowIcon: true,
    tabBarShowLabel: true,
  }}
>
  <Tab.Screen name="Depot" component={DepotScreen}
    options={{ tabBarIcon: ({ color }) => <TibiaIcon source={castleIcon} tintColor={color} /> }}
  />
  <Tab.Screen name="Itens" component={ItemsScreen}
    options={{ tabBarIcon: ({ color }) => <TibiaIcon source={armorIcon} tintColor={color} /> }}
  />
  <Tab.Screen name="Chars" component={CharsScreen}
    options={{ tabBarIcon: ({ color }) => <TibiaIcon source={historyBookIcon} tintColor={color} /> }}
  />
  <Tab.Screen name="Conta" component={AccountScreen}
    options={{ tabBarIcon: ({ color }) => <TibiaText style={{ fontSize: 18 }}>⚙️</TibiaText> }}
  />
</Tab.Navigator>
```

---

## 5. Zustand Stores

### 5.1 Padrão de Store (mesmo do compensa-app)

```typescript
// Padrão de toda store:
// 1. Interface com state + actions
// 2. create() com immer middleware (se necessário)
// 3. Granular selectors exportados
// 4. Screens lêem com seletores — components NUNCA acessam stores

interface ItemsState {
  items: Item[];
  filter: ItemFilter;
  sort: ItemSort;
  // actions
  setItems: (items: Item[]) => void;
  setFilter: (filter: ItemFilter) => void;
  setSort: (sort: ItemSort) => void;
  loadItems: () => Promise<void>;
}
```

### 5.2 Stores do Tibia Stories

#### `useAppStore.ts` — Estado global do app

```typescript
interface AppState {
  isReady: boolean;          // Boot flow completo?
  isOnline: boolean;         // Tem conectividade?
  isSyncing: boolean;        // Sync Firebase ↔ SQLite em progresso?
  lastSyncAt: string | null; // Timestamp do último sync
  // actions
  setReady: (ready: boolean) => void;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSync: (timestamp: string) => void;
}
```

#### `useAuthStore.ts` — Autenticação 🆕

```typescript
interface AuthState {
  user: User | null;          // Firebase Auth user
  userToken: string | null;   // Token UUID (TS-xxxxx) do user_config
  isLoggedIn: boolean;
  isLoading: boolean;
  // actions
  setUser: (user: User | null) => void;
  setUserToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

#### `useItemsStore.ts` — Itens lendários

```typescript
interface ItemsState {
  items: Item[];
  filteredItems: Item[];
  searchQuery: string;
  rarityFilter: ItemRarity | 'all';
  sort: ItemSort;
  selectedItem: Item | null;
  // actions
  loadItems: () => Promise<void>;        // Lê do SQLite (seed)
  setSearchQuery: (q: string) => void;
  setRarityFilter: (r: ItemRarity | 'all') => void;
  setSort: (s: ItemSort) => void;
  selectItem: (item: Item | null) => void;
  applyFilters: () => void;              // Usa itemRules.ts
}
```

#### `useCharsStore.ts` — Chars públicos (leitura)

```typescript
interface CharsState {
  chars: Character[];
  filteredChars: Character[];
  highlightedChars: Character[];   // is_highlighted = 1 && não expirado
  recentChars: Character[];        // 3 mais recentes
  searchQuery: string;
  vocationFilter: Vocation | 'all';
  worldFilter: string | 'all';
  sort: CharSort;
  selectedChar: Character | null;
  // actions
  loadChars: () => Promise<void>;         // Lê do SQLite
  setSearchQuery: (q: string) => void;
  setVocationFilter: (v: Vocation | 'all') => void;
  setWorldFilter: (w: string | 'all') => void;
  setSort: (s: CharSort) => void;
  selectChar: (char: Character | null) => void;
  applyFilters: () => void;               // Usa charRules.ts
}
```

#### `useMyCharsStore.ts` — Meus chars (escrita) 🆕

```typescript
interface MyCharsState {
  myChars: Character[];
  isLoading: boolean;
  // actions
  loadMyChars: (userToken: string) => Promise<void>;
  addChar: (name: string) => Promise<Character>;       // Exiva → TibiaData API
  verifyChar: (charId: string) => Promise<boolean>;     // Quest de Vínculo
  saveStory: (charId: string, title: string, content: string) => Promise<void>;
  purchaseHighlight: (charId: string) => Promise<void>;
}
```

### 5.3 Regra de Acesso (igual compensa-app)

```
✅ Screen → useXxxStore(selector)     // OK: screens lêem stores
✅ Screen → store.action()            // OK: screens disparam actions
✅ Store action → service/repository  // OK: actions chamam camada de dados
✅ Store action → rules (pura)        // OK: actions usam regras de negócio
❌ Component → useXxxStore()          // PROIBIDO: components recebem props
❌ Rules → useXxxStore()              // PROIBIDO: rules são funções puras
❌ Repository → useXxxStore()         // PROIBIDO: repos são camada de dados
```

---

## 6. Rules (Funções Puras)

Mesmo padrão do compensa-app: **zero imports de React, Zustand, SQLite ou Firebase.** Recebem dados como parâmetro e retornam resultado.

### 6.1 Arquivos de Rules

#### `verificationRules.ts`

```typescript
// Verifica se o comment do char contém o token
export function isTokenInComment(comment: string, token: string): boolean;

// Gera mensagem de status da quest
export function getVerificationStatus(isVerified: boolean): string;

// Verifica se pode iniciar quest (char existe, não vinculado a outro user)
export function canStartVerification(char: TibiaCharacter, existingChars: Character[]): { allowed: boolean; reason?: string };
```

#### `highlightRules.ts`

```typescript
// Verifica se char é elegível para destaque
export function canHighlight(char: Character): { eligible: boolean; reason?: string };

// Calcula data de expiração (now + 7 dias)
export function calculateHighlightExpiry(purchaseDate: Date): Date;

// Verifica se destaque ainda é válido
export function isHighlightActive(highlightUntil: string | null): boolean;

// Filtra chars com destaque ativo
export function filterActiveHighlights(chars: Character[]): Character[];
```

#### `charRules.ts`

```typescript
// Filtra lista de chars por busca, vocação, mundo
export function filterChars(chars: Character[], filter: CharFilter): Character[];

// Ordena lista de chars
export function sortChars(chars: Character[], sort: CharSort): Character[];

// Valida nome de char (não vazio, tamanho ok)
export function validateCharName(name: string): { valid: boolean; error?: string };

// Mapeia vocação para abreviação (Elite Knight → EK)
export function vocationToAbbr(vocation: string): string;
```

#### `itemRules.ts`

```typescript
// Filtra lista de itens por busca e raridade
export function filterItems(items: Item[], filter: ItemFilter): Item[];

// Ordena lista de itens
export function sortItems(items: Item[], sort: ItemSort): Item[];
```

#### `authRules.ts` 🆕

```typescript
// Valida formato de e-mail
export function validateEmail(email: string): { valid: boolean; error?: string };

// Valida senha (mín. 6 chars)
export function validatePassword(password: string): { valid: boolean; error?: string };

// Valida confirmação de senha
export function validatePasswordMatch(password: string, confirm: string): { valid: boolean; error?: string };

// Valida formulário completo de registro
export function validateRegisterForm(data: RegisterFormData): { valid: boolean; errors: Record<string, string> };
```

#### `formatRules.ts`

```typescript
// Formata nível para exibição (850 → "Level 850")
export function formatLevel(level: number): string;

// Formata data para exibição relativa ("há 3 dias")
export function formatRelativeDate(date: string): string;

// Formata vocação com badge (EK, RP, ED, MS, MO)
export function formatVocation(vocation: string): { abbr: string; color: string };

// Formata raridade com cor
export function formatRarity(rarity: ItemRarity): { label: string; color: string };
```

---

## 7. Services

### 7.1 Padrão de Service

Cada service encapsula uma integração externa ou orquestração de lógica complexa. Services podem chamar repositories, APIs externas e rules. Services **nunca** importam React ou Zustand.

### 7.2 `initService.ts` — Boot Flow

Adaptado do compensa-app, com Firebase e sync adicionados:

```typescript
// Boot flow sequencial (chamado pelo useInitApp hook)
export async function initializeApp(): Promise<void> {
  // Passo 1: Abrir banco SQLite (WAL mode)
  await openDatabase();

  // Passo 2: Executar migrations + seed de itens
  await runMigrations();

  // Passo 3: Carregar config local (user_token)
  await loadUserConfig();

  // Passo 4: Inicializar Firebase
  await initializeFirebase();

  // Passo 5: Verificar auth state (Firebase Auth onAuthStateChanged)
  await checkAuthState();

  // Passo 6: Sync Firebase → SQLite (se online)
  await syncIfOnline();

  // Passo 7: Carregar itens do SQLite → store
  await loadItemsToStore();

  // Passo 8: Carregar chars do SQLite → store
  await loadCharsToStore();

  // Passo 9: Verificar destaques expirados (local)
  await expireHighlights();

  // Passo 10: Sinalizar app ready
  useAppStore.getState().setReady(true);
}
```

### 7.3 `firebaseService.ts` 🆕

```typescript
// Inicializa Firebase App (usando google-services.json / GoogleService-Info.plist)
export function initializeFirebase(): void;

// Retorna instância do Firestore
export function getFirestoreInstance(): FirebaseFirestoreTypes.Module;

// Retorna instância do Auth
export function getAuthInstance(): FirebaseAuthTypes.Module;
```

### 7.4 `authService.ts` 🆕

```typescript
// Login com e-mail/senha
export async function loginWithEmail(email: string, password: string): Promise<User>;

// Criar conta com e-mail/senha
export async function registerWithEmail(email: string, password: string, displayName?: string): Promise<User>;

// Login com Google
export async function loginWithGoogle(): Promise<User>;

// Login com Apple
export async function loginWithApple(): Promise<User>;

// Logout
export async function logout(): Promise<void>;

// Reset de senha
export async function resetPassword(email: string): Promise<void>;

// Listener de estado de auth (onAuthStateChanged)
export function subscribeToAuthState(callback: (user: User | null) => void): () => void;

// Gera e persiste user_token no Firestore (vinculado ao uid)
export async function ensureUserToken(uid: string): Promise<string>;
```

### 7.5 `firestoreService.ts` 🆕

```typescript
// Characters
export async function fetchAllCharacters(): Promise<Character[]>;
export async function fetchCharactersByUser(userToken: string): Promise<Character[]>;
export async function createCharacter(char: Omit<Character, 'id'>): Promise<string>;
export async function updateCharacter(id: string, data: Partial<Character>): Promise<void>;
export async function checkCharacterExists(name: string): Promise<Character | null>;

// Highlight Payments
export async function createHighlightPayment(payment: Omit<HighlightPayment, 'id'>): Promise<string>;
export async function fetchActiveHighlights(): Promise<Character[]>;

// User Tokens (collection users)
export async function getUserToken(uid: string): Promise<string | null>;
export async function saveUserToken(uid: string, token: string): Promise<void>;
```

### 7.6 `tibiaDataService.ts` 🆕

```typescript
const BASE_URL = 'https://api.tibiadata.com/v4';

// Busca dados de um personagem pelo nome
export async function fetchCharacter(name: string): Promise<TibiaCharacter | null>;

// Verifica se o comment do char contém o token
export async function verifyCharacterToken(name: string, token: string): Promise<boolean>;
```

### 7.7 `syncService.ts` 🆕

```typescript
// Sync completo: Firestore → SQLite
export async function syncFromFirestore(): Promise<void>;

// Sync incremental: só registros alterados desde lastSync
export async function syncIncremental(lastSyncAt: string): Promise<void>;

// Escreve no Firestore e atualiza SQLite local
export async function writeAndSync(collection: string, data: any): Promise<string>;

// Verifica conectividade
export async function checkConnectivity(): Promise<boolean>;
```

### 7.8 `adService.ts`

```typescript
// Inicializa SDK de anúncios
export function initializeAds(): Promise<void>;

// Retorna o ad unit ID correto (teste vs produção)
export function getBannerAdUnitId(): string;
```

### 7.9 `purchaseService.ts` 🆕

```typescript
// Inicializa IAP
export async function initializePurchases(): Promise<void>;

// Busca produto de destaque
export async function getHighlightProduct(): Promise<Product>;

// Executa compra
export async function purchaseHighlight(): Promise<PurchaseResult>;

// Valida receipt
export async function validateReceipt(receipt: string): Promise<boolean>;
```

---

## 8. Repositories (SQLite)

### 8.1 Padrão (mesmo do compensa-app)

```typescript
// Toda operação usa a sync API do expo-sqlite (não async).
// WAL mode habilitado na abertura.
// Repositories NUNCA importam React, Zustand ou Firebase.

import { database } from './database';

export function getAllItems(): Item[] {
  return database.getAllSync<Item>('SELECT * FROM items ORDER BY name');
}
```

### 8.2 `database.ts`

```typescript
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export function openDatabase(): void {
  db = SQLite.openDatabaseSync('tibiastories.db');
  db.execSync('PRAGMA journal_mode = WAL');
  db.execSync('PRAGMA foreign_keys = ON');
}

export { db as database };
```

### 8.3 `migrations.ts`

```typescript
export function runMigrations(): void {
  // Tabela items (somente leitura, seed pelo dev)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT,
      rarity TEXT NOT NULL,
      history TEXT,
      myths TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela characters (sincronizada do Firestore)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      user_token TEXT,
      name TEXT NOT NULL,
      world TEXT,
      vocation TEXT,
      level INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_highlighted INTEGER DEFAULT 0,
      highlight_until TEXT,
      story_title TEXT,
      story_content TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela user_config (chave-valor, igual compensa-app config)
  database.execSync(`
    CREATE TABLE IF NOT EXISTS user_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed de itens (somente se tabela estiver vazia)
  seedItemsIfEmpty();
}
```

### 8.4 `itemsRepository.ts`

```typescript
export function getAllItems(): Item[];
export function getItemById(id: number): Item | null;
export function getItemsByRarity(rarity: string): Item[];
export function getItemCount(): number;
export function seedItems(items: Item[]): void;
```

### 8.5 `charsRepository.ts`

```typescript
export function getAllVerifiedCharsWithStory(): Character[];
export function getHighlightedChars(): Character[];
export function getRecentChars(limit: number): Character[];
export function getCharById(id: string): Character | null;
export function getCharsByUserToken(userToken: string): Character[];
export function upsertCharacter(char: Character): void;
export function updateHighlightStatus(id: string, highlighted: boolean, until: string | null): void;
export function expireHighlights(): number;  // Retorna qtd expirados
```

### 8.6 `userConfigRepository.ts`

```typescript
export function getValue(key: string): string | null;
export function setValue(key: string, value: string): void;
export function getUserToken(): string | null;
export function setUserToken(token: string): void;
export function getLastSyncTimestamp(): string | null;
export function setLastSyncTimestamp(timestamp: string): void;
```

---

## 9. Theme (Design Tokens)

### 9.1 Arquivo único: `theme/index.ts`

Mesmo padrão do compensa-app: **um único arquivo** com TODOS os tokens. Nenhum componente usa cores, fontes ou espaçamentos hardcoded.

```typescript
export const theme = {
  colors: {
    // Backgrounds
    background: '#FFFFFF',
    panel: '#FFF2DB',
    panelAlt: '#DEBB9D',
    headerBg: '#8B2020',
    headerGradientStart: '#A02828',
    headerGradientEnd: '#6E1818',
    subtitleBg: '#D4A66A',

    // Text
    textPrimary: '#5A2800',
    textSecondary: '#7A4A20',
    textMuted: '#9A7A50',
    textDark: '#3A1800',
    textOnHeader: '#FFF2DB',

    // Borders
    borderOuter: '#5A2800',
    borderInner: '#A0703C',
    borderGold: '#8B5E2A',

    // Accents
    accentRed: '#C0392B',
    accentGreen: '#1B7A2E',
    accentBlue: '#2B5C9A',
    gold: '#D4A66A',
    goldHover: '#C49658',

    // Cards
    cardBg: '#FFF2DB',
    cardHover: '#DEBB9D',

    // Highlight
    highlightGlow: 'rgba(255, 200, 50, 0.3)',

    // Tab
    tabActive: '#FFF2DB',
    tabInactive: 'rgba(255, 242, 219, 0.5)',

    // Buttons
    btnPrimary: '#D4A66A',
    btnPrimaryPressed: '#C49658',
    btnDanger: '#C0392B',
    btnSuccess: '#1B7A2E',

    // Badges
    badgeLegendary: '#FF8C00',
    badgeVeryRare: '#9B59B6',
    badgeRare: '#3498DB',
    badgeEK: '#C0392B',
    badgeRP: '#27AE60',
    badgeED: '#8E44AD',
    badgeMS: '#2980B9',
    badgeMO: '#D4A66A',
  },

  fonts: {
    title: 'MedievalSharp',        // Títulos, nomes de itens/chars, painéis
    body: 'Martel',                // Corpo de texto, UI, botões
    bodyBold: 'Martel-Bold',
    bodySemiBold: 'Martel-SemiBold',
  },

  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    title: 26,
    header: 20,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },

  shadows: {
    card: {
      shadowColor: '#5A2800',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    panel: {
      shadowColor: '#5A2800',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 5,
    },
    header: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  borders: {
    panel: {
      borderWidth: 2,
      borderColor: '#5A2800',
    },
    panelInner: {
      borderWidth: 1,
      borderColor: '#A0703C',
    },
    card: {
      borderWidth: 1,
      borderColor: '#A0703C',
    },
    input: {
      borderWidth: 1,
      borderColor: '#A0703C',
    },
  },
} as const;

export type Theme = typeof theme;
```

### 9.2 Uso nos Componentes

```typescript
// ✅ CORRETO — usar theme tokens
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.panel,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    ...theme.borders.panel,
    ...theme.shadows.card,
  },
  title: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.xl,
    color: theme.colors.textPrimary,
  },
});

// ❌ PROIBIDO — inline styles ou valores hardcoded
<View style={{ backgroundColor: '#FFF2DB', padding: 16 }}>
```

---

## 10. Componentes — Padrão de Escrita

### 10.1 Template de Componente Base

```typescript
// src/components/base/TibiaButton.tsx

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

// 1. Props interface (apenas primitivas)
interface TibiaButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glow';
  disabled?: boolean;
  onPress: () => void;
}

// 2. Componente funcional
function TibiaButton({ label, variant = 'primary', disabled = false, onPress }: TibiaButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <TibiaText style={styles.label}>{label}</TibiaText>
    </TouchableOpacity>
  );
}

// 3. StyleSheet com theme tokens (zero hardcoded)
const styles = StyleSheet.create({
  base: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: theme.colors.btnPrimary,
  },
  secondary: {
    backgroundColor: theme.colors.panelAlt,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.borderGold,
  },
  glow: {
    backgroundColor: theme.colors.gold,
    shadowColor: theme.colors.highlightGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: theme.fonts.bodySemiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textPrimary,
  },
});

// 4. Export com React.memo
export default React.memo(TibiaButton);
```

### 10.2 Template de Componente Composed

```typescript
// src/components/composed/CharCard.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';

// Props podem incluir callbacks, mas NÃO objetos complexos de store
interface CharCardProps {
  name: string;
  level: number;
  vocation: string;
  world: string;
  storyTitle: string | null;
  isHighlighted: boolean;
  onPress: () => void;
}

function CharCard({ name, level, vocation, world, storyTitle, isHighlighted, onPress }: CharCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isHighlighted && styles.highlighted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <TibiaText style={styles.name}>{name}</TibiaText>
        <TibiaBadge label={vocation} variant="vocation" />
      </View>
      <TibiaText style={styles.info}>Level {level} • {world}</TibiaText>
      {storyTitle && <TibiaText style={styles.story}>📜 {storyTitle}</TibiaText>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    ...theme.borders.card,
    ...theme.shadows.card,
    marginBottom: theme.spacing.md,
  },
  highlighted: {
    borderColor: theme.colors.gold,
    borderWidth: 2,
    shadowColor: theme.colors.highlightGlow,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textPrimary,
  },
  info: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  story: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});

export default React.memo(CharCard);
```

### 10.3 Template de Screen

```typescript
// src/screens/ItemsScreen.tsx

import React, { useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/theme';

// Screens SIM acessam stores (com seletores granulares)
import { useItemsStore } from '@/stores/useItemsStore';

// Screens usam composed components
import ItemCard from '@/components/composed/ItemCard';
import ItemSearchBar from '@/components/composed/ItemSearchBar';
import TibiaEmpty from '@/components/base/TibiaEmpty';

export default function ItemsScreen() {
  const navigation = useNavigation();

  // Seletores granulares (não pega store inteira)
  const filteredItems = useItemsStore((s) => s.filteredItems);
  const searchQuery = useItemsStore((s) => s.searchQuery);
  const setSearchQuery = useItemsStore((s) => s.setSearchQuery);
  const rarityFilter = useItemsStore((s) => s.rarityFilter);
  const setRarityFilter = useItemsStore((s) => s.setRarityFilter);

  const handleItemPress = useCallback((itemId: number) => {
    navigation.navigate('ItemDetail', { id: itemId });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ItemSearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        rarityFilter={rarityFilter}
        onRarityChange={setRarityFilter}
      />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemCard
            name={item.name}
            rarity={item.rarity}
            imageUrl={item.image_url}
            onPress={() => handleItemPress(item.id)}
          />
        )}
        ListEmptyComponent={<TibiaEmpty message="Nenhum item encontrado..." />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
  },
});
```

---

## 11. Types

### 11.1 `types/item.ts`

```typescript
export type ItemRarity = 'Legendary' | 'Very Rare' | 'Rare';

export interface Item {
  id: number;
  name: string;
  image_url: string | null;
  rarity: ItemRarity;
  history: string | null;
  myths: string | null;
  created_at: string;
  updated_at: string;
}

export type ItemSort = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';

export interface ItemFilter {
  searchQuery: string;
  rarity: ItemRarity | 'all';
}
```

### 11.2 `types/character.ts`

```typescript
export type Vocation = 'Elite Knight' | 'Royal Paladin' | 'Elder Druid' | 'Master Sorcerer' | 'Monk';
export type VocationAbbr = 'EK' | 'RP' | 'ED' | 'MS' | 'MO';

export interface Character {
  id: string;
  user_token: string | null;
  name: string;
  world: string;
  vocation: string;
  level: number;
  is_verified: boolean;
  is_highlighted: boolean;
  highlight_until: string | null;
  story_title: string | null;
  story_content: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type CharSort = 'name-asc' | 'name-desc' | 'level-asc' | 'level-desc';

export interface CharFilter {
  searchQuery: string;
  vocation: Vocation | 'all';
  world: string | 'all';
}
```

### 11.3 `types/auth.ts` 🆕

```typescript
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: 'email' | 'google' | 'apple';
}

export interface AuthState {
  user: User | null;
  userToken: string | null;  // TS-xxxxxxxx
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterFormData {
  displayName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### 11.4 `types/market.ts` 🆕

```typescript
export interface HighlightPayment {
  id: string;
  character_id: string;
  user_token: string;
  platform: 'android' | 'ios';
  transaction_id: string;
  amount_brl: number;
  purchased_at: string;
  expires_at: string;
  status: 'active' | 'expired';
}

export type PurchaseStatus = 'idle' | 'purchasing' | 'validating' | 'success' | 'error';
```

### 11.5 `types/tibiaData.ts`

```typescript
export interface TibiaDataResponse {
  character: {
    character: TibiaCharacter;
  };
  information: {
    api: { version: number };
    timestamp: string;
  };
}

export interface TibiaCharacter {
  name: string;
  level: number;
  vocation: string;
  world: string;
  comment: string;
  guild?: { name: string; rank: string };
  last_login: string;
}
```

---

## 12. Boot Flow Detalhado

```
App.tsx monta → useInitApp() dispara → initService.initializeApp()
│
├── 1. openDatabase()
│   └── SQLite aberto com WAL mode + foreign keys
│
├── 2. runMigrations()
│   └── CREATE TABLE items, characters, user_config
│   └── seedItemsIfEmpty() → popula 12+ itens lendários
│
├── 3. loadUserConfig()
│   └── Lê user_token do SQLite (user_config)
│   └── Se não existe: gera UUID com prefixo TS- e salva
│   └── Seta useAuthStore.userToken
│
├── 4. initializeFirebase()
│   └── Firebase App init (automático via google-services.json)
│
├── 5. checkAuthState()
│   └── Firebase Auth onAuthStateChanged
│   └── Se logado: seta useAuthStore.user + busca userToken do Firestore
│   └── Se não logado: mantém null (app funciona sem login para leitura)
│
├── 6. syncIfOnline()
│   ├── checkConnectivity()
│   ├── Se ONLINE:
│   │   ├── useAppStore.setSyncing(true)
│   │   ├── Firestore.characters → SQLite (upsert por ID, updated_at resolve conflitos)
│   │   ├── useAppStore.setLastSync(now)
│   │   └── useAppStore.setSyncing(false)
│   └── Se OFFLINE: usa dados locais do SQLite
│
├── 7. loadItemsToStore()
│   └── itemsRepository.getAllItems() → useItemsStore.setItems()
│
├── 8. loadCharsToStore()
│   └── charsRepository.getAllVerifiedCharsWithStory() → useCharsStore.setChars()
│   └── charsRepository.getHighlightedChars() → useCharsStore.setHighlightedChars()
│   └── charsRepository.getRecentChars(3) → useCharsStore.setRecentChars()
│
├── 9. expireHighlights()
│   └── charsRepository.expireHighlights() → chars com highlight_until < now
│
└── 10. useAppStore.setReady(true)
    └── UI libera: SplashScreen → TopTabNavigator
```

---

## 13. Fluxos de Dados por Feature

### 13.1 Leitura de Itens (somente local)

```
ItemsScreen
  → useItemsStore.filteredItems (seletor)
  → dados vêm do boot flow (SQLite seed → store)
  → filtros/sort usam itemRules.ts (funções puras)
  → nunca toca Firebase (itens são locais/seed)
```

### 13.2 Leitura de Chars (sync do Firebase)

```
CharsScreen
  → useCharsStore.filteredChars (seletor)
  → dados sincronizados no boot flow (Firestore → SQLite → store)
  → filtros/sort usam charRules.ts (funções puras)
  → atualização: só no boot flow ou pull-to-refresh
```

### 13.3 Login / Registro 🆕

```
LoginScreen
  → authRules.validateEmail() + validatePassword()
  → useAuthStore.login()
    → authService.loginWithEmail()
      → Firebase Auth signInWithEmailAndPassword
    → authService.ensureUserToken(uid)
      → firestoreService.getUserToken(uid)
      → Se não existe: gera UUID, salva no Firestore + SQLite
    → useAuthStore.setUser() + setUserToken()
    → syncService.syncFromFirestore() (re-sync com novo user)
```

### 13.4 Adicionar Char (Exiva) 🆕

```
AddCharScreen
  → Input: nome do char
  → charRules.validateCharName()
  → tibiaDataService.fetchCharacter(name)
    → GET https://api.tibiadata.com/v4/character/{name}
  → Se encontrado: exibe dados na tela
  → Botão "Adicionar & Vincular"
    → firestoreService.checkCharacterExists(name) (evita duplicata)
    → firestoreService.createCharacter({...dados, user_token, is_verified: false})
    → syncService.writeAndSync()
    → Navega para VerifyCharScreen
```

### 13.5 Quest de Vínculo 🆕

```
VerifyCharScreen
  → Exibe token do usuário (useAuthStore.userToken)
  → Botão "Vincular Agora"
    → tibiaDataService.fetchCharacter(charName)
    → verificationRules.isTokenInComment(comment, token)
    → Se TRUE:
      → firestoreService.updateCharacter(id, { is_verified: true })
      → charsRepository.upsertCharacter({...char, is_verified: true})
      → useMyCharsStore.loadMyChars()
      → Feedback: "✅ Personagem vinculado com sucesso!"
    → Se FALSE:
      → Feedback: "❌ Token não encontrado. Verifique o comment em tibia.com."
```

### 13.6 Escrever/Editar História 🆕

```
EditStoryScreen
  → Input: título + conteúdo
  → Botão "Salvar"
    → firestoreService.updateCharacter(id, { story_title, story_content, updated_at })
    → charsRepository.upsertCharacter({...char atualizado})
    → useCharsStore.loadChars() (re-carrega lista pública)
    → Feedback: "✅ História salva com sucesso!"
```

### 13.7 Comprar Destaque 🆕

```
HighlightScreen
  → highlightRules.canHighlight(char) → verifica: vinculado + tem história
  → Botão "Comprar Destaque — R$5"
    → purchaseService.purchaseHighlight()
      → IAP da store (Google Play / Apple)
    → Se sucesso:
      → highlightRules.calculateHighlightExpiry(now) → +7 dias
      → firestoreService.updateCharacter(id, { is_highlighted: true, highlight_until })
      → firestoreService.createHighlightPayment({...})
      → charsRepository.upsertCharacter({...})
      → useCharsStore.loadChars()
      → Feedback: "✅ Seu personagem está em destaque!"
```

---

## 14. Configuração de Projeto

### 14.1 `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
      'react-native-reanimated/plugin', // Deve ser o último
    ],
  };
};
```

### 14.2 `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "prototype"]
}
```

### 14.3 `app.json` (parcial)

```json
{
  "expo": {
    "name": "Tibia Stories",
    "slug": "tibia-stories",
    "version": "1.0.0",
    "scheme": "tibiastories",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "backgroundColor": "#8B2020"
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-google-signin/google-signin",
      "expo-apple-authentication",
      "react-native-google-mobile-ads"
    ],
    "android": {
      "package": "com.tibiastories.app",
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#8B2020"
      }
    },
    "ios": {
      "bundleIdentifier": "com.tibiastories.app",
      "googleServicesFile": "./GoogleService-Info.plist",
      "usesAppleSignIn": true,
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["REVERSED_CLIENT_ID_FROM_GOOGLE_SERVICES"]
          }
        ]
      }
    }
  }
}
```

---

## 15. Comparativo: compensa-app → Tibia Stories

| Aspecto               | compensa-app                           | Tibia Stories                                       |
| --------------------- | -------------------------------------- | --------------------------------------------------- |
| Navegação             | Material Top Tabs (3 tabs)             | Material Top Tabs (4 tabs) + NativeStack             |
| Tabs                  | Mercado, Poupança, Config              | Depot, Itens, Chars, Conta                           |
| Stores                | 4 (market, savings, config, app)       | 5 (items, chars, auth, myChars, app)                |
| SQLite tabelas        | 3 (savings, config, external_cache)    | 3 (items, characters, user_config)                   |
| Firebase              | ❌ Não usa                              | ✅ Firestore + Auth                                 |
| Autenticação          | ❌ Não tem                              | ✅ Firebase Auth (e-mail + Google + Apple)           |
| API externa           | ❌ Market data local/cache              | ✅ TibiaData API v4 + Firebase                      |
| Sync remoto           | ❌ Tudo local                           | ✅ Firestore ↔ SQLite (abertura + write-through)    |
| In-App Purchase       | ❌ Não tem                              | ✅ Destaque pago (R$5/7 dias)                       |
| Login social          | ❌ Não tem                              | ✅ Google Sign-In + Apple Sign-In                   |
| Rules                 | 4 arquivos                             | 6 arquivos (+authRules, +itemRules)                  |
| Services              | 4 arquivos                             | 8 arquivos (+firebase, +auth, +sync, +purchase, +tibiaData) |
| Base components       | 11                                     | 11                                                   |
| Composed components   | 17                                     | 17                                                   |
| Theme                 | Escuro (investimentos)                 | Medieval claro (Tibia #FFF2DB, #8B2020)              |
| Boot steps            | 5                                      | 10 (inclui Firebase + sync + auth)                   |

---

## 16. Regras de Desenvolvimento

### 16.1 Checklist de Todo Componente

- [ ] Props interface com tipos primitivos (string, number, boolean, callback)
- [ ] `StyleSheet.create` com tokens de `theme/index.ts`
- [ ] Zero inline styles
- [ ] `export default React.memo(ComponentName)`
- [ ] Nenhum import de store (Zustand) em componentes base/composed

### 16.2 Checklist de Toda Screen

- [ ] Seletores granulares: `useStore((s) => s.campo)` — nunca `useStore()`
- [ ] Callbacks memoizados com `useCallback`
- [ ] Usa apenas composed components (nunca monta UI diretamente)
- [ ] Navegação via `useNavigation()` do React Navigation

### 16.3 Checklist de Toda Rule

- [ ] Zero imports de React, Zustand, SQLite, Firebase
- [ ] Função pura: recebe dados → retorna resultado
- [ ] Testável unitariamente sem mocks

### 16.4 Checklist de Todo Service

- [ ] Sem imports de React ou Zustand (exceto `getState()` no initService)
- [ ] Pode chamar repositories, APIs externas e rules
- [ ] Tratamento de erros com try/catch

### 16.5 Checklist de Todo Repository

- [ ] Usa `database` (expo-sqlite sync API)
- [ ] Sem imports de React, Zustand ou Firebase
- [ ] Funções síncronas (sync API do expo-sqlite)

---

## 17. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Characters: qualquer um lê, só o dono escreve
    match /characters/{charId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.user_token is string;
      allow update: if request.auth != null
                    && resource.data.user_token == request.resource.data.user_token;
      allow delete: if request.auth != null
                    && resource.data.user_token == request.resource.data.user_token;
    }

    // Highlight Payments: qualquer um lê, só autenticado cria
    match /highlight_payments/{paymentId} {
      allow read: if true;
      allow create: if request.auth != null;
    }

    // Users: cada user lê/escreve só o próprio doc
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 18. Resumo

| Aspecto                | Decisão                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| **Base arquitetural**  | Replicada do compensa-app (camadas, stores, rules, repos, theme)           |
| **Navegação**          | React Navigation 7 (Material Top Tabs + NativeStack). NÃO Expo Router.    |
| **State**              | Zustand 5.x com seletores granulares. 5 stores.                           |
| **Banco local**        | expo-sqlite (sync API, WAL mode). 3 tabelas.                              |
| **Banco remoto**       | Firebase Firestore (plano Spark). 3 collections.                          |
| **Auth**               | Firebase Auth (e-mail/senha + Google + Apple).                             |
| **API externa**        | TibiaData API v4 (busca + vinculação por token no comment).                |
| **Sync**               | Firestore → SQLite na abertura. Write-through em criação/edição.           |
| **Components**         | 11 base + 17 composed. React.memo. Props primitivas. Zero inline styles.   |
| **Theme**              | Arquivo único `theme/index.ts`. Medieval claro (#FFF2DB, #8B2020).         |
| **Rules**              | 6 arquivos de funções puras. Zero React/Zustand/Firebase.                  |
| **Services**           | 8 arquivos. Firebase, Auth, Sync, TibiaData, IAP, Ads.                    |
| **Boot flow**          | 10 passos sequenciais no initService.ts.                                   |
| **Monetização**        | AdMob banner + IAP consumível (destaque R$5/7 dias).                       |
| **Path alias**         | `@/` → `src/` via babel-plugin-module-resolver.                            |
| **Naming**             | PascalCase.tsx (componentes), camelCase.ts (lógica), useXxxStore.ts.       |

---

> **Próximo passo:** Criar o projeto Expo, instalar dependências e implementar a estrutura de pastas conforme este documento.
