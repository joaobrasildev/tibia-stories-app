import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@/theme';
import { useCharsStore } from '@/stores/useCharsStore';
import CharCard from '@/components/composed/CharCard';
import CharSearchBar from '@/components/composed/CharSearchBar';
import VocationFilter from '@/components/composed/VocationFilter';
import SortSelector from '@/components/composed/SortSelector';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import { APP_TEXTS } from '@/constants/app';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { CharSort } from '@/types/character';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SORT_OPTIONS: { key: CharSort; label: string }[] = [
    { key: 'name-asc', label: 'A → Z' },
    { key: 'name-desc', label: 'Z → A' },
    { key: 'level-desc', label: 'Level ↓' },
    { key: 'level-asc', label: 'Level ↑' },
];

export default function CharsScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Granular selectors
    const filteredChars = useCharsStore((s) => s.filteredChars);
    const searchQuery = useCharsStore((s) => s.searchQuery);
    const setSearchQuery = useCharsStore((s) => s.setSearchQuery);
    const vocationFilter = useCharsStore((s) => s.vocationFilter);
    const setVocationFilter = useCharsStore((s) => s.setVocationFilter);
    const worldFilter = useCharsStore((s) => s.worldFilter);
    const setWorldFilter = useCharsStore((s) => s.setWorldFilter);
    const sort = useCharsStore((s) => s.sort);
    const setSort = useCharsStore((s) => s.setSort);
    const worlds = useCharsStore((s) => s.worlds);
    const loadChars = useCharsStore((s) => s.loadChars);

    useEffect(() => {
        loadChars();
    }, [loadChars]);

    const handleCharPress = useCallback((charId: string) => {
        navigation.navigate('CharStory', { charId });
    }, [navigation]);

    const worldOptions = useMemo(() => [
        { key: 'all' as const, label: 'Todos' },
        ...worlds.map((w) => ({ key: w, label: w })),
    ], [worlds]);

    return (
        <View style={styles.container}>
            <CharSearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
            />
            <VocationFilter
                activeFilter={vocationFilter}
                onFilterChange={setVocationFilter}
            />
            <View style={styles.sortRow}>
                <SortSelector<string>
                    label="Mundo:"
                    options={worldOptions}
                    activeSort={worldFilter}
                    onSortChange={setWorldFilter}
                />
                <SortSelector<CharSort>
                    label="Ordenar:"
                    options={SORT_OPTIONS}
                    activeSort={sort}
                    onSortChange={setSort}
                />
            </View>
            <FlatList
                data={filteredChars}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CharCard
                        name={item.name}
                        level={item.level}
                        vocation={item.vocation}
                        world={item.world}
                        storyTitle={item.story_title}
                        avatarEmoji={null}
                        avatarUrl={item.avatar_url}
                        isHighlighted={item.is_highlighted}
                        onPress={() => handleCharPress(item.id)}
                    />
                )}
                ListHeaderComponent={
                    <TibiaHeader
                        title={`${APP_TEXTS.chars.panelTitle} (${filteredChars.length})`}
                        icon="📖"
                    />
                }
                ListEmptyComponent={
                    <TibiaEmpty message={APP_TEXTS.chars.empty} icon="📖" />
                }
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    list: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
});
