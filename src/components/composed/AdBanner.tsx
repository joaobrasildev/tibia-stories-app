import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getBannerAdUnitId } from '@/services/adService';
import { theme } from '@/theme';

/**
 * Banner AdMob encapsulado.
 * Nenhuma outra parte do app deve importar react-native-google-mobile-ads diretamente.
 *
 * Visual: fundo panelAlt (#DEBB9D) com borda borderInner (#A0703C),
 * consistente com o protótipo (prototype/styles.css .ad-banner).
 */

interface AdBannerProps {
    /** Callback opcional quando o anúncio carrega com sucesso */
    onAdLoaded?: () => void;
    /** Callback opcional quando o anúncio falha */
    onAdFailedToLoad?: (error: Error) => void;
}

function AdBanner({ onAdLoaded, onAdFailedToLoad }: AdBannerProps) {
    const [adLoaded, setAdLoaded] = useState(false);
    const [adError, setAdError] = useState(false);

    const handleAdLoaded = () => {
        setAdLoaded(true);
        setAdError(false);
        onAdLoaded?.();
    };

    const handleAdFailedToLoad = (error: Error) => {
        setAdLoaded(false);
        setAdError(true);
        onAdFailedToLoad?.(error);
    };

    // Se o anúncio falhou, não renderiza nada
    if (adError) {
        return null;
    }

    return (
        <View style={[styles.container, !adLoaded && styles.hidden]}>
            <BannerAd
                unitId={getBannerAdUnitId()}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                onAdLoaded={handleAdLoaded}
                onAdFailedToLoad={handleAdFailedToLoad}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.panelAlt,
        borderTopWidth: 2,
        borderTopColor: theme.colors.borderInner,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hidden: {
        opacity: 0,
        height: 0,
        overflow: 'hidden',
    },
});

export default React.memo(AdBanner);
