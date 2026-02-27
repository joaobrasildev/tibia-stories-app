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

const depotIcon = require('../../assets/icons/depot.png');
const itemIcon = require('../../assets/icons/item.png');
const charIcon = require('../../assets/icons/char2.png');

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
                        <TibiaIcon source={depotIcon} size={20} tintColor={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Itens"
                component={ItemsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TibiaIcon source={itemIcon} size={20} tintColor={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Chars"
                component={CharsScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <TibiaIcon source={charIcon} size={20} tintColor={color} />
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
