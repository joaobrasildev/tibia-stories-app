import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TibiaText from '@/components/base/TibiaText';
import { theme } from '@/theme';
import { APP_TEXTS } from '@/constants/app';

function AppHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={[
                    theme.colors.headerBg,
                    theme.colors.headerBg,
                    theme.colors.headerBg,
                ]}
                style={styles.gradient}
            >
                {/* <View style={styles.borderTop} /> */}
                <View style={styles.content}>
                    <TibiaText style={styles.ornament}>⚔</TibiaText>
                    <TibiaText style={styles.title}>{APP_TEXTS.appName}</TibiaText>
                    <TibiaText style={styles.ornament}>⚔</TibiaText>
                </View>
                <View style={styles.borderBottom} />
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.headerBg,
        ...theme.shadows.header,
    },
    gradient: {
        width: '100%',
    },
    borderTop: {
        height: 3,
        backgroundColor: theme.colors.gold,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    title: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSizes.title,
        color: theme.colors.textOnHeader,
        letterSpacing: 1,
    },
    ornament: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.gold,
    },
    borderBottom: {
        height: 2,
        backgroundColor: theme.colors.textDark,
    },
});

export default React.memo(AppHeader);
