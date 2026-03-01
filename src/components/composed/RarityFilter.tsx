import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import type { ItemRarity } from '@/types/item';

interface RarityFilterProps {
    activeFilter: ItemRarity | 'all';
    onFilterChange: (filter: ItemRarity | 'all') => void;
}

const FILTERS: { key: ItemRarity | 'all'; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'Legendary', label: '🟠 Legendary' },
    { key: 'Very Rare', label: '🟣 Very Rare' },
    { key: 'Rare', label: '🔵 Rare' },
];

function RarityFilter({ activeFilter, onFilterChange }: RarityFilterProps) {
    return (
        <View style={styles.container}>
            {FILTERS.map((filter) => (
                <TouchableOpacity
                    key={filter.key}
                    style={[
                        styles.button,
                        activeFilter === filter.key && styles.buttonActive,
                    ]}
                    onPress={() => onFilterChange(filter.key)}
                    activeOpacity={0.7}
                >
                    <TibiaText
                        style={[
                            styles.label,
                            activeFilter === filter.key && styles.labelActive,
                        ]}
                    >
                        {filter.label}
                    </TibiaText>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.gap,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    button: {
        paddingVertical: theme.spacing.chipY,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.panelAlt,
        ...theme.borders.panelInner,
        borderRadius: theme.radius.sm,
    },
    buttonActive: {
        backgroundColor: theme.colors.gold,
        borderColor: theme.colors.borderOuter,
    },
    label: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xxs,
        color: theme.colors.textPrimary,
    },
    labelActive: {
        color: theme.colors.textDark,
        fontFamily: theme.fonts.bodySemiBold,
    },
});

export default React.memo(RarityFilter);
