# 📜 Plano de Imersão — Tibia Stories

> **Objetivo:** Substituir todos os textos genéricos do app por termos autênticos do universo de Tibia, baseados em lore oficial (Genesis, deuses, NPCs), mecânicas do jogo (spells, runes, blessings, depot, temple) e gírias da comunidade (char, hunt, loot, SD, UH).
>
> **Regra:** Cada substituição deve ser reconhecível por um jogador de Tibia. Nenhum termo inventado de fantasia medieval genérica.

---

## 📚 Glossário de Referência — Termos Tibia Utilizados

| Termo Tibia | Origem | Significado |
|---|---|---|
| **Depot** | Gameplay | Baú/armazém comunitário em cada cidade; ponto de encontro social dos jogadores |
| **Loot** | Gameplay/Comunidade | Itens obtidos de criaturas ou encontrados; o "espólio" |
| **Rune** | Gameplay | Magia armazenada em pedra — item icônico de Tibia |
| **Exiva** | Spell | `exiva "name"` — feitiço para localizar outro jogador no mundo |
| **Blessing / Bênção** | Gameplay | Proteção divina obtida de NPCs (Spiritual Shielding, Embrace of Tibia, Fire of the Suns, Spark of the Phoenix, Wisdom of Solitude) |
| **Banor** | Lore (Genesis Cap.5) | Deus Guerreiro Divino, primeiro humano, ancestral dos reis de Thais, patrono dos Knights |
| **Fardos** | Lore (Genesis Cap.1) | Deus Criador supremo de todo o universo |
| **Crunor** | Lore (Genesis Cap.4) | Senhor das Árvores, patrono dos Druids |
| **Elane** | Lore (Genesis Cap.6) | Primeira Paladin, filha de Banor |
| **Uman** | Lore (Genesis Cap.5) | Deus da Sabedoria, ensinou a magia aos Sorcerers |
| **Toth** | Lore (Genesis Cap.4) | Guardião das Almas |
| **Nornur** | Lore (Genesis Cap.4) | Deus do Destino |
| **Tibiasula** | Lore (Genesis Cap.2) | Deusa cujo corpo se tornou o mundo de Tibia |
| **Portal of Souls** | Lore (Genesis Cap.7) | Portais pelos quais heróis de outros mundos entram em Tibia |
| **Cyclopedia** | Gameplay | Enciclopédia do jogo (introduzida como feature in-game) |
| **Spellbook** | Gameplay | Livro de magias que todo mago carrega |
| **Temple** | Gameplay | Templo — ponto de respawn e segurança em cada cidade |
| **Mainland** | Gameplay | O continente principal de Tibia (vs. Rookgaard) |
| **Rookgaard** | Gameplay | Ilha inicial onde novos jogadores começam |
| **Thais** | Lore/Gameplay | Capital do reino humano, fundada pelos descendentes de Banor |
| **Tibia Coins (TC)** | Gameplay | Moeda premium do jogo |
| **Skull** | Gameplay | Marca de PvP sobre a cabeça do jogador |
| **NPC** | Gameplay | Non-Player Character — personagens do jogo controlados pelo servidor |
| **Quest** | Gameplay | Missão/aventura no jogo |
| **Hunt** | Comunidade | Caçada — atividade principal dos jogadores |
| **Char** | Comunidade | Abreviação de "character", universalmente usada pelos tibians |
| **SD** | Comunidade | Sudden Death Rune — a rune de ataque mais icônica |
| **UH** | Comunidade | Ultimate Healing Rune |

---

## 🗂️ Mapeamento de Substituições por Tela

