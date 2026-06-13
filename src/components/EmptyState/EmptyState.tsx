import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import {Spacing} from '../../theme/spacing';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const EmptyState: React.FC<Props> = ({
  title = 'No Data Available',
  message = 'Market data could not be loaded at this time.',
  onRetry,
}) => (
  <View style={styles.container}>
    <Text style={styles.illustration}>📊</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity onPress={onRetry} style={styles.retryBtn} activeOpacity={0.7}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  illustration: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: Spacing.xl,
    backgroundColor: 'rgba(255,215,0,0.12)',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  retryText: {
    color: Colors.gold,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
  },
});

export default React.memo(EmptyState);
