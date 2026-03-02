/**
 * EditStoryScreen — Editar História do Char
 * Permite escrever/editar história de um char vinculado.
 * Referência: general-plan.md seção 8.2 (Tela 4.3), prototype/app.js renderEditStory
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaButton from '@/components/base/TibiaButton';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaInput from '@/components/base/TibiaInput';
import TibiaLoading from '@/components/base/TibiaLoading';
import { useMyCharsStore } from '@/stores/useMyCharsStore';
import { getCharById } from '@/repositories/charsRepository';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type EditStoryRouteProp = RouteProp<RootStackParamList, 'EditStory'>;
type EditStoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditStory'>;

function EditStoryScreen() {
    const route = useRoute<EditStoryRouteProp>();
    const navigation = useNavigation<EditStoryNavigationProp>();
    const { charId } = route.params;

    const saveStory = useMyCharsStore((s) => s.saveStory);
    const isLoading = useMyCharsStore((s) => s.isLoading);
    const storeError = useMyCharsStore((s) => s.error);
    const clearError = useMyCharsStore((s) => s.clearError);

    const [charName, setCharName] = useState('Personagem');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Carrega dados existentes do char (modo edição)
    useEffect(() => {
        clearError();
        const char = getCharById(charId);
        if (char) {
            setCharName(char.name);
            if (char.story_title) setTitle(char.story_title);
            if (char.story_content) setContent(char.story_content);
        }
    }, [charId, clearError]);

    const handleSave = useCallback(async () => {
        setIsSuccess(false);
        await saveStory(charId, title.trim(), content.trim());

        // Verifica se houve erro após a operação
        const { error } = useMyCharsStore.getState();
        if (!error) {
            setIsSuccess(true);
        }
    }, [charId, title, content, saveStory]);

    const handleBackToAccount = useCallback(() => {
        navigation.popToTop();
    }, [navigation]);

    const isSaveDisabled = isLoading || !title.trim() || !content.trim();

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Painel principal */}
            <TibiaPanel>
                <TibiaHeader title={`História de ${charName}`} icon="✏️" />
                <View style={styles.panelBody}>
                    <TibiaInput
                        label="Título da História"
                        placeholder="Ex: A Lenda de Antica..."
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                    <TibiaInput
                        label="Sua História"
                        placeholder="Conte as aventuras do seu char..."
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />
                    <View style={styles.notice}>
                        <TibiaText style={styles.noticeText}>
                            ✍️ Escreva com calma! Você pode editar sua história quantas vezes quiser.
                            Outros aventureiros poderão ler na aba de Chars.
                        </TibiaText>
                    </View>
                </View>
            </TibiaPanel>

            {/* Botão Salvar */}
            {!isSuccess ? (
                <TibiaButton
                    label="💾 Salvar História"
                    variant="primary"
                    onPress={handleSave}
                    disabled={isSaveDisabled}
                />
            ) : null}

            {/* Loading */}
            {isLoading ? (
                <View style={styles.feedbackContainer}>
                    <TibiaLoading message="Salvando história..." />
                </View>
            ) : null}

            {/* Feedback de sucesso */}
            {isSuccess ? (
                <View style={styles.successNotice}>
                    <TibiaText style={styles.successText}>
                        ✅ História salva com sucesso!{'\n'}Seu char agora aparece nas Histórias dos Aventureiros.
                    </TibiaText>
                </View>
            ) : null}

            {/* Feedback de erro */}
            {storeError && !isLoading ? (
                <View style={styles.errorNotice}>
                    <TibiaText style={styles.errorText}>{storeError}</TibiaText>
                </View>
            ) : null}

            {/* Botão voltar após sucesso */}
            {isSuccess ? (
                <View style={styles.backBtnContainer}>
                    <TibiaButton
                        label="Voltar para Meus Chars"
                        variant="secondary"
                        onPress={handleBackToAccount}
                    />
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    content: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xxxl,
    },
    panelBody: {
        padding: theme.spacing.md,
    },

    // ── Notice ──
    notice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
    },
    noticeText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },

    // ── Feedback ──
    feedbackContainer: {
        marginTop: theme.spacing.md,
    },
    successNotice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    successText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.accentGreen,
        lineHeight: theme.lineHeights.body,
    },
    errorNotice: {
        backgroundColor: theme.colors.feedbackErrorBg,
        borderWidth: 1,
        borderColor: theme.colors.accentRed,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    errorText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.accentRed,
        lineHeight: theme.lineHeights.body,
    },
    backBtnContainer: {
        marginTop: theme.spacing.md,
    },
});

export default EditStoryScreen;
