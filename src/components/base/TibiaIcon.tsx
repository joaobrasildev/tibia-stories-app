import React from 'react';
import { Image, StyleSheet, ImageSourcePropType, ImageStyle } from 'react-native';

interface TibiaIconProps {
    source: ImageSourcePropType;
    size?: number;
    tintColor?: string;
    style?: ImageStyle;
}

function TibiaIcon({ source, size = 24, tintColor, style }: TibiaIconProps) {
    return (
        <Image
            source={source}
            style={[
                styles.icon,
                { width: size, height: size },
                tintColor ? { tintColor } : undefined,
                style,
            ]}
            resizeMode="contain"
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

export default React.memo(TibiaIcon);
