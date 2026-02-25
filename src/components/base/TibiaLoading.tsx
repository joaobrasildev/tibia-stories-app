import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaLoadingProps {
    message?: string;
}

function TibiaLoading({ message }: TibiaLoadingProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={theme.colors.gold} />
            {message ? (
                <TibiaText style={styles.message}>{message}</TibiaText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xxl,
    },
    message: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.lg,
        textAlign: 'center',
    },
});

export default React.memo(TibiaLoading);
