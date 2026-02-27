import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { theme } from '@/theme';
import { getCharById } from '@/repositories/charsRepository';
import { getVocationColor, getVocationAbbr } from '@/constants/vocations';
import { APP_TEXTS } from '@/constants/app';
import { formatRelativeDate } from '@/rules/formatRules';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type CharStoryRouteProp = RouteProp<RootStackParamList, 'CharStory'>;

function HeroAvatar({ avatarUrl }: { avatarUrl: string | null }) {
    const [imageError, setImageError] = useState(false);
    const hasImage = avatarUrl && avatarUrl.startsWith('http') && !imageError;

    if (!hasImage && !avatarUrl) return null;

    return (
        <View style={styles.heroImage}>
            {hasImage ? (
                <Image
                    source={{ uri: avatarUrl }}
                    style={styles.heroAvatarImage}
                    resizeMode="contain"
                    onError={() => setImageError(true)}
                />
            ) : avatarUrl ? (
                <TibiaText style={styles.heroEmoji}>{avatarUrl}</TibiaText>
            ) : null}
        </View>
    );
}

export default function CharStoryScreen() {
    const route = useRoute<CharStoryRouteProp>();
    const { charId } = route.params;

    const char = getCharById(charId);

    if (!char) {
        return (
            <View style={styles.container}>
                <TibiaEmpty message={APP_TEXTS.charDetail.notFound} icon="📖" />
            </View>
        );
    }

    const vocAbbr = getVocationAbbr(char.vocation);
    const vocColor = getVocationColor(char.vocation);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <HeroAvatar avatarUrl={char.avatar_url} />
                <TibiaText style={styles.heroName}>{char.name}</TibiaText>
                <View style={styles.heroBadges}>
                    <TibiaBadge
                        label={char.vocation}
                        variant="vocation"
                        color={vocColor}
                        borderColor={vocColor}
                    />
                    <TibiaBadge
                        label={`Level ${char.level}`}
                        variant="level"
                    />
                    <TibiaBadge
                        label={char.world}
                        variant="world"
                    />
                    {char.is_highlighted ? (
                        <TibiaBadge
                            label={APP_TEXTS.charDetail.highlightBadge}
                            variant="status"
                            color={theme.colors.gold}
                            backgroundColor={theme.colors.highlightGlow}
                            borderColor={theme.colors.gold}
                        />
                    ) : null}
                </View>
                <View style={styles.meta}>
                    <TibiaText style={styles.metaText}>
                        📅 {formatRelativeDate(char.created_at)}
                    </TibiaText>
                </View>
            </View>

            {/* Story Section */}
            {char.story_title ? (
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <TibiaText style={styles.sectionTitleText}>
                            📜 {char.story_title}
                        </TibiaText>
                    </View>
                    <View style={styles.sectionBody}>
                        {char.story_content
                            ? char.story_content.split('\n\n').map((paragraph, index) => (
                                <TibiaText
                                    key={`story-${index}`}
                                    style={[
                                        styles.paragraph,
                                        index === char.story_content!.split('\n\n').length - 1 && styles.paragraphLast,
                                    ]}
                                >
                                    {paragraph}
                                </TibiaText>
                            ))
                            : null}
                    </View>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    // Hero
    hero: {
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.md,
    },
    heroImage: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panel,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.card,
    },
    heroEmoji: {
        fontSize: 48,
    },
    heroAvatarImage: {
        width: 64,
        height: 64,
    },
    heroName: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.textPrimary,
        marginBottom: 6,
        textAlign: 'center',
    },
    heroBadges: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    meta: {
        marginTop: theme.spacing.sm,
    },
    metaText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
    },
    // Sections
    section: {
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.gold,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
        borderBottomWidth: 0,
    },
    sectionTitleText: {
        fontFamily: theme.fonts.title,
        fontSize: 17,
        color: theme.colors.textDark,
    },
    sectionBody: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
    },
    paragraph: {
        fontFamily: theme.fonts.body,
        fontSize: 13,
        color: theme.colors.textPrimary,
        lineHeight: 22,
        marginBottom: 10,
    },
    paragraphLast: {
        marginBottom: 0,
    },
});
