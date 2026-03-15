/* ============================================================
   TIBIA STORIES — LÓGICA DO PROTÓTIPO
   Navegação SPA com renderização dinâmica de telas
   ============================================================ */

// ===== ESTADO GLOBAL =====
const state = {
  currentScreen: 'home',
  currentTab: 'home',
  history: [],             // pilha de navegação para o botão voltar
  itemFilter: 'all',       // filtro de itens: all, legendary, very-rare, rare
  itemSort: 'alpha-asc',    // ordenação de itens: alpha-asc, alpha-desc, rarity-asc, rarity-desc
  charSort: 'alpha-asc',    // ordenação de chars: alpha-asc, alpha-desc, level-desc, level-asc
  charFilterVoc: 'all',     // filtro vocação: all, EK, RP, ED, MS
  charFilterWorld: 'all',   // filtro servidor: all, <world>
  searchQuery: '',          // busca
};

// ===== NAVEGAÇÃO =====
function navigateTo(screen, params = {}) {
  // Se é uma tab, limpa o histórico
  const isTabs = ['home', 'items', 'characters', 'account'].includes(screen);

  if (isTabs) {
    state.history = [];
    state.currentTab = screen;
    updateTabBar();
  } else {
    // Push tela atual no histórico antes de navegar
    state.history.push({ screen: state.currentScreen, params: state.currentParams });
  }

  state.currentScreen = screen;
  state.currentParams = params;
  renderScreen();
  scrollToTop();
}

function goBack() {
  if (state.history.length > 0) {
    const prev = state.history.pop();
    state.currentScreen = prev.screen;
    state.currentParams = prev.params;
    renderScreen();
    scrollToTop();
  }
}

function scrollToTop() {
  document.getElementById('content-area').scrollTop = 0;
}

function updateTabBar() {
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === state.currentTab);
  });
}

// ===== RENDERIZADOR PRINCIPAL =====
function renderScreen() {
  const content = document.getElementById('content-area');
  const subtitle = document.getElementById('page-subtitle');
  const backBtn = document.getElementById('btn-back');

  const isSubScreen = state.history.length > 0;
  backBtn.style.display = isSubScreen ? 'block' : 'none';

  let html = '';
  let title = '';

  switch (state.currentScreen) {
    case 'home':
      title = '';
      html = renderHome();
      break;
    case 'items':
      title = '';
      html = renderItems();
      break;
    case 'item-detail':
      const item = ITEMS.find(i => i.id === state.currentParams.id);
      title = '';
      html = renderItemDetail(item);
      break;
    case 'characters':
      title = '';
      html = renderCharacters();
      break;
    case 'character-story':
      const char = ALL_CHARACTERS.find(c => c.id === state.currentParams.id);
      title = '';
      html = renderCharacterStory(char);
      break;
    case 'account':
      title = '';
      html = renderAccount();
      break;
    case 'add-character':
      title = 'Adicionar Char';
      html = renderAddCharacter();
      break;
    case 'verify-character':
      title = 'Quest de Vínculo';
      html = renderVerifyCharacter();
      break;
    case 'edit-story':
      title = 'Editar História';
      html = renderEditStory();
      break;
    case 'highlight':
      title = 'Destacar char';
      html = renderHighlight();
      break;
    case 'login':
      title = '';
      html = renderLogin();
      break;
    case 'register':
      title = '';
      html = renderRegister();
      break;
    default:
      title = 'Tibia Stories';
      html = '<div class="empty-state"><div class="empty-state-icon">❓</div><div class="empty-state-text">Esse TP não leva a lugar algum...</div></div>';
  }

  subtitle.textContent = title;
  subtitle.style.display = title ? '' : 'none';
  content.innerHTML = `<div class="fade-in">${html}</div>`;

  // Attach event listeners para inputs de busca
  attachSearchListeners();
}

