import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/theme';

interface TibiaPanelProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
}

function TibiaPanel({ children, style }: TibiaPanelProps) {
    return (
        <View style={[styles.outer, style]}>
            <View style={styles.inner}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        backgroundColor: theme.colors.panel,
        borderRadius: theme.radius.sm,
        ...theme.borders.panel,
        ...theme.shadows.panel,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },
    inner: {
        borderWidth: 0,
    },
});

export default React.memo(TibiaPanel);
