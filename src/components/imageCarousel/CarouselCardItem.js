/* eslint-disable react/react-in-jsx-scope */
import { Box } from '@/atoms';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
export const SLIDER_WIDTH = Dimensions.get('window').width + 1;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
export const CarouselCardItem = ({ item, index }) => {
  // const imageUrl = Array.isArray(item?.image) ? item.image[0] : item.image;
  return (
    <Box style={styles.container} key={index}>
      <Image
        source={{
          // uri: imageUrl || item?.image || item?.images || item?.image?.[0],
          uri: item,
        }}
        style={styles.image}
      />
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
    resizeMode: 'contain',
  },
});
