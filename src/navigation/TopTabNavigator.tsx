import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OfflineBanner from '@/components/composed/OfflineBanner';
import TibiaIcon from '@/components/base/TibiaIcon';
import TibiaText from '@/components/base/TibiaText';
import DepotScreen from '@/screens/DepotScreen';
import ItemsScreen from '@/screens/ItemsScreen';
import CharsScreen from '@/screens/CharsScreen';
import AccountScreen from '@/screens/AccountScreen';
import { useAppStore } from '@/stores/useAppStore';
import { theme } from '@/theme';

const depotIcon = require('../../assets/icons/depot.png');
const itemIcon = require('../../assets/icons/item.png');
const charIcon = require('../../assets/icons/char2.png');

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
    const isOnline = useAppStore((s) => s.isOnline);
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={{ paddingTop: insets.top, backgroundColor: theme.colors.headerBg }} />
            <OfflineBanner isOnline={isOnline} />
            <Tab.Navigator
                tabBarPosition="top"
                screenOptions={{
                    swipeEnabled: true,
                    tabBarStyle: {
                        backgroundColor: theme.colors.headerBg,
                        borderBottomWidth: 2,
                        borderBottomColor: theme.colors.textDark,
                    },
                    tabBarActiveTintColor: theme.colors.tabActive,
                    tabBarInactiveTintColor: theme.colors.tabInactive,
                    tabBarIndicatorStyle: {
                        backgroundColor: theme.colors.gold,
                        height: 3,
                    },
                    tabBarShowIcon: true,
                    tabBarShowLabel: true,
                    tabBarLabelStyle: {
                        fontFamily: theme.fonts.body,
                        fontSize: theme.fontSizes.xs,
                        textTransform: 'none',
                    },
                    tabBarItemStyle: {
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingVertical: theme.spacing.xs,
                    },
                }}
            >
                <Tab.Screen
                    name="Depot"
                    component={DepotScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TibiaIcon source={depotIcon} size={20} style={{ opacity: focused ? 1 : 0.5 }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Itens"
                    component={ItemsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TibiaIcon source={itemIcon} size={20} style={{ opacity: focused ? 1 : 0.5 }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Chars"
                    component={CharsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TibiaIcon source={charIcon} size={20} style={{ opacity: focused ? 1 : 0.5 }} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Conta"
                    component={AccountScreen}
                    options={{
                        tabBarIcon: () => (
                            <TibiaText style={styles.emojiIcon}>⚙️</TibiaText>
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    emojiIcon: {
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.lineHeights.body,
    },
});

export default TopTabNavigator;
