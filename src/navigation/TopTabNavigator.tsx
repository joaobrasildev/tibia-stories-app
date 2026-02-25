import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TibiaIcon from '@/components/base/TibiaIcon';
import TibiaText from '@/components/base/TibiaText';
import DepotScreen from '@/screens/DepotScreen';
import ItemsScreen from '@/screens/ItemsScreen';
import CharsScreen from '@/screens/CharsScreen';
import AccountScreen from '@/screens/AccountScreen';
import { theme } from '@/theme';

const castleIcon = require('../../../assets/icons/castle.png');
const armorIcon = require('../../../assets/icons/armor.png');
const historyBookIcon = require('../../../assets/icons/history-book.png');

const Tab = createMaterialTopTabNavigator();

function TopTabNavigator() {
    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={{
                swipeEnabled: true,
                tabBarStyle: {
                    backgroundColor: theme.colors.headerBg,
                    borderTopWidth: 2,
                    borderTopColor: theme.colors.textDark,
                },
                tabBarActiveTintColor: theme.colors.tabActive,
                tabBarInactiveTintColor: theme.colors.tabInactive,
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.gold,
                    height: 3,
                    top: 0,
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
                    tabBarIcon: ({ color }) => (
                        <TibiaIcon source={castleIcon} size={20} tintColor={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Itens"
                component={ItemsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TibiaIcon source={armorIcon} size={20} tintColor={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chars"
                component={CharsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TibiaIcon source={historyBookIcon} size={20} tintColor={color} />
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
    );
}

const styles = StyleSheet.create({
    emojiIcon: {
        fontSize: theme.fontSizes.xl,
        lineHeight: 22,
    },
});

export default TopTabNavigator;