### 1. Navegação — Tab Bar (`index.html`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 1.1 | `🏠` (ícone Home) | `🏰` | Castelo — referência às cidades de Tibia (Thais Castle) |
| 1.2 | `Home` | `Depot` | O depot é o ponto de encontro social de toda cidade em Tibia |
| 1.3 | `📦` (ícone Itens) | `<img src="icons/armor.png">` ([Flaticon #286627](https://www.flaticon.com/br/icone-gratis/armaduras_286627)) | Armadura — referência a itens raros / loot valioso |
| 1.6 | `Chars` | `Chars` | ✅ Manter — já é gíria autêntica da comunidade Tibia |
| 1.8 | `Conta` | `Conta` | ✅ Manter — clareza de UX; "Account" é termo do próprio tibia.com |

### 2. Header & Subtítulos (`index.html`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 2.1 | `⚔` (ornamentos do header) | `⚔` | ✅ Manter — referência a armas/combate |
| 2.2 | `Tibia Stories` | `Tibia Stories` | ✅ Manter — nome do app |
| 2.3 | `◄ Voltar` | `◄ Voltar` | ✅ Manter — UX funcional |

### 3. Ad Banner (`index.html`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 3.1 | `📢 Anúncio` | `📢 Anúncio` | ✅ Manter |
| 3.2 | `Tibia Coins — Compre agora no site oficial!` | `Tibia Coins — Compre agora no site oficial!` | ✅ Manter — já usa termo real (Tibia Coins) |

### 4. Tela Home — Destaques (`app.js → renderHome`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 4.1 | `🏰` (empty state icon) | `🏰` | ✅ Manter |
| 4.2 | `Nenhum herói em destaque no momento...` | `Nenhum char em destaque no momento...` | "Campeão" (champion — termo usado em quests) + "abençoado" (blessed — mecânica real de blessings) |
| 4.3 | `⭐ Chars em Destaque` (panel header) | `⭐ Chars em Destaque` | Banor é o Deus Guerreiro Divino, patrono dos heróis humanos. Blessings são mecânica real do jogo |
| 4.5 | `✦ ✦ ✦` (divider) | `✦ ✦ ✦` | ✅ Manter |

### 5. Tela Itens / Loot (`app.js → renderItems`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 5.2 | `Todos` (filtro) | `Todos` | ✅ Manter |
| 5.3 | `🟠 Legendary` | `🟠 Legendary` | ✅ Manter — é a classificação oficial do jogo em inglês |
| 5.4 | `🟣 Very Rare` | `🟣 Very Rare` | ✅ Manter — classificação oficial |
| 5.5 | `🔵 Rare` | `🔵 Rare` | ✅ Manter — classificação oficial |
| 5.6 | `Ordenar:` | `Ordenar:` | ✅ Manter |
| 5.7 | `Raridade ↓` / `Raridade ↑` | `Raridade ↓` / `Raridade ↑` | ✅ Manter |
| 5.10 | `📜 História` (section title no detalhe) | `📜 Origem` | "Origem" — de onde o item veio, sua história no mundo |
| 5.11 | `🔮 Mitos & Lendas` (section title no detalhe) | `🔮 Mitos & Lendas` | ✅ Manter — faz sentido no contexto de Tibia |

### 6. Tela Personagens / Chars (`app.js → renderCharacters`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 6.1 | `Buscar personagem...` (placeholder) | `exiva "nome"...` | `exiva "name"` é o spell Find Person — usado para localizar outros jogadores. Todo tibiano reconhece |
| 6.2 | `Todas` (filtro vocação) | `Todas` | ✅ Manter |
| 6.3 | `⚔️ EK` / `🏹 RP` / `🌿 ED` / `🔥 MS` / `🥋 MO` | ✅ Manter | Já são abreviações autênticas da comunidade Tibia |
| 6.4 | `Servidor:` | `Mundo:` | Em Tibia, os servidores são chamados oficialmente de "Game Worlds" (mundos) |
| 6.5 | `Todos` (filtro servidor) | `Todos` | ✅ Manter |
| 6.6 | `Nenhum personagem encontrado...` | `Nenhum char encontrado...` | "Char" — como NPCs se referem aos jogadores ("Greetings, adventurer!") |

### 7. Tela História do Personagem (`app.js → renderCharacterStory`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 7.3 | `📜` (section title icon para história) | `📜` | ✅ Manter |

### 8. Tela Minha Conta (`app.js → renderAccount`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 8.4 | `✅ Copiado!` | `✅ Copiado!` | ✅ Manter — UX funcional |
| 8.6 | `⚔️ Meus Personagens` (panel header) | `⚔️ Meus Chars` | ✅ Manter |
| 8.7 | `🛡️ Nenhum personagem adicionado` | `🛡️ Nenhum char vinculado` | "Vinculado" — consistente com "Runa de Vínculo" |
| 8.8 | `✅ Verificado` (badge) | `✅ Vinculado` | Consistência com a metáfora de vínculo |
| 8.9 | `⏳ Pendente` (badge) | `⏳ Pendente` | ✅ Manter |
| 8.10 | `Verificar` (botão) | `Vincular` | Consistência |
| 8.11 | `Escrever` (botão) | `Escrever` | ✅ Manter |
| 8.12 | `Editar` (botão) | `Editar` | ✅ Manter |
| 8.13 | `➕ Adicionar Personagem` (botão) | `➕ Adicionar Char` | ✅ Manter |
| 8.14 | `ℹ️ Sobre o App` (panel header) | `ℹ️ Sobre o App` | ✅ Manter |
| 8.17 | `Sair` (botão logout) | `Sair` | ✅ Manter |

### 9. Tela Adicionar Personagem (`app.js → renderAddCharacter`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 9.1 | `Adicionar Personagem` (título) | `Adicionar Char` | ✅ Manter |
| 9.2 | `🔍 Buscar Personagem` (panel header) | `🔍 Exiva — Localizar Char` | **exiva** é o spell Find Person (`exiva "name"`) — todo tibiano reconhece |
| 9.3 | `Nome do Personagem no Tibia` (label) | `Nome do Char no Tibia` | ✅ Manter — clareza |
| 9.4 | `Ex: Bubble, Kharsek...` (placeholder) | `Ex: Bubble, Kharsek...` | ✅ Manter — são nomes reais de jogadores famosos |
| 9.5 | `🔍 Buscar Personagem` (botão) | `🔍 Exiva!` | Spell name como ação |
| 9.6 | `Resultado` (divider) | `Resultado` | ✅ Manter |
| 9.7 | `✅ Personagem Encontrado` (panel header) | `✅ Char Localizado` | "Aventureiro" — como NPCs chamam jogadores |
| 9.8 | `➕ Adicionar & Verificar` (botão) | `➕ Adicionar & Vincular` | Consistência com "vínculo" |
| 9.9 | `⚠️ Char não encontrado. Verifique o nick e tente novamente.` | `⚠️ Char não encontrado. Verifique o nick e tente novamente.` | Aventureiro |
| 9.10 | `ℹ️ O nome deve ser exatamente como aparece no site oficial do Tibia. A busca utiliza a API pública TibiaData.` | `ℹ️ O nome deve ser exatamente como aparece em tibia.com. A busca utiliza a API pública TibiaData.` | Simplificação + referência direta ao site |

### 10. Tela Verificar/Vincular Personagem (`app.js → renderVerifyCharacter`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 10.1 | `Verificar Personagem` (título da tela) | `Quest de Vínculo` | "Ritual" — referência aos diversos rituais em quests de Tibia (Inquisition Quest, rituais de magia). "Vínculo" — binding |
| 10.2 | `🔐 Verificar: ${charName}` (panel header) | `🔐 Quest de Vínculo: ${charName}` | Ritual + Vínculo |
| 10.3 | `Para provar que ... é seu char, cole o token abaixo na descrição dele no site oficial do Tibia.` | `Para vincular ... à sua conta, cole o token abaixo no comment dele em tibia.com.` | Rune + vínculo + referência exata ao site |
| 10.6 | `📋 Passo a Passo` (panel header) | `📋 Instruções da quest` | Ritual |
| 10.7 | `Copie o token acima tocando no botão "Copiar Token".` | `Copie o token acima tocando no botão "Copiar Token".` | Rune |
| 10.8 | `Acesse tibia.com no navegador e faça login na sua conta.` | `Acesse tibia.com e faça login na sua conta.` | Simplificação |
| 10.9 | `Vá em My Account → Edit Comment.` | `Vá em My Account → Edit Comment.` | ✅ Manter — caminho exato no site oficial |
| 10.10 | `Cole o token em qualquer parte da descrição do personagem e clique em salvar.` | `Cole o token em qualquer parte do comment do char e salve.` | Rune + "comment" (termo usado no tibia.com) |
| 10.11 | `Volte aqui e toque em "Verificar Agora".` | `Volte aqui e toque em "Vincular Agora".` | Vínculo |
| 10.12 | `✅ Verificar Agora` (botão) | `✅ Vincular Agora` | Vínculo |
| 10.13 | `⏳ A verificação pode levar até 5 minutos após a edição no site, pois a API externa possui cache. Seja paciente!` | `⏳ A quest pode levar até 5 minutos, pois a API do TibiaData possui cache. Seja paciente, aventureiro!` | Ritual + aventureiro |
| 10.14 | `ℹ️ Após a verificação bem-sucedida, você pode remover o token da descrição do personagem se desejar.` | `ℹ️ Após o fim da quest de vínculo, você pode remover a runa do comment do personagem se desejar.` | Vínculo + runa + "comment" |

### 11. Mensagens de Feedback — Verificação (`app.js → mockVerify`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 11.1 | `✅ Personagem verificado com sucesso!` | `✅ Personagem vinculado com sucesso!` | Vínculo |

### 12. Tela Editar História (`app.js → renderEditStory`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 12.4 | `Ex: A Lenda de Antica...` (placeholder) | `Ex: A Lenda de Antica...` | ✅ Manter — Antica é um dos mundos mais famosos de Tibia |
| 12.6 | `Conte a história do seu personagem... suas aventuras, conquistas, guerras, amizades e tudo que tornou sua jornada em Tibia única.` (placeholder) | `Conte as aventuras do seu char... hunts épicas, quests lendárias, guerras, amizades e tudo que tornou sua jornada em Tibia única.` | "Hunts" e "quests" — termos reais do jogo usados diariamente pela comunidade |
| 12.7 | `✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser. Outros jogadores poderão ler na aba de Personagens.` | `✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser. Outros aventureiros poderão ler na aba de Chars.` | Crônica + aventureiros + "Chars" (nome real da aba) |

### 13. Mensagens de Feedback — Salvar História (`app.js → mockSaveStory`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 13.2 | `Seu personagem agora aparece na lista de Personagens & Histórias.` | `Seu char agora aparece nas Histórias dos Aventureiros.` | Nome exato da seção no app |

### 14. Tela Destacar Personagem (`app.js → renderHighlight`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 14.1 | `Destacar Personagem` (título da tela) | `Destacar char` | **Blessing** — mecânica real de Tibia. Bênçãos são compradas de NPCs especiais (Norf, Humphrey, Edala, etc.) |
| 14.4 | `R$ 5,00` | `R$ 5,00` | ✅ Manter |
| 14.7 | `✦ A compra é processada pela App Store / Google Play.` | ✅ Manter | Informação funcional |

### 15. Mensagens de Feedback — Compra (`app.js → mockPurchase`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|

### 16. Tela Login (`app.js → renderLogin`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 16.1 | `📖` (ícone) | `📜` | Pergaminho |
| 16.2 | `Tibia Stories` (título) | `Tibia Stories` | ✅ Manter |
| 16.3 | `Entre para gerenciar seus personagens e histórias` | `Entre para gerenciar seus chars e histórias` | Crônica |
| 16.4 | `🔑 Entrar` (panel header) | `🔑 Entrar` | ✅ Manter — clareza |
| 16.5 | `E-mail` / `Senha` / `seu@email.com` / `Sua senha` | ✅ Manter | UX funcional |
| 16.6 | `Entrar` (botão) | `Entrar` | ✅ Manter |
| 16.7 | `Esqueceu a senha?` | `Esqueceu a senha?` | ✅ Manter |
| 16.8 | `Um e-mail de recuperação será enviado.` (alert) | `Um e-mail de recuperação será enviado.` | ✅ Manter |
| 16.9 | `— ou —` | `— ou —` | ✅ Manter |
| 16.10 | `Entrar com Google` / `Entrar com Apple` | ✅ Manter | UX funcional |
| 16.11 | `Não tem conta?` | `Não tem conta?` | ✅ Manter |
| 16.12 | `Criar Conta` (link) | `Criar Conta` | ✅ Manter |

### 17. Mensagens de Feedback — Login (`app.js → mockLogin`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 17.1 | `✅ Login realizado com sucesso!` | `✅ Login realizado com sucesso!` | ✅ Manter |
| 17.2 | `Redirecionando para sua conta...` | `Entrando em mainland...` | **Mainland** — o continente principal de Tibia. Referência ao momento em que o jogador sai de Rookgaard e chega ao "mundo real" |

### 18. Tela Criar Conta / Register (`app.js → renderRegister`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 18.1 | `🛡️` (ícone) | `🛡️` | ✅ Manter |
| 18.2 | `Criar Conta` (título) | `Criar Conta` | ✅ Manter |
| 18.3 | `Junte-se à comunidade de Tibia Stories` | `Atravesse o TP e junte-se à comunidade de Tibia Stories` | **Portal of Souls** — na lore de Tibia, heróis de outros mundos entram em Tibia através dos Portais das Almas (Genesis Cap.7) |
| 18.4 | `✏️ Dados da Conta` (panel header) | `✏️ Dados da Conta` | ✅ Manter — clareza |
| 18.5 | `Nome (opcional)` / `E-mail` / `Senha` / `Confirmar Senha` | ✅ Manter | UX funcional |
| 18.6 | `Como quer ser chamado?` (placeholder) | `Como quer ser chamado?` | ✅ Manter |
| 18.7 | `Criar Conta` (botão) | `Criar Conta` | ✅ Manter |
| 18.8 | `Registrar com Google` / `Registrar com Apple` | ✅ Manter | UX funcional |
| 18.9 | `Já tem conta?` / `Entrar` | ✅ Manter | UX funcional |

### 19. Mensagens de Feedback — Register (`app.js → mockRegister`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 19.1 | `✅ Conta criada com sucesso!` | `✅ Conta criada com sucesso!` | ✅ Manter |

### 20. Mensagens de Estado Vazio / Erro (`app.js`)

| # | Texto Atual | Texto Novo | Referência Tibia |
|---|---|---|---|
| 20.1 | `❓ Tela não encontrada` | `❓ Esse TP não leva a lugar algum...` | Referência à exploração de Tibia — becos sem saída em caves |
| 20.3 | `Personagem não encontrado` | `Char não encontrado` | Aventureiro |

---

## 📊 Resumo das Mudanças

### Termos-chave do novo vocabulário:

| Conceito no App | Termo Anterior (genérico) | Termo Novo (Tibia) | Referência |
|---|---|---|---|
| Token de verificação | Token | **Runa (de Vínculo)** | Runes — magia armazenada em pedra, item icônico de Tibia |
| Processo de verificação | Verificar / Verificação | **Vincular / Ritual de Vínculo** | Rituais existem em diversas quests (Inquisition, PoI, etc.) |
| Destaque na Home | Destaque / Destacar | **Blessing / Abençoar** | Blessings — proteção divina real do jogo (Spiritual Shielding, Embrace of Tibia, etc.) |
| Tela principal | Home | **Depot** | Depot — ponto de encontro e armazenamento em toda cidade de Tibia |
| Lista de itens | Itens | **Loot** | Loot — termo universal para itens obtidos no jogo |
| Histórias | Histórias | **Crônicas** | Gênero literário medieval; livros do jogo são chamados de books/chronicles |
| Jogadores em geral | Usuários / Jogadores | **Aventureiros** | "Greetings, adventurer!" — saudação clássica dos NPCs de Tibia |
| Personagens destacados | Heróis em Destaque | **Abençoados por Banor** | Banor — Deus Guerreiro Divino, patrono dos heróis (Genesis Cap.5) |
| Busca de personagem | Buscar | **Exiva** | `exiva "name"` — spell Find Person do jogo |
| Registro | Junte-se à comunidade | **Atravesse o Portal of Souls** | Portais das Almas — como heróis entram em Tibia (Genesis Cap.7) |

### Estatísticas:
- **Total de strings mapeadas:** ~90
- **Strings alteradas:** ~50
- **Strings mantidas (já adequadas):** ~40
- **Termos de lore utilizados:** Banor, Fardos, Tibiasula, Portal of Souls, Mainland, Rookgaard
- **Termos de gameplay utilizados:** Rune, Blessing, Depot, Loot, Exiva, Quest, Hunt, Temple, Char
- **Termos da comunidade mantidos:** Char, EK, RP, ED, MS, MO, SD, UH, TC

---

## 📎 Notas de Implementação

1. **Não alterar cores, fontes ou layout** — este plano cobre apenas texto/conteúdo
2. **Arquivos afetados:**
   - `prototype/index.html` — tabs, header, ad banner
   - `prototype/app.js` — todas as telas e mensagens de feedback
3. **Ordem sugerida de implementação:**
   - Primeiro: Tab bar (impacto visual imediato)
   - Segundo: Tela Account (token → runa é a mudança mais significativa)
   - Terceiro: Tela Add/Verify Character (exiva + ritual)
   - Quarto: Telas Home e Items (headers)
   - Quinto: Mensagens de feedback
4. **Testes necessários:** Verificar que nenhum termo ficou inconsistente (ex: "token" sobrevivendo em algum lugar quando o resto já diz "runa")
