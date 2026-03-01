import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface SortOption<T extends string> {
    key: T;
    label: string;
}

interface SortSelectorProps<T extends string> {
    label: string;
    options: SortOption<T>[];
    activeSort: T;
    onSortChange: (sort: T) => void;
}

function SortSelectorInner<T extends string>({
    label,
    options,
    activeSort,
    onSortChange,
}: SortSelectorProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const activeLabel = options.find((o) => o.key === activeSort)?.label ?? options[0]?.label ?? '';

    const handleSelect = useCallback((sort: T) => {
        onSortChange(sort);
        setIsOpen(false);
    }, [onSortChange]);

    return (
        <View style={styles.container}>
            <TibiaText style={styles.label}>{label}</TibiaText>
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
                        {options.map((option) => (
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
        gap: theme.spacing.sm,
    },
    label: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.xxs,
        color: theme.colors.textPrimary,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.chipY,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        ...theme.borders.panelInner,
        borderRadius: theme.radius.sm,
    },
    selectorText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xxs,
        color: theme.colors.textPrimary,
    },
    arrow: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textMuted,
    },
    overlay: {
        flex: 1,
        backgroundColor: theme.colors.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        backgroundColor: theme.colors.panel,
        ...theme.borders.panel,
        borderRadius: theme.radius.md,
        minWidth: 180,
        overflow: 'hidden',
        ...theme.shadows.panel,
    },
    option: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: theme.borders.panelInner.borderWidth,
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

// Wrap with React.memo - use type assertion for generics
const SortSelector = React.memo(SortSelectorInner) as typeof SortSelectorInner;

export default SortSelector;
