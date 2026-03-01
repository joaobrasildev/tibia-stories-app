import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import type { Vocation } from '@/types/character';

interface VocationOption {
    key: Vocation | 'all';
    label: string;
    emoji: string;
}

const VOCATION_OPTIONS: VocationOption[] = [
    { key: 'all', label: 'Todas', emoji: '' },
    { key: 'Elite Knight', label: 'EK', emoji: '⚔️' },
    { key: 'Royal Paladin', label: 'RP', emoji: '🏹' },
    { key: 'Elder Druid', label: 'ED', emoji: '🌿' },
    { key: 'Master Sorcerer', label: 'MS', emoji: '🔥' },
    { key: 'Monk', label: 'MO', emoji: '🥋' },
];

interface VocationFilterProps {
    activeFilter: Vocation | 'all';
    onFilterChange: (vocation: Vocation | 'all') => void;
}

function VocationFilter({ activeFilter, onFilterChange }: VocationFilterProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {VOCATION_OPTIONS.map((option) => {
                const isActive = activeFilter === option.key;
                return (
                    <TouchableOpacity
                        key={option.key}
                        style={[styles.btn, isActive && styles.btnActive]}
                        onPress={() => onFilterChange(option.key)}
                        activeOpacity={0.7}
                    >
                        <TibiaText
                            style={[styles.btnText, isActive && styles.btnTextActive]}
                        >
                            {option.emoji ? `${option.emoji} ` : ''}{option.label}
                        </TibiaText>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: theme.spacing.gap,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    btn: {
        paddingVertical: theme.spacing.chipY,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        ...theme.borders.panelInner,
        borderRadius: theme.radius.sm,
    },
    btnActive: {
        backgroundColor: theme.colors.gold,
        borderColor: theme.colors.borderGold,
    },
    btnText: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.xxs,
        color: theme.colors.textSecondary,
    },
    btnTextActive: {
        color: theme.colors.textDark,
    },
});

export default React.memo(VocationFilter);
