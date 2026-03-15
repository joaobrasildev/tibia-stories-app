# Plano de Reestruturação — Itens

## 1. Objetivo

Reestruturar o modelo de dados dos itens para:

1. **Nova estrutura de campos** — substituir `history` + `myths` por 4 campos mais granulares (`summary`, `origin`, `lore`, `myths`).
2. **Migrar itens para o Firestore** — permitir adicionar/editar itens sem precisar publicar nova versão do app.
3. **Manter o padrão Firestore → SQLite** — mesmo pattern usado para characters: o app consome apenas SQLite local, e sincroniza do Firestore ao abrir o app (se online).

---

## 2. Nova estrutura de dados

### 2.1 Campos atuais (SQLite)

```
items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  image_url TEXT,
  rarity TEXT NOT NULL,
  history TEXT,           ← mistura fatos reais + lore fictícia
  myths TEXT,             ← mistura mitos da comunidade + lore
  created_at TEXT,
  updated_at TEXT
)
```

### 2.2 Campos novos

```
items (
  id TEXT PRIMARY KEY,        ← muda para TEXT (doc ID do Firestore, ex: "blessed-shield")
  name TEXT NOT NULL,
  image_url TEXT,
  rarity TEXT NOT NULL,
  summary TEXT,               ← NOVO: resumo breve (2-3 frases)
  origin TEXT,                ← RENOMEADO de "history": história real (fatos verificáveis)
  lore TEXT,                  ← NOVO: lore fictícia do universo Tibia
  myths TEXT,                 ← MANTIDO: mitos e lendas da comunidade
  sources TEXT,               ← NOVO: nomes dos sites de referência (sem links)
  created_at TEXT,
  updated_at TEXT
)
```

### 2.3 Descrição dos campos

| Campo | Conteúdo | Exemplo (Blessed Shield) |
|---|---|---|
| **`summary`** | Resumo breve (2-3 frases). Texto introdutório na tela, pode ser usado em previews futuros. | "Introduzido no início do Tibia (1999). Não possui drop de criatura e nunca teve método de obtenção via gameplay. Foi concedido manualmente pela CipSoft como recompensa." |
| **`origin`** | **Fatos reais**: como surgiu no jogo, quem criou, como é obtido, eventos notáveis com datas/jogadores/valores, nerfs, updates. | Presente ao Elleshar por contribuição gráfica, venda para Muecil, leilão de Lightbringer, venda de 12 bilhões em 2022, nerf de def 50→40 no Update 7.0. |
| **`lore`** | **Lore fictícia do Tibia**: flavor text, backstory in-game, mitologia dos deuses/raças, conexões com NPCs e quests. | "The shield grants divine protection." Referência a Banor, proteção divina, significado dentro do universo. |
| **`myths`** | **Mitos da comunidade**: teorias de jogadores, lendas urbanas, crenças populares, fakes desmentidas. | Mito do drop de monstros, quest secreta de Banor, existência de múltiplos shields, crença de proteção mágica contra demons. |
| **`sources`** | **Referências**: nomes dos sites utilizados como fonte, separados por vírgula. Sem links — apenas os nomes para credibilidade. | "TibiaWiki (Fandom), TibiaWiki Brasil, TibiaQA, Portal Tibia, Tibia Light" |

### 2.4 Layout da tela de detalhe

```
┌─────────────────────────────┐
│      [Imagem + Nome]        │
│      [Badge Raridade]       │
│                             │
│   Texto do summary          │  ← sem header de seção
│                             │
│   📜 Origem                 │  ← origin
│   [parágrafos]              │
│                             │
│   📖 Lore                   │  ← lore (NOVA seção)
│   [parágrafos]              │
│                             │
│   🔮 Mitos & Lendas         │  ← myths
│   [parágrafos]              │
│                             │
│   ─────────────────────     │
│   📚 Fontes: TibiaWiki...   │  ← sources (texto discreto, menor, ao final)
└─────────────────────────────┘
```

---

## 3. Mapeamento de conteúdo — nada fica de fora

Abaixo, cada seção dos 3 arquivos de `items-description-temp/` mapeada para o campo correspondente.

### 3.1 Blessed Shield (`blessed_shield.txt`)

