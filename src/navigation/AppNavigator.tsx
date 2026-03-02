import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TopTabNavigator from '@/navigation/TopTabNavigator';
import ItemDetailScreen from '@/screens/ItemDetailScreen';
import CharStoryScreen from '@/screens/CharStoryScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import AddCharScreen from '@/screens/AddCharScreen';
import VerifyCharScreen from '@/screens/VerifyCharScreen';
import { theme } from '@/theme';

export type RootStackParamList = {
    MainTabs: undefined;
    ItemDetail: { id: number };
    CharStory: { charId: string };
    Login: undefined;
    Register: undefined;
    AddChar: undefined;
    VerifyChar: { charId: string; charName: string };
    // Future stack screens (Fase 10+):
    // EditStory: { charId: string };
    // Highlight: { charId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: theme.colors.panel },
                }}
            >
                <Stack.Screen name="MainTabs" component={TopTabNavigator} />
                <Stack.Screen
                    name="ItemDetail"
                    component={ItemDetailScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Detalhe do Item',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
                <Stack.Screen
                    name="CharStory"
                    component={CharStoryScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'História do Char',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Login',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Criar Conta',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
                <Stack.Screen
                    name="AddChar"
                    component={AddCharScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Exiva — Localizar Char',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
                <Stack.Screen
                    name="VerifyChar"
                    component={VerifyCharScreen}
                    options={{
                        headerShown: true,
                        headerTitle: 'Quest de Vínculo',
                        headerStyle: {
                            backgroundColor: theme.colors.headerBg,
                        },
                        headerTintColor: theme.colors.textOnHeader,
                        headerTitleStyle: {
                            fontFamily: theme.fonts.title,
                            fontSize: theme.fontSizes.lg,
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigator;
