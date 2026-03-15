/* ============================================================
   TIBIA STORIES — DADOS MOCKADOS DO PROTÓTIPO
   ============================================================ */

// Token do usuário mockado
const USER_TOKEN = 'TS-f47ac10b-58cc';

// ===== ITENS RAROS =====
const ITEMS = [
    {
        id: 'golden-armor',
        name: 'Golden Armor',
        emoji: '🛡️',
        rarity: 'Rare',
        summary: `Armadura encantada com armor 14 e peso de 80.00 oz, restrita a knights e paladins. Faz parte do Golden Set e pode ser obtida pela Behemoth Quest ou ao desoxidar uma Slightly Rusted Armor.`,
        origin: `A Golden Armor foi implementada nos primórdios do Tibia e se tornou uma das armaduras mais reconhecíveis do jogo. É obtida através da Behemoth Quest, e também pode surgir ao desoxidar uma Slightly Rusted Armor — uma mecânica que surpreendeu muitos jogadores quando descoberta.

Desde o Update 8.4, passou a ser exclusiva de knights e paladins. Antes disso, podia ser usada por qualquer vocação, o que a tornava muito mais disputada. A restrição mudou completamente a dinâmica de mercado.

É dropada por criaturas poderosas como Falcon Knight, Ferumbras, Juggernaut, Warlock, entre outras. Seu valor de mercado gira entre 20,000 e 32,000 gold coins.`,
        lore: `Seu flavor text diz: "It's an enchanted armor." A Golden Armor é parte do Golden Set, um dos conjuntos temáticos mais clássicos de Tibia, representando o luxo e a riqueza do mundo medieval do jogo.`,
        myths: `📜 O Segredo da Ferrugem: Poucos sabem que é possível obter uma Golden Armor ao desoxidar uma Slightly Rusted Armor — um item aparentemente inútil. Essa mecânica escondida faz da Golden Armor um dos itens com a origem mais curiosa do jogo.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'magic-plate-armor',
        name: 'Magic Plate Armor',
        emoji: '⚔️',
        rarity: 'Rare',
        summary: `Uma das armaduras mais icônicas de Tibia, com armor 17 e peso de 85.00 oz. Também conhecida como "e-plate", é restrita a knights e paladins desde o Christmas Update 2008.`,
        origin: `A Magic Plate Armor (MPA) foi implementada no Update 3.0, sendo uma das armaduras mais antigas do jogo. Originalmente tinha armor 18, mas teve seu valor reduzido para 17 com o Update 7.0 — uma mudança que gerou debates acalorados na comunidade.

Até o Christmas Update 2008, a MPA podia ser usada por todas as vocações. Quando a CipSoft restringiu o uso a knights e paladins, magos que dependiam da armadura tiveram que repensar todo seu equipamento.

É dropada por criaturas lendárias como Demon, Ferumbras, Morgaroth e Orshabaal, entre outras. Seu valor de mercado varia entre 90,000 e 150,000 gold coins, consolidando-a como um item acessível mas extremamente respeitado pela comunidade.`,
        lore: `O apelido "e-plate" vem de "Enchanted Plate Armor", o nome pelo qual muitos veteranos ainda se referem ao item. O nome oficial sempre foi Magic Plate Armor, mas a comunidade nunca abandonou o apelido original.`,
        myths: `📜 A Nerf do Update 7.0: A redução de armor 18 para 17 foi uma das primeiras grandes nerfs da história de Tibia, gerando debates que ecoaram por anos nos fóruns da comunidade.

📜 Restrição Tardia: Até o Christmas Update 2008, a MPA podia ser usada por todas as vocações — incluindo magos que a consideravam essencial. A restrição forçou uma mudança radical no meta de equipamentos.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'ferumbras-hat',
        name: 'Ferumbras\' Hat',
        emoji: '🎩',
        rarity: 'Very Rare',
        summary: `A prova material de que o arquimago mais temido de Tibia foi derrotado — pelo menos por enquanto. Com armor 1 e peso de 8.50 oz, é um dos itens mais caros ainda obtíveis no jogo.`,
        origin: `O Ferumbras' Hat foi implementado no Update 7.8 e é dropado por Ferumbras e Ferumbras Mortal Shell. Seu valor estimado varia entre 1,300,000,000 e 1,500,000,000 gold coins.

Além do prestígio, o chapéu é necessário para um addon dos Mage Outfits (masculino) e Summoner Outfits (feminino), tornando-o desejado tanto por colecionadores quanto por jogadores que buscam completar seus outfits.

Cada queda de Ferumbras é um evento que mobiliza dezenas de jogadores de alto nível, e o loot do chapéu é um dos momentos mais aguardados da comunidade.`,
        lore: `Seu flavor text diz: "It is the proof that Ferumbras has fallen. For now. The Edron Academy should be interested in this." A frase "por enquanto" sugere que Ferumbras sempre volta, e de fato ele é revivido periodicamente no jogo.

O flavor text menciona que a Edron Academy deveria se interessar pelo chapéu, sugerindo uma conexão entre o item e a academia de magia de Edron, um dos centros de conhecimento arcano de Tibia.`,
        myths: `📜 Bilhões em Gold: Com valor acima de 1 bilhão de gold coins, o Ferumbras' Hat é um dos itens mais caros ainda obtíveis no jogo. Cada aparição de Ferumbras gera uma corrida entre as guilds mais poderosas de cada servidor.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'thunder-hammer',
        name: 'Thunder Hammer',
        emoji: '🔨',
        rarity: 'Legendary',
        summary: `Uma das armas mais icônicas da história de Tibia. Introduzido na versão 6.4 (2001), foi considerado a club mais poderosa de uma mão. Seus atributos — attack 49, defense 35 (+1) — o tornaram extremamente desejado e raro.`,
        origin: `Durante os primeiros anos do Tibia, existiam apenas alguns Thunder Hammers. A história desses primeiros martelos envolve eventos especiais, recompensas da CipSoft e até exploits.

Em 2002, ocorreu uma convenção de Tibia em Viena. O jogador Patryn, que ajudou a organizar o evento, recebeu um Thunder Hammer como presente dos desenvolvedores. Posteriormente, o martelo foi dado de presente para Pytru como presente de Natal no mesmo ano.

Outro Thunder Hammer foi entregue pela CipSoft ao jogador Krin, no servidor Eternia, como recompensa por reportar bugs importantes de segurança do jogo.

Um episódio controverso envolveu o jogador Warrax, de Antica, que utilizou um exploit na Behemoth Quest com auxílio de um GM comprado chamado Ender Speaker of the Dead. Após a descoberta, Warrax foi deletado e o Thunder Hammer confiscado.

No servidor Premia, quando foi criado, a CipSoft realizou um evento especial em 16 de junho de 2002. Um demon apareceu em Darashia e um grupo de aventureiros o derrotou. O loot incluía um Thunder Hammer, que foi posteriormente vendido em Antica por uma enorme coleção de itens raros.

Em 26 de agosto de 2005, o boss mundial Orshabaal apareceu no servidor Elysia. O jogador Elahrion Avessar conseguiu lootar um Thunder Hammer — o primeiro de um boss mundial. Segundo relato dele: "Gritei na vida real quando vi o loot."

Desde então, o item passou a dropar raramente de bosses como Orshabaal, Morgaroth, Ghazbaran e Ferumbras. O Thunder Hammer tornou-se símbolo de status e peça de coleção, com exemplares exibidos em casas famosas no Tibia. Seu valor de mercado gira entre 60,000,000 e 70,000,000 gold coins.`,
        lore: `Seu flavor text diz: "It is blessed by the gods of Tibia." Existe uma lore associada ao martelo que remonta aos anões de Tibia.

Segundo a narrativa preservada em wikis da comunidade: nos tempos de pavor, os melhores ferreiros anões foram mantidos cativos pelas forças do mal. Um herói anão chamado Kazrad Rockfist os libertou. Seu martelo foi abençoado pelos deuses, e com um único golpe poderoso ele destruiu as portas de aço da prisão.

Os anões chamam este artefato de Khundahamar — "libertador". Entre os humanos, ficou conhecido como Thunder Hammer.`,
        myths: `📜 Quest Secreta da Basilisk: Um dos maiores mitos dizia que existia uma quest secreta envolvendo uma Basilisk gigante. Segundo a lenda, o martelo de Thor teria sido roubado e jogado nas profundezas do subsolo, guardado por uma serpente gigantesca. Jogadores passaram anos tentando encontrar essa sala secreta. Nunca foi comprovada.

📜 Ligação com Thor: Por causa do nome "Thunder Hammer", muitos acreditavam que o item era inspirado no Mjölnir, o martelo de Thor, e seria parte de uma quest mitológica. Embora a inspiração seja plausível, nunca houve confirmação oficial.

📜 O Martelo Perdido nas Minas: Outro mito dizia que o Thunder Hammer estava escondido em alguma mina subterrânea protegida por cyclops ou dwarves, baseado na história do Khundahamar. Nunca foi encontrada quest ligada a isso.

📜 Fake da Sala da Cobra: Uma das fakes mais famosas da comunidade mostrou um jogador supostamente entrando em uma sala secreta guardada por uma cobra gigante. A imagem circulou por anos, mas foi confirmada como fake.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil, Portal Tibia, Tibia Mistérios Database, TibiaQA'
    },
    {
        id: 'blessed-shield',
        name: 'Blessed Shield',
        emoji: '🛡️',
        rarity: 'Legendary',
        summary: `Introduzido no início do Tibia (1999). Não possui drop de criatura e nunca teve método de obtenção via gameplay. Foi concedido manualmente pela CipSoft ao jogador Elleshar como recompensa por contribuição gráfica ao jogo.`,
        origin: `Nos primeiros anos do Tibia (1997–2000), a CipSoft contou com ajuda da comunidade para produzir gráficos do jogo. Jogadores com habilidades de design ajudavam a criar equipamentos, criaturas e elementos de cenário. Como recompensa, alguns receberam itens únicos.

O Blessed Shield foi entregue ao jogador Elleshar por sua contribuição significativa na criação de gráficos. Esse foi o primeiro Blessed Shield existente no jogo.

Originalmente o escudo tinha defense 50, reduzido para 40 no patch 7.0 (2002). Mesmo após o nerf, permaneceu durante anos como o escudo com maior defesa do Tibia.

Elleshar vendeu o escudo para Muecil por aproximadamente 130k gold — uma quantia absurda na época — com a condição de que nunca fosse revendido.

Anos depois, Muecil quebrou a promessa e colocou o Blessed Shield em leilão público. O preço subiu para 5 milhões de gold + itens raros. O vencedor foi Lightbringer, um dos maiores colecionadores de rares da época.

Lightbringer manteve o escudo em sua coleção, mas posteriormente o vendeu. O comprador teria feito uma oferta "que ninguém poderia superar" — esse episódio se tornou uma das histórias mais famosas do Tibia.

Com o passar dos anos, o escudo mudou de mãos várias vezes. Entre os donos documentados estão: Elleshar → Muecil → Lightbringer → Gryphee → Lost Planegazer, entre outros colecionadores. Em determinado momento, o dono foi banido, gerando medo de que o item desaparecesse — mas foi transferido antes da exclusão da conta.

Em 15 de junho de 2022, um Blessed Shield foi vendido via Market por Karr Chaos (Nathquata) para Rei de Lutabra por 12 bilhões de gold coins — uma das maiores transações da história de Tibia.

O Blessed Shield se tornou um símbolo de raridade extrema, história do Tibia, economia do jogo e colecionismo de rares.`,
        lore: `Seu flavor text diz: "The shield grants divine protection." A descrição sugere uma conexão com o deus Banor e o conceito de proteção divina dentro do universo de Tibia. O significado mítico do escudo vai além de seus atributos — representa a bênção dos próprios deuses criadores.`,
        myths: `📜 Drop de Monstros: Alguns jogadores acreditavam que o Blessed Shield poderia dropar de Morgaroth, Demon ou Ferumbras. Na realidade, nenhuma criatura dropa o item.

📜 Quest Secreta de Banor: Outro mito dizia que o escudo poderia ser obtido em uma quest secreta ligada ao deus Banor. Nunca houve confirmação dessa quest.

📜 Existência de Vários Blessed Shields: Rumores afirmam que existem 2 ou 3 Blessed Shields, mas historicamente a comunidade considera que apenas um foi confirmado publicamente.

📜 Proteção Divina: A descrição "The shield grants divine protection" levou jogadores a acreditar que o item poderia reduzir dano mágico, proteger contra ataques de demon ou impedir morte em PvP. Nunca houve evidência disso.

📜 O Blessed Shield em Hellgate: Screenshots dentro da Hellgate Treasure Room levaram muitos a acreditar que existia uma quest secreta ligada ao lugar. Na verdade, eram apenas exibições feitas por jogadores.`,
        sources: 'TibiaWiki (Fandom), Tibia Light, TibiaQA, TibiaWiki Brasil, Portal Tibia'
    },
    {
        id: 'demon-helmet',
        name: 'Demon Helmet',
        emoji: '👹',
        rarity: 'Rare',
        summary: `Capacete demoníaco com armor 10 e peso de 29.50 oz. Implementado no Update 6.0, é um dos capacetes mais reconhecíveis de Tibia, com seu design inconfundível.`,
        origin: `O Demon Helmet é obtido através da Demon Helmet Quest e também é dropado por Lloyd e Madareth. Seu valor de mercado varia entre 30,000 e 55,000 gold coins.

Antes da criação da Demon Helmet Quest, o capacete era extremamente raro. A quest original era conhecida como Demon Legs Quest, e sua conversão na atual Demon Helmet Quest tornou o item mais acessível.

Embora tenha sido superado pelo Zaoan Helmet em termos de defesa pura, continua sendo uma excelente opção para magos que priorizam proteção, especialmente em PvP.`,
        lore: `Seu flavor text diz: "You hear an evil whispering from inside." É um dos textos mais atmosféricos do jogo, sugerindo que o capacete ainda carrega a essência demoníaca de seus criadores.`,
        myths: `📜 A Mudança de Quest: O Demon Helmet era extremamente raro antes que a quest de Demon Legs fosse convertida na atual Demon Helmet Quest. Antes disso, não está claro como era obtido — provavelmente através de spawns únicos ou presentes dos Deuses.

📜 Escolha de Magos: Apesar de superado pelo Zaoan Helmet, o Demon Helmet permanece popular entre magos que buscam defesa extra, especialmente em situações de PvP onde cada ponto de armor conta.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'horned-helmet',
        name: 'Horned Helmet',
        emoji: '🪖',
        rarity: 'Legendary',
        summary: `Capacete lendário com armor 11 e peso de 51.00 oz. Implementado no Update 6.0, é um item de colecionador sem igual, com valor estimado entre 600,000,000 e 750,000,000 gold coins.`,
        origin: `O Horned Helmet surgiu nos tempos em que o mapa de Tibia era resetado a cada 4-6 meses. Ele aparecia como spawn na área que hoje é a Bright Sword Quest, abaixo do Outlaw Camp. Nesses resets periódicos, itens raros respawnavam em locais específicos.

Com a implementação de world transfers, alguns jogadores conseguiram distribuir o capacete entre vários mundos. Hoje, existem poucos exemplares espalhados por mundos como Antica, Premia, Secura, Isara, Lunara e Amera.

Cada exemplar tem uma história própria — alguns passaram por dezenas de donos ao longo de mais de duas décadas.`,
        lore: `Um Horned Helmet pode ser visto na Treasure Room do Amazon Camp em Venore, completamente inalcançável — servindo como uma provocação eterna aos jogadores que passam por ali.`,
        myths: `📜 O Spawn do Map Reset: Nos primórdios de Tibia, o mapa era resetado periodicamente, e itens raros respawnavam em locais específicos. O Horned Helmet era um desses spawns, na área que hoje abriga a Bright Sword Quest sob o Outlaw Camp.

📜 O Capacete Inalcançável: O Horned Helmet visível na Treasure Room de Venore se tornou um dos maiores "teasers" do Tibia — todos podem vê-lo, ninguém pode pegá-lo.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'warlord-sword',
        name: 'Warlord Sword',
        emoji: '⚔️',
        rarity: 'Legendary',
        summary: `Two-handed sword com attack 53, defense 38 e peso de 64.00 oz, requerendo level 120 e vocação knight. É um dos itens mais raros do jogo, com pouquíssimos exemplares existindo.`,
        origin: `A Warlord Sword não possui drop confirmado — nenhuma criatura a dropa atualmente. Pode ser vista abaixo do NPC A Sweaty Cyclops em Ab'Dendriel e na Morguthis Treasure Room.

A Warlord Sword já teve attack 62 e defense 40, valores absurdamente altos. A nerf reduziu seus stats, mas não diminuiu seu status lendário.

Um dos poucos exemplares conhecidos foi exibido na famosa Tibianic Exhibition em Antica, organizada pela Alliance of Free Tibians liderada por Taghor — um evento que reuniu os itens mais raros do jogo em uma exposição pública.

Historicamente, era considerada a segunda melhor espada de Tibia, atrás apenas da Magic Longsword — outro item lendário praticamente inexistente.`,
        lore: `Seu flavor text diz: "Strong powers flow in this magic sword." Se você falar com o NPC A Sweaty Cyclops em Ab'Dendriel e disser "warlord sword", ele pedirá materiais para forjá-la — mas esses materiais permanecem desconhecidos até hoje.`,
        myths: `📜 O Mistério do Cyclops: A Sweaty Cyclops oferece forjar uma Warlord Sword se você trouxer os materiais certos. Após mais de 20 anos, ninguém descobriu quais são esses materiais — ou se a quest é sequer completável.

📜 A Tibianic Exhibition: Um dos poucos exemplares conhecidos foi exibido na Tibianic Exhibition em Antica, organizada por Taghor e a Alliance of Free Tibians — um evento histórico que reuniu os itens mais raros do jogo.

📜 Após a Magic Longsword: Historicamente, a Warlord Sword era considerada a segunda melhor espada de Tibia, atrás apenas da Magic Longsword — outro item lendário praticamente inexistente.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'dragon-scale-mail',
        name: 'Dragon Scale Mail',
        emoji: '🐉',
        rarity: 'Rare',
        summary: `Armadura de escamas de dragão com armor 15 e peso de 114.00 oz, restrita a knights e paladins. Implementada no Update 5.1, é uma das armaduras mais antigas do jogo.`,
        origin: `A Dragon Scale Mail faz parte do Dragon Set e é necessária para um addon dos Wizard Outfits. É dropada por criaturas dracônicas como Dragon Lord, Frost Dragon, Demodras, Chizzoron the Distorter, entre outras.

Seu valor de mercado gira entre 40,000 e 60,000 gold coins, e pode ser vendida a Rashid.

Durante o Christmas Update 2004 (Update 7.4), o sprite da Dragon Scale Mail foi completamente redesenhado. O modelo antigo se parecia com uma Elven Mail — um visual muito diferente do atual.`,
        lore: `A armadura faz parte do Dragon Set, um dos conjuntos temáticos do jogo que celebra as criaturas mais emblemáticas de Tibia — os dragões. Completar o set é um rito de passagem para muitos knights.`,
        myths: `📜 Uma das Mais Antigas: A Dragon Scale Mail existe desde o Update 5.1. Sua longevidade no jogo a torna um verdadeiro fóssil vivo da história de Tibia.

📜 O Sprite Antigo: O modelo antigo se parecia com uma Elven Mail. O redesign no Update 7.4 pegou muitos jogadores de surpresa e dividiu opiniões na comunidade.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'great-shield',
        name: 'Great Shield',
        emoji: '🛡️',
        rarity: 'Very Rare',
        summary: `Escudo lendário com defense 38 e peso de 84.00 oz. Existe desde quase o início de Tibia, quando o único servidor se chamava simplesmente "Tibia" — o que hoje é Antica.`,
        origin: `O primeiro Great Shield conhecido foi de Cressir, em Antica. Originalmente tinha defense 42, reduzido para 38 com o Update 7.0.

Por um breve período, Dragon Lords dropavam o Great Shield. Lootar um era mais difícil que conseguir uma Dragon Scale Mail. Na época, só existiam três spawns de Dragon Lord — Plains of Havoc, Thais e Deeper Fibula — e os levels mais altos eram por volta de 50. O drop foi removido porque o valor e a defesa do escudo foram considerados excessivos.

O visual do Great Shield foi alterado durante o Christmas Update 2004 (Update 7.4). O modelo antigo era completamente diferente do atual.

Atualmente é dropado por bosses como Ferumbras, Ferumbras Mortal Shell, Massacre, Morgaroth, Razzagorn e Soul of Dragonking Zyrtarch. Seu valor varia entre 30,000,000 e 50,000,000 gold coins.`,
        lore: `Seu flavor text diz: "The shield is made of dragon scales." Faz parte do Full Set. Pode ser visto na Treasure Room do Imperador Kruzak em Kazordoon e também no tesouro do Maze of Lost Souls.`,
        myths: `📜 O Drop Removido dos Dragon Lords: O Great Shield era dropado por Dragon Lords nos primórdios do jogo. Com apenas três spawns de Dragon Lord e levels máximos por volta de 50, lootar um era um feito quase impossível. O drop foi removido por ser considerado excessivo.

📜 A Nerf Histórica: A redução de defense 42 para 38 no Update 7.0 afetou profundamente o meta de escudos, mas o Great Shield continuou sendo um dos mais poderosos do jogo.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'pair-of-soft-boots',
        name: 'Pair of Soft Boots',
        emoji: '👢',
        rarity: 'Rare',
        summary: `Botas mágicas com regeneração acelerada, pesando apenas 8.00 oz. Regeneram 3 HP e 12 MP a cada 6 segundos durante 4 horas. São obtidas na Pits of Inferno Quest.`,
        origin: `Embora as Soft Boots tenham sido implementadas no Christmas Update 2002 (Update 7.1), elas só se tornaram obtíveis após o Christmas Update 2006 (Update 7.9) — quatro anos de existência como item fantasma.

São obtidas através da Pits of Inferno Quest. Quando completamente usadas, se transformam em Worn Soft Boots, que podem ser recarregadas. Seu valor varia entre 500,000 e 850,000 gold coins.

As Soft Boots mudaram completamente o meta de magos em Tibia. Um promoted mage usando Soft Boots e comendo food pode produzir 129 SDs, 324 GFBs ou 1,230 HMMs em 4 horas — tornando o craft de runas significativamente mais lucrativo.

São especialmente úteis em resting areas, onde a regeneração é dobrada se o reward streak for 6 ou maior.`,
        lore: `As Soft Boots têm exatamente a mesma aparência das Boots of Waterwalking — um detalhe que já causou confusão em inúmeras negociações entre jogadores. Um par de Soft Boots pode ser visto decorando a Santa's House no mundo Vega.`,
        myths: `📜 Item Fantasma: Durante quatro anos (2002–2006), as Soft Boots existiam no código do jogo mas eram impossíveis de obter. Jogadores sabiam de sua existência mas ninguém as possuía — um mistério que alimentou inúmeras teorias.

📜 A Revolução dos Magos: As Soft Boots redefiniram o que significava ser mage em Tibia. O impacto na economia de runas foi tão grande que os preços de SDs, GFBs e HMMs nunca mais foram os mesmos.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'winged-helmet',
        name: 'Winged Helmet',
        emoji: '🪽',
        rarity: 'Legendary',
        summary: `Capacete com armor 10 e peso de apenas 12.00 oz. Implementado no Update 3.1, é um dos itens mais antigos e raros de todo o Tibia, com valor estimado entre 8 e 11 bilhões de gold coins.`,
        origin: `Nos tempos em que só Thais existia, o Winged Helmet spawnava uma vez por map reset (a cada ~6 meses) em um baú no Thais Lighthouse, onde hoje fica a Dark Shield Quest.

Mesmo tendo sido ilegalmente duplicado há muito tempo, existem cerca de 10 exemplares, originalmente todos em Antica. Pode ser visto na Morguthis Treasure Room e na Treasure Room de Pythius The Rotten.

Em fevereiro de 2025, um Winged Helmet foi vendido em Antica através do bazaar de personagens por 217,626 Tibia Coins — uma das maiores transações já registradas na plataforma.`,
        lore: `Seu flavor text diz: "It's the Helmet of Hermes." Ao contrário da crença popular, o Winged Helmet nunca concedeu velocidade, proteção suprema ou qualquer atributo especial além de sua defesa. O nome "Helmet of Hermes" sempre foi puramente temático.`,
        myths: `📜 O Spawn do Farol: O Winged Helmet spawnava no Thais Lighthouse durante os map resets dos primórdios de Tibia. Esse detalhe é conhecido apenas pelos jogadores mais antigos do jogo.

📜 A Duplicação Ilegal: Há muito tempo, o Winged Helmet foi ilegalmente duplicado, aumentando o número de exemplares em circulação. Mesmo assim, continua sendo um dos itens mais raros do jogo.

📜 Venda Histórica no Bazaar: A venda de 217,626 Tibia Coins em 2025 consolidou o Winged Helmet como um dos itens mais valiosos já negociados na plataforma oficial.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil'
    },
    {
        id: 'chayennes-magical-key',
        name: 'Chayenne\'s Magical Key',
        emoji: '🔑',
        rarity: 'Very Rare',
        summary: `Adicionada na versão 9.44 (janeiro de 2012), distribuída durante as comemorações do 15º aniversário do Tibia. Sua utilidade foi publicamente revelada em agosto de 2012, com o jogador Dragenas (Secura) entre os primeiros a desvendar o mistério.`,
        origin: `Em 13 de janeiro de 2012, a Chayenne's Magical Key foi adicionada ao jogo na versão 9.44, obtida como loot do monstro especial Chayenne durante o evento do 15º aniversário.

Em agosto de 2012, a Community Manager Chayenne anunciou sua saída da equipe e confirmou que a chave "leva a algum lugar", reacendendo as buscas. Em 19 de agosto de 2012, o jogador Dragenas (Secura) foi um dos primeiros a desvendar o local e postou screenshots da descoberta.

Em 20 de agosto de 2012, a CipSoft anunciou o Chayenne's Farewell Contest. Três vencedores — Abiston, Azurai e Jinxz — receberam uma chave cada.

A comunidade criou threads massivas de cooperação (uma no Otland chegou a 1.900+ posts) para dividir pistas e hipóteses. A investigação foi um dos eventos comunitários mais marcantes da história de Tibia.

Por ser rara e existir apenas em Yellow BattlEye worlds originalmente, a chave é altamente valorizada no mercado, com preços históricos na casa de dezenas de milhões de gold coins.`,
        lore: `A descrição do item diz: "No one really knows where it leads to, but the dragon graveyard might reveal the secret — or not." Essa pista levou jogadores a focarem em áreas dracônicas de Ankrahmun e Draconia.

Os jogadores encontraram um livro chamado "Key to Magic" dentro de uma caixa no topo da pirâmide em Draconia, cujos versos continham pistas para manipular paredes mágicas e switches. A mecânica exigia ir ao dragon lair de Ankrahmun, limpar todo o respawn, usar Destroy Field para remover um Fire Field, e ativar uma alavanca escondida que revelava um teleporte para o Chayenne's Realm.

A quest concede uma Beach Backpack contendo itens como Music Box, Blue Rose e Dracoyle Statue, além de desbloquear acesso ao Chayenne's Realm. A Music Box é usada para domar certos mounts com 100% de sucesso.`,
        myths: `📜 A Chave Não Teria Propósito: Muitos jogadores acreditavam que a chave era apenas um item decorativo sem utilidade. Esse mito foi desmentido pela própria Chayenne, que confirmou que havia uso.

📜 Music Box Domestica Qualquer Criatura: Meio-mito — a Music Box funciona somente em uma lista específica de criaturas (montarias favoritas de Chayenne) e é consumida no processo, mas tem taxa de sucesso 100% nas que suporta.`,
        sources: 'TibiaWiki (Fandom), TibiaWiki Brasil, OTLand, Tibia.com, TibiaPedia'
    }
];