| Seção do arquivo | Campo |
|---|---|
| "Resumo rápido" (introduzido em 1999, sem drop, concedido ao Elleshar...) | `summary` |
| "Origem do Blessed Shield" — contexto histórico CipSoft, voluntários de gráficos | `origin` |
| "O jogador Elleshar" — como recebeu o shield, motivo da entrega | `origin` |
| "A primeira versão" — def 50 → 40, nerf do patch 7.0 | `origin` |
| "Primeira venda" — Elleshar → Muecil por 130k gold, promessa de nunca revender | `origin` |
| "O leilão que quebrou a promessa" — Muecil leiloa, Lightbringer vence por 5M + rares | `origin` |
| "Lightbringer e o mistério da venda" — revenda, oferta impossível de recusar, lenda da proposta | `origin` |
| "Donos posteriores" — Elleshar → Muecil → Lightbringer → Gryphee → Lost Planegazer | `origin` |
| "Um dos itens mais valiosos" — bilhões em gold, coleções inteiras | `origin` |
| "O quase desaparecimento" — dono banido, medo da deleção, transferência antes da exclusão | `origin` |
| "Status atual" / "Importância cultural" — símbolo de raridade, economia, colecionismo | `origin` |
| Flavor text: "The shield grants divine protection." — conexão com Banor, significado in-game | `lore` |
| "Mito 1 — Drop de monstros" (Morgaroth, Demon, Ferumbras) — nunca confirmado | `myths` |
| "Mito 2 — Quest secreta de Banor" — never confirmed | `myths` |
| "Mito 3 — Existência de vários Blessed Shields" | `myths` |
| "Crenças sobre o poder" — proteção divina, reduzir dano mágico, escudo anti-demon | `myths` |
| "O Blessed Shield em Hellgate" — screenshots falsos, crença de quest secreta | `myths` |
| Fontes: tibia.fandom.com, tibialight.com, tibiaqa.com, tibiawiki.com.br, portaltibia.com.br | `sources` → "TibiaWiki (Fandom), Tibia Light, TibiaQA, TibiaWiki Brasil, Portal Tibia" |

### 3.2 Thunder Hammer (`thunder_hammer.txt`)

| Seção do arquivo | Campo |
|---|---|
| "Introdução" (arma icônica, club mais poderosa, introduzida na v6.4) | `summary` |
| "Lore dentro do universo" — Khundahamar, ferreiros anões cativos, Kazrad Rockfist, abençoado pelos deuses, "libertador" | `lore` |
| Flavor text: "It is blessed by the gods of Tibia." | `lore` |
| "Primeiros anos" — atributos (atk 49, def 35+1), fama, raridade extrema | `origin` |
| "Os primeiros Thunder Hammers existentes" — história dos primeiros exemplares | `origin` |
| "Convenção de Tibia (2002)" — Patryn recebe TH como presente, dá para Pytru no Natal | `origin` |
| "Recebido por reportar bugs" — Krin no Eternia, recompensa de segurança | `origin` |
| "Obtido ilegalmente" — Warrax, GM comprado Ender Speaker of the Dead, Behemoth Quest exploit, deleção | `origin` |
| "A Demon Quest especial de Premia" — evento de 16/06/2002, demon em Darashia, grupo vence, loot TH, vendido para Antica | `origin` |
| "A Era dos Bosses" — Orshabaal 26/08/2005, Elahrion Avessar loota primeiro TH de boss mundial, "Gritei na vida real" | `origin` |
| "Em coleções de rares" — símbolo de status, decoração, exibição em casas, Silver Mace | `origin` |
| "Importância histórica" / "Situação atual" — item histórico, era clássica, dado por GMs | `origin` |
| "Mito 1 — Quest secreta da Basilisk" — martelo de Thor roubado, serpente gigante, sala subterrânea | `myths` |
| "Mito 2 — Ligação com Thor" — Mjölnir, quest mitológica, nunca confirmado | `myths` |
| "Mito 3 — Martelo perdido nas minas" — baseado na história do Khundahamar, sem quest encontrada | `myths` |
| "Mito 4 — Fake da sala da cobra" — screenshot falso, confirmado como fake | `myths` |
| Fontes: tibia.fandom.com, tibiawiki.com.br, portaltibia.com.br, tibiamisteriosdatabase, tibiaqa.com | `sources` → "TibiaWiki (Fandom), TibiaWiki Brasil, Portal Tibia, Tibia Mistérios Database, TibiaQA" |

