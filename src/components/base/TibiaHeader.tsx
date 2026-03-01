import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaHeaderProps {
    title: string;
    icon?: string;
}

function TibiaHeader({ title, icon }: TibiaHeaderProps) {
    return (
        <View style={styles.container}>
            {icon ? (
                <TibiaText style={styles.icon}>{icon}</TibiaText>
            ) : null}
            <TibiaText style={styles.title}>{title}</TibiaText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.gold,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    icon: {
        fontSize: theme.fontSizes.lg,
    },
    title: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textDark,
        flex: 1,
    },
});

export default React.memo(TibiaHeader);
