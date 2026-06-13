// Platinum Loader: Circular progress indicator with rotating ring
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Text, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../theme/colors';
import {BorderRadius, Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';

const RING_SIZE = 64;
const STROKE = 4;

const PlatinumLoader: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const progress = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
    );

    rotate.start();
    progress.start();

    const listenerId = progressAnim.addListener(({value}) => {
      setDisplayPct(Math.round(value * 100));
    });

    return () => {
      rotate.stop();
      progress.stop();
      progressAnim.removeListener(listenerId);
    };
  }, [rotateAnim, progressAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(184,192,204,0.10)', 'rgba(107,114,128,0.04)', 'rgba(10,10,15,0)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>

        <View style={styles.headerRow}>
          {/* Spinning ring */}
          <View style={styles.ringContainer}>
            <Animated.View style={[styles.ringOuter, {transform: [{rotate: spin}]}]}>
              <LinearGradient
                colors={[Colors.platinumGradientStart, 'transparent']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.ringGradient}
              />
            </Animated.View>
            <View style={styles.ringInner}>
              <Text style={styles.pctText}>{displayPct}%</Text>
            </View>
          </View>

          <View style={styles.flex}>
            <View style={[styles.bar, {width: '60%', height: 13}]} />
            <View style={[styles.bar, {width: '40%', height: 10, marginTop: 6}]} />
          </View>

          <View style={[styles.bar, {width: 72, height: 28, borderRadius: BorderRadius.full}]} />
        </View>

        <View style={[styles.bar, {width: '62%', height: 32, marginTop: 18}]} />
        <View style={[styles.bar, {width: '38%', height: 12, marginTop: 8}]} />

        {/* Mini stat bars */}
        <View style={styles.statsRow}>
          {[40, 55, 35].map((w, i) => (
            <View key={i} style={styles.statItem}>
              <View style={[styles.bar, {width: w, height: 8, marginBottom: 4}]} />
              <View style={[styles.bar, {width: 30, height: 10}]} />
            </View>
          ))}
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
    borderColor: 'rgba(184,192,204,0.15)',
    minHeight: 180,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center'},
  flex: {flex: 1, marginLeft: Spacing.md},
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: STROKE,
    borderColor: 'transparent',
    borderTopColor: Colors.platinumGradientStart,
    borderRightColor: 'rgba(184,192,204,0.3)',
  },
  ringGradient: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
  },
  ringInner: {
    width: RING_SIZE - STROKE * 4,
    height: RING_SIZE - STROKE * 4,
    borderRadius: (RING_SIZE - STROKE * 4) / 2,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctText: {
    color: Colors.platinum,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  bar: {
    backgroundColor: Colors.shimmerBase,
    borderRadius: BorderRadius.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  statItem: {alignItems: 'center'},
});

export default React.memo(PlatinumLoader);