### 3.3 Chayenne's Magical Key (`chayennes_key.txt`)

| Seção do arquivo | Campo |
|---|---|
| "Resumo" (adicionada v9.44, 15º aniversário, Dragenas, Realm of Dreams Quest, Music Box) | `summary` |
| "13 de janeiro de 2012" — adição à versão 9.44 | `origin` |
| "Agosto de 2012 — despedida de Chayenne" — CM anuncia saída, confirma que chave tem uso | `origin` |
| "19 de agosto de 2012" — Dragenas (Secura) desvenda o local, posta screenshots | `origin` |
| "20 de agosto de 2012" — Chayenne's Farewell Contest, vencedores: Abiston, Azurai, Jinxz | `origin` |
| "Agosto–Outubro 2012" — thread massiva no Otland (1900+ posts), cooperação comunitária | `origin` |
| "Observação sobre datas conflitantes" — "9 meses para resolver" é community claim | `origin` |
| "Quem participou da descoberta" — Dragenas, Abiston, Azurai, Jinxz, comunidade coletiva | `origin` |
| "Disponibilidade / raridade / mercado" — loot do monstro Chayenne, Yellow BE worlds, tens of millions GP | `origin` |
| "Panorama da investigação comunitária" — enigma real, caça intelectual, evento marcante | `origin` |
| "Como a solução foi encontrada" — pistas textuais in-game, Dragon Graveyard, livro Key to Magic em Draconia, mecânica (fire field, lever, magic wall, teleport) | `lore` |
| Descrição do item: "No one really knows where it leads to, but the dragon graveyard might reveal the secret" | `lore` |
| "Recompensas" — Beach Backpack, Music Box, Blue Rose, Dracoyle Statue, Chayenne's Realm | `lore` |
| "Mito: a chave não teria propósito" — desmentido por Chayenne | `myths` |
| "Mito: Music Box domestica qualquer criatura" — meio-mito, funciona só em lista específica | `myths` |
| Fontes: tibia.fandom.com, tibiawiki.com.br, otland.net, tibia.com, tibiapedia.com | `sources` → "TibiaWiki (Fandom), TibiaWiki Brasil, OTLand, Tibia.com, TibiaPedia" |

---

## 4. Migração para Firestore

### 4.1 Modelo no Firestore

**Collection**: `items`  
**Document ID**: slug do item (ex: `blessed-shield`, `thunder-hammer`)

