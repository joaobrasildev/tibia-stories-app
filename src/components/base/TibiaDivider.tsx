import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaDividerProps {
    ornament?: string;
}

function TibiaDivider({ ornament = '✦ ✦ ✦' }: TibiaDividerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <TibiaText style={styles.ornament}>{ornament}</TibiaText>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.borderInner,
    },
    ornament: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
        paddingHorizontal: theme.spacing.md,
    },
});

export default React.memo(TibiaDivider);
