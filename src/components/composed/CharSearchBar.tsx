import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import { APP_TEXTS } from '@/constants/app';

interface CharSearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
}

function CharSearchBar({ query, onQueryChange }: CharSearchBarProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={APP_TEXTS.chars.searchPlaceholder}
                placeholderTextColor={theme.colors.textMuted}
                value={query}
                onChangeText={onQueryChange}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.panel,
        ...theme.borders.input,
        borderRadius: theme.radius.sm,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
});

export default React.memo(CharSearchBar);
