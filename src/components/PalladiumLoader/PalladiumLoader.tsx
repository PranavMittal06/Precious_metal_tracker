// Palladium Loader: Animated financial ticker + moving wave bar graph
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Text, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../../theme/colors';
import {BorderRadius, Spacing} from '../../theme/spacing';
import {Typography} from '../../theme/typography';

const BAR_COUNT = 8;
const MAX_BAR_HEIGHT = 36;

const PalladiumLoader: React.FC = () => {
  const tickerAnim = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(Array.from({length: BAR_COUNT}, () => new Animated.Value(0.3))).current;
  const [tickerText, setTickerText] = useState('XPD  ——  Loading...');

  const tickers = ['XPD  ——  Fetching...', 'XPD  ——  Connecting...', 'XPD  ——  Syncing...'];
  const tickerIdx = useRef(0);

  useEffect(() => {
    // Ticker text cycle
    const textInterval = setInterval(() => {
      tickerIdx.current = (tickerIdx.current + 1) % tickers.length;
      setTickerText(tickers[tickerIdx.current]);
    }, 900);

    // Scrolling ticker line
    const ticker = Animated.loop(
      Animated.timing(tickerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    ticker.start();

    // Wave bars animation
    const waveAnimations = barAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 80),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ]),
      ),
    );
    waveAnimations.forEach(a => a.start());

    return () => {
      clearInterval(textInterval);
      ticker.stop();
      waveAnimations.forEach(a => a.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tickerTranslate = tickerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(155,136,255,0.10)', 'rgba(75,62,174,0.04)', 'rgba(10,10,15,0)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>

        {/* Ticker header */}
        <View style={styles.tickerContainer}>
          <View style={styles.tickerDot} />
          <View style={styles.tickerTextWrap}>
            <Animated.View style={{transform: [{translateX: tickerTranslate}]}}>
              <Text style={styles.tickerTextStyle}>{tickerText}   {tickerText}</Text>
            </Animated.View>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Price skeleton */}
        <View style={[styles.bar, {width: '58%', height: 30, marginTop: 14}]} />
        <View style={[styles.bar, {width: '35%', height: 11, marginTop: 8}]} />

        {/* Wave bar graph */}
        <View style={styles.waveContainer}>
          {barAnims.map((anim, i) => {
            const barHeight = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, MAX_BAR_HEIGHT],
            });
            const opacity = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            });
            return (
              <View key={i} style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.waveBar,
                    {
                      height: barHeight,
                      opacity,
                      backgroundColor: i % 2 === 0 ? Colors.palladium : Colors.palladiumLight,
                    },
                  ]}
                />
              </View>
            );
          })}
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
    borderColor: 'rgba(155,136,255,0.18)',
    minHeight: 180,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tickerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.sm,
  },
  tickerTextWrap: {flex: 1, overflow: 'hidden'},
  tickerTextStyle: {
    color: Colors.palladiumLight,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    letterSpacing: 1,
    width: 400,
  },
  liveBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  liveText: {
    color: Colors.success,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  bar: {
    backgroundColor: Colors.shimmerBase,
    borderRadius: BorderRadius.sm,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: Spacing.lg,
    height: MAX_BAR_HEIGHT + 4,
  },
  barWrapper: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  waveBar: {
    width: '70%',
    borderRadius: 2,
    minHeight: 8,
  },
});

export default React.memo(PalladiumLoader);
