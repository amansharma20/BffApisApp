import { Box } from '@/atoms';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
export const CarouselCrossSellingProducts = ({ item, index }) => {
  return (
    <Box style={styles.container} key={index}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text>hello Aamir</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH,
    height: 300,
  },
});
