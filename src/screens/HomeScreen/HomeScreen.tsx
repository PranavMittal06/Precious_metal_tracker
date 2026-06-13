import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';

import {useGoldPrice}      from '../../hooks/useGoldPrice';
import {useSilverPrice}    from '../../hooks/useSilverPrice';
import {usePlatinumPrice}  from '../../hooks/usePlatinumPrice';
import {usePalladiumPrice} from '../../hooks/usePalladiumPrice';
import {useRealTimePrice, useWsStatus} from '../../hooks/useRealTimePrice';

import MetalCard         from '../../components/MetalCard';
import GoldLoader        from '../../components/GoldLoader';
import SilverLoader      from '../../components/SilverLoader';
import PlatinumLoader    from '../../components/PlatinumLoader';
import PalladiumLoader   from '../../components/PalladiumLoader';
import ErrorCard         from '../../components/ErrorCard';
import OfflineBanner     from '../../components/OfflineBanner';

import {Colors}           from '../../theme/colors';
import {Typography}       from '../../theme/typography';
import {Spacing}          from '../../theme/spacing';
import {BackgroundGradient} from '../../theme/gradients';
import {MetalPrice, MetalType, RootStackParamList} from '../../types';
import {formatDate}       from '../../utils';
import {metalWebSocket}   from '../../services/webSocketService';
import {ConnectionStatus} from '../../services/webSocketService';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// ── WS status badge config ────────────────────────────────────────────────────
const WS_STATUS_CONFIG: Record<
  ConnectionStatus,
  {label: string; color: string; dotColor: string}