// ===== TELA HOME (DESTAQUES) =====
function renderHome() {
  const highlighted = HIGHLIGHTED_CHARACTERS.filter(c => c.isHighlighted);

  if (highlighted.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">🏰</div>
        <div class="empty-state-text">Nenhum char em destaque no momento...</div>
      </div>`;
  }

  let html = `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>⭐</span>
        <h2>Chars em Destaque</h2>
      </div>
      <div class="tibia-panel-body">`;

  highlighted.forEach(char => {
    html += renderCharCard(char, true);
  });

  html += `
      </div>
    </div>`;

  // Seção de últimas histórias
  const recent = ALL_CHARACTERS.filter(c => !c.isHighlighted).slice(0, 3);
  if (recent.length > 0) {
    html += `
      <div class="tibia-divider"><span>✦ ✦ ✦</span></div>
      <div class="tibia-panel">
        <div class="tibia-panel-header">
          <span><img src="icons/history-book.png" alt="" style="width:16px;height:16px;vertical-align:middle;"></span>
          <h2>Histórias Recentes</h2>
        </div>
        <div class="tibia-panel-body">`;

    recent.forEach(char => {
      html += renderCharCard(char, false);
    });

    html += `
        </div>
      </div>`;
  }

  return html;
}

// ===== TELA ITENS RAROS =====
function renderItems() {
  let html = `
    <div class="search-bar">
      <input type="text" id="items-search" placeholder="Buscar item por nome..." value="${state.searchQuery}">
    </div>
    <div class="filter-bar">
      <button class="filter-btn ${state.itemFilter === 'all' ? 'active' : ''}" onclick="filterItems('all')">Todos</button>
      <button class="filter-btn ${state.itemFilter === 'legendary' ? 'active' : ''}" onclick="filterItems('legendary')">🟠 Legendary</button>
      <button class="filter-btn ${state.itemFilter === 'very-rare' ? 'active' : ''}" onclick="filterItems('very-rare')">🟣 Very Rare</button>
      <button class="filter-btn ${state.itemFilter === 'rare' ? 'active' : ''}" onclick="filterItems('rare')">🔵 Rare</button>
    </div>
    <div class="sort-bar">
      <label>Ordenar:</label>
      <select id="items-sort" onchange="sortItems(this.value)">
        <option value="alpha-asc" ${state.itemSort === 'alpha-asc' ? 'selected' : ''}>A → Z</option>
        <option value="alpha-desc" ${state.itemSort === 'alpha-desc' ? 'selected' : ''}>Z → A</option>
        <option value="rarity-desc" ${state.itemSort === 'rarity-desc' ? 'selected' : ''}>Raridade ↓</option>
        <option value="rarity-asc" ${state.itemSort === 'rarity-asc' ? 'selected' : ''}>Raridade ↑</option>
      </select>
    </div>`;

  let filtered = ITEMS;

  // Filtro por raridade
  if (state.itemFilter !== 'all') {
    const rarityMap = { 'legendary': 'Legendary', 'very-rare': 'Very Rare', 'rare': 'Rare' };
    filtered = filtered.filter(i => i.rarity === rarityMap[state.itemFilter]);
  }

  // Filtro por busca
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(i => i.name.toLowerCase().includes(q));
  }

  // Ordenação
  const rarityOrder = { 'Legendary': 3, 'Very Rare': 2, 'Rare': 1 };
  filtered = [...filtered].sort((a, b) => {
    switch (state.itemSort) {
      case 'alpha-asc': return a.name.localeCompare(b.name);
      case 'alpha-desc': return b.name.localeCompare(a.name);
      case 'rarity-desc': return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      case 'rarity-asc': return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
      default: return 0;
    }
  });

  if (filtered.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">Nenhum item encontrado...</div>
      </div>`;
  } else {
    html += `<div class="tibia-panel"><div class="tibia-panel-header"><span>📦</span><h2>Itens Lendários & Raros (${filtered.length})</h2></div><div class="tibia-panel-body" style="padding:6px 8px;">`;
    filtered.forEach(item => {
      const rarityClass = item.rarity === 'Legendary' ? 'rarity-legendary'
        : item.rarity === 'Very Rare' ? 'rarity-very-rare' : 'rarity-rare';
      html += `
        <div class="item-card" onclick="navigateTo('item-detail', {id: '${item.id}'})">
          <div class="item-sprite">${item.emoji}</div>
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-rarity ${rarityClass}">★ ${item.rarity}</div>
          </div>
          <div class="item-arrow">›</div>
        </div>`;
    });
    html += `</div></div>`;
  }

  return html;
}

function filterItems(filter) {
  state.itemFilter = filter;
  renderScreen();
}

function sortItems(sort) {
  state.itemSort = sort;
  renderScreen();
}

