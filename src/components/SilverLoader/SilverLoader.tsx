// Silver Loader: Pulse / opacity breathing effect with silver glow
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../theme/colors';
import {BorderRadius, Spacing} from '../../theme/spacing';

const SilverLoader: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.01,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, scaleAnim]);

  return (
    <Animated.View
      style={[styles.container, {opacity: pulseAnim, transform: [{scale: scaleAnim}]}]}>
      <LinearGradient
        colors={['rgba(192,192,192,0.12)', 'rgba(128,128,128,0.04)', 'rgba(10,10,15,0)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>

        {/* Glowing border pulse */}
        <Animated.View
          style={[styles.glowRing, {opacity: pulseAnim}]}
          pointerEvents="none"
        />

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.flex}>
            <View style={[styles.bar, {width: '55%', height: 13}]} />
            <View style={[styles.bar, {width: '35%', height: 10, marginTop: 6}]} />
          </View>
          <View style={[styles.bar, {width: 72, height: 28, borderRadius: BorderRadius.full}]} />
        </View>

        {/* Price block */}
        <View style={[styles.bar, {width: '65%', height: 34, marginTop: 18}]} />
        <View style={[styles.bar, {width: '40%', height: 12, marginTop: 8}]} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={[styles.bar, {width: '45%', height: 12}]} />
          <View style={[styles.bar, {width: '30%', height: 12}]} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {marginHorizontal: Spacing.base, marginBottom: Spacing.md},
  card: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.15)',
    minHeight: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  glowRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1.5,
    borderColor: 'rgba(192,192,192,0.40)',
  },
  headerRow: {flexDirection: 'row', alignItems: 'center'},
  flex: {flex: 1, marginLeft: Spacing.md},
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.shimmerBase,
  },
  bar: {
    backgroundColor: Colors.shimmerBase,
    borderRadius: BorderRadius.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
});

export default React.memo(SilverLoader);
