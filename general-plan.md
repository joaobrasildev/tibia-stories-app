# 📜 Tibia Stories App — Plano Geral de Especificações

> **Versão:** 1.1  
> **Data:** 24/02/2026  
> **Status:** Protótipo HTML5 concluído — pronto para Fase 1 (React Native)

---

## 1. Visão Geral do Projeto

**Tibia Stories** é um aplicativo mobile voltado para a comunidade do MMORPG Tibia, com foco em:

- Leitura de histórias e mitos de **itens lendários e raros** do jogo.
- Criação e compartilhamento de **histórias de personagens** pelos próprios jogadores.
- **Destaque pago** de personagens na página principal (monetização).
- **Anúncios em banner** na parte inferior do app (monetização).

---

## 2. Stack Tecnológica

| Camada            | Tecnologia                                          |
| ----------------- | --------------------------------------------------- |
| Framework Mobile  | **React Native** com **Expo** (Managed Workflow)    |
| Linguagem         | **TypeScript**                                      |
| Navegação         | **Expo Router** (file-based routing)                |
| Banco Local       | **expo-sqlite** (SQLite via Expo)                   |
| Banco Remoto      | **Firebase Firestore** (plano gratuito Spark)       |
| Autenticação      | **Firebase Auth** (e-mail/senha + Login Social Google & Apple) |
| API Externa       | **TibiaData API v4** (gratuita, sem chave de API)   |
| Anúncios          | **Google AdMob** via `expo-ads-admob` ou `react-native-google-mobile-ads` |
| Pagamento In-App  | **expo-in-app-purchases** (Google Play / Apple IAP) |
| Publicação        | **EAS Build + EAS Submit** (Google Play e App Store) |

### 2.1 Dependências Principais (package.json)

```
expo ~52
expo-router ~4
expo-sqlite ~15
@react-native-firebase/app
@react-native-firebase/firestore
@react-native-firebase/auth
@react-native-google-signin/google-signin
expo-apple-authentication
react-native-google-mobile-ads
expo-in-app-purchases
expo-font (para fontes customizadas)
react-native-reanimated
```

> **Nota:** Sem backend próprio. Todo o processamento ocorre no device + Firebase + TibiaData API.

---

## 3. Arquitetura do App

```
┌──────────────────────────────────────────────────┐
│                   TIBIA STORIES APP               │
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌────────────┐   ┌─────────────┐   ┌──────────┐ │
│  │  UI Layer  │   │  Data Layer │   │ Services │ │
│  │ (Screens + │   │ (SQLite +   │   │ (TibiaData│ │
│  │ Components)│   │  Firebase)  │   │  + AdMob) │ │
│  └─────┬──────┘   └──────┬──────┘   └────┬─────┘ │
│        │                 │                │       │
│        └────────┬────────┘                │       │
│                 │                         │       │
│        ┌────────▼─────────────────────────▼──┐    │
│        │        Sync Manager                  │    │
│        │  (Firebase ↔ SQLite na abertura)     │    │
│        └──────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### 3.1 Fluxo de Dados

1. **Abertura do app** → Sync Manager busca dados de personagens no Firestore e atualiza o SQLite local.
2. **Leitura de itens** → Dados vêm do SQLite local (pré-populado pelo desenvolvedor).
3. **Leitura de personagens/histórias** → Dados vêm do SQLite local (sincronizado do Firebase).
4. **Criação/edição de char** → Escrita no Firebase Firestore → Atualização no SQLite local.
5. **Vinculação de char** → Chamada à TibiaData API v4 → Valida token no comment.

---

## 4. Vinculação de Char via Token (Quest de Vínculo)

### 4.1 API Disponível ✅

A **TibiaData API v4** (https://api.tibiadata.com) fornece o endpoint:

```
GET https://api.tibiadata.com/v4/character/{name}
```

**Resposta relevante (JSON):**

```json
{
  "character": {
    "character": {
      "name": "Bubble",
      "level": 273,
      "vocation": "Knight",
      "world": "Refugia",
      "comment": "Texto do comment do char em tibia.com...",
      ...
    }
  }
}
```

O campo **`comment`** contém exatamente o texto que o jogador escreve no comment do char em tibia.com (My Account → Edit Comment).

### 4.2 Fluxo de Vinculação (Quest de Vínculo)

```
┌─────────────┐     ┌───────────────┐     ┌─────────────────┐
│  App gera   │     │ Usuário cola  │     │  App consulta   │
│  token UUID │────▶│ token no      │────▶│  TibiaData API  │
│  único      │     │ comment do    │     │  GET /character  │
│             │     │ char em       │     │                  │
│             │     │ tibia.com     │     │                  │
└─────────────┘     └───────────────┘     └────────┬────────┘
                                                    │
                                          ┌─────────▼────────┐
                                          │  Verifica se o   │
                                          │  campo "comment" │
                                          │  contém o token  │
                                          └────────┬─────────┘
                                                   │
                                    ┌──────────────▼──────────────┐
                                    │  SIM → Char vinculado ✅     │
                                    │  NÃO → Exibe erro ❌        │
                                    └─────────────────────────────┘