Campos do documento:
```
{
  name: "Blessed Shield",
  image_url: "https://...",
  rarity: "Legendary",
  summary: "...",
  origin: "...",
  lore: "...",
  myths: "...",
  sources: "TibiaWiki (Fandom), TibiaWiki Brasil, TibiaQA, Portal Tibia, Tibia Light",
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### 4.2 Regras de segurança (Firestore Rules)

```
match /items/{itemId} {
  allow read: if true;                  // leitura pública (qualquer user, autenticado ou não)
  allow write: if false;                // escrita bloqueada pelo client — itens são gerenciados via Firebase Console ou admin
}
```

- **Read público**: o app precisa buscar os itens sem exigir login (itens são visíveis para todos).
- **Write bloqueado**: nenhum client pode escrever. Novos itens são adicionados via Firebase Console ou script admin.

### 4.3 Fluxo de sync (mesmo pattern de characters)

**Pattern atual (chars):**
```
Boot → syncIfOnline() → fetchAllCharacters() → upsertCharacter() (loop) → SQLite atualizado
Pull-to-refresh → syncFromFirestore() → mesmo fluxo acima
```

**Pattern novo (itens):**
```
Boot → syncIfOnline() → fetchAllItems() + fetchAllCharacters() → upsertItem() (loop) → SQLite atualizado
Pull-to-refresh → syncFromFirestore() → mesmo fluxo acima (chars + items)
```

O app continua consumindo **apenas o SQLite** em toda a UI. O Firestore é acessado apenas:
- **No boot** (se online) — `syncIfOnline()`
- **No pull-to-refresh** — `syncFromFirestore()`

### 4.4 Seed local como fallback

O seed local permanece como fallback para **primeiro uso offline**:
- Se o user instalar o app sem internet, ele verá os itens do seed.
- Na próxima vez que tiver conexão, o sync do Firestore sobrescreve o SQLite com dados atualizados.
- O `ITEMS_SEED_VERSION` continua existindo para controlar o seed inicial.
- O campo `updated_at` resolve conflitos: dados do Firestore são mais recentes e vencem no `INSERT OR REPLACE`.

---

## 5. Arquivos a modificar — Checklist

### Fase A: Novo schema + campos no app (sem Firestore ainda)

#### A1. `src/types/item.ts`
- [ ] Mudar `id` de `number` para `string`
- [ ] Remover campo `history`
- [ ] Adicionar campos `summary`, `origin`, `lore`, `sources`
- [ ] Manter `myths`

#### A2. `src/repositories/migrations.ts`
- [ ] Alterar `CREATE TABLE items`: `id TEXT PRIMARY KEY` (sem AUTOINCREMENT), novos campos `summary`, `origin`, `lore`, substituir `history`
- [ ] Bumpar `ITEMS_SEED_VERSION`
- [ ] Reescrever array de seed com os 5 novos campos para os 12 itens (summary, origin, lore, myths, sources)
- [ ] Atualizar INSERT no loop de seed para refletir novos campos

#### A3. `src/repositories/itemsRepository.ts`
- [ ] Atualizar tipo do parâmetro `id` de `number` para `string` em `getItemById()`
- [ ] Atualizar `seedItems()`: INSERT statement com novos campos (`summary`, `origin`, `lore`, `myths`, `sources` substituindo `history`, `myths`)
- [ ] Adicionar função `upsertItem()` (para o sync com Firestore — mesmo pattern do `upsertCharacter()`)

#### A4. `src/screens/ItemDetailScreen.tsx`
- [ ] Adicionar renderização do `summary` (texto introdutório abaixo dos badges, sem header de seção)
- [ ] Renomear `item.history` → `item.origin` na seção "📜 Origem"
- [ ] Adicionar nova seção "📖 Lore" para `item.lore`
- [ ] Manter seção "🔮 Mitos & Lendas" com `item.myths`
- [ ] Adicionar renderização de `sources` no final (texto discreto/menor, estilo "📚 Fontes: TibiaWiki, Portal Tibia...")

#### A5. `src/constants/app.ts`
- [ ] Adicionar `loreTitle: '📖 Lore'` em `APP_TEXTS.itemDetail`
- [ ] Adicionar `sourcesTitle: '📚 Fontes'` em `APP_TEXTS.itemDetail`

#### A6. `src/rules/itemRules.ts`
- [ ] Verificar se há referências ao campo `history` — se houver, atualizar para `origin`

#### A7. `src/stores/useItemsStore.ts`
- [ ] Nenhuma mudança funcional esperada (usa `loadItems()` → `getAllItems()` → `SELECT *`), mas verificar tipagem

#### A8. `src/navigation/AppNavigator.tsx`
- [ ] Atualizar tipo do param `id` de `number` para `string` em `RootStackParamList.ItemDetail`

#### A9. `src/screens/ItemsScreen.tsx`
- [ ] Verificar se passa `id` como number na navegação — atualizar para string

---

### Fase B: Firestore integration

#### B1. `src/constants/firebase.ts`
- [ ] Adicionar `items: 'items'` em `FIREBASE_COLLECTIONS`

#### B2. `firestore.rules`
- [ ] Adicionar regra para collection `items`: read público, write bloqueado

#### B3. `src/services/firestoreService.ts`
- [ ] Adicionar `mapDocToItem()` — mapper Firestore doc → Item type
- [ ] Adicionar `fetchAllItems()` — busca todos os itens da collection `items`, ordenados por `name`

#### B4. `src/services/syncService.ts`
- [ ] Importar `fetchAllItems` do firestoreService
- [ ] Importar `upsertItem` do itemsRepository
- [ ] Expandir `syncFromFirestore()` para sincronizar **items** além de characters:
  ```
  const [characters, items] = await Promise.all([
    fetchAllCharacters(),
    fetchAllItems(),
  ]);
  for (const char of characters) upsertCharacter(char);
  for (const item of items) upsertItem(item);
  ```

#### B5. `src/hooks/useSync.ts`
- [ ] Após `syncFromFirestore()`, chamar `useItemsStore.getState().loadItems()` além do `useCharsStore.getState().loadChars()` existente — para a UI refletir itens novos do Firestore

#### B6. `src/hooks/useInitApp.ts`
- [ ] Nenhuma mudança necessária — o `syncIfOnline()` no passo 6 do boot já chama `syncFromFirestore()`, que agora incluirá items

#### B7. Seed no Firestore (one-time)
- [ ] Criar script ou fazer manualmente no Firebase Console: inserir os 12 itens na collection `items` com os 5 novos campos
- [ ] Garantir que os document IDs são slugs consistentes (ex: `golden-armor`, `magic-plate-armor`)

---

### Fase C: Atualizar protótipo (referência visual)

#### C1. `prototype/data.js`
- [x] Atualizar objetos dos itens: `history` → `origin`, adicionar `summary` e `lore`

#### C2. `prototype/app.js`
- [x] Em `renderItemDetail()`: adicionar renderização de `summary` e seção `lore`

---

### Fase D: Documentação

#### D1. `general-plan.md`
- [x] Atualizar modelo de dados do item (seção correspondente)
- [x] Atualizar descrição da tela 2.1 (Detalhe do Item) com as novas seções

#### D2. `architecture.md`
- [x] Atualizar schema de items
- [x] Atualizar referência ao syncService (agora sincroniza items também)
- [x] Atualizar referência ao firestoreService (nova função fetchAllItems)

#### D3. `execution-plan.md`
- [x] Atualizar referências "Origem + Mitos" para incluir "Lore"

---

## 6. Ordem de execução sugerida

| Passo | Fase | Descrição |
|---|---|---|
| 1 | A1 | Atualizar types (`item.ts`) |
| 2 | A2 | Atualizar migrations (schema + seed) |
| 3 | A3 | Atualizar repository (`itemsRepository.ts` — novas queries + `upsertItem`) |
| 4 | A5 | Atualizar constantes (`app.ts` — novo título Lore) |
| 5 | A4 | Atualizar tela de detalhe (`ItemDetailScreen.tsx`) |
| 6 | A6-A9 | Atualizar rules, store, navigation, ItemsScreen (ajustes de tipo `id`) |
| 7 | — | **Testar app** — verificar que tudo funciona com dados locais |
| 8 | B1 | Adicionar collection items nas constantes Firebase |
| 9 | B2 | Atualizar Firestore rules |
| 10 | B3 | Adicionar fetch de items no firestoreService |
| 11 | B4 | Expandir syncService para sincronizar items |
| 12 | B5 | Atualizar useSync para recarregar items na UI |
| 13 | B7 | Seed dos 12 itens no Firestore (Console ou script) |
| 14 | — | **Testar sync completo** — verificar que items do Firestore atualizam o SQLite |
| 15 | C1-C2 | Atualizar protótipo |
| 16 | D1-D3 | Atualizar documentação |

---

## 7. Impacto resumido

| Escopo | Arquivos | Complexidade |
|---|---|---|
| Types | 1 (`item.ts`) | Baixa |
| Database + Seed | 2 (`migrations.ts`, `itemsRepository.ts`) | Média |
| Tela | 1 (`ItemDetailScreen.tsx`) | Baixa |
| Constantes | 2 (`app.ts`, `firebase.ts`) | Trivial |
| Firestore Rules | 1 (`firestore.rules`) | Trivial |
| Services | 2 (`firestoreService.ts`, `syncService.ts`) | Média |
| Hooks | 1 (`useSync.ts`) | Baixa |
| Navigation/Screens | 2 (`AppNavigator.tsx`, `ItemsScreen.tsx`) | Baixa |
| Protótipo | 2 (`data.js`, `app.js`) | Média |
| Documentação | 3 (`general-plan.md`, `architecture.md`, `execution-plan.md`) | Baixa |
| **Total** | **~17 arquivos** | — |

### Riscos
- **Mudança de `id` de `number` para `string`**: impacta navegação e qualquer lugar que passe `id` como parâmetro. Precisa revisar todos os usos.
- **Seed como fallback**: se o formato do seed local ficar defasado em relação ao Firestore, o user offline verá dados antigos. O sync ao reconectar resolve isso.
- **Conteúdo dos 12 itens**: reescrever o texto de cada item nos 4 campos é o trabalho mais pesado (mas é conteúdo, não código).
