import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MetalType} from '../../types';
import {MetalColors, Colors} from '../../theme/colors';
import {METAL_CONFIG} from '../../constants';
import {Typography} from '../../theme/typography';
import {BorderRadius, Spacing} from '../../theme/spacing';

interface Props {
  metalType: MetalType;
  error: string;
  onRetry?: () => void;
}

const ErrorCard: React.FC<Props> = ({metalType, error, onRetry}) => {
  const config = METAL_CONFIG[metalType];
  const metalColor = MetalColors[metalType];

  const isTimeout = error.toLowerCase().includes('timeout') || error.toLowerCase().includes('timed out');
  const isNetwork = error.toLowerCase().includes('network') || error.toLowerCase().includes('internet');

  const getMessage = () => {
    if (isTimeout) return 'Request timed out';
    if (isNetwork) return 'No internet connection';
    return `Unable to load ${config.name} price`;
  };

  const getSubMessage = () => {
    if (isTimeout) return 'The server took too long to respond.';
    if (isNetwork) return 'Please check your internet connection.';
    return 'An error occurred while fetching data.';
  };

  return (
    <LinearGradient
      colors={[`${metalColor.primary}18`, `${metalColor.primary}06`, 'transparent']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>

      <View style={styles.row}>
        <View style={[styles.iconContainer, {backgroundColor: Colors.errorLight}]}>
          <Text style={styles.errorIcon}>⚠️</Text>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.metalIcon}>{config.displayIcon}</Text>
            <Text style={[styles.metalName, {color: metalColor.primary}]}>{config.name}</Text>
          </View>
          <Text style={styles.errorMessage}>{getMessage()}</Text>
          <Text style={styles.errorSub}>{getSubMessage()}</Text>
        </View>
      </View>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={[styles.retryBtn, {borderColor: metalColor.primary}]}
          activeOpacity={0.7}>
          <Text style={[styles.retryText, {color: metalColor.primary}]}>↻  Retry</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.20)',
    minHeight: 120,
  },
  row: {flexDirection: 'row', alignItems: 'flex-start'},
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  errorIcon: {fontSize: 18},
  textContainer: {flex: 1},
  headerRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4},
  metalIcon: {fontSize: 16, marginRight: 6},
  metalName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
  },
  errorMessage: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    marginBottom: 4,
  },
  errorSub: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  retryBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  retryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
  },
});

export default React.memo(ErrorCard);