```

**Detalhes:**

1. O app gera um **token UUID v4** único por usuário (ex: `TS-a1b2c3d4`).
2. O token é exibido na tela com botão de "copiar".
3. O usuário acessa tibia.com, faz login, vai em **My Account → Edit Comment** e cola o token no comment do char.
4. No app, o usuário toca em **"Vincular Agora"** e o app faz a chamada à TibiaData API.
5. Se o campo `comment` da resposta **contém** o token → char vinculado ao usuário.
6. O usuário pode remover o token (chamado "runa" no contexto da quest) do comment após a vinculação (opcional).

> **Rate limit da API:** A TibiaData API tem cache de ~5 minutos para dados de personagens. O app avisa: *"A quest pode levar até 5 minutos, pois a API do TibiaData possui cache. Seja paciente, aventureiro!"*

---

## 5. Modelo de Dados

### 5.1 SQLite (Banco Local)

#### Tabela: `items`
| Campo           | Tipo     | Descrição                                    |
| --------------- | -------- | -------------------------------------------- |
| `id`            | INTEGER  | PK, autoincrement                            |
| `name`          | TEXT     | Nome do item (ex: "Golden Armor")            |
| `image_url`     | TEXT     | Caminho da imagem do item (asset local)      |
| `rarity`        | TEXT     | Classificação (Legendary, Rare, Very Rare)   |
| `history`       | TEXT     | Texto da história real do item               |
| `myths`         | TEXT     | Texto dos mitos relacionados ao item         |
| `created_at`    | TEXT     | Data de criação do registro                  |
| `updated_at`    | TEXT     | Data da última atualização                   |

#### Tabela: `characters`
| Campo              | Tipo     | Descrição                                    |
| ------------------ | -------- | -------------------------------------------- |
| `id`               | TEXT     | PK (mesmo ID do Firestore)                   |
| `user_token`       | TEXT     | Token UUID do dono                           |
| `name`             | TEXT     | Nome do char no Tibia                        |
| `world`            | TEXT     | Mundo do char                                |
| `vocation`         | TEXT     | Vocação (Knight, Paladin, Sorcerer, Druid, Monk) |
| `level`            | INTEGER  | Nível do char                                |
| `is_verified`      | INTEGER  | 0 = não vinculado, 1 = vinculado            |
| `is_highlighted`   | INTEGER  | 0 = normal, 1 = em destaque pago            |
| `highlight_until`  | TEXT     | Data de expiração do destaque                |
| `story_title`      | TEXT     | Título da história do char                   |
| `story_content`    | TEXT     | Conteúdo da história (Markdown ou texto)     |
| `avatar_url`       | TEXT     | URL do outfit do char (TibiaData)            |
| `created_at`       | TEXT     | Data de criação                              |
| `updated_at`       | TEXT     | Data da última atualização                   |

#### Tabela: `user_config`
| Campo         | Tipo   | Descrição                            |
| ------------- | ------ | ------------------------------------ |
| `id`          | INTEGER| PK (sempre 1, registro único)        |
| `user_token`  | TEXT   | Token UUID único do usuário          |
| `created_at`  | TEXT   | Data de criação do token             |

### 5.2 Firebase Firestore (Banco Remoto)

#### Collection: `characters`
```json
{
  "id": "auto-generated",
  "user_token": "TS-a1b2c3d4",
  "name": "Knight Legend",
  "world": "Antica",
  "vocation": "Elite Knight",
  "level": 850,
  "is_verified": true,
  "is_highlighted": false,
  "highlight_until": null,
  "story_title": "A Lenda de Antica",
  "story_content": "Era uma noite escura em Thais quando...",
  "avatar_url": "https://static.tibia.com/outfits/...",
  "created_at": "2026-02-23T00:00:00Z",
  "updated_at": "2026-02-23T00:00:00Z"
}
```

#### Collection: `highlight_payments`
```json
{
  "id": "auto-generated",
  "character_id": "ref-to-character",
  "user_token": "TS-a1b2c3d4",
  "platform": "android|ios",
  "transaction_id": "google-play-or-apple-transaction-id",
  "plan": "7d|30d|365d",
  "amount_brl": 5.00,
  "duration_days": 7,
  "purchased_at": "2026-02-23T00:00:00Z",
  "expires_at": "2026-03-02T00:00:00Z",
  "status": "active|expired"
}
```
> `amount_brl` e `duration_days` variam conforme o plano: 5.00/7, 15.00/30, ou 100.00/365.
```

---

## 6. Sincronização Firebase ↔ SQLite

### 6.1 Estratégia

```
App Aberto
    │
    ▼
┌─────────────────────────┐
│ Verifica conectividade  │
└──────────┬──────────────┘
           │
    ┌──────▼──────┐
    │  Online?    │
    └──┬──────┬───┘
       │      │
      SIM    NÃO
       │      │
       ▼      ▼
  ┌────────┐  ┌──────────────┐
  │ Busca  │  │ Usa dados    │
  │ dados  │  │ locais do    │
  │ do     │  │ SQLite       │
  │Firebase│  └──────────────┘
  └───┬────┘
      │
      ▼
  ┌──────────────────────┐
  │ Atualiza SQLite com  │
  │ dados mais recentes  │
  │ (upsert por ID)      │
  └──────────────────────┘
```

### 6.2 Regras de Sync

- **Na abertura do app:** Sincronização completa (fetch all characters do Firestore → upsert no SQLite).
- **Ao criar/editar char:** Escrita imediata no Firestore + atualização local no SQLite.
- **Campo `updated_at`:** Usado para resolver conflitos (mais recente vence).
- **Destaques expirados:** Verificados localmente; `is_highlighted` volta a `0` se `highlight_until < now`.
- **Otimização futura:** Usar `updated_at` como cursor para sync incremental (só trazer registros alterados desde a última sync).

### 6.3 Política Offline — Regras Invioláveis

> **Premissa fundamental:** Nenhum dado é criado localmente. Todo dado novo (char, história, destaque, conta) **deve ser criado no Firebase primeiro** e depois sincronizado para o SQLite local. O SQLite é cache de leitura, nunca fonte de escrita.

#### Leitura offline (permitido)
- O app **funciona offline** para leitura usando os dados locais do SQLite.
- Abas **Depot**, **Itens** e **Chars** exibem os dados da última sincronização.
- Detalhes de itens e histórias de chars já sincronizados são acessíveis normalmente.
- Não deve haver mensagem de erro ao navegar por telas de leitura offline.

#### Escrita offline (bloqueado com feedback)
- Features que requerem internet **devem verificar conectividade antes de executar** e exibir mensagem de erro amigável se offline.
- **Nenhuma operação de escrita deve ser enfileirada localmente** (sem queue/retry automático).
- O usuário deve reconectar e tentar novamente manualmente.

#### Features que requerem internet

| Feature | Motivo |
| ------- | ------ |
| Login / Registro | Firebase Auth |
| Login social (Google/Apple) | OAuth + Firebase Auth |
| Esqueceu a senha | Firebase Auth sendPasswordResetEmail |
| Adicionar char (Exiva) | TibiaData API + criação no Firestore |
| Quest de Vínculo (verificar token) | TibiaData API + atualização no Firestore |
| Escrever/Editar história | Escrita no Firestore |
| Comprar destaque | IAP + Firestore |
| Sync manual (pull-to-refresh) | Firestore |

#### Mensagem de erro padrão (offline)

```
"⚠️ Sem conexão com a internet. Conecte-se para realizar esta ação."
```

> Cada tela pode complementar com contexto específico (ex: "Conecte-se para adicionar um char"), mas a mensagem padrão deve sempre estar presente como fallback.

#### Detecção de conectividade

- Usa **`@react-native-community/netinfo`** com listener contínuo (`NetInfo.addEventListener`).
- `syncService.startConnectivityListener()` é chamado no boot flow (passo 4.5) e atualiza `useAppStore.isOnline` em tempo real.
- Quando o app volta online, **não há sync automático** — o usuário faz pull-to-refresh manualmente.
- Um **banner visual "Modo offline"** (`OfflineBanner`) é exibido de forma persistente no topo da tela enquanto `isOnline === false`.
- O banner desaparece automaticamente quando a conexão é restaurada.

---

## 7. Design & Identidade Visual

### 7.1 Referência: Estilo tibia.com

O layout segue estética medieval com paleta de pergaminho claro, inspirado no universo de Tibia:

