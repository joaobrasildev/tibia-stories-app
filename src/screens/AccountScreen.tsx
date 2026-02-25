import React from 'react';
import { View, StyleSheet } from 'react-native';
import TibiaText from '@/components/base/TibiaText';
import { theme } from '@/theme';

function AccountScreen() {
    return (
        <View style={styles.container}>
            <TibiaText variant="title">Conta</TibiaText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AccountScreen;
