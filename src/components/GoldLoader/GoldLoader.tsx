// Gold Loader: Skeleton with golden shimmer animation
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../theme/colors';
import {BorderRadius, Spacing} from '../../theme/spacing';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - Spacing.base * 2;

const abs = {position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0};

const GoldLoader: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {toValue: 1, duration: 1200, useNativeDriver: true}),
        Animated.timing(shimmerAnim, {toValue: 0, duration: 0,    useNativeDriver: true}),
      ]),
    );
    const shine = Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {toValue: 1, duration: 1800, useNativeDriver: true}),
        Animated.timing(shineAnim, {toValue: 0, duration: 0,    useNativeDriver: true}),
      ]),
    );
    shimmer.start();
    shine.start();
    return () => { shimmer.stop(); shine.stop(); };
  }, [shimmerAnim, shineAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  const shineOpacity = shineAnim.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.6, 0.6, 0],
  });

  const SkeletonBar = ({
    width: w,
    height = 14,
    marginTop = 0,
  }: {width: number | string; height?: number; marginTop?: number}) => (
    <View style={[styles.skeletonBar, {width: w as any, height, marginTop, overflow: 'hidden'}]}>
      <Animated.View style={[styles.shimmerOverlay, {transform: [{translateX: shimmerTranslate}]}]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,215,0,0.18)', 'transparent']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={abs}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,215,0,0.10)', 'rgba(184,150,12,0.04)', 'rgba(10,10,15,0)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>

        {/* Shine sweep overlay */}
        <Animated.View pointerEvents="none" style={[styles.shineOverlay, {opacity: shineOpacity}]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,215,0,0.12)', 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={abs}
          />
        </Animated.View>

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.iconSkeleton} />
          <View style={styles.headerRight}>
            <SkeletonBar width={70} height={12} />
            <SkeletonBar width={40} height={10} marginTop={6} />
          </View>
          <View style={styles.badgeSkeleton} />
        </View>

        {/* Price */}
        <SkeletonBar width={160} height={32} marginTop={16} />
        <SkeletonBar width={90} height={12} marginTop={8} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <SkeletonBar width={100} height={12} />
          <SkeletonBar width={60} height={12} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginHorizontal: Spacing.base, marginBottom: Spacing.md},
  card: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    minHeight: 160,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center'},
  headerRight: {flex: 1, marginLeft: Spacing.md},
  iconSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.shimmerBase,
  },
  badgeSkeleton: {
    width: 70,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.shimmerBase,
  },
  skeletonBar: {
    backgroundColor: Colors.shimmerBase,
    borderRadius: BorderRadius.sm,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: CARD_WIDTH * 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius['2xl'],
  },
});

export default React.memo(GoldLoader);