| Elemento                | Especificação                                                                     |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Fundo geral**         | `#FFFFFF` (branco) — corpo da página                                              |
| **Fundo painéis**       | `#FFF2DB` (creme/pergaminho claro) — `--bg-panel`, `--bg-content`                 |
| **Fundo alternativo**   | `#DEBB9D` (bege escuro) — `--bg-content-alt`, hover de cards                      |
| **Fundo header/tab**    | Gradiente `#A02828 → #8B2020 → #6E1818` (vermelho escuro medieval)                |
| **Fundo subtítulo**     | `#D4A66A` (dourado) — barra de contexto abaixo do header                          |
| **Bordas externas**     | `#5A2800` (marrom escuro) — `--border-outer`                                      |
| **Bordas internas**     | `#A0703C` (marrom médio) — `--border-inner`                                       |
| **Borda dourada**       | `#8B5E2A` — `--border-gold`                                                       |
| **Texto principal**     | `#5A2800` (marrom escuro) — `--text-primary`, `--text-highlight`                  |
| **Texto secundário**    | `#7A4A20` (marrom médio) — `--text-secondary`                                     |
| **Texto mudo**          | `#9A7A50` (marrom claro) — `--text-muted`                                         |
| **Texto escuro**        | `#3A1800` (quase preto) — `--text-white` (usado em strong/ênfases)                |
| **Cor de erro**         | `#C0392B` (vermelho) — `--accent-red`                                             |
| **Cor de sucesso**      | `#1B7A2E` (verde) — `--accent-green`                                              |
| **Cor de info**         | `#2B5C9A` (azul) — `--accent-blue`                                                |
| **Botões primários**    | `#D4A66A` com hover `#C49658` — `--btn-bg`, `--btn-hover`                         |
| **Cards**               | `#FFF2DB` com hover `#DEBB9D` — `--card-bg`, `--card-hover`                       |
| **Glow de destaque**    | `rgba(255, 200, 50, 0.3)` — `--highlight-glow`                                   |
| **Título header**       | `#FFF2DB` com text-shadow dourado                                                 |
| **Ornamentos header**   | `#D4A66A` (⚔ laterais ao título)                                                 |
| **Separadores**         | Linhas horizontais ornamentadas `✦ ✦ ✦` em dourado                               |

