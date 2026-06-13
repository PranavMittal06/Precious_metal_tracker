import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import {MetalColors, Colors} from '../../theme/colors';
import {GradientPresets} from '../../theme/gradients';
import {METAL_CONFIG} from '../../constants';
import {Typography} from '../../theme/typography';
import {BorderRadius, Spacing} from '../../theme/spacing';
import {
  formatPrice,
  formatChange,
  formatPercent,
  getTrendDirection,
  formatFullDateTime,
  formatDate,
  formatTimestamp,
} from '../../utils';
import PriceBadge from '../../components/PriceBadge';
import MarketStatCard from '../../components/MarketStatCard';
import {RootStackParamList, MetalPrice} from '../../types';

type Route = RouteProp<RootStackParamList, 'Details'>;

// Animated count-up hook
const useCountUp = (targetValue: number, duration = 1200) => {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animRef.setValue(0);
    const id = animRef.addListener(({value}) => {
      setDisplayed(parseFloat((value * targetValue).toFixed(2)));
    });
    Animated.timing(animRef, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
    return () => animRef.removeListener(id);
  }, [targetValue, duration, animRef]);

  return displayed;
};

const DetailsScreen: React.FC = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const {metalType, metalData: initialData} = route.params;

  const [metalData, setMetalData] = useState<MetalPrice>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const config = METAL_CONFIG[metalType];
  const metalColor = MetalColors[metalType];
  const trend = getTrendDirection(metalData.changePercent);

  // Animations
  const heroAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const displayedPrice = useCountUp(metalData.price);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(heroAnim, {toValue: 1, useNativeDriver: true, tension: 60}),
        Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 60}),
      ]),
      Animated.timing(contentAnim, {toValue: 1, duration: 400, useNativeDriver: true}),
    ]).start();
  }, [heroAnim, contentAnim, scaleAnim]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${config.name} (${config.symbol}) is currently trading at ${formatPrice(metalData.price, metalData.currency || 'USD')} per troy oz.\n\nChange: ${formatChange(metalData.change ?? 0)} (${formatPercent(metalData.changePercent ?? 0)})\n\n📊 Precious Metals Tracker`,
        title: `${config.name} Live Price`,
      });
    } catch {}
  }, [config, metalData]);

  const now = Math.floor(Date.now() / 1000);
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  const priceChangeColor = isUp ? Colors.success : isDown ? Colors.error : Colors.textSecondary;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Hero gradient header */}
      <LinearGradient
        colors={[`${metalColor.primary}22`, `${metalColor.primary}08`, Colors.background]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.heroGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.navTitle}>{config.name}</Text>

          <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
            <Text style={styles.shareIcon}>↑</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={metalColor.primary}
              colors={[metalColor.primary]}
            />
          }>

          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: heroAnim,
                transform: [
                  {scale: scaleAnim},
                  {
                    translateY: heroAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}>
            {/* Metal icon */}
            <View style={[styles.heroIconWrap, {backgroundColor: `${metalColor.primary}18`}]}>
              <Text style={styles.heroIcon}>{config.displayIcon}</Text>
            </View>

            <Text style={[styles.heroName, {color: metalColor.primary}]}>{config.name}</Text>
            <Text style={styles.heroSymbol}>{config.symbol} · {config.shortName}</Text>

            {/* Animated price */}
            <Text style={[styles.heroPrice, {color: metalColor.light}]}>
              ${displayedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </Text>
            <Text style={styles.heroUnit}>per {config.unit}</Text>

            <View style={styles.heroBadgeRow}>
              <PriceBadge trend={trend} changePercent={metalData.changePercent} size="lg" />
              <Text style={[styles.heroChange, {color: priceChangeColor}]}>
                {'  '}{isUp ? '▲' : isDown ? '▼' : ''}{' '}
                {formatChange(metalData.change ?? 0)} USD
              </Text>
            </View>

            {/* Last updated badge */}
            <View style={styles.updatedBadge}>
              <View style={[styles.dot, {backgroundColor: Colors.success}]} />
              <Text style={styles.updatedText}>
                Updated {metalData.timestamp ? formatTimestamp(metalData.timestamp) : 'Just now'}
              </Text>
            </View>
          </Animated.View>

          {/* Market Information */}
          <Animated.View style={[styles.section, {opacity: contentAnim}]}>
            <Text style={styles.sectionTitle}>Market Information</Text>

            <View style={styles.statsGrid}>
              <MarketStatCard
                label="Current Price"
                value={formatPrice(metalData.price)}
                accentColor={metalColor.primary}
                icon="💰"
              />
              <MarketStatCard
                label="Day High"
                value={metalData.high ? formatPrice(metalData.high) : '—'}
                accentColor={Colors.success}
                icon="📈"
              />
            </View>

            <View style={styles.statsGrid}>
              <MarketStatCard
                label="Day Low"
                value={metalData.low ? formatPrice(metalData.low) : '—'}
                accentColor={Colors.error}
                icon="📉"
              />
              <MarketStatCard
                label="Prev. Close"
                value={metalData.previousClose ? formatPrice(metalData.previousClose) : '—'}
                accentColor={Colors.textSecondary}
                icon="🔒"
              />
            </View>

            <View style={styles.statsGrid}>
              <MarketStatCard
                label="Prev. Open"
                value={metalData.previousOpen ? formatPrice(metalData.previousOpen) : '—'}
                accentColor={Colors.info}
                icon="🔓"
              />
              <MarketStatCard
                label="Change %"
                value={metalData.changePercent !== undefined ? formatPercent(metalData.changePercent) : '—'}
                accentColor={priceChangeColor}
                icon={isUp ? '🚀' : isDown ? '📊' : '⚖️'}
              />
            </View>

            <View style={styles.statsGrid}>
              <MarketStatCard
                label="Abs. Change"
                value={metalData.change !== undefined ? `${formatChange(metalData.change)} USD` : '—'}
                accentColor={priceChangeColor}
                icon="↕️"
              />
              <MarketStatCard
                label="Currency"
                value={metalData.currency || 'USD'}
                accentColor={Colors.gold}
                icon="💱"
              />
            </View>
          </Animated.View>

          {/* Additional Info */}
          <Animated.View style={[styles.section, {opacity: contentAnim}]}>
            <Text style={styles.sectionTitle}>Session Details</Text>

            <View style={[styles.infoCard, {borderLeftColor: metalColor.primary}]}>
              <InfoRow label="Market Status" value="Open · Active Trading" valueColor={Colors.success} />
              <InfoRow label="Data Source" value={metalData.dataSource || 'MetalPriceAPI'} />
              <InfoRow label="Unit" value={`1 ${config.unit}`} />
              <InfoRow label="Last Updated" value={metalData.timestamp ? formatFullDateTime(metalData.timestamp) : '—'} />
              <InfoRow label="Today's Date" value={formatDate(now)} />
              <InfoRow label="Current Time" value={formatTimestamp(now)} />
            </View>
          </Animated.View>

          {/* Trend Summary */}
          <Animated.View style={[styles.section, {opacity: contentAnim}]}>
            <Text style={styles.sectionTitle}>Trend Summary</Text>
            <LinearGradient
              colors={GradientPresets[metalType]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.trendBar}>
              <View style={styles.trendContent}>
                <Text style={styles.trendIcon}>
                  {isUp ? '📈' : isDown ? '📉' : '📊'}
                </Text>
                <View style={styles.trendText}>
                  <Text style={styles.trendTitle}>
                    {isUp ? 'Bullish' : isDown ? 'Bearish' : 'Neutral'} Today
                  </Text>
                  <Text style={styles.trendDesc}>
                    {config.name} is {isUp ? 'up' : isDown ? 'down' : 'unchanged'}{' '}
                    {metalData.changePercent !== undefined ? `${Math.abs(metalData.changePercent).toFixed(2)}%` : ''}{' '}
                    from previous close
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Action buttons */}
          <Animated.View style={[styles.actionRow, {opacity: contentAnim}]}>
            <TouchableOpacity
              style={[styles.actionBtn, {borderColor: metalColor.primary, flex: 1}]}
              onPress={handleRefresh}
              activeOpacity={0.7}>
              <Text style={[styles.actionBtnText, {color: metalColor.primary}]}>⟳  Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: metalColor.primary, flex: 1, marginLeft: Spacing.sm}]}
              onPress={handleShare}
              activeOpacity={0.7}>
              <Text style={[styles.actionBtnText, {color: Colors.textInverse}]}>↑  Share Price</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const InfoRow: React.FC<{label: string; value: string; valueColor?: string}> = ({
  label,
  value,
  valueColor,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueColor ? {color: valueColor} : {}]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {flex: 1},
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  backIcon: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: Typography.weights.bold,
    lineHeight: 30,
  },
  navTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  shareIcon: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: Typography.weights.bold,
  },
  scroll: {flex: 1},
  scrollContent: {paddingBottom: Spacing['2xl']},

  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  heroIcon: {fontSize: 42},
  heroName: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.extraBold,
    letterSpacing: -0.5,
  },
  heroSymbol: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  heroPrice: {
    fontSize: Typography.sizes['5xl'],
    fontWeight: Typography.weights.extraBold,
    letterSpacing: -1,
  },
  heroUnit: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  heroChange: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  updatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  updatedText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
  },

  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
    marginBottom: 0,
  },

  infoCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderLeftWidth: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    flex: 1,
  },
  infoValue: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    textAlign: 'right',
    flex: 1,
  },

  trendBar: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  trendContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  trendIcon: {fontSize: 32, marginRight: Spacing.md},
  trendText: {flex: 1},
  trendTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  trendDesc: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    marginTop: 4,
    lineHeight: 18,
  },

  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  actionBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
  },
  bottomPadding: {height: Spacing['3xl']},
});

export default DetailsScreen;
