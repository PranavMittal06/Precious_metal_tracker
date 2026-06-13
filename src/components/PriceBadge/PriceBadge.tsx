import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TrendDirection} from '../../types';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import {BorderRadius, Spacing} from '../../theme/spacing';
import {formatPercent} from '../../utils';

interface Props {
  changePercent?: number;
  trend: TrendDirection;
  size?: 'sm' | 'md' | 'lg';
}

const PriceBadge: React.FC<Props> = ({changePercent, trend, size = 'md'}) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  const bgColor = isUp
    ? Colors.successLight
    : isDown
    ? Colors.errorLight
    : Colors.warningLight;

  const textColor = isUp
    ? Colors.success
    : isDown
    ? Colors.error
    : Colors.warning;

  const arrow = isUp ? '▲' : isDown ? '▼' : '—';

  const fontSize =
    size === 'sm' ? Typography.sizes.xs
    : size === 'lg' ? Typography.sizes.md
    : Typography.sizes.sm;

  const paddingV = size === 'sm' ? 3 : size === 'lg' ? 7 : 5;
  const paddingH = size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.md : Spacing.sm + 2;

  return (
    <View style={[styles.badge, {backgroundColor: bgColor, paddingVertical: paddingV, paddingHorizontal: paddingH}]}>
      <Text style={[styles.text, {color: textColor, fontSize}]}>
        {arrow} {changePercent !== undefined ? formatPercent(changePercent) : '—'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: Typography.weights.semiBold,
    letterSpacing: 0.3,
  },
});

export default React.memo(PriceBadge);
