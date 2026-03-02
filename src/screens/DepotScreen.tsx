import React, { useCallback, useEffect } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@/theme';
import { useCharsStore } from '@/stores/useCharsStore';
import { APP_TEXTS } from '@/constants/app';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaDivider from '@/components/base/TibiaDivider';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import HighlightedCharCard from '@/components/composed/HighlightedCharCard';
import CharCard from '@/components/composed/CharCard';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { useSync } from '@/hooks/useSync';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DepotScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { isSyncing, onRefresh } = useSync();

    // Granular selectors
    const highlightedChars = useCharsStore((s) => s.highlightedChars);
    const recentChars = useCharsStore((s) => s.recentChars);
    const loadChars = useCharsStore((s) => s.loadChars);

    useEffect(() => {
        loadChars();
    }, [loadChars]);

    const handleCharPress = useCallback(
        (charId: string) => {
            navigation.navigate('CharStory', { charId });
        },
        [navigation],
    );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={isSyncing}
                    onRefresh={onRefresh}
                    tintColor={theme.colors.headerBg}
                    colors={[theme.colors.headerBg]}
                />
            }
        >
            {/* ⭐ Chars em Destaque */}
            <TibiaPanel>
                <TibiaHeader
                    title={APP_TEXTS.depot.highlightTitle}
                    icon="⭐"
                />
                <View style={styles.cardsContainer}>
                    {highlightedChars.length > 0 ? (
                        highlightedChars.map((char) => (
                            <HighlightedCharCard
                                key={char.id}
                                name={char.name}
                                level={char.level}
                                vocation={char.vocation}
                                world={char.world}
                                storyTitle={char.story_title}
                                avatarEmoji={null}
                                avatarUrl={char.avatar_url}
                                onPress={() => handleCharPress(char.id)}
                            />
                        ))
                    ) : (
                        <TibiaEmpty
                            message={APP_TEXTS.depot.highlightEmpty}
                            icon="🏰"
                        />
                    )}
                </View>
            </TibiaPanel>

            {/* ✦ ✦ ✦ Divider */}
            {recentChars.length > 0 && <TibiaDivider />}

            {/* 📖 Histórias Recentes */}
            {recentChars.length > 0 && (
                <TibiaPanel>
                    <TibiaHeader
                        title={APP_TEXTS.depot.recentTitle}
                        icon="📖"
                    />
                    <View style={styles.cardsContainer}>
                        {recentChars.map((char) => (
                            <CharCard
                                key={char.id}
                                name={char.name}
                                level={char.level}
                                vocation={char.vocation}
                                world={char.world}
                                storyTitle={char.story_title}
                                avatarEmoji={null}
                                avatarUrl={char.avatar_url}
                                isHighlighted={char.is_highlighted}
                                onPress={() => handleCharPress(char.id)}
                            />
                        ))}
                    </View>
                </TibiaPanel>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    cardsContainer: {
        padding: theme.spacing.sm,
        paddingTop: theme.spacing.md,
    },
});
