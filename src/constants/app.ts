/**
 * Textos imersivos do app — referência: general-plan.md seção 8.2
 * Todos os textos entre aspas usados nas telas.
 */

export const APP_TEXTS = {
    // ── Geral ──────────────────────────────────────────────
    appName: 'Tibia Stories',

    // ── Tela 1: Depot (Home) ──────────────────────────────
    depot: {
        highlightTitle: '⭐ Chars em Destaque',
        highlightEmpty: 'Nenhum char em destaque no momento...',
        recentTitle: 'Histórias Recentes',
    },

    // ── Tela 2: Itens ─────────────────────────────────────
    items: {
        panelTitle: 'Itens Lendários & Raros',
        searchPlaceholder: 'Buscar item por nome...',
        empty: 'Nenhum item encontrado...',
    },

    // ── Tela 2.1: Detalhe do Item ─────────────────────────
    itemDetail: {
        originTitle: '📜 Origem',
        loreTitle: '📖 Lore',
        mythsTitle: '🔮 Mitos & Lendas',
        sourcesTitle: '📚 Fontes',
    },

    // ── Tela 3: Chars ─────────────────────────────────────
    chars: {
        panelTitle: 'Todas as Histórias',
        searchPlaceholder: 'exiva "nome"...',
        empty: 'Nenhum char encontrado...',
    },

    // ── Tela 3.1: História do Char ────────────────────────
    charDetail: {
        highlightBadge: '⭐ Em Destaque',
        notFound: 'Char não encontrado',
    },

    // ── Tela 4: Conta ─────────────────────────────────────
    account: {
        tokenTitle: '🔑 Meu Token de Verificação',
        myCharsTitle: '⚔️ Meus Chars',
        addCharBtn: '➕ Adicionar Char',
        aboutTitle: 'ℹ️ Sobre o App',
        logoutBtn: 'Sair',
        noChars: 'Nenhum char vinculado',
        statusVerified: '✅ Vinculado',
        statusPending: '⏳ Pendente',
    },

    // ── Tela 4.0a: Login ─────────────────────────────────
    login: {
        title: 'Tibia Stories',
        subtitle: 'Entre para gerenciar seus chars e histórias',
        panelTitle: '🔑 Entrar',
        emailLabel: 'E-mail',
        passwordLabel: 'Senha',
        submitBtn: 'Entrar',
        forgotPassword: 'Esqueceu a senha?',
        separator: '— ou —',
        googleBtn: 'Entrar com Google',
        appleBtn: 'Entrar com Apple',
        registerLink: 'Não tem conta? Criar Conta',
        success: '✅ Login realizado com sucesso! Entrando em mainland...',
    },

    // ── Tela 4.0b: Criar Conta ───────────────────────────
    register: {
        title: 'Criar Conta',
        subtitle: 'Atravesse o TP e junte-se à comunidade de Tibia Stories',
        panelTitle: '✏️ Dados da Conta',
        nameLabel: 'Nome',
        namePlaceholder: 'Como quer ser chamado?',
        emailLabel: 'E-mail',
        passwordLabel: 'Senha',
        confirmPasswordLabel: 'Confirmar Senha',
        submitBtn: 'Criar Conta',
        separator: '— ou —',
        googleBtn: 'Registrar com Google',
        appleBtn: 'Registrar com Apple',
        loginLink: 'Já tem conta? Entrar',
        success: '✅ Conta criada com sucesso!',
    },

    // ── Tela 4.1: Exiva (Adicionar Char) ─────────────────
    exiva: {
        panelTitle: '🔍 Exiva — Localizar Char',
        inputLabel: 'Nome do Char no Tibia',
        inputPlaceholder: 'Ex: Bubble, Kharsek...',
        searchBtn: '🔍 Exiva!',
        resultTitle: '✅ Char Localizado',
        addBtn: '➕ Adicionar & Vincular',
        errorNotFound: '⚠️ Char não encontrado. Verifique o nick e tente novamente.',
        infoNote: 'ℹ️ O nome deve ser exatamente como aparece em tibia.com. A busca utiliza a API pública TibiaData.',
    },

    // ── Tela 4.2: Quest de Vínculo ───────────────────────
    questVinculo: {
        panelTitle: (charName: string) => `🔐 Quest de Vínculo: ${charName}`,
        description: (charName: string) =>
            `Para vincular ${charName} à sua conta, cole o token abaixo no comment dele em tibia.com.`,
        instructionsTitle: '📋 Instruções da quest',
        step1: 'Copie o token acima tocando no botão "Copiar Token".',
        step2: 'Acesse tibia.com e faça login na sua conta.',
        step3: 'Vá em My Account → Edit Comment.',
        step4: 'Cole o token em qualquer parte do comment do char e salve.',
        step5: 'Volte aqui e toque em "Vincular Agora".',
        verifyBtn: '✅ Vincular Agora',
        waitWarning:
            '⏳ A quest pode levar até 5 minutos, pois a API do TibiaData possui cache. Seja paciente, aventureiro!',
        postVerifyNote:
            'ℹ️ Após o fim da quest de vínculo, você pode remover a runa do comment do personagem se desejar.',
        success:
            '✅ Personagem vinculado com sucesso! O token foi encontrado no comment do personagem. Agora você pode escrever sua história!',
    },

    // ── Tela 4.3: Editar História ─────────────────────────
    editStory: {
        panelTitle: (charName: string) => `✏️ História de ${charName}`,
        titleLabel: 'Título da História',
        titlePlaceholder: 'Ex: A Lenda de Antica...',
        contentLabel: 'Sua História',
        contentPlaceholder:
            'Conte as aventuras do seu char... hunts épicas, quests lendárias, guerras, amizades e tudo que tornou sua jornada em Tibia única.',
        writeNote:
            '✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser. Outros aventureiros poderão ler na aba de Chars.',
        saveBtn: '💾 Salvar História',
        success: '✅ História salva com sucesso! Seu char agora aparece nas Histórias dos Aventureiros.',
    },

    // ── Tela 4.4: Destacar Char ──────────────────────────
    highlight: {
        panelTitle: (charName: string) => `⭐ Destacar ${charName}`,
        description:
            'Ao destacar seu personagem, ele aparecerá na página principal do app por 7 dias, visível para todos os usuários!',
        price: 'R$ 5,00',
        duration: '7 dias',
        buyBtn: '⭐ Comprar Destaque — R$ 5,00',
        requirementsNote: 'ℹ️ Requisitos: personagem verificado e com história escrita.',
        success: '✅ Compra realizada com sucesso! Seu personagem está em destaque na Home por 7 dias.',
    },
} as const;
