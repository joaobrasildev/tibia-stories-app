# Tibia Stories App — Instruções para o Agent

## Projeto
Aplicativo mobile React Native + Expo para a comunidade do MMORPG Tibia. Histórias de itens lendários e personagens de jogadores.

## Documentação obrigatória
Antes de criar ou modificar qualquer arquivo, **leia os documentos abaixo** na raiz do projeto:

1. **`execution-plan.md`** — Plano de execução faseado. Identifique a fase atual (primeira com status ⬜) e siga os passos na ordem.
2. **`architecture.md`** — Padrões de arquitetura, templates de código, estrutura de pastas. Consulte APENAS as seções indicadas pelo execution-plan.
3. **`general-plan.md`** — Especificações completas: telas, textos, modelos de dados, regras de negócio. Consulte APENAS as seções indicadas pelo execution-plan.

## Regras invioláveis
- **NÃO toque na pasta `prototype/`** — é o protótipo HTML5 de referência.
- **Sempre consulte o protótipo antes de criar qualquer tela** — O `prototype/app.js` é a referência visual definitiva. Antes de implementar um layout, leia a função `render` correspondente no protótipo (ex: `renderHome`, `renderItems`, `renderAccount`) e replique a estrutura, ordem dos elementos, textos e hierarquia visual. O `prototype/styles.css` é a referência para cores, espaçamentos e bordas.
- **NÃO mude as cores do header/tab bar** — `#8B2020` (gradiente `#A02828 → #8B2020 → #6E1818`). Foram ajustadas manualmente pelo usuário.
- **NÃO use Expo Router** — o projeto usa React Navigation 7 (Material Top Tabs + NativeStack). As tabs ficam na parte **inferior** da tela (`tabBarPosition: 'bottom'`), igual ao protótipo.
- **Zero inline styles** — todo estilo vem de `src/theme/index.ts`.
- **React.memo** em todo componente base/ e composed/.
- **Componentes nunca acessam stores** — recebem apenas props primitivas.
- **Rules são funções puras** — zero imports de React, Zustand, SQLite ou Firebase.
- **Path alias `@/`** → `src/`. Nunca use `../../../`.
- **Naming**: `PascalCase.tsx` (componentes), `camelCase.ts` (lógica), `useXxxStore.ts` (stores).

## Terminologia do app
O app usa termos autênticos de Tibia. Siga exatamente o que o protótipo (`prototype/app.js`) usa em cada contexto:
- **"Char"** é o termo principal, mas **"personagem"** também aparece no protótipo em frases descritivas (ex: "Ao destacar seu personagem", "personagem verificado"). Use o mesmo termo que o protótipo usa em cada texto.
- **"Depot"** — nome da aba principal (Home).
- **"Exiva"** — busca de char (referência ao spell).
- **"Quest de Vínculo"** — processo de vincular char à conta. Mas **"verificar"** e **"verificado"** também aparecem no protótipo (ex: "personagem verificado", "verificar que um personagem é seu"). Manter o que o protótipo usa.
- **"Mundo"** (nunca "servidor") para game worlds — exceto em comentários de código onde "servidor" pode aparecer.
- **"runa"** — referência ao token no comment do char.
- **"mainland"** — referência ao app principal após login.
- **"comment"** (nunca "descrição") para o campo de tibia.com — ⚠️ exceto na linha do protótipo que usa "descrição" (ver `app.js` linha 435), que deve ser corrigida para "comment" no React Native.
- Na dúvida, **consulte o protótipo** (`prototype/app.js`) como referência final para o texto exato.

## Stack
React Native ~0.76, Expo SDK 52+, TypeScript strict, React Navigation 7, Zustand 5.x, expo-sqlite (sync API, WAL), Firebase Firestore + Auth, TibiaData API v4, react-native-google-mobile-ads, expo-in-app-purchases.