// ===== PERSONAGENS EM DESTAQUE (MOCK) =====
const HIGHLIGHTED_CHARACTERS = [
    {
        id: 1,
        name: 'Eternal Flame',
        world: 'Antica',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 1250,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'A Chama que Nunca se Apaga',
        storyContent: `Minha jornada começou em 2005, quando eu era apenas um garoto curioso que descobriu Tibia através de um amigo na escola. Criei meu personagem em Antica, o servidor mais antigo e populoso, sem saber que aquele dia mudaria minha vida.

Os primeiros dias foram de pura descoberta. Morri para ratos em Rookgaard mais vezes do que gostaria de admitir. Mas cada morte era uma lição, cada nível conquistado era uma vitória épica.

Quando finalmente cheguei ao mainland, o mundo se abriu diante dos meus olhos. Thais era uma cidade imensa e cheia de vida. Jogadores corriam de um lado para o outro, merchants gritavam seus preços no depot, e eu ali, um cavaleiro nível 8, olhando tudo com admiração.

A primeira vez que enfrentei um Dragon foi inesquecível. Eu tinha nível 45 e um grupo de amigos da guild me convenceu a ir para a Darashia Dragon Lair. Meu coração disparou quando vi aquela criatura enorme cuspindo fogo. Sobrevivi — por pouco — e a partir daquele dia, eu sabia que queria ser o cavaleiro mais forte de Antica.

Ao longo dos anos, participei de guerras entre guilds, explorei dungeons misteriosas, e fiz amizades que duram até hoje. Tibia não é apenas um jogo para mim — é uma segunda casa, um lugar onde forjei memórias que carregarei para sempre.

Hoje, com nível 1250, olho para trás e vejo cada cicatriz, cada conquista, cada momento de desespero e triunfo. A chama do meu personagem nunca se apagou, e enquanto Tibia existir, ela continuará ardendo.`,
        avatarEmoji: '🔥',
        createdAt: '2024-06-15'
    },
    {
        id: 2,
        name: 'Shadow Weaver',
        world: 'Secura',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 980,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'Flechas na Escuridão',
        storyContent: `Eles dizem que paladinos são a vocação mais versátil de Tibia. Concordo. Mas ser versátil não significa ser fácil.

Criei Shadow Weaver em 2010, quando já era veterano no jogo. Queria um desafio diferente — e encontrei. A vida de um paladino é solitária. Enquanto cavaleiros formam frontlines e magos devastam hordas, nós ficamos nas sombras, calculando cada flecha, cada passo.

Minha história mais marcante aconteceu durante uma war contra a guild "Dark Legion" em Secura. Éramos superados em número 3 para 1. A maioria do nosso time havia sido eliminada, e eu era um dos últimos de pé.

Me escondi em uma passagem estreita da dungeon e, um por um, embosquei os inimigos que entravam. Foram 47 kills naquela noite. Quando o sol virtual nasceu, a Dark Legion havia recuado, e meu nome estava gravado na história de Secura.

Desde aquele dia, me tornei conhecido como o "Fantasma de Secura" — você nunca me vê, mas minhas flechas sempre encontram o alvo.`,
        avatarEmoji: '🏹',
        createdAt: '2024-09-22'
    },
    {
        id: 3,
        name: 'Arcane Tempest',
        world: 'Luminera',
        vocation: 'Master Sorcerer',
        vocShort: 'MS',
        level: 1100,
        isVerified: true,
        isHighlighted: true,
        storyTitle: 'O Mago da Tempestade',
        storyContent: `Fogo. Gelo. Energia. Morte. Os quatro elementos da destruição, e eu os domino todos.

Comecei como um simples sorcerer em Luminera em 2012. O que me atraiu para esta vocação foi a promessa de poder puro — a capacidade de destruir hordas inteiras de inimigos com um único feitiço.

A realidade foi mais dura do que eu esperava. Sorcerers são frágeis como cristal nos níveis baixos. Morri incontáveis vezes antes de aprender a arte de posicionar-me, de controlar o ritmo da batalha, de saber quando atacar e quando recuar.

O ponto de virada foi quando aprendi o "Rage of the Skies". A primeira vez que lancei esse feitiço em um grupo de 30 monstros e vi todos caírem simultaneamente... foi como ser um deus por um instante.

Hoje sou respeitado como um dos sorcerers mais fortes de Luminera. Mas nunca esqueço de onde vim: um mago nível 8 em Rookgaard, tentando matar um rato com uma varinha que fazia menos dano que um tapa.`,
        avatarEmoji: '⚡',
        createdAt: '2025-01-10'
    }
];

