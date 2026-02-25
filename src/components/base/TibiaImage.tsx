import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType, ImageStyle } from 'react-native';
import { theme } from '@/theme';

interface TibiaImageProps {
    source: ImageSourcePropType;
    size?: number;
    style?: ImageStyle;
}

function TibiaImage({ source, size = 96, style }: TibiaImageProps) {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Image
                source={source}
                style={[styles.image, { width: size - 4, height: size - 4 }, style]}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.panel,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.card,
    },
    image: {
        borderRadius: theme.radius.sm,
    },
});

export default React.memo(TibiaImage);