> = {
  connected:    {label: 'LIVE',          color: Colors.success,       dotColor: Colors.success},
  mock:         {label: 'DEMO · LIVE',   color: Colors.gold,          dotColor: Colors.gold},
  connecting:   {label: 'Connecting…',   color: Colors.warning,       dotColor: Colors.warning},
  reconnecting: {label: 'Reconnecting…', color: Colors.warning,       dotColor: Colors.warning},
  disconnected: {label: 'Offline',       color: Colors.error,         dotColor: Colors.error},
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [isOffline, setIsOffline] = React.useState(false);

  // ── REST hooks (initial load, error, pull-to-refresh) ────────────────────
  const gold      = useGoldPrice();
  const silver    = useSilverPrice();
  const platinum  = usePlatinumPrice();
  const palladium = usePalladiumPrice();

  // ── Real-time WebSocket layer ─────────────────────────────────────────────
  const goldRT      = useRealTimePrice('gold',      gold.data);
  const silverRT    = useRealTimePrice('silver',    silver.data);
  const platinumRT  = useRealTimePrice('platinum',  platinum.data);
  const palladiumRT = useRealTimePrice('palladium', palladium.data);
  const wsStatus    = useWsStatus();

  // ── Header animation ─────────────────────────────────────────────────────
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start WebSocket once on mount
    metalWebSocket.connect();

    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [headerAnim]);

  // ── NetInfo offline detection ─────────────────────────────────────────────
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      setIsOffline(!(state.isConnected && state.isInternetReachable));
    });
    return unsub;
  }, []);

  const isRefreshing =
    gold.isRefetching || silver.isRefreshing || platinum.isRefetching || palladium.isRefreshing;

  const handleRefreshAll = useCallback(() => {
    gold.refresh();
    silver.refresh();
    platinum.refresh();
    palladium.refresh();
  }, [gold, silver, platinum, palladium]);

  const handleCardPress = useCallback(
    (metalType: MetalType, data: MetalPrice) => {
      navigation.navigate('Details', {metalType, metalData: data});
    },
    [navigation],
  );

  const now = Math.floor(Date.now() / 1000);
  const statusCfg = WS_STATUS_CONFIG[wsStatus];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <LinearGradient
        colors={BackgroundGradient}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      <OfflineBanner isOffline={isOffline} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ── Header ── */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}>
          <View>
            <Text style={styles.headerDate}>{formatDate(now)}</Text>
            <Text style={styles.headerTitle}>Precious Metals</Text>
            <Text style={styles.headerSubtitle}>Real-time Market Prices</Text>
          </View>

          <TouchableOpacity
            onPress={handleRefreshAll}
            style={styles.refreshBtn}
            activeOpacity={0.7}>
            <Text style={styles.refreshIcon}>⟳</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── WebSocket connection status bar ── */}
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, {backgroundColor: statusCfg.dotColor}]} />
          <Text style={[styles.statusLabel, {color: statusCfg.color}]}>
            {statusCfg.label}
          </Text>
          {(wsStatus === 'connected' || wsStatus === 'mock') && (
            <Text style={styles.statusSub}> · WebSocket stream active</Text>
          )}
          {wsStatus === 'mock' && (
            <Text style={styles.statusSub}> · Add Finnhub key for live data</Text>
          )}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefreshAll}
              tintColor={Colors.gold}
              colors={[Colors.gold, Colors.silver]}
            />
          }>

          {/* ── GOLD ── */}
          {gold.isLoading ? (
            <GoldLoader />
          ) : gold.isError ? (
            <ErrorCard metalType="gold" error={gold.error?.message ?? 'Error'} onRetry={gold.refresh} />
          ) : goldRT.data ? (
            <MetalCard
              metalType="gold"
              data={goldRT.data}
              onPress={handleCardPress}
              animationDelay={0}
              isFetching={gold.isFetching}
              flashDirection={goldRT.flashDirection}
              tickCount={goldRT.tickCount}
            />
          ) : null}

          {/* ── SILVER ── */}
          {silver.isLoading ? (
            <SilverLoader />
          ) : silver.isError ? (
            <ErrorCard metalType="silver" error={silver.error?.message ?? 'Error'} onRetry={silver.retry} />
          ) : silverRT.data ? (
            <MetalCard
              metalType="silver"
              data={silverRT.data}
              onPress={handleCardPress}
              animationDelay={100}
              isFetching={silver.isRefreshing}
              flashDirection={silverRT.flashDirection}
              tickCount={silverRT.tickCount}
            />
          ) : null}

          {/* ── PLATINUM ── */}
          {platinum.isLoading ? (
            <PlatinumLoader />
          ) : platinum.isError ? (
            <ErrorCard metalType="platinum" error={platinum.error?.message ?? 'Error'} onRetry={platinum.refresh} />
          ) : platinumRT.data ? (
            <MetalCard
              metalType="platinum"
              data={platinumRT.data}
              onPress={handleCardPress}
              animationDelay={200}
              isFetching={platinum.isFetching}
              flashDirection={platinumRT.flashDirection}
              tickCount={platinumRT.tickCount}
            />
          ) : null}

          {/* ── PALLADIUM ── */}
          {palladium.isLoading ? (
            <PalladiumLoader />
          ) : palladium.isError ? (
            <ErrorCard metalType="palladium" error={palladium.error?.message ?? 'Error'} onRetry={palladium.retry} />
          ) : palladiumRT.data ? (
            <MetalCard
              metalType="palladium"
              data={palladiumRT.data}
              onPress={handleCardPress}
              animationDelay={300}
              isFetching={palladium.isRefreshing}
              flashDirection={palladiumRT.flashDirection}
              tickCount={palladiumRT.tickCount}
            />
          ) : null}

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Prices in USD · Per troy ounce</Text>
            <Text style={styles.footerSub}>
              {wsStatus === 'mock'
                ? 'Demo mode — simulated live stream'
                : 'Streaming via Finnhub WebSocket'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  safeArea: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerDate: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.extraBold,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
    marginTop: 2,
  },
  refreshBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  refreshIcon: {
    color: Colors.gold,
    fontSize: 20,
    fontWeight: Typography.weights.bold,
  },

  // WS status bar
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  statusSub: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
  },

  scroll: {flex: 1},
  scrollContent: {paddingTop: Spacing.md, paddingBottom: Spacing['3xl']},
  footer: {alignItems: 'center', paddingTop: Spacing.md, paddingBottom: Spacing.base},
  footerText: {color: Colors.textMuted, fontSize: Typography.sizes.xs, letterSpacing: 0.5},
  footerSub: {color: Colors.textMuted, fontSize: Typography.sizes.xs, marginTop: 4, opacity: 0.6},
});

export default HomeScreen;
