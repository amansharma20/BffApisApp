import React from 'react';
import { View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { SLIDER_WIDTH, CarouselCardItem, ITEM_WIDTH } from './CarouselCardItem';
import data from './data';
import { Box } from '@/atoms';
import { CarouselCrossSellingProducts } from './CarouselCrossSellingProducts';

const CarouselCards = ({ images, crosSelling }) => {
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  return (
    <Box alignItems="center" height={350}>
      <Carousel
        // layout="tinder"
        // layoutCardOffset={9}
        ref={isCarousel}
        data={images}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={index => setIndex(index)}
        useScrollView={true}
      />
      <Pagination
        dotsLength={images?.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
    </Box>
  );
};

export default CarouselCards;
