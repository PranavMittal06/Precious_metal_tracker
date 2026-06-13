import React, {useEffect, useRef, useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MetalPrice, MetalType} from '../../types';
import {MetalColors, Colors} from '../../theme/colors';
import {CardGradients} from '../../theme/gradients';
import {METAL_CONFIG} from '../../constants';
import {Typography} from '../../theme/typography';
import {BorderRadius, Spacing} from '../../theme/spacing';
import {formatPrice, formatChange, getTrendDirection, getRelativeTime} from '../../utils';
import PriceBadge from '../PriceBadge';
import {FlashDirection} from '../../hooks/useRealTimePrice';

interface Props {
  metalType: MetalType;
  data: MetalPrice;
  onPress: (metalType: MetalType, data: MetalPrice) => void;
  animationDelay?: number;
  isFetching?: boolean;
  flashDirection?: FlashDirection;
  tickCount?: number;
}

const MetalCard: React.FC<Props> = ({
  metalType,
  data,
  onPress,
  animationDelay = 0,
  isFetching,
  flashDirection,
  tickCount = 0,
}) => {
  const metalColor = MetalColors[metalType];
  const config = METAL_CONFIG[metalType];
  const trend = getTrendDirection(data.changePercent);

  // ── Entry animations (native driver) ──────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // ── Flash overlay: opacity native driver; color via plain state ────────────
  // Mixing animated backgroundColor + native-driver opacity on the same node
  // causes a driver conflict. Fix: keep opacity Animated (native driver),
  // keep backgroundColor as plain React state (updated synchronously via setValue).
  const flashOpacity   = useRef(new Animated.Value(0)).current;
  const [flashBg, setFlashBg] = useState(Colors.success);

  // ── Price text scale on tick (native driver) ──────────────────────────────
  const priceScale = useRef(new Animated.Value(1)).current;

  // ── Entry animation ───────────────────────────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      Animated.delay(animationDelay),
      Animated.parallel([
        Animated.spring(fadeAnim,  {toValue: 1, useNativeDriver: true, tension: 70}),
        Animated.spring(slideAnim, {toValue: 0, useNativeDriver: true, tension: 70}),
      ]),
    ]).start();
  }, [animationDelay, fadeAnim, slideAnim]);

  // ── Flash on every live tick ──────────────────────────────────────────────
  useEffect(() => {
    if (!flashDirection) return;

    // Update bg color synchronously (plain state → no driver conflict)
    setFlashBg(flashDirection === 'up' ? Colors.success : Colors.error);

    // Opacity animation runs on native thread (opacity is ND-safe)
    Animated.sequence([
      Animated.timing(flashOpacity, {toValue: 0.20, duration: 80,  useNativeDriver: true}),
      Animated.timing(flashOpacity, {toValue: 0.12, duration: 280, useNativeDriver: true}),
      Animated.timing(flashOpacity, {toValue: 0,    duration: 200, useNativeDriver: true}),
    ]).start();

    // Price text bounce (native driver, transform is ND-safe)
    Animated.sequence([
      Animated.spring(priceScale, {toValue: 1.04, useNativeDriver: true, tension: 300, friction: 8}),
      Animated.spring(priceScale, {toValue: 1,    useNativeDriver: true, tension: 300, friction: 8}),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickCount]);

  // ── Press scale ───────────────────────────────────────────────────────────
  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {toValue: 0.96, useNativeDriver: true, tension: 200, friction: 10}).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, tension: 200, friction: 10}).start();
  }, [scaleAnim]);

  const priceChangeColor =
    trend === 'up' ? Colors.success : trend === 'down' ? Colors.error : Colors.textSecondary;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {opacity: fadeAnim, transform: [{translateY: slideAnim}, {scale: scaleAnim}]},
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPress(metalType, data)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>

        <LinearGradient
          colors={CardGradients[metalType]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.card, {borderColor: `${metalColor.primary}22`}]}>

          {/* ── Flash overlay: plain bg color + animated opacity (no driver conflict) ── */}
          <Animated.View
            pointerEvents="none"
            style={[styles.overlay, {opacity: flashOpacity, backgroundColor: flashBg}]}
          />

          {/* ── REST refetch dot ── */}
          {isFetching && (
            <View style={[styles.refreshDot, {backgroundColor: metalColor.primary}]} />
          )}

          {/* ── Header ── */}
          <View style={styles.header}>
            <View style={[styles.iconWrap, {backgroundColor: `${metalColor.primary}18`}]}>
              <Text style={styles.iconText}>{config.displayIcon}</Text>
            </View>
            <View style={styles.headerCenter}>
              <Text style={[styles.metalName, {color: metalColor.primary}]}>{config.name}</Text>
              <Text style={styles.metalSymbol}>{config.symbol} · {config.unit}</Text>
            </View>
            <PriceBadge trend={trend} changePercent={data.changePercent} size="sm" />
          </View>

          {/* ── Price with bounce on tick ── */}
          <Animated.View style={{transform: [{scale: priceScale}]}}>
            <Text style={[styles.price, {color: metalColor.light}]}>
              {formatPrice(data.price, data.currency)}
            </Text>
          </Animated.View>

          {/* ── Change ── */}
          <Text style={[styles.change, {color: priceChangeColor}]}>
            {trend !== 'neutral' ? (trend === 'up' ? '▲' : '▼') : ''}{' '}
            {data.change !== undefined ? formatChange(data.change) : '—'} USD today
          </Text>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <View style={[styles.dot, {backgroundColor: Colors.success}]} />
              <Text style={styles.footerText}>
                {data.timestamp ? getRelativeTime(data.timestamp) : 'Live'}
              </Text>
              {tickCount > 0 && (
                <Text style={styles.tickBadge}>  ⟳ {tickCount}</Text>
              )}
            </View>
            <View style={styles.currencyBadge}>
              <Text style={[styles.currencyText, {color: metalColor.primary}]}>
                {data.currency}
              </Text>
            </View>
          </View>

          {/* ── Corner glow decoration ── */}
          <View
            style={[styles.cornerGlow, {backgroundColor: metalColor.glow}]}
            pointerEvents="none"
          />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 160,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius['2xl'],
  },
  refreshDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {fontSize: 22},
  headerCenter: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  metalName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  metalSymbol: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  price: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.extraBold,
    letterSpacing: -0.5,
    marginTop: Spacing.base,
  },
  change: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
  },
  tickBadge: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    opacity: 0.7,
  },
  currencyBadge: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  currencyText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  cornerGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default React.memo(MetalCard);
