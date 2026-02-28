import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaInput from '@/components/base/TibiaInput';
import { APP_TEXTS } from '@/constants/app';

interface CharSearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
}

function CharSearchBar({ query, onQueryChange }: CharSearchBarProps) {
    return (
        <View style={styles.container}>
            <TibiaInput
                placeholder={APP_TEXTS.chars.searchPlaceholder}
                value={query}
                onChangeText={onQueryChange}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
});

export default React.memo(CharSearchBar);
