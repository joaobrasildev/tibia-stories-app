import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import { getVocationColor, getVocationAbbr } from '@/constants/vocations';

interface MyCharItemProps {
    name: string;
    vocation: string;
    level: number;
    world: string;
    isVerified: boolean;
    hasStory: boolean;
    isAlternate: boolean;
    onVerifyPress?: () => void;
    onWritePress?: () => void;
    onEditPress?: () => void;
    onHighlightPress?: () => void;
}

function MyCharItem({
    name,
    vocation,
    level,
    world,
    isVerified,
    hasStory,
    isAlternate,
    onVerifyPress,
    onWritePress,
    onEditPress,
    onHighlightPress,
}: MyCharItemProps) {
    const vocAbbr = getVocationAbbr(vocation);
    const vocColor = getVocationColor(vocation);

    return (
        <View style={[styles.container, isAlternate && styles.containerAlt]}>
            <View style={styles.info}>
                <TibiaText style={styles.name}>{name}</TibiaText>
                <View style={styles.details}>
                    <TibiaBadge
                        label={vocAbbr}
                        variant="vocation"
                        color={vocColor}
                        borderColor={vocColor}
                    />
                    <TibiaText style={styles.detailsText}>
                        Level {level} • {world}
                    </TibiaText>
                    {isVerified ? (
                        <TibiaBadge
                            label="✅ Vinculado"
                            variant="status"
                        />
                    ) : (
                        <TibiaBadge
                            label="⏳ Pendente"
                            backgroundColor={theme.colors.badgePendingBg}
                            borderColor={theme.colors.badgePendingBorder}
                            color={theme.colors.badgePendingText}
                        />
                    )}
                </View>
            </View>
            <View style={styles.actions}>
                {!isVerified && onVerifyPress ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={onVerifyPress} activeOpacity={0.7}>
                        <TibiaText style={styles.actionBtnText}>Vincular</TibiaText>
                    </TouchableOpacity>
                ) : null}
                {isVerified && !hasStory && onWritePress ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={onWritePress} activeOpacity={0.7}>
                        <TibiaText style={styles.actionBtnText}>Escrever</TibiaText>
                    </TouchableOpacity>
                ) : null}
                {isVerified && hasStory && onEditPress ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={onEditPress} activeOpacity={0.7}>
                        <TibiaText style={styles.actionBtnText}>Editar</TibiaText>
                    </TouchableOpacity>
                ) : null}
                {isVerified && onHighlightPress ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={onHighlightPress} activeOpacity={0.7}>
                        <TibiaText style={styles.actionBtnText}>⭐</TibiaText>
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.cardGap,
        paddingVertical: theme.spacing.cardGap,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.cardBg,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.xs,
        marginBottom: theme.spacing.gap,
    },
    containerAlt: {
        backgroundColor: theme.colors.panelAlt,
    },
    info: {
        flex: 1,
        gap: theme.spacing.xs,
    },
    name: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    details: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    detailsText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xxs,
        color: theme.colors.textSecondary,
    },
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.xs,
        flexShrink: 0,
    },
    actionBtn: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.btnPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.xs,
    },
    actionBtnText: {
        fontSize: theme.fontSizes.xxs,
        fontFamily: theme.fonts.bodySemiBold,
        color: theme.colors.textDark,
    },
});

export default React.memo(MyCharItem);
