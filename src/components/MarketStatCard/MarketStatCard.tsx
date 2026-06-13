import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import {BorderRadius, Spacing} from '../../theme/spacing';

interface Props {
  label: string;
  value: string;
  subValue?: string;
  accentColor?: string;
  icon?: string;
}

const MarketStatCard: React.FC<Props> = ({label, value, subValue, accentColor = Colors.gold, icon}) => (
  <View style={[styles.card, {borderLeftColor: accentColor}]}>
    {icon && <Text style={styles.icon}>{icon}</Text>}
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, {color: accentColor}]}>{value}</Text>
    {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    flex: 1,
    margin: Spacing.xs,
    minHeight: 80,
    justifyContent: 'center',
  },
  icon: {fontSize: 16, marginBottom: 4},
  label: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  subValue: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
});

export default React.memo(MarketStatCard);