// ===== TELA DETALHE DO ITEM =====
function renderItemDetail(item) {
  if (!item) return '<div class="empty-state"><div class="empty-state-text">Item não encontrado</div></div>';

  const rarityClass = item.rarity === 'Legendary' ? 'rarity-legendary'
    : item.rarity === 'Very Rare' ? 'rarity-very-rare' : 'rarity-rare';

  return `
    <div class="detail-hero">
      <div class="detail-hero-image">${item.emoji}</div>
      <h2>${item.name}</h2>
      <div class="detail-badges">
        <span class="badge ${rarityClass === 'rarity-legendary' ? 'badge-highlighted' : rarityClass === 'rarity-very-rare' ? 'badge-ek' : 'badge-world'}">${item.rarity}</span>
      </div>
    </div>

    <div class="section-body">
      <p>${item.summary}</p>
    </div>

    <div class="section-title">📜 Origem</div>
    <div class="section-body">
      ${item.origin.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>

    ${item.lore ? `<div class="section-title">📖 Lore</div>
    <div class="section-body">
      ${item.lore.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>` : ''}

    <div class="section-title">🔮 Mitos & Lendas</div>
    <div class="section-body">
      ${item.myths.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>

    ${item.sources ? `<div class="section-title">📚 Fontes</div>
    <div class="section-body">
      <p>${item.sources}</p>
    </div>` : ''}`;
}

// ===== TELA PERSONAGENS =====
function renderCharacters() {
  const worlds = [...new Set(ALL_CHARACTERS.map(c => c.world))].sort();

  let html = `
    <div class="search-bar">
      <input type="text" id="chars-search" placeholder="exiva \"nome\"..." value="${state.searchQuery}">
    </div>
    <div class="filter-bar">
      <button class="filter-btn ${state.charFilterVoc === 'all' ? 'active' : ''}" onclick="filterCharsVoc('all')">Todas</button>
      <button class="filter-btn ${state.charFilterVoc === 'EK' ? 'active' : ''}" onclick="filterCharsVoc('EK')">⚔️ EK</button>
      <button class="filter-btn ${state.charFilterVoc === 'RP' ? 'active' : ''}" onclick="filterCharsVoc('RP')">🏹 RP</button>
      <button class="filter-btn ${state.charFilterVoc === 'ED' ? 'active' : ''}" onclick="filterCharsVoc('ED')">🌿 ED</button>
      <button class="filter-btn ${state.charFilterVoc === 'MS' ? 'active' : ''}" onclick="filterCharsVoc('MS')">🔥 MS</button>
      <button class="filter-btn ${state.charFilterVoc === 'MO' ? 'active' : ''}" onclick="filterCharsVoc('MO')">🥋 MO</button>
    </div>
    <div class="sort-bar">
      <label>Mundo:</label>
      <select id="chars-world" onchange="filterCharsWorld(this.value)">
        <option value="all" ${state.charFilterWorld === 'all' ? 'selected' : ''}>Todos</option>
        ${worlds.map(w => `<option value="${w}" ${state.charFilterWorld === w ? 'selected' : ''}>${w}</option>`).join('')}
      </select>
      <label>Ordenar:</label>
      <select id="chars-sort" onchange="sortChars(this.value)">
        <option value="alpha-asc" ${state.charSort === 'alpha-asc' ? 'selected' : ''}>A → Z</option>
        <option value="alpha-desc" ${state.charSort === 'alpha-desc' ? 'selected' : ''}>Z → A</option>
        <option value="level-desc" ${state.charSort === 'level-desc' ? 'selected' : ''}>Level ↓</option>
        <option value="level-asc" ${state.charSort === 'level-asc' ? 'selected' : ''}>Level ↑</option>
      </select>
    </div>`;

  let chars = ALL_CHARACTERS;

  // Filtro por busca
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    chars = chars.filter(c => c.name.toLowerCase().includes(q) || c.world.toLowerCase().includes(q));
  }

  // Filtro por vocação
  if (state.charFilterVoc !== 'all') {
    chars = chars.filter(c => c.vocShort === state.charFilterVoc);
  }

  // Filtro por servidor
  if (state.charFilterWorld !== 'all') {
    chars = chars.filter(c => c.world === state.charFilterWorld);
  }

  // Ordenação
  chars = [...chars].sort((a, b) => {
    switch (state.charSort) {
      case 'alpha-asc': return a.name.localeCompare(b.name);
      case 'alpha-desc': return b.name.localeCompare(a.name);
      case 'level-desc': return b.level - a.level;
      case 'level-asc': return a.level - b.level;
      default: return 0;
    }
  });

  if (chars.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-state-icon"><img src="icons/history-book.png" alt="" style="width:48px;height:48px;"></div>
        <div class="empty-state-text">Nenhum char encontrado...</div>
      </div>`;
  } else {
    html += `<div class="tibia-panel"><div class="tibia-panel-header"><span><img src="icons/history-book.png" alt="" style="width:18px;height:18px;vertical-align:middle;"></span><h2>Todas as Histórias (${chars.length})</h2></div><div class="tibia-panel-body">`;
    chars.forEach(char => {
      html += renderCharCard(char, char.isHighlighted);
    });
    html += `</div></div>`;
  }

  return html;
}

function filterCharsVoc(voc) {
  state.charFilterVoc = voc;
  renderScreen();
}

function filterCharsWorld(world) {
  state.charFilterWorld = world;
  renderScreen();
}

function sortChars(sort) {
  state.charSort = sort;
  renderScreen();
}

// ===== TELA HISTÓRIA DO PERSONAGEM =====
function renderCharacterStory(char) {
  if (!char) return '<div class="empty-state"><div class="empty-state-text">Char não encontrado</div></div>';

  const vocBadgeClass = char.vocShort === 'EK' ? 'badge-ek'
    : char.vocShort === 'RP' ? 'badge-rp'
      : char.vocShort === 'MS' ? 'badge-ms' : 'badge-ed';

  return `
    <div class="detail-hero">
      <div class="detail-hero-image">${char.avatarEmoji}</div>
      <h2>${char.name}</h2>
      <div class="detail-badges">
        <span class="badge ${vocBadgeClass}">${char.vocation}</span>
        <span class="badge badge-level">Level ${char.level}</span>
        <span class="badge badge-world">${char.world}</span>
        ${char.isHighlighted ? '<span class="badge badge-highlighted glow-pulse">⭐ Em Destaque</span>' : ''}
      </div>
      <div class="story-meta">
        <span>📅 Publicado em ${formatDate(char.createdAt)}</span>
      </div>
    </div>

    <div class="section-title">📜 ${char.storyTitle}</div>
    <div class="section-body">
      ${char.storyContent.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    </div>`;
}

// ===== TELA MINHA CONTA =====
function renderAccount() {
  let html = `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>🔑</span>
        <h2>Meu Token de Verificação</h2>
      </div>
      <div class="tibia-panel-body">
        <div class="token-box">
          <div class="token-label">Seu token único e pessoal</div>
          <div class="token-value">${USER_TOKEN}</div>
          <button class="token-copy-btn" onclick="copyToken(this)">📋 Copiar Token</button>
        </div>
        <div class="tibia-notice">
          ℹ️ Use este token para verificar que um personagem é seu. Cole-o na descrição do seu char no site oficial do Tibia (tibia.com → My Account → Edit Comment).
        </div>
      </div>
    </div>

    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>⚔️</span>
        <h2>Meus Chars</h2>
      </div>
      <div class="tibia-panel-body">`;

  if (MY_CHARACTERS.length === 0) {
    html += `
        <div class="empty-state" style="padding:20px 0;">
          <div class="empty-state-icon">🛡️</div>
          <div class="empty-state-text">Nenhum char vinculado</div>
        </div>`;
  } else {
    MY_CHARACTERS.forEach(char => {
      const vocBadgeClass = char.vocShort === 'EK' ? 'badge-ek'
        : char.vocShort === 'RP' ? 'badge-rp'
          : char.vocShort === 'MS' ? 'badge-ms' : 'badge-ed';

      html += `
        <div class="my-char-item">
          <div class="char-info" style="flex:1;">
            <div class="char-name">${char.name}</div>
            <div class="char-details">
              <span class="badge ${vocBadgeClass}" style="font-size:9px;padding:1px 5px;">${char.vocShort}</span>
              Level ${char.level} • ${char.world}
              ${char.isVerified
          ? '<span class="badge badge-verified" style="font-size:9px;padding:1px 5px;">✅ Vinculado</span>'
          : '<span class="badge badge-pending" style="font-size:9px;padding:1px 5px;">⏳ Pendente</span>'}
            </div>
          </div>
          <div class="my-char-actions">
            ${!char.isVerified ? `<button onclick="navigateTo('verify-character', {id: ${char.id}})">Vincular</button>` : ''}
            ${char.isVerified && !char.hasStory ? `<button onclick="navigateTo('edit-story', {id: ${char.id}})">Escrever</button>` : ''}
            ${char.isVerified && char.hasStory ? `<button onclick="navigateTo('edit-story', {id: ${char.id}})">Editar</button>` : ''}
            ${char.isVerified ? `<button onclick="navigateTo('highlight', {id: ${char.id}})">⭐</button>` : ''}
          </div>
        </div>`;
    });
  }

  html += `
      </div>
    </div>

    <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="navigateTo('add-character')" style="margin-top:8px;">
      ➕ Adicionar Char
    </button>

    <div class="tibia-divider"><span>✦ ✦ ✦</span></div>

    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>ℹ️</span>
        <h2>Sobre o App</h2>
      </div>
      <div class="tibia-panel-body" style="font-size:12px; color: var(--text-muted);">
        <p><strong>Tibia Stories</strong> v1.0.0</p>
        <p style="margin-top:6px;">Um app para a comunidade de Tibia compartilhar histórias, mitos e lendas.</p>
        <p style="margin-top:6px;">⚠️ Se reinstalar o app, seu token será perdido e você precisará verificar seus personagens novamente.</p>
      </div>
    </div>

    <div style="text-align:center; margin: 20px 0 10px;">
      <button class="btn-logout" onclick="navigateTo('login')">Sair</button>
    </div>`;

  return html;
}
function renderAddCharacter() {
  return `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>🔍</span>
        <h2>Exiva — Localizar Char</h2>
      </div>
      <div class="tibia-panel-body">
        <div class="tibia-input-group">
          <label class="tibia-label">Nome do Char no Tibia</label>
          <input type="text" class="tibia-input" id="char-name-input" placeholder="Ex: Bubble, Kharsek...">
        </div>
        <button class="tibia-btn tibia-btn-full" onclick="mockSearchCharacter()">
          🔍 Exiva!
        </button>
      </div>
    </div>

    <div id="search-result" style="display:none;">
      <div class="tibia-divider"><span>Resultado</span></div>
      <div class="tibia-panel">
        <div class="tibia-panel-header">
          <span>✅</span>
          <h2>Char Localizado</h2>
        </div>
        <div class="tibia-panel-body">
          <div class="char-card" style="cursor:default; margin-bottom:12px;">
            <div class="char-avatar">🛡️</div>
            <div class="char-info">
              <div class="char-name" id="found-char-name">Bubble</div>
              <div class="char-details" id="found-char-details">Knight • Level 273 • Refugia</div>
            </div>
          </div>
          <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="navigateTo('verify-character', {id: 999, name: 'Bubble'})">
            ➕ Adicionar & Vincular
          </button>
        </div>
      </div>
    </div>

    <div id="search-error" style="display:none;">
      <div class="tibia-notice warning" style="margin-top:12px;">
        ⚠️ Char não encontrado. Verifique o nick e tente novamente.
      </div>
    </div>

    <div class="tibia-notice" style="margin-top:12px;">
      ℹ️ O nome deve ser exatamente como aparece em tibia.com. A busca utiliza a API pública TibiaData.
    </div>`;
}

function mockSearchCharacter() {
  const input = document.getElementById('char-name-input');
  const name = input.value.trim();

  document.getElementById('search-error').style.display = 'none';
  document.getElementById('search-result').style.display = 'none';

  if (!name) {
    document.getElementById('search-error').style.display = 'block';
    return;
  }

  // Simula busca (no protótipo sempre encontra)
  document.getElementById('found-char-name').textContent = name;
  document.getElementById('found-char-details').textContent = `Knight • Level 273 • Refugia`;
  document.getElementById('search-result').style.display = 'block';
  document.getElementById('search-result').classList.add('fade-in');
}

// ===== TELA VERIFICAR PERSONAGEM =====
function renderVerifyCharacter() {
  const charName = state.currentParams?.name || 'Wild Hunter';

  return `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>🔐</span>
        <h2>Quest de Vínculo: ${charName}</h2>
      </div>
      <div class="tibia-panel-body">
        <p style="font-size:13px; margin-bottom:12px; color: var(--text-secondary);">
          Para vincular <strong style="color:var(--text-white);">${charName}</strong> à sua conta, cole o token abaixo no comment dele em tibia.com.
        </p>

        <div class="token-box">
          <div class="token-label">Seu Token</div>
          <div class="token-value">${USER_TOKEN}</div>
          <button class="token-copy-btn" onclick="copyToken(this)">📋 Copiar Token</button>
        </div>
      </div>
    </div>

    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>📋</span>
        <h2>Instruções da quest</h2>
      </div>
      <div class="tibia-panel-body">
        <ul class="instructions-list">
          <li>
            <span class="step-num">1</span>
            Copie o token acima tocando no botão "Copiar Token".
          </li>
          <li>
            <span class="step-num">2</span>
            Acesse <strong style="color:var(--text-white);">tibia.com</strong> e faça login na sua conta.
          </li>
          <li>
            <span class="step-num">3</span>
            Vá em <strong style="color:var(--text-white);">My Account → Edit Comment</strong>.
          </li>
          <li>
            <span class="step-num">4</span>
            Cole o token em qualquer parte do comment do char e salve.
          </li>
          <li>
            <span class="step-num">5</span>
            Volte aqui e toque em <strong style="color:var(--text-highlight);">"Vincular Agora"</strong>.
          </li>
        </ul>
      </div>
    </div>

    <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="mockVerify()" style="margin-top:4px;">
      ✅ Vincular Agora
    </button>

    <div id="verify-result" style="display:none; margin-top:12px;"></div>

    <div class="tibia-notice warning" style="margin-top:12px;">
      ⏳ A quest pode levar até 5 minutos, pois a API do TibiaData possui cache. Seja paciente, aventureiro!
    </div>

    <div class="tibia-notice" style="margin-top:8px;">
      ℹ️ Após o fim da quest de vínculo, você pode remover a runa do comment do personagem se desejar.
    </div>`;
}

function mockVerify() {
  const result = document.getElementById('verify-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="tibia-notice success fade-in">
      ✅ <strong>Personagem vinculado com sucesso!</strong><br>
      O token foi encontrado no comment do personagem. Agora você pode escrever sua história!
    </div>`;
}

// ===== TELA EDITAR HISTÓRIA =====
function renderEditStory() {
  const char = MY_CHARACTERS.find(c => c.id === state.currentParams?.id);
  const charName = char ? char.name : 'Personagem';

  return `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>✏️</span>
        <h2>História de ${charName}</h2>
      </div>
      <div class="tibia-panel-body">
        <div class="tibia-input-group">
          <label class="tibia-label">Título da História</label>
          <input type="text" class="tibia-input" placeholder="Ex: A Lenda de Antica..." value="${char?.storyTitle || ''}">
        </div>
        <div class="tibia-input-group">
          <label class="tibia-label">Sua História</label>
          <textarea class="tibia-textarea" placeholder="Conte as aventuras do seu char... hunts épicas, quests lendárias, guerras, amizades e tudo que tornou sua jornada em Tibia única."></textarea>
        </div>

        <div class="tibia-notice" style="margin-bottom:12px;">
          ✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser. Outros aventureiros poderão ler na aba de Chars.
        </div>

        <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="mockSaveStory()">
          💾 Salvar História
        </button>

        <div id="save-result" style="display:none; margin-top:12px;"></div>
      </div>
    </div>`;
}

function mockSaveStory() {
  const result = document.getElementById('save-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="tibia-notice success fade-in">
      ✅ <strong>História salva com sucesso!</strong><br>
      Seu char agora aparece nas Histórias dos Aventureiros.
    </div>`;
}

// ===== TELA DESTACAR PERSONAGEM =====
function renderHighlight() {
  const char = MY_CHARACTERS.find(c => c.id === state.currentParams?.id);
  const charName = char ? char.name : 'Personagem';

  return `
    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>⭐</span>
        <h2>Destacar ${charName}</h2>
      </div>
      <div class="tibia-panel-body">
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">
          Ao destacar seu personagem, ele aparecerá na <strong style="color:var(--text-highlight);">página principal</strong> do app por <strong style="color:var(--text-highlight);">7 dias</strong>, visível para todos os usuários!
        </p>

        <div class="price-box">
          <div class="price-value">R$ 5,00</div>
          <div class="price-desc">Destaque por 7 dias na Home</div>
        </div>

        <div style="font-size:12px; color:var(--text-secondary); margin-bottom:16px;">
          <p>✦ Seu personagem aparecerá com destaque dourado e estrela.</p>
          <p style="margin-top:4px;">✦ A compra é processada pela ${navigator.userAgent.includes('iPhone') ? 'App Store' : 'Google Play'}.</p>
          <p style="margin-top:4px;">✦ O destaque é ativado imediatamente após a confirmação.</p>
        </div>

        <button class="tibia-btn tibia-btn-gold tibia-btn-full glow-pulse" onclick="mockPurchase()">
          ⭐ Comprar Destaque — R$ 5,00
        </button>

        <div id="purchase-result" style="display:none; margin-top:12px;"></div>
      </div>
    </div>

    <div class="tibia-notice" style="margin-top:8px;">
      ℹ️ Requisitos: personagem verificado e com história escrita.
    </div>`;
}

function mockPurchase() {
  const result = document.getElementById('purchase-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="tibia-notice success fade-in">
      ✅ <strong>Compra realizada com sucesso!</strong><br>
      Seu personagem está em destaque na Home por 7 dias a partir de agora. Parabéns!
    </div>`;
}

// ===== TELA LOGIN =====
function renderLogin() {
  return `
    <div style="text-align:center; padding: 20px 0 16px;">
      <div style="font-size:48px; margin-bottom:8px;">�</div>
      <h2 style="font-family:var(--font-body); font-size:22px; font-weight:bold; color:#5A2800; margin-bottom:4px;">Tibia Stories</h2>
      <p style="font-size:12px; color:var(--text-muted);">Entre para gerenciar seus chars e histórias</p>
    </div>

    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>🔑</span>
        <h2>Entrar</h2>
      </div>
      <div class="tibia-panel-body">
        <div class="tibia-input-group">
          <label class="tibia-label">E-mail</label>
          <input type="email" class="tibia-input" id="login-email" placeholder="seu@email.com">
        </div>
        <div class="tibia-input-group">
          <label class="tibia-label">Senha</label>
          <input type="password" class="tibia-input" id="login-password" placeholder="Sua senha">
        </div>
        <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="mockLogin()" style="margin-top:4px;">
          Entrar
        </button>
        <div style="text-align:right; margin-top:8px;">
          <a href="#" onclick="alert('Um e-mail de recuperação será enviado.'); return false;" style="font-size:12px; color:var(--text-secondary); text-decoration:underline;">Esqueceu a senha?</a>
        </div>
      </div>
    </div>

    <div class="login-separator">
      <span>— ou —</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      <button class="btn-social btn-google" onclick="mockLogin()">
        <span class="btn-social-icon">G</span>
        Entrar com Google
      </button>
      <button class="btn-social btn-apple" onclick="mockLogin()">
        <span class="btn-social-icon"></span>
        Entrar com Apple
      </button>
    </div>

    <div style="text-align:center; margin-top:20px; font-size:13px;">
      <span style="color:var(--text-muted);">Não tem conta? </span>
      <a href="#" onclick="navigateTo('register'); return false;" style="color:#5A2800; font-weight:bold; text-decoration:underline;">Criar Conta</a>
    </div>

    <div id="login-result" style="display:none; margin-top:12px;"></div>`;
}

function mockLogin() {
  const result = document.getElementById('login-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="tibia-notice success fade-in">
      ✅ <strong>Login realizado com sucesso!</strong><br>
      Entrando em mainland...
    </div>`;
  setTimeout(() => navigateTo('account'), 1500);
}

// ===== TELA CRIAR CONTA =====
function renderRegister() {
  return `
    <div style="text-align:center; padding: 20px 0 16px;">
      <div style="font-size:48px; margin-bottom:8px;">🛡️</div>
      <h2 style="font-family:var(--font-body); font-size:22px; font-weight:bold; color:#5A2800; margin-bottom:4px;">Criar Conta</h2>
      <p style="font-size:12px; color:var(--text-muted);">Atravesse o TP e junte-se à comunidade de Tibia Stories</p>
    </div>

    <div class="tibia-panel">
      <div class="tibia-panel-header">
        <span>✏️</span>
        <h2>Dados da Conta</h2>
      </div>
      <div class="tibia-panel-body">
        <div class="tibia-input-group">
          <label class="tibia-label">Nome (opcional)</label>
          <input type="text" class="tibia-input" id="register-name" placeholder="Como quer ser chamado?">
        </div>
        <div class="tibia-input-group">
          <label class="tibia-label">E-mail</label>
          <input type="email" class="tibia-input" id="register-email" placeholder="seu@email.com">
        </div>
        <div class="tibia-input-group">
          <label class="tibia-label">Senha (mín. 6 caracteres)</label>
          <input type="password" class="tibia-input" id="register-password" placeholder="Crie uma senha">
        </div>
        <div class="tibia-input-group">
          <label class="tibia-label">Confirmar Senha</label>
          <input type="password" class="tibia-input" id="register-confirm" placeholder="Repita a senha">
        </div>
        <button class="tibia-btn tibia-btn-primary tibia-btn-full" onclick="mockRegister()" style="margin-top:4px;">
          Criar Conta
        </button>
      </div>
    </div>

    <div class="login-separator">
      <span>— ou —</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      <button class="btn-social btn-google" onclick="mockRegister()">
        <span class="btn-social-icon">G</span>
        Registrar com Google
      </button>
      <button class="btn-social btn-apple" onclick="mockRegister()">
        <span class="btn-social-icon"></span>
        Registrar com Apple
      </button>
    </div>

    <div style="text-align:center; margin-top:20px; font-size:13px;">
      <span style="color:var(--text-muted);">Já tem conta? </span>
      <a href="#" onclick="navigateTo('login'); return false;" style="color:#5A2800; font-weight:bold; text-decoration:underline;">Entrar</a>
    </div>

    <div id="register-result" style="display:none; margin-top:12px;"></div>`;
}

function mockRegister() {
  const result = document.getElementById('register-result');
  result.style.display = 'block';
  result.innerHTML = `
    <div class="tibia-notice success fade-in">
      ✅ <strong>Conta criada com sucesso!</strong><br>
      Seu token foi gerado. Redirecionando...
    </div>`;
  setTimeout(() => navigateTo('account'), 1500);
}

// ===== COMPONENTES REUTILIZÁVEIS =====
function renderCharCard(char, highlighted) {
  const vocBadgeClass = char.vocShort === 'EK' ? 'badge-ek'
    : char.vocShort === 'RP' ? 'badge-rp'
      : char.vocShort === 'MS' ? 'badge-ms' : 'badge-ed';

  return `
    <div class="char-card ${highlighted ? 'highlighted' : ''}" onclick="navigateTo('character-story', {id: ${char.id}})">
      <div class="char-avatar">${char.avatarEmoji}</div>
      <div class="char-info">
        <div class="char-name">${char.name}</div>
        <div class="char-details">
          <span class="badge ${vocBadgeClass}" style="font-size:9px;padding:1px 5px;">${char.vocShort}</span>
          Level ${char.level} • ${char.world}
        </div>
        <div class="char-story-preview">"${char.storyTitle}"</div>
      </div>
      <div class="char-arrow">›</div>
    </div>`;
}

// ===== UTILITÁRIOS =====
function copyToken(btn) {
  navigator.clipboard?.writeText(USER_TOKEN).then(() => {
    btn.textContent = '✅ Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copiar Token';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback para ambientes sem clipboard API
    btn.textContent = '✅ Copiado!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copiar Token';
      btn.classList.remove('copied');
    }, 2000);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function attachSearchListeners() {
  const itemsSearch = document.getElementById('items-search');
  if (itemsSearch) {
    itemsSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      // Re-render apenas o conteúdo dos itens
      const content = document.getElementById('content-area');
      content.innerHTML = `<div class="fade-in">${renderItems()}</div>`;
      // Re-focus no input
      const newInput = document.getElementById('items-search');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
      attachSearchListeners();
    });
  }

  const charsSearch = document.getElementById('chars-search');
  if (charsSearch) {
    charsSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      const content = document.getElementById('content-area');
      content.innerHTML = `<div class="fade-in">${renderCharacters()}</div>`;
      const newInput = document.getElementById('chars-search');
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
      attachSearchListeners();
    });
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  state.searchQuery = '';
  renderScreen();
});
