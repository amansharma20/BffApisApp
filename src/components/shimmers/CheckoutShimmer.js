import React from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Box } from '@/atoms';
const CheckoutShimmer = ({ duration = 1250 }) => {
  const { width } = useWindowDimensions();
  const shimmerValue = new Animated.Value(-width);
  const startAnimation = () => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: width,
        duration: duration,
        useNativeDriver: true,
      }),
    ).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <Box backgroundColor="white" flex={1}>
      <Box
        marginHorizontal="s16"
        backgroundColor="border"
        overflow="hidden"
        flex={1}
        borderRadius={8}
        minHeight={150}
        maxHeight={150}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerValue,
                },
              ],
            },
          ]}
        />
      </Box>
      <Box
        marginHorizontal="s16"
        marginTop="s16"
        backgroundColor="border"
        overflow="hidden"
        flex={1}
        borderRadius={8}
        minHeight={150}
        maxHeight={150}
      >
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerValue,
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  shimmer: {
    backgroundColor: '#ebebeb', // Set this to the shimmer color you desire
    height: '100%',
    width: '50%', // Adjust the width of the shimmer as per your needs
    marginHorizontal: 16,
  },
});

export default CheckoutShimmer;
