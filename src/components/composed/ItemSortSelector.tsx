import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import type { ItemSort } from '@/types/item';

interface SortOption {
    key: ItemSort;
    label: string;
}

const SORT_OPTIONS: SortOption[] = [
    { key: 'name-asc', label: 'A → Z' },
    { key: 'name-desc', label: 'Z → A' },
    { key: 'rarity-desc', label: 'Raridade ↓' },
    { key: 'rarity-asc', label: 'Raridade ↑' },
];

interface ItemSortSelectorProps {
    activeSort: ItemSort;
    onSortChange: (sort: ItemSort) => void;
}

function ItemSortSelector({ activeSort, onSortChange }: ItemSortSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeLabel = SORT_OPTIONS.find((o) => o.key === activeSort)?.label ?? 'A → Z';

    const handleSelect = useCallback((sort: ItemSort) => {
        onSortChange(sort);
        setIsOpen(false);
    }, [onSortChange]);

    return (
        <View style={styles.container}>
            <TibiaText style={styles.label}>Ordenar:</TibiaText>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <TibiaText style={styles.selectorText}>{activeLabel}</TibiaText>
                <TibiaText style={styles.arrow}>▾</TibiaText>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
                    <View style={styles.dropdown}>
                        {SORT_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[
                                    styles.option,
                                    activeSort === option.key && styles.optionActive,
                                ]}
                                onPress={() => handleSelect(option.key)}
                                activeOpacity={0.7}
                            >
                                <TibiaText
                                    style={[
                                        styles.optionText,
                                        activeSort === option.key && styles.optionTextActive,
                                    ]}
                                >
                                    {option.label}
                                </TibiaText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    label: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: 11,
        color: theme.colors.textPrimary,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 5,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
    },
    selectorText: {
        fontFamily: theme.fonts.body,
        fontSize: 11,
        color: theme.colors.textPrimary,
    },
    arrow: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: theme.colors.panel,
        borderWidth: 2,
        borderColor: theme.colors.borderOuter,
        borderRadius: theme.radius.md,
        minWidth: 180,
        overflow: 'hidden',
        ...theme.shadows.panel,
    },
    option: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderInner,
    },
    optionActive: {
        backgroundColor: theme.colors.gold,
    },
    optionText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    optionTextActive: {
        fontFamily: theme.fonts.bodySemiBold,
        color: theme.colors.textDark,
    },
});

export default React.memo(ItemSortSelector);
