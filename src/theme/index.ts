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

        // Badges — rarity accent colors
        badgeLegendary: '#FF8C00',
        badgeVeryRare: '#9B59B6',
        badgeRare: '#3498DB',
        badgeEK: '#C0392B',
        badgeRP: '#27AE60',
        badgeED: '#8E44AD',
        badgeMS: '#2980B9',
        badgeMO: '#D4A66A',

        // Badge variant backgrounds / borders / text (prototype/styles.css)
        badgeVocationBg: '#E8C0C0',
        badgeVocationBorder: '#C08080',
        badgeVocationText: '#8B1A1A',
        badgeStatusBg: '#C0E8C8',
        badgeStatusBorder: '#80C090',
        badgeStatusText: '#1A6B2A',
        badgeWorldBg: '#C0D8E8',
        badgeWorldBorder: '#80A8C0',
        badgeWorldText: '#1A4060',
        badgeLevelBg: '#E8D8B0',
        badgeLevelBorder: '#C0A870',
    },

    fonts: {
        title: 'MedievalSharp',
        body: 'Martel',
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
