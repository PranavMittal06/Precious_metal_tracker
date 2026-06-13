import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import {Spacing} from '../../theme/spacing';

interface Props {
  isOffline: boolean;
}

const OfflineBanner: React.FC<Props> = ({isOffline}) => {
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOffline) {
      Animated.parallel([
        Animated.spring(slideAnim, {toValue: 0, useNativeDriver: true, tension: 80}),
        Animated.timing(opacityAnim, {toValue: 1, duration: 300, useNativeDriver: true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {toValue: -60, duration: 250, useNativeDriver: true}),
        Animated.timing(opacityAnim, {toValue: 0, duration: 250, useNativeDriver: true}),
      ]).start();
    }
  }, [isOffline, slideAnim, opacityAnim]);

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY: slideAnim}], opacity: opacityAnim}]}
      pointerEvents={isOffline ? 'auto' : 'none'}>
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <View>
          <Text style={styles.title}>You're offline</Text>
          <Text style={styles.subtitle}>Showing cached data · Reconnecting...</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#1A1A2E',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239,68,68,0.40)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.errorLight,
  },
  icon: {fontSize: 16, marginRight: Spacing.sm},
  title: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
  },
});

export default React.memo(OfflineBanner);
