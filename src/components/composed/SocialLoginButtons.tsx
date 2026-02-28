import React from 'react';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface SocialLoginButtonsProps {
    mode: 'login' | 'register';
    onGooglePress: () => void;
    onApplePress: () => void;
    disabled?: boolean;
}

function SocialLoginButtons({ mode, onGooglePress, onApplePress, disabled = false }: SocialLoginButtonsProps) {
    const googleLabel = mode === 'login' ? 'Entrar com Google' : 'Registrar com Google';
    const appleLabel = mode === 'login' ? 'Entrar com Apple' : 'Registrar com Apple';

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.googleButton, disabled && styles.disabled]}
                onPress={onGooglePress}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <TibiaText style={styles.googleIcon}>G</TibiaText>
                <TibiaText style={styles.googleLabel}>{googleLabel}</TibiaText>
            </TouchableOpacity>

            {Platform.OS === 'ios' ? (
                <TouchableOpacity
                    style={[styles.button, styles.appleButton, disabled && styles.disabled]}
                    onPress={onApplePress}
                    disabled={disabled}
                    activeOpacity={0.7}
                >
                    <TibiaText style={styles.appleIcon}>{'\uF8FF'}</TibiaText>
                    <TibiaText style={styles.appleLabel}>{appleLabel}</TibiaText>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
    },
    googleButton: {
        backgroundColor: theme.colors.btnPrimary,
        borderColor: '#DADCE0',
    },
    appleButton: {
        backgroundColor: theme.colors.btnPrimary,
        borderColor: '#DADCE0',
    },
    disabled: {
        opacity: 0.5,
    },
    googleIcon: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.lg,
        color: '#4285F4',
        marginRight: theme.spacing.sm,
    },
    googleLabel: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.md,
        color: '#3C4043',
    },
    appleIcon: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xl,
        color: '#FFFFFF',
        marginRight: theme.spacing.sm,
    },
    appleLabel: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.md,
        color: '#FFFFFF',
    },
});

export default React.memo(SocialLoginButtons);
