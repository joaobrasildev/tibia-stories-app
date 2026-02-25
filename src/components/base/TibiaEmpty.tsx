import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaEmptyProps {
    message: string;
    icon?: string;
}

function TibiaEmpty({ message, icon = '📜' }: TibiaEmptyProps) {
    return (
        <View style={styles.container}>
            <TibiaText style={styles.icon}>{icon}</TibiaText>
            <TibiaText style={styles.message}>{message}</TibiaText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xxxl,
        paddingHorizontal: theme.spacing.xl,
    },
    icon: {
        fontSize: 48,
        marginBottom: theme.spacing.md,
        opacity: 0.5,
    },
    message: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});

export default React.memo(TibiaEmpty);