// ===== TODOS OS PERSONAGENS COM HISTÓRIA =====
const ALL_CHARACTERS = [
    ...HIGHLIGHTED_CHARACTERS,
    {
        id: 4,
        name: 'Emerald Healer',
        world: 'Antica',
        vocation: 'Elder Druid',
        vocShort: 'ED',
        level: 870,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'A Guardiã da Floresta',
        storyContent: `Sempre me disseram que druidas são apenas "curandeiros". Que nosso papel é ficar atrás do time, spammando "exura sio" e rezando para ninguém morrer. Eles estão errados.

Sou Emerald Healer, e esta é a história de como uma druid mudou o destino de guerras inteiras em Antica.

Comecei minha jornada em 2008. Na época, druids eram subvalorizados. Todos queriam ser sorcerers pelo dano, ou knights pela resistência. Mas eu vi algo que outros não viam: o poder de manter um exército inteiro vivo.

Minha fama começou na Grande Guerra de Antica de 2015, quando nossa guild estava à beira da derrota. Os knights caíam, os paladinos ficavam sem munição, os sorcerers sem mana. Mas eu mantive todos vivos. Por três horas seguidas, minha mana nunca zerou, meus heals nunca falharam.

Quando a poeira baixou, tínhamos vencido. E todos sabiam: a vitória tinha um nome, e era o meu.`,
        avatarEmoji: '🌿',
        createdAt: '2024-08-05'
    },
    {
        id: 5,
        name: 'Blazing Fury',
        world: 'Quintera',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 750,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Do Rook ao Inferno',
        storyContent: `Minha história não é de glória. É de teimosia.

Comecei Tibia em 2014 sem saber absolutamente nada. Não falava inglês, não conhecia ninguém no jogo, e escolhi ser knight porque a descrição dizia "é a vocação mais fácil para iniciantes". Mentira.

Passei meses morrendo. Para trolls, para cyclops, para aquelas malditas amazonas em Venore. Meu level ia e voltava como maré. Mas eu nunca desisti.

O momento que definiu minha jornada foi quando, no level 150, decidi ir sozinho para a Inquisiton Quest. Todo mundo disse que era impossível solo. Levei 4 horas, morri 6 vezes, gastei toda minha gold em potions. Mas completei.

Desde aquele dia, "impossível" deixou de existir no meu vocabulário. Se existe um desafio em Tibia, eu vou enfrentar — mesmo que leve 100 tentativas.`,
        avatarEmoji: '🔥',
        createdAt: '2025-02-01'
    },
    {
        id: 6,
        name: 'Moonlit Arrow',
        world: 'Premia',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 620,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Caçadora da Lua',
        storyContent: `Em Premia, as noites são mais perigosas que os dias. Pelo menos era o que eu acreditava quando era novata.

Criei Moonlit Arrow numa madrugada de insônia em 2016. O nome veio naturalmente — eu estava olhando pela janela, vi a lua, e pensei: "quero ser como uma flecha guiada pela luz da lua. Silenciosa, precisa, inevitável."

Minha história é sobre paciência. Paladinos não são sobre força bruta ou magia devastadora. Somos sobre precisão. Cada flecha conta, cada passo é calculado.

Me especializei em caçar bosses raros. Conheço os spawns, os timers, os patterns de todos os bosses de Premia. Sou a primeira a chegar e a última a sair.

Já encontrei itens que muitos jogadores só viram em screenshots. E cada um deles tem uma história, uma noite acordada, uma batalha silenciosa sob a luz da lua.`,
        avatarEmoji: '🌙',
        createdAt: '2025-01-20'
    },
    {
        id: 7,
        name: 'Iron Fist Zara',
        world: 'Antica',
        vocation: 'Monk',
        vocShort: 'MO',
        level: 410,
        isVerified: true,
        isHighlighted: false,
        storyTitle: 'Punhos de Ferro',
        storyContent: `Quando a vocação Monk chegou a Tibia, muitos riram. "Lutar sem arma? Sem magia? Boa sorte." Eu fui a primeira a provar que estavam errados.

Sou Iron Fist Zara, e minha arma é meu próprio corpo.

Criei minha Monk no primeiro dia que a vocação foi liberada. Enquanto todos testavam builds e reclamavam da falta de dano, eu estudava. Cada combo, cada esquiva, cada timing de contra-ataque.

O segredo do Monk não é força bruta — é ritmo. É sentir o momento exato de desviar, o frame perfeito para contra-atacar. É uma dança, não uma briga.

Minha fama veio quando venci um Elite Knight level 800 num duelo em Antica. Ele ria antes da luta. Não ria mais quando acordou no templo.

Desde então, carrego o título com orgulho: a primeira Monk a provar que os punhos são mais letais que qualquer lâmina.`,
        avatarEmoji: '🥋',
        createdAt: '2025-12-10'
    }
];

// ===== PERSONAGENS DO USUÁRIO (MINHA CONTA) =====
const MY_CHARACTERS = [
    {
        id: 101,
        name: 'Dark Crusader',
        world: 'Antica',
        vocation: 'Elite Knight',
        vocShort: 'EK',
        level: 450,
        isVerified: true,
        hasStory: true,
        storyTitle: 'O Cruzado das Sombras'
    },
    {
        id: 102,
        name: 'Frost Mage',
        world: 'Secura',
        vocation: 'Master Sorcerer',
        vocShort: 'MS',
        level: 320,
        isVerified: true,
        hasStory: false,
        storyTitle: null
    },
    {
        id: 103,
        name: 'Wild Hunter',
        world: 'Luminera',
        vocation: 'Royal Paladin',
        vocShort: 'RP',
        level: 180,
        isVerified: false,
        hasStory: false,
        storyTitle: null
    }
];
