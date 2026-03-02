/**
 * AddCharScreen — "Exiva — Localizar Char"
 * Busca char na TibiaData API e permite adicionar + vincular.
 * Referência: general-plan.md seção 8.2 (Tela 4.1), prototype/app.js renderAddCharacter
 */

import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaButton from '@/components/base/TibiaButton';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaInput from '@/components/base/TibiaInput';
import TibiaBadge from '@/components/base/TibiaBadge';
import TibiaLoading from '@/components/base/TibiaLoading';
import TibiaDivider from '@/components/base/TibiaDivider';
import { fetchCharacter } from '@/services/tibiaDataService';
import { checkCharacterExists, createCharacter } from '@/services/firestoreService';
import { upsertCharacter } from '@/repositories/charsRepository';
import { validateCharName } from '@/rules/charRules';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyCharsStore } from '@/stores/useMyCharsStore';
import { requireOnline } from '@/services/syncService';
import { APP_TEXTS } from '@/constants/app';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { TibiaCharacter } from '@/types/tibiaData';

type AddCharNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddChar'>;

function AddCharScreen() {
    const navigation = useNavigation<AddCharNavigationProp>();
    const userToken = useAuthStore((s) => s.userToken);
    const loadMyChars = useMyCharsStore((s) => s.loadMyChars);

    const [charName, setCharName] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [foundChar, setFoundChar] = useState<TibiaCharacter | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [inputError, setInputError] = useState<string | undefined>(undefined);

    const handleSearch = useCallback(async () => {
        setError(null);
        setFoundChar(null);
        setInputError(undefined);

        // Valida nome
        const validation = validateCharName(charName);
        if (!validation.valid) {
            setInputError(validation.error);
            return;
        }

        setIsSearching(true);
        try {
            const result = await fetchCharacter(charName.trim());
            if (result) {
                setFoundChar(result);
            } else {
                setError(APP_TEXTS.exiva.errorNotFound);
            }
        } catch {
            setError(APP_TEXTS.exiva.errorNotFound);
        } finally {
            setIsSearching(false);
        }
    }, [charName]);

    const handleAddAndVerify = useCallback(async () => {
        if (!foundChar || !userToken) return;

        setIsAdding(true);
        setError(null);

        try {
            requireOnline();

            // Verifica se char já existe no Firestore
            const existing = await checkCharacterExists(foundChar.name);
            if (existing) {
                if (existing.user_token === userToken) {
                    // Char já pertence a este usuário — navega direto para verificação
                    setIsAdding(false);
                    navigation.navigate('VerifyChar', {
                        charId: existing.id,
                        charName: existing.name,
                    });
                    return;
                }
                if (existing.is_verified) {
                    setError('Este char já está vinculado a outra conta.');
                    setIsAdding(false);
                    return;
                }
            }

            const now = new Date().toISOString();

            // Cria no Firestore
            const charData = {
                user_token: userToken,
                name: foundChar.name,
                world: foundChar.world,
                vocation: foundChar.vocation,
                level: foundChar.level,
                is_verified: false,
                is_highlighted: false,
                highlight_until: null,
                story_title: null,
                story_content: null,
                avatar_url: null,
                created_at: now,
                updated_at: now,
            };

            const docId = await createCharacter(charData);

            // Sincroniza localmente no SQLite
            upsertCharacter({ id: docId, ...charData });

            // Recarrega store
            await loadMyChars(userToken);

            // Navega para Quest de Vínculo
            navigation.navigate('VerifyChar', {
                charId: docId,
                charName: foundChar.name,
            });
        } catch {
            setError('Erro ao adicionar o char. Tente novamente.');
        } finally {
            setIsAdding(false);
        }
    }, [foundChar, userToken, navigation, loadMyChars]);

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Painel de busca */}
            <TibiaPanel>
                <TibiaHeader title="Exiva — Localizar Char" icon="🔍" />
                <View style={styles.panelBody}>
                    <TibiaInput
                        label={APP_TEXTS.exiva.inputLabel}
                        placeholder={APP_TEXTS.exiva.inputPlaceholder}
                        value={charName}
                        onChangeText={setCharName}
                        error={inputError}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                    <TibiaButton
                        label={APP_TEXTS.exiva.searchBtn}
                        onPress={handleSearch}
                        disabled={isSearching}
                    />
                </View>
            </TibiaPanel>

            {/* Loading */}
            {isSearching ? (
                <TibiaLoading message="Buscando char..." />
            ) : null}

            {/* Resultado encontrado */}
            {foundChar && !isSearching ? (
                <>
                    <TibiaDivider ornament="Resultado" />
                    <TibiaPanel>
                        <TibiaHeader title="Char Localizado" icon="✅" />
                        <View style={styles.panelBody}>
                            <View style={styles.charCard}>
                                <TibiaText style={styles.charAvatar}>🛡️</TibiaText>
                                <View style={styles.charInfo}>
                                    <TibiaText style={styles.charName}>{foundChar.name}</TibiaText>
                                    <View style={styles.badgeRow}>
                                        <TibiaBadge label={foundChar.vocation} variant="vocation" />
                                        <TibiaBadge label={`Level ${foundChar.level}`} variant="level" />
                                        <TibiaBadge label={foundChar.world} variant="world" />
                                    </View>
                                </View>
                            </View>
                            <TibiaButton
                                label={APP_TEXTS.exiva.addBtn}
                                variant="primary"
                                onPress={handleAddAndVerify}
                                disabled={isAdding}
                            />
                        </View>
                    </TibiaPanel>
                </>
            ) : null}

            {/* Erro */}
            {error ? (
                <View style={styles.errorNotice}>
                    <TibiaText style={styles.errorText}>{error}</TibiaText>
                </View>
            ) : null}

            {/* Nota informativa */}
            <View style={styles.infoNotice}>
                <TibiaText style={styles.infoText}>{APP_TEXTS.exiva.infoNote}</TibiaText>
            </View>

            {/* Loading de adição */}
            {isAdding ? (
                <TibiaLoading message="Adicionando char..." />
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

    // ── Char card resultado ──
    charCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    charAvatar: {
        fontSize: theme.fontSizes.emoji,
        marginRight: theme.spacing.md,
    },
    charInfo: {
        flex: 1,
    },
    charName: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.gap,
    },

    // ── Notices ──
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
    infoNotice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    infoText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },
});

export default AddCharScreen;