> **Nota:** A paleta segue estilo pergaminho/medieval claro, diferente do tibia.com escuro. O header e tab bar usam vermelho escuro (#8B2020) que remete ao visual do jogo.

### 7.2 Fontes

| Uso                 | Fonte                        | Fallback           |
| ------------------- | ---------------------------- | ------------------- |
| **Títulos**         | `MedievalSharp` (Google Font) | `serif`            |
| **Corpo de texto**  | `Martel` (Google Font)        | `Georgia`, `serif` |
| **UI/Botões**       | `Martel` (Google Font)        | `Georgia`, `serif` |

> As fontes serão carregadas via `expo-font` e embedadas no bundle do app.

### 7.3 Componentes Visuais Estilizados

- **Painéis de conteúdo:** Caixas com borda estilizada imitando as "content boxes" do tibia.com (cantos decorados, borda dupla marrom/dourada).
- **Headers/Títulos:** Faixas horizontais com fundo mais escuro e texto dourado centralizado, similar aos headers de seção do site.
- **Listas:** Itens com ícone/bullet decorativo (espada, escudo ou ponto medieval).
- **Imagens de itens:** Enquadradas em bordas estilizadas com fundo escuro, exatamente como o site exibe sprites.
- **Divisores:** Linhas horizontais ornamentadas (asset de imagem ou SVG).
- **Scroll:** Visual customizado com scrollbar estilizado (se viável).

### 7.4 Mockup Conceitual das Telas

```
┌─────────────────────────────────────┐
│  ⚔ ═══ TIBIA STORIES ═══ ⚔       │  ← Header fixo (#8B2020)
├─────────────────────────────────────┤
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║   ⭐ CHARS EM DESTAQUE        ║  │
│  ╠═══════════════════════════════╣  │
│  ║  🛡️ Knight Legend [850 EK]   ║  │  ← Cards clicáveis
│  ║  Antica • "A Lenda de Antica" ║  │
│  ╠───────────────────────────────╣  │
│  ║  ⚔️ Dark Wizard [1200 MS]    ║  │
│  ║  Secura • "O Mago das Trevas" ║  │
│  ╠───────────────────────────────╣  │
│  ║  🏹 Arrow Storm [990 RP]     ║  │
│  ║  Antica • "Tempestade"        ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  [═══════ BANNER ADMOB ═══════════] │  ← Anúncio
│  [🏰Depot][⚔Itens][📖Chars][⚙Conta]│  ← Tab bar (#8B2020)
└─────────────────────────────────────┘
```

### 7.5 Ícones das Tabs (Flaticon)

As tabs utilizam ícones PNG 128×128 do Flaticon em vez de emojis:

| Tab     | Ícone                 | Fonte Flaticon                              |
| ------- | --------------------- | ------------------------------------------- |
| Depot   | `icons/castle.png`    | [Flaticon #1065543](https://www.flaticon.com/br/icone-gratis/castelo_1065543) |
| Itens   | `icons/armor.png`     | [Flaticon #286627](https://www.flaticon.com/br/icone-gratis/armaduras_286627) |
| Chars   | `icons/history-book.png` | [Flaticon #1800196](https://www.flaticon.com/br/icone-gratis/history-book_1800196) |
| Conta   | `⚙️` (emoji)          | — |

---

## 8. Estrutura de Telas & Navegação

### 8.1 Mapa de Navegação

```
Tab Navigator (Bottom Tabs)
│
├── � Depot (Home — Chars em Destaque)
│   └── CharacterStoryScreen (história de um char)
│
├── ⚔ Itens (Itens Lendários & Raros)
│   └── ItemDetailScreen (origem + mitos de um item)
│
├── 📖 Chars (lista geral de chars com histórias)
│   └── CharacterStoryScreen (história de um char)
│
└── ⚙️ Conta
    ├── LoginScreen (e-mail/senha + social login)
    ├── RegisterScreen (criar conta)
    ├── MyCharactersScreen (lista dos meus chars)
    │   ├── AddCharacterScreen (Exiva — Localizar Char)
    │   ├── VerifyCharacterScreen (Quest de Vínculo)
    │   └── EditCharacterStoryScreen (escrever/editar história)
    ├── HighlightScreen (comprar destaque)
    └── Sobre o App (info + logout)
```

### 8.2 Descrição Detalhada das Telas

#### � Tela 1: Depot — Chars em Destaque
- **Rota:** `/(tabs)/home`
- **Conteúdo:**
  - Header decorativo com ⚔ ornamentais e título "Tibia Stories".
  - Painel **"⭐ Chars em Destaque"** com cards de chars que compraram destaque.
  - Cada card exibe: nome, nível, vocação (badge), mundo, título da história, avatar emoji.
  - Se não houver destaques, exibe mensagem: *"Nenhum char em destaque no momento..."*
  - Seção **"Histórias Recentes"** abaixo dos destaques, com 3 chars mais recentes.
  - Ao clicar em um card → navega para `CharacterStoryScreen`.
- **Dados:** SQLite local (tabela `characters` filtrado por `is_highlighted = 1` e `highlight_until >= now`).

#### ⚔ Tela 2: Itens — Lendários & Raros
- **Rota:** `/(tabs)/items`
- **Conteúdo:**
  - Painel **"Itens Lendários & Raros"** com lista de itens.
  - Cada item exibe: **emoji/sprite**, **nome** e **classificação de raridade** (badge colorido).
  - Barra de busca no topo (filtro por nome). Placeholder: *"Buscar item por nome..."*
  - **Filtro por raridade:** Todos / 🟠 Legendary / 🟣 Very Rare / 🔵 Rare (botões toggle).
  - **Ordenação:** A→Z / Z→A / Raridade ↓ / Raridade ↑ (dropdown).
  - Estado vazio: *"Nenhum item encontrado..."*
  - Ao clicar em um item → navega para `ItemDetailScreen`.
- **Dados:** SQLite local (tabela `items`).

#### ⚔ Tela 2.1: Detalhe do Item
- **Rota:** `/item/[id]`
- **Conteúdo:**
  - Imagem/emoji do item (centralizada).
  - Nome do item como título principal.
  - Badge de raridade.
  - **Seção "📜 Origem"** — Texto sobre a origem e história real do item no jogo.
  - **Seção "🔮 Mitos & Lendas"** — Texto dos mitos/lendas populares do item.
  - Layout simples: tudo em scroll vertical, com títulos separando as seções.
- **Dados:** SQLite local (tabela `items` por ID).

#### 📖 Tela 3: Chars — Todas as Histórias
- **Rota:** `/(tabs)/characters`
- **Conteúdo:**
  - Painel **"Todas as Histórias"** com lista de todos os chars verificados com histórias publicadas.
  - Cada item exibe: nome, nível, vocação (badge), mundo, título da história.
  - Barra de busca com placeholder imersivo: `exiva "nome"...` (referência ao spell Find Person do Tibia).
  - **Filtros:**
    - Por vocação (EK, RP, ED, MS, MO).
    - Por mundo (dropdown — label "Mundo:", não "Servidor").
  - **Ordenação:**
    - Alfabética (A-Z / Z-A).
    - Por nível (maior → menor ou inverso).
  - Estado vazio: *"Nenhum char encontrado..."*
  - Ao clicar → navega para `CharacterStoryScreen`.
- **Dados:** SQLite local (tabela `characters` filtrado por `is_verified = 1` e `story_content IS NOT NULL`).

#### 📖 Tela 3.1: História do Char
- **Rota:** `/character/[id]`
- **Conteúdo:**
  - Avatar/emoji do char.
  - Nome do char como título.
  - Badges: vocação (EK/RP/ED/MS/MO), nível, mundo.
  - Se em destaque: badge dourado "⭐ Em Destaque".
  - Título da história como seção (📜).
  - Texto completo da história escrita pelo jogador.
  - Data de publicação no rodapé.
  - Estado vazio: *"Char não encontrado"*
- **Dados:** SQLite local (tabela `characters` por ID).

#### ⚙️ Tela 4: Conta
- **Rota:** `/(tabs)/account`
- **Conteúdo (usuário NÃO logado):**
  - Tela de login (ver Tela 4.0a).
- **Conteúdo (usuário logado):**
  - Seção **"🔑 Meu Token de Verificação"**: Exibe o token UUID do usuário com botão de copiar.
  - Instruções de como usar o token para vincular chars.
  - Seção **"⚔️ Meus Chars"**: Lista dos chars vinculados ao usuário.
    - Cada char exibe avatar (imagem via URL ou fallback 🛡️), consistente com a aba Chars.
    - Cada char com status: `✅ Vinculado` / `⏳ Pendente`.
    - Botões de ação: **Vincular**, **Escrever** (história), **Editar**, **⭐** (destacar).
  - Botão **"➕ Adicionar Char"**.
  - Seção **"ℹ️ Sobre o App"** com versão e descrição.
  - Botão **"Sair"** (logout).
  - Estado vazio (sem chars): *"Nenhum char vinculado"*
- **Dados:** Firebase Auth + SQLite local + Firestore.

#### ⚙️ Tela 4.0a: Login
- **Rota:** `/account/login`
- **Conteúdo:**
  - Ícone 📜 (pergaminho) + título "Tibia Stories".
  - Subtítulo: *"Entre para gerenciar seus chars e histórias"*.
  - Painel **"🔑 Entrar"**:
    - Campo "E-mail" (input).
    - Campo "Senha" (input password).
    - Botão "Entrar".
    - Link "Esqueceu a senha?" → Firebase Auth password reset.
  - Separador "— ou —".
  - Botão **"Entrar com Google"**.
  - Botão **"Entrar com Apple"**.
  - Link "Não tem conta? Criar Conta".
- **Validação:** Firebase Auth `signInWithEmailAndPassword`.
- **Feedback:** *"✅ Login realizado com sucesso! Entrando em mainland..."*

#### ⚙️ Tela 4.0b: Criar Conta
- **Rota:** `/account/register`
- **Conteúdo:**
  - Ícone 🛡️ (escudo) + título "Criar Conta".
  - Subtítulo: *"Atravesse o TP e junte-se à comunidade de Tibia Stories"*.
  - Painel **"✏️ Dados da Conta"**:
    - Campo "Nome" (input — opcional, display name). Placeholder: *"Como quer ser chamado?"*
    - Campo "E-mail" (input).
    - Campo "Senha" (input password, mín. 6 caracteres).
    - Campo "Confirmar Senha" (input password).
    - Botão "Criar Conta".
  - Separador "— ou —".
  - Botão **"Registrar com Google"**.
  - Botão **"Registrar com Apple"**.
  - Link "Já tem conta? Entrar".
- **Validação:** Firebase Auth `createUserWithEmailAndPassword`.
- **Pós-criação:** Gera `user_token` UUID e salva no Firestore vinculado ao `uid` do Firebase Auth.
- **Feedback:** *"✅ Conta criada com sucesso!"*

#### ⚙️ Tela 4.1: Adicionar Char (Exiva — Localizar Char)
- **Rota:** `/account/add-character`
- **Conteúdo:**
  - Painel **"🔍 Exiva — Localizar Char"** (referência ao spell `exiva "name"` do Tibia).
    - Campo: "Nome do Char no Tibia". Placeholder: *"Ex: Bubble, Kharsek..."*
    - Botão **"🔍 Exiva!"**.
  - Ao buscar → chama TibiaData API `GET /v4/character/{name}`.
  - Painel resultado **"✅ Char Localizado"**: exibe dados (nome, nível, vocação, mundo).
  - Botão **"➕ Adicionar & Vincular"** → inicia Quest de Vínculo.
  - Aviso de erro: *"⚠️ Char não encontrado. Verifique o nick e tente novamente."*
  - Nota informativa: *"ℹ️ O nome deve ser exatamente como aparece em tibia.com. A busca utiliza a API pública TibiaData."*
- **Validação:** Se o char não existir na API, exibe erro.

#### ⚙️ Tela 4.2: Quest de Vínculo (Vincular Char)
- **Rota:** `/account/verify/[id]`
- **Conteúdo:**
  - Painel **"🔐 Quest de Vínculo: ${charName}"**.
  - Descrição: *"Para vincular ${charName} à sua conta, cole o token abaixo no comment dele em tibia.com."*
  - Exibe o token do usuário em destaque com botão de copiar.
  - Painel **"📋 Instruções da quest"** (passo a passo):
    1. Copie o token acima tocando no botão "Copiar Token".
    2. Acesse **tibia.com** e faça login na sua conta.
    3. Vá em **My Account → Edit Comment**.
    4. Cole o token em qualquer parte do **comment do char** e salve.
    5. Volte aqui e toque em **"Vincular Agora"**.
  - Botão **"✅ Vincular Agora"**.
  - Ao clicar → chama TibiaData API e verifica se `comment` contém o token.
  - Aviso: *"⏳ A quest pode levar até 5 minutos, pois a API do TibiaData possui cache. Seja paciente, aventureiro!"*
  - Nota pós-vínculo: *"ℹ️ Após o fim da quest de vínculo, você pode remover a runa do comment do personagem se desejar."*
  - **Feedback de sucesso:** *"✅ Personagem vinculado com sucesso! O token foi encontrado no comment do personagem. Agora você pode escrever sua história!"*

#### ⚙️ Tela 4.3: Editar História do Char
- **Rota:** `/account/edit-story/[id]`
- **Conteúdo:**
  - Painel **"✏️ História de ${charName}"**.
  - Campo: "Título da História" (input text). Placeholder: *"Ex: A Lenda de Antica..."*
  - Campo: "Sua História" (textarea). Placeholder: *"Conte as aventuras do seu char... hunts épicas, quests lendárias, guerras, amizades e tudo que tornou sua jornada em Tibia única."*
  - Nota: *"✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser. Outros aventureiros poderão ler na aba de Chars."*
  - Botão **"💾 Salvar História"**.
  - **Feedback:** *"✅ História salva com sucesso! Seu char agora aparece nas Histórias dos Aventureiros."*
- **Validação:** Char deve estar vinculado para editar a história.
- **Escrita:** Firebase Firestore → sync local SQLite.

#### ⚙️ Tela 4.4: Destacar Char
- **Rota:** `/account/highlight/[id]`
- **Conteúdo:**
  - Painel **"⭐ Destacar ${charName}"**.
  - Explicação: *"Ao destacar seu personagem, ele aparecerá na página principal do app, visível para todos os usuários!"*
  - **Planos de destaque (3 opções):**
    | Plano       | Preço       | Duração  |
    | ----------- | ----------- | -------- |
    | 7 dias      | R$ 5,00     | 7 dias   |
    | 30 dias     | R$ 15,00    | 30 dias  |
    | 365 dias    | R$ 100,00   | 365 dias |
  - O usuário seleciona um plano antes de clicar no botão de compra.
  - Botões com glow dourado para cada plano (ou seletor + botão único).
  - Detalhes: destaque dourado com estrela, compra via App Store/Google Play, ativação imediata.
  - Nota: *"ℹ️ Requisitos: personagem verificado e com história escrita."*
  - **Feedback:** *"✅ Compra realizada com sucesso! Seu personagem está em destaque na Home por {N} dias."* (onde {N} é a duração do plano comprado).
- **Validação:** Char deve estar vinculado e ter uma história escrita.
- Após confirmação → atualiza `is_highlighted = 1` e `highlight_until = now + {duração do plano}` no Firestore.

---

## 9. Monetização

### 9.1 Anúncios (AdMob)

| Tipo   | Posição                      | Comportamento                                           |
| ------ | ---------------------------- | ------------------------------------------------------- |
| Banner | Parte inferior (todas telas) | Banner fixo persistente, não intrusivo                  |

- Implementado com `react-native-google-mobile-ads`.
- IDs de teste durante desenvolvimento; IDs de produção no build final.
- Banner de tamanho adaptativo (adaptive banner).

### 9.2 Destaque Pago (In-App Purchase)

| Produto                      | Preço      | Duração  | Plataforma                |
| ---------------------------- | ---------- | -------- | ------------------------- |
| Destaque de Char — 7 dias    | R$ 5,00    | 7 dias   | Google Play + Apple Store |
| Destaque de Char — 30 dias   | R$ 15,00   | 30 dias  | Google Play + Apple Store |
| Destaque de Char — 365 dias  | R$ 100,00  | 365 dias | Google Play + Apple Store |

- Implementado como **3 produtos consumíveis** (pode comprar múltiplas vezes).
- O usuário escolhe o plano desejado na tela de destaque.
- Se o char já tem destaque ativo, a nova compra **estende** a duração existente (`highlight_until += duração`).
- Fluxo: Escolhe plano → Compra → Confirmação da store → App registra no Firestore → Atualiza local.
- Expiração verificada no app ao abrir (compara `highlight_until` com data atual).

---

## 10. Estrutura de Pastas do Projeto

```
tibia-stories-app/
├── prototype/                        # Protótipo HTML5 navegável (Fase 0)
│   ├── index.html                    # Shell HTML (header, tabs, content area)
│   ├── styles.css                    # Estilos completos do protótipo
│   ├── data.js                       # Dados mockados (itens, chars, token)
│   ├── app.js                        # Lógica SPA (navegação + renderização)
│   └── icons/                        # Ícones das tabs (Flaticon PNGs 128×128)
│       ├── castle.png                # Aba Depot (Flaticon #1065543)
│       ├── armor.png                 # Aba Itens (Flaticon #286627)
│       └── history-book.png          # Aba Chars (Flaticon #1800196)
│
├── app/                              # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── (tabs)/                   # Tab Navigator
│   │   ├── _layout.tsx           # Tab layout configuration
│   │   ├── home.tsx              # 🏠 Home — Destaques
│   │   ├── items.tsx             # 📦 Itens Raros — Listagem
│   │   ├── characters.tsx        # 📖 Personagens — Lista Geral
│   │   └── account.tsx           # ⚙️ Conta
│   ├── item/
│   │   └── [id].tsx              # Detalhe do Item
│   ├── character/
│   │   └── [id].tsx              # História do Char
│   └── account/
│       ├── add-character.tsx     # Exiva — Localizar Char
│       ├── verify/
│       │   └── [id].tsx          # Quest de Vínculo
│       ├── edit-story/
│       │   └── [id].tsx          # Editar História
│       └── highlight/
│           └── [id].tsx          # Destacar Char
│
├── src/
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                   # Componentes genéricos estilizados
│   │   │   ├── TibiaPanel.tsx    # Painel com borda medieval
│   │   │   ├── TibiaButton.tsx   # Botão estilizado
│   │   │   ├── TibiaText.tsx     # Texto com fontes medievais
│   │   │   ├── TibiaHeader.tsx   # Header de seção
│   │   │   ├── TibiaDivider.tsx  # Divisor ornamental
│   │   │   ├── TibiaInput.tsx    # Campo de input estilizado
│   │   │   └── TibiaBadge.tsx    # Badge de raridade/vocação
│   │   ├── CharacterCard.tsx     # Card de char (listas)
│   │   ├── ItemCard.tsx          # Card de item (listas)
│   │   ├── AdBanner.tsx          # Componente do banner AdMob
│   │   └── TokenDisplay.tsx      # Exibição do token com botão copiar
│   │
│   ├── database/                 # Camada de banco de dados
│   │   ├── sqlite.ts             # Inicialização e helpers do SQLite
│   │   ├── migrations.ts         # Criação/atualização de tabelas
│   │   ├── seeds/                # Dados iniciais dos itens
│   │   │   └── items-seed.ts     # Array com dados dos itens raros
│   │   ├── repositories/         # Repositórios de acesso a dados
│   │   │   ├── itemRepository.ts
│   │   │   ├── characterRepository.ts
│   │   │   └── userConfigRepository.ts
│   │   └── sync.ts               # Lógica de sincronização Firebase ↔ SQLite
│   │
│   ├── services/                 # Serviços externos
│   │   ├── firebase.ts           # Configuração do Firebase
│   │   ├── firestore.ts          # Operações Firestore (CRUD characters)
│   │   ├── tibiaDataApi.ts       # Chamadas à TibiaData API v4
│   │   ├── purchaseService.ts    # Lógica de In-App Purchase
│   │   └── adService.ts          # Configuração de anúncios
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useDatabase.ts        # Hook para acesso ao banco
│   │   ├── useSync.ts            # Hook de sincronização
│   │   ├── useCharacterVerify.ts # Hook de vinculação de char (Quest de Vínculo)
│   │   └── useToken.ts           # Hook para gerenciar token do usuário
│   │
│   ├── theme/                    # Tema e estilos
│   │   ├── colors.ts             # Paleta de cores Tibia
│   │   ├── fonts.ts              # Configuração de fontes
│   │   ├── spacing.ts            # Espaçamentos padronizados
│   │   └── styles.ts             # Estilos globais compartilhados
│   │
│   ├── types/                    # TypeScript types/interfaces
│   │   ├── item.ts               # Interface Item
│   │   ├── character.ts          # Interface Character
│   │   └── tibiaData.ts          # Tipos da resposta TibiaData API
│   │
│   ├── utils/                    # Utilitários
│   │   ├── tokenGenerator.ts     # Geração de UUID token
│   │   └── dateUtils.ts          # Helpers de data
│   │
│   └── constants/                # Constantes
│       └── app.ts                # Constantes do app (textos, configs)
│
├── assets/                       # Assets estáticos
│   ├── fonts/                    # Fontes .ttf
│   │   ├── MedievalSharp-Regular.ttf
│   │   └── Martel-Regular.ttf
│   ├── images/                   # Imagens gerais
│   │   ├── logo.png              # Logo do app
│   │   ├── splash.png            # Splash screen
│   │   ├── border-corner.png     # Cantos decorativos
│   │   └── divider.png           # Divisor ornamental
│   └── items/                    # Sprites dos itens
│       ├── golden-armor.png
│       ├── magic-plate-armor.png
│       └── ...
│
├── app.json                      # Configuração Expo
├── eas.json                      # Configuração EAS Build
├── firebase.json                 # Config Firebase (se necessário)
├── google-services.json          # Config Firebase Android
├── GoogleService-Info.plist      # Config Firebase iOS
├── tsconfig.json                 # Config TypeScript
├── package.json                  # Dependências
└── README.md                     # Documentação do projeto
```

---

## 11. Regras de Negócio

### 11.1 Char

| Regra | Descrição |
| ----- | --------- |
| RN-01 | Todo char precisa ser vinculado (Quest de Vínculo) via token antes de ter uma história publicada. |
| RN-02 | Um char só pode ser vinculado a um `user_token`. |
| RN-03 | O nome do char deve existir na TibiaData API. |
| RN-04 | O mesmo char não pode ser cadastrado por dois usuários diferentes. |
| RN-05 | Para aparecer na aba Chars, o char deve estar vinculado E ter uma história escrita. |
| RN-06 | Para comprar destaque, o char deve estar vinculado E ter uma história escrita. |
| RN-07 | O destaque dura conforme o plano escolhido: 7 dias (R$ 5), 30 dias (R$ 15) ou 365 dias (R$ 100). Se já houver destaque ativo, a duração é estendida. |
| RN-08 | Destaques expirados são removidos automaticamente na abertura do app (verificação local). |

### 11.2 Usuário

| Regra | Descrição |
| ----- | --------- |
| RN-09 | O usuário deve criar conta (e-mail/senha) ou usar login social (Google/Apple) para acessar a aba "Conta". |
| RN-10 | Ao criar conta, um `user_token` UUID único é gerado e salvo no Firestore vinculado ao `uid` do Firebase Auth. |
| RN-11 | Login social com Google usa `@react-native-google-signin/google-signin` + Firebase Auth. |
| RN-11b | Login social com Apple usa `expo-apple-authentication` + Firebase Auth (obrigatório para apps iOS com login social). |
| RN-12 | O `user_token` persiste entre dispositivos pois está vinculado à conta Firebase Auth (não se perde ao reinstalar). |

### 11.3 Itens

| Regra | Descrição |
| ----- | --------- |
| RN-13 | Itens são somente leitura para os usuários. |
| RN-14 | Itens são pré-populados no SQLite via seed (pelo desenvolvedor). |
| RN-15 | Atualizações de itens vêm via atualização do app na store. |

### 11.4 Offline & Conectividade

| Regra | Descrição |
| ----- | --------- |
| RN-16 | O app deve funcionar offline para **leitura** usando dados locais do SQLite (última sincronização). |
| RN-17 | **Nenhum dado pode ser criado localmente.** Todo dado novo (char, história, conta, destaque) deve ser criado no Firebase primeiro e depois sincronizado para o SQLite. |
| RN-18 | Features que requerem internet (login, criar char, vincular, escrever história, comprar destaque) devem verificar conectividade antes de executar e exibir erro amigável se offline. |
| RN-19 | Mensagem de erro padrão offline: `"⚠️ Sem conexão com a internet. Conecte-se para realizar esta ação."` |
| RN-20 | Não há fila de escrita offline (sem queue/retry automático). O usuário deve reconectar e tentar novamente. |

---

## 12. Fluxos Completos do Usuário

### 12.1 Primeiro Acesso

```
1. Abre o app pela primeira vez
2. Splash screen temática
3. Token UUID é gerado e salvo no SQLite (user_config)
4. Firebase Anonymous Auth cria sessão
5. Sync inicial: busca chars do Firestore → SQLite
6. Navega para Depot (aba Chars em Destaque)
7. Explore normalmente (ler itens, ler histórias de outros aventureiros)
```

### 12.2 Adicionar e Vincular Char

```
1. Vai em Conta (tab)
2. Clica em "➕ Adicionar Char"
3. Digita o nome do char e toca em "🔍 Exiva!"
4. TibiaData API retorna dados do char (nome, nível, vocação, mundo)
5. Dados do char exibidos no painel "Char Localizado"
6. Clica em "➕ Adicionar & Vincular"
7. Tela "Quest de Vínculo" exibe token + instruções da quest
8. Usuário vai em tibia.com, edita o comment do char, cola o token
9. Volta ao app, toca em "✅ Vincular Agora"
10. App consulta TibiaData API, verifica o token no comment
11. Se válido: char vinculado ✅, salvo no Firestore + SQLite
```

### 12.3 Escrever História

```
1. Vai em Conta → Meus Chars
2. Seleciona um char vinculado
3. Clica em "Escrever" (ou "Editar" se já tem história)
4. Preenche título e texto da história
5. Clica em "💾 Salvar História"
6. Feedback: "Seu char agora aparece nas Histórias dos Aventureiros."
7. Dados enviados ao Firestore + atualizados no SQLite
8. Char agora aparece na aba Chars (lista geral)
```

### 12.4 Comprar Destaque

```
1. Vai em Conta → Meus Chars
2. Seleciona um char vinculado e com história escrita
3. Clica no botão "⭐"
4. Tela exibe informações do destaque (3 planos: 7/30/365 dias)
5. Seleciona um plano e clica no botão de compra correspondente
6. In-App Purchase da store é acionado
7. Após confirmação: Firestore atualizado (is_highlighted, highlight_until)
8. Char aparece na aba Depot (destaques) pela duração do plano escolhido
```

---

## 13. Publicação nas Lojas

### 13.1 Pré-requisitos

| Loja         | Requisito                                                    |
| ------------ | ------------------------------------------------------------ |
| Google Play  | Conta de desenvolvedor (~US$25 taxa única)                   |
| Apple Store  | Apple Developer Program (~US$99/ano)                         |
| Ambas        | Ícone 1024x1024, screenshots, descrição, política de privacidade |

### 13.2 Build & Deploy com EAS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar projeto
eas build:configure

# Build Android (APK/AAB)
eas build --platform android --profile production

# Build iOS (IPA)
eas build --platform ios --profile production

# Submit para as lojas
eas submit --platform android
eas submit --platform ios
```

### 13.3 Configuração do `eas.json`

```json
{
  "cli": { "version": ">= 3.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "android": { "track": "production" },
      "ios": { "appleId": "SEU_APPLE_ID" }
    }
  }
}
```

---

## 14. Itens Raros Sugeridos (Seed Inicial)

Lista inicial de itens para popular o banco. O desenvolvedor pode expandir a qualquer momento:

| Item                    | Raridade  | Nota                                  |
| ----------------------- | --------- | ------------------------------------- |
| Golden Armor            | Legendary | Um dos itens mais lendários           |
| Magic Plate Armor       | Rare      | Item icônico desde os primórdios      |
| Blessed Shield          | Legendary | Escudo lendário                       |
| Ferumbras' Hat          | Very Rare | Drop do boss mais famoso              |
| Thunder Hammer          | Legendary | Arma extremamente rara                |
| Demon Helmet            | Rare      | Helm com grande história              |
| Horned Helmet           | Legendary | Um dos itens mais antigos e raros     |
| Winged Helmet           | Legendary | Helm voador lendário                  |
| Dragon Scale Mail       | Rare      | Armadura de escamas                   |
| Havoc Blade             | Very Rare | Arma rara dos primórdios              |
| Annihilation Bear       | Legendary | Item de colecionador                  |
| Warlord Sword           | Rare      | Espada clássica rara                  |
| Great Shield            | Very Rare | Escudo massivo raro                   |
| Pair of Soft Boots      | Rare      | Item funcional com muita história     |
| Surprise Bag (red/blue) | Rare      | Item de evento                        |

> O desenvolvedor preencherá os campos `history` e `myths` manualmente para cada item.

---

## 15. Considerações de Segurança

| Item | Medida |
| ---- | ------ |
| Token | UUID v4 com prefixo `TS-` para evitar conflito com outros serviços que usam o mesmo fluxo. |
| Firestore Rules | Regras para permitir escrita apenas onde `user_token` do documento == `user_token` do request. |
| TibiaData API | Apenas leitura, sem risco. Respeitar rate limit. |
| In-App Purchase | Validar receipt no client (ou futuramente via Cloud Functions se necessário). |
| Dados sensíveis | Nenhum dado pessoal é coletado (sem e-mail, sem nome real). |

### 15.1 Exemplo de Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Personagens: qualquer um lê, só o dono escreve
    match /characters/{charId} {
      allow read: if true;
      allow create: if request.resource.data.user_token is string;
      allow update, delete: if resource.data.user_token == request.resource.data.user_token;
    }

    // Pagamentos: qualquer um lê (para destaques), só o dono cria
    match /highlight_payments/{paymentId} {
      allow read: if true;
      allow create: if request.resource.data.user_token is string;
    }
  }
}
```

---

## 16. Limites do Plano Gratuito Firebase (Spark)

| Recurso                | Limite Gratuito              | Estimativa de Uso      |
| ---------------------- | ---------------------------- | ---------------------- |
| Firestore reads        | 50.000/dia                   | ✅ Suficiente início   |
| Firestore writes       | 20.000/dia                   | ✅ Suficiente          |
| Firestore storage      | 1 GiB                        | ✅ Suficiente          |
| Auth (anonymous)       | Ilimitado                    | ✅ OK                  |
| Cloud Storage          | 5 GB                         | Não utilizado          |
| Bandwidth              | 10 GiB/mês                  | ✅ Monitorar           |

> A estratégia de sync local (SQLite) **reduz drasticamente** o consumo de reads do Firestore, já que a leitura do dia a dia é feita no banco local.

---

## 17. Roadmap de Desenvolvimento

### Fase 0 — Protótipo HTML5 Navegável ✅ (Concluído em 24/02/2026)
- [x] Protótipo HTML5/CSS/JS navegável com visual medieval do Tibia
- [x] Todas as telas implementadas com dados mockados
- [x] Navegação SPA completa (tabs + stack com botão voltar)
- [x] Paleta de cores claro/pergaminho, header/tab bar em vermelho escuro (#8B2020)
- [x] Fontes MedievalSharp (títulos/painéis) e Martel (corpo/UI)
- [x] Ícones das tabs em PNG (Flaticon): castelo, armadura, livro de histórias
- [x] Tela Depot (Home) — Chars em Destaque + Histórias Recentes
- [x] Tela Itens — Listagem com busca, filtro por raridade e ordenação + detalhe com origem/mitos
- [x] Tela Chars — Lista geral com busca (exiva), filtro por vocação/mundo, ordenação por nome/level
- [x] Tela Conta — Token, meus chars, ações (vincular/escrever/editar/destacar)
- [x] Tela Adicionar Char — "Exiva — Localizar Char" com busca mockada
- [x] Tela Quest de Vínculo — Token + instruções da quest + botão "Vincular Agora"
- [x] Tela Editar História — Formulário com título e textarea
- [x] Tela Destacar Char — Preço, informações e botão de compra com glow
- [x] Tela Login — E-mail/senha + Google + Apple + "Esqueceu a senha?"
- [x] Tela Criar Conta — Nome/e-mail/senha + Google + Apple
- [x] Banner AdMob mockado na parte inferior
- [x] 12 itens raros com histórias e mitos detalhados
- [x] 7 personagens com histórias completas (EK, MS, RP, ED, MO)
- [x] Vocação Monk (MO) incluída em filtros e dados mockados
- [x] Textos imersivos com terminologia autêntica de Tibia (exiva, quest de vínculo, mainland, etc.)
- **Arquivos:** `prototype/index.html`, `prototype/styles.css`, `prototype/data.js`, `prototype/app.js`, `prototype/icons/`
- **Referência de texto:** `change-text-plan.md` (glossário completo de substituições)
- **Visualizar:** `cd prototype && python3 -m http.server 8080` → http://localhost:8080

### Fase 1 — Protótipo React Native (MVP) 🎯
- [ ] Setup do projeto Expo + TypeScript + Expo Router
- [ ] Tema visual (cores, fontes, componentes base UI)
- [ ] Estrutura SQLite (tabelas, migrations, seed de itens)
- [ ] Tela Home (layout com lista de destaques — mock data)
- [ ] Tela Itens Raros (listagem + detalhe com história e mitos)
- [ ] Tela Personagens (listagem geral — mock data)
- [ ] Tela História do Char (detalhe)
- [ ] Tela Conta (exibição de token, lista de chars, login/register)
- [ ] Navegação completa entre telas

### Fase 2 — Integração Firebase + TibiaData
- [ ] Setup Firebase (Firestore + Anonymous Auth)
- [ ] CRUD de chars no Firestore
- [ ] Sincronização Firebase ↔ SQLite
- [ ] Integração TibiaData API (Exiva + vinculação)
- [ ] Fluxo completo de adicionar + vincular char (Quest de Vínculo)
- [ ] Fluxo de escrever/editar história

### Fase 3 — Monetização
- [ ] Integração Google AdMob (banner inferior)
- [ ] Integração In-App Purchase (destaque)
- [ ] Fluxo de compra de destaque
- [ ] Lógica de expiração de destaque

### Fase 4 — Polimento & Publicação
- [ ] Splash screen e ícone do app
- [ ] Animações e transições
- [ ] Testes em dispositivos reais (Android + iOS)
- [ ] Política de privacidade
- [ ] Build de produção com EAS
- [ ] Publicação Google Play
- [ ] Publicação Apple Store

---

## 18. Terminologia Imersiva (Glossário Tibia)

O app utiliza termos autênticos do universo de Tibia em todos os textos visíveis ao usuário. Detalhes completos em `change-text-plan.md`.

### 18.1 Mapeamento de Termos

| Conceito no App           | Termo Usado         | Referência Tibia                                      |
| ------------------------- | ------------------- | ----------------------------------------------------- |
| Aba principal             | **Depot**           | Ponto de encontro social em toda cidade de Tibia       |
| Aba de personagens        | **Chars**           | Gíria universal da comunidade ("char" = character)     |
| Buscar personagem         | **Exiva**           | Spell `exiva "name"` — Find Person                    |
| Verificar personagem      | **Vincular**        | "Quest de Vínculo" — vincular char à conta             |
| Processo de verificação   | **Quest de Vínculo**| Quests são missões do jogo                             |
| Instruções da verificação | **Instruções da quest** | Referência a quest logs do jogo                   |
| Token no comment          | **runa**            | Runes = magia armazenada em pedra, item icônico        |
| Servidor                  | **Mundo**           | "Game Worlds" é o termo oficial                        |
| Seção de história do item | **Origem**          | De onde o item veio no mundo                           |
| Jogadores                 | **aventureiros**    | "Greetings, adventurer!" — saudação de NPCs            |
| Personagens em destaque   | **Chars em Destaque** | Chars = gíria autêntica da comunidade                |
| Redirect após login       | **Entrando em mainland** | Mainland = continente principal (vs. Rookgaard)   |
| Subtitle do registro      | **Atravesse o TP**  | TP = Teleport, portais de transporte no jogo           |
| Tela não encontrada       | **Esse TP não leva a lugar algum** | Referência a becos sem saída em caves   |
| Texto de estado vazio     | **Nenhum char em destaque** | Usar "char" em vez de "personagem"          |

### 18.2 Regras de Consistência

- **"Char"** (nunca "personagem") em todo texto visível ao usuário.
- **"Vincular" / "Vinculado"** (nunca "verificar" / "verificado") para o processo de autenticação de posse.
- **"Mundo"** (nunca "servidor") para referir-se a game worlds.
- **"comment"** (nunca "descrição") quando referindo-se ao campo do tibia.com.
- **"tibia.com"** (nunca "site oficial do Tibia") para referência direta.
- **"Quest de Vínculo"** como nome da tela/processo de vinculação.
- **"Exiva"** como ação de busca de personagem (referência ao spell).

---

## 19. Resumo Executivo

| Aspecto              | Decisão                                                       |
| -------------------- | ------------------------------------------------------------- |
| **Framework**        | React Native + Expo (Managed → Dev Client se necessário)      |
| **Navegação**        | Expo Router (file-based, Tab Navigator)                       |
| **Tabs**             | 🏰 Depot · ⚔ Itens · 📖 Chars · ⚙️ Conta                    |
| **Banco local**      | SQLite via expo-sqlite                                        |
| **Banco remoto**     | Firebase Firestore (plano gratuito)                           |
| **Backend**          | Nenhum — tudo client-side + Firebase                          |
| **API de chars**     | TibiaData API v4 (campo `comment` para vinculação por token)  |
| **Design**           | Medieval pergaminho claro (#FFF2DB), header/tab #8B2020       |
| **Fontes**           | MedievalSharp (títulos) + Martel (corpo)                      |
| **Ícones tabs**      | Flaticon PNGs (castle, armor, history-book)                   |
| **Monetização**      | AdMob (banner) + In-App Purchase (destaque: R$5/7d, R$15/30d, R$100/365d) |
| **Publicação**       | Google Play + Apple Store via EAS Build/Submit                |
| **Autenticação**     | Firebase Auth (e-mail/senha + Google Sign-In + Apple Sign-In) |
| **Terminologia**     | Imersiva/Tibia (char, exiva, quest de vínculo, mainland)      |

---

> **Próximo passo:** Criar `execution-plan.md` com o passo a passo detalhado para implementar a Fase 1 (React Native MVP) baseado neste plano geral e no protótipo HTML5 de referência.
