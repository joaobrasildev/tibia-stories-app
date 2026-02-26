import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppHeader from '@/components/composed/AppHeader';
import TopTabNavigator from '@/navigation/TopTabNavigator';
import ItemDetailScreen from '@/screens/ItemDetailScreen';
import { theme } from '@/theme';

export type RootStackParamList = {
    MainTabs: undefined;
    ItemDetail: { id: number };
    // Future stack screens (Fase 5+):
    // CharStory: { charId: string };
    // Login: undefined;
    // Register: undefined;
    // AddChar: undefined;
    // VerifyChar: { charId: string };
    // EditStory: { charId: string };
    // Highlight: { charId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <NavigationContainer>
            <View style={styles.container}>
                <AppHeader />
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: theme.colors.background },
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
                                backgroundColor: theme.colors.panel,
                            },
                            headerTintColor: theme.colors.textPrimary,
                            headerTitleStyle: {
                                fontFamily: theme.fonts.title,
                                fontSize: theme.fontSizes.lg,
                            },
                        }}
                    />
                </Stack.Navigator>
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});

export default AppNavigator;
