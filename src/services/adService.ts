import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

// IDs de teste oficiais do Google (para desenvolvimento)
const TEST_BANNER_ANDROID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_BANNER_IOS = 'ca-app-pub-3940256099942544/2934735716';

// IDs de produção (hardcoded — não são dados sensíveis)
// TODO: Substituir pelos Ad Unit IDs reais criados no AdMob Console
const PROD_BANNER_ANDROID = 'ca-app-pub-9302632754670115/XXXXXXXXXX';
const PROD_BANNER_IOS = 'ca-app-pub-9302632754670115/XXXXXXXXXX';

const IS_DEV = __DEV__;

/**
 * Inicializa o SDK de anúncios (Google Mobile Ads).
 * Deve ser chamado uma vez no boot flow do app.
 */
export async function initializeAds(): Promise<void> {
    await mobileAds().initialize();
}

/**
 * Retorna o ad unit ID correto para banner,
 * alternando entre teste (dev) e produção automaticamente.
 */
export function getBannerAdUnitId(): string {
    if (IS_DEV) {
        return Platform.OS === 'ios' ? TEST_BANNER_IOS : TEST_BANNER_ANDROID;
    }
    return Platform.OS === 'ios' ? PROD_BANNER_IOS : PROD_BANNER_ANDROID;
}
