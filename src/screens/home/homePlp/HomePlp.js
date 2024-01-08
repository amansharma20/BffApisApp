/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Box, Text, theme } from '@atoms';
import ProductItem from '../../../components/ProductItem/ProductItem';
import ProductListShimmer from '@/components/shimmers/ProductListShimmer';

const HomePlp = ({
  isLoadingNewArival,
  isLoadingBestSelling,
  productList,
  listTitle,
}) => {
  const renderItem = ({ item, index }) => {
    return <ProductItem item={item} key={index} />; 
  };

  return (
    <Box style={styles.container}>
      {/* <CommonHeader title={title || 'All Products'} showCartIcon /> */}
      <>
        {productList?.length !== 0 ? (
          <Text style={styles.heading}>{listTitle}</Text>
        ) : (
          ''
        )}
        <Box paddingHorizontal="s6">
          {isLoadingNewArival || isLoadingBestSelling ? (
            <ProductListShimmer />
          ) : (
            <FlatList
              data={productList}
              renderItem={renderItem}
              numColumns={2}
            />
          )}
        </Box>
      </>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    // padding: 16,
  },

  productList: {
    paddingHorizontal: 16,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  heading: {
    textAlign: 'center',
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold', // Adjust the font weight as needed
    marginBottom: 16, // Adjust the margin as needed
  },
});

export default HomePlp;
