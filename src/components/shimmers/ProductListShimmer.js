import { Box } from '@/atoms';
import React from 'react';
import { View, Animated, StyleSheet, Text, FlatList } from 'react-native';
import { useWindowDimensions } from 'react-native';

const ProductListShimmer = ({ duration = 1250 }) => {
  const { width } = useWindowDimensions();
  const shimmerValue = new Animated.Value(-width);
  const items = Array.from({ length: 5 }, (_, index) => `Item ${index + 1}`);
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
  }, [items]);

  return (
    <Box backgroundColor="white" flex={1}>
      {items.map((item, index) => (
        <Box key={index} flexDirection="row">
          <Box flexDirection="column" flex={1}>
            <Box
              marginHorizontal="s16"
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s16"
              minHeight={250}
              maxHeight={250}
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
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s10"
              minHeight={30}
              maxHeight={30}
              width={'80%'}
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
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s10"
              minHeight={30}
              maxHeight={30}
              width={'25%'}
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
          <Box flexDirection="column" flex={1}>
            <Box
              marginHorizontal="s16"
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s16"
              minHeight={250}
              maxHeight={250}
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
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s10"
              minHeight={30}
              maxHeight={30}
              width={'80%'}
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
              backgroundColor="border"
              overflow="hidden"
              flex={1}
              borderRadius={8}
              mt="s10"
              minHeight={30}
              maxHeight={30}
              width={'25%'}
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
        </Box>
      ))}
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

export default ProductListShimmer;
