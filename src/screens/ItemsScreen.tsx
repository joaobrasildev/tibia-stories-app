import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@/theme';
import { useItemsStore } from '@/stores/useItemsStore';
import ItemCard from '@/components/composed/ItemCard';
import ItemSearchBar from '@/components/composed/ItemSearchBar';
import RarityFilter from '@/components/composed/RarityFilter';
import ItemSortSelector from '@/components/composed/ItemSortSelector';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import { APP_TEXTS } from '@/constants/app';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { ITEM_EMOJIS } from '@/constants/itemEmojis';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ItemsScreen() {
    const navigation = useNavigation<NavigationProp>();

    // Granular selectors
    const filteredItems = useItemsStore((s) => s.filteredItems);
    const searchQuery = useItemsStore((s) => s.searchQuery);
    const setSearchQuery = useItemsStore((s) => s.setSearchQuery);
    const rarityFilter = useItemsStore((s) => s.rarityFilter);
    const setRarityFilter = useItemsStore((s) => s.setRarityFilter);
    const sort = useItemsStore((s) => s.sort);
    const setSort = useItemsStore((s) => s.setSort);
    const loadItems = useItemsStore((s) => s.loadItems);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleItemPress = useCallback((itemId: string) => {
        navigation.navigate('ItemDetail', { id: itemId });
    }, [navigation]);

    const listHeader = useMemo(() => (
        <View>
            <View style={styles.filtersWrapper}>
                <ItemSearchBar
                    query={searchQuery}
                    onQueryChange={setSearchQuery}
                />
                <RarityFilter
                    activeFilter={rarityFilter}
                    onFilterChange={setRarityFilter}
                />
                <ItemSortSelector
                    activeSort={sort}
                    onSortChange={setSort}
                />
            </View>
            <View style={styles.listHeader}>
                <TibiaHeader
                    title={`${APP_TEXTS.items.panelTitle} (${filteredItems.length})`}
                    icon="📦"
                />
            </View>
        </View>
    ), [searchQuery, setSearchQuery, rarityFilter, setRarityFilter, sort, setSort, filteredItems.length]);

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <ItemCard
                        name={item.name}
                        emoji={ITEM_EMOJIS[item.name] ?? '📦'}
                        imageUrl={item.image_url}
                        rarity={item.rarity}
                        onPress={() => handleItemPress(item.id)}
                    />
                )}
                ListHeaderComponent={listHeader}
                ListEmptyComponent={
                    <TibiaEmpty message={APP_TEXTS.items.empty} icon="📦" />
                }
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    list: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    filtersWrapper: {
        marginHorizontal: -theme.spacing.lg,
    },
    listHeader: {
        marginBottom: theme.spacing.gap,
    },
});
