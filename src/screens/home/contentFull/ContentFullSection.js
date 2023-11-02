/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Box, theme } from '@atoms';
import { Animated, Dimensions, StyleSheet, Image } from 'react-native';
import ContentFullShimmer from '@/components/shimmers/ContentFullShimmer';

const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = 200;

const ContentFullSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogPageImage, setBlogPageImage] = useState();
  const [cmsData, setCmsData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef();

  const headerData = cmsData?.items?.[0]?.heroBannerImageCollection?.items;
  const midSectionData = [];

  const handleScroll = event => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.floor(contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  const renderHeaderItem = ({ item }) => {
    return (
      <Box>
        <Box
          marginVertical="s10"
          marginHorizontal="paddingHorizontal"
          backgroundColor="white"
          borderRadius={8}
        >
          <Image
            source={{ uri: item.url }}
            style={{
              width: ITEM_WIDTH - 32,
              height: ITEM_WIDTH - 32,
              borderRadius: 8,
            }}
            contentFit="cover"
          />
        </Box>
      </Box>
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    const url =
      'https://graphql.contentful.com/content/v1/spaces/b7hw33ucy3y5/environments/master';
    const query = `{

   sushiittoHomeContentCollection{
    items{
      heroBannerImageCollection{
        items{
          url
        }
      }
    }
  }
    }`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 1bKW_Ovigequ04fW779NKR1inURdE7FPGRKhIFRMyuM',
      },
      body: JSON.stringify({ query }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setCmsData(data?.data?.sushiittoHomeContentCollection);
      setIsLoading(false);
      // setCmsData(data.data);
      // Process the response data as per your requirements
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Box>
        <Animated.FlatList
          ref={flatListRef}
          data={headerData}
          renderItem={renderHeaderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          scrollEventThrottle={16}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={handleScroll}
        />
      </Box>
      <Box
        flexDirection="row"
        // position="absolute"
        // bottom={40}
        width={'100%'}
        justifyContent="center"
        mb="s16"
      >
        {isLoading ? (
          <ContentFullShimmer />
        ) : (
          headerData?.map((_, index) => (
            <Box
              width={8}
              height={8}
              borderRadius={4}
              backgroundColor={
                index === currentIndex ? 'activeDot' : 'inactiveDot'
              }
              marginHorizontal="s4"
              key={index}
              // style={[
              //   styles.paginationDot,
              //   index === currentIndex && styles.paginationDotActive,
              // ]}
            />
          ))
        )}
      </Box>

      {/* <Box paddingHorizontal="paddingHorizontal" mt="s20" backgroundColor='red'>
        <FlatList
          // ref={flatListRef}
          data={midSectionData}
          renderItem={renderMidSectionItem}
          // horizontal
          // pagingEnabled
          showsHorizontalScrollIndicator={false}
          // keyExtractor={item => item.id}
          // scrollEventThrottle={16}
          // snapToInterval={ITEM_WIDTH}
          // decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: theme.spacing.s8,
          }}
          // onScroll={handleScroll}
        />
      </Box> */}
    </Box>
  );
};

export default ContentFullSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    flex: 1,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.bottomTabActiveColor,
  },
});
