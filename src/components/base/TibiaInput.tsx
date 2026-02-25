import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaInputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    error?: string;
}

function TibiaInput({
    label,
    placeholder,
    value,
    onChangeText,
    multiline = false,
    error,
    ...rest
}: TibiaInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label ? (
                <TibiaText style={styles.label}>{label}</TibiaText>
            ) : null}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multiline,
                    isFocused && styles.focused,
                    error ? styles.error : undefined,
                ]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...rest}
            />
            {error ? (
                <TibiaText style={styles.errorText}>{error}</TibiaText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    input: {
        backgroundColor: theme.colors.background,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        ...theme.borders.input,
        borderRadius: theme.radius.sm,
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    multiline: {
        minHeight: 180,
        lineHeight: 22,
    },
    focused: {
        borderColor: theme.colors.borderOuter,
        shadowColor: theme.colors.borderOuter,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },
    error: {
        borderColor: theme.colors.accentRed,
    },
    errorText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xs,
        color: theme.colors.accentRed,
        marginTop: theme.spacing.xs,
    },
});

export default React.memo(TibiaInput);
