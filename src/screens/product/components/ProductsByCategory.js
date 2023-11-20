/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { theme } from '../../../atoms/theme';
import { Box, Text } from '@/atoms';
import { useDispatch, useSelector } from 'react-redux';
import { ProductsApiAsyncThunk } from '@/redux/productsApi/ProductsApiAsyncThunk';
// import ProductItem from '@/components/product/ProductItem';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import ProductItem from '@/components/ProductItem/ProductItem';
import config from '@/config';
import ProductListShimmer from '@/components/shimmers/ProductListShimmer';

const ProductsByCategory = props => {
  const [isLoading, setIsLoading] = useState(true);

  const isCategoryTrue = props.route.params.isCategoryTrue;
  const categoryId = isCategoryTrue
    ? props.route?.params?.item?.parent_Id
    : props.route?.params?.item?.Id;

  const categoryName = props.route?.params?.item?.name;
  const categoryEndPoint = isCategoryTrue
    ? config.productsByCategoryUrl
    : config.productsBySubCategoryUrl;

  const dispatch = useDispatch();

  const productsByCategory = useSelector(
    state =>
      state?.getProductsByCategoryApiSlice?.productsByCategory?.data
        ?.productData,
  );
  console.log('productsByCategory: ', productsByCategory);

  useEffect(() => {
    setIsLoading(true);
    dispatch(ProductsApiAsyncThunk(`${categoryEndPoint}/${categoryId}`))
      .then(() => setIsLoading(false))
      .catch(error => {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      });
  }, []);

  const renderItem = ({ item, index }) => (
    <>
      {/* <ProductItem item={item} index={index} /> */}
      <ProductItem item={item} />
    </>
  );

  return (
    <Box style={styles.container} flex={1}>
      <CommonHeader title={`${categoryName}`} showCartIcon searchIcon={true} />
      <>
        {isLoading ? (
          <Box backgroundColor="white">
            <ProductListShimmer />
          </Box>
        ) : (
          <FlatList
            data={productsByCategory}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        )}
      </>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: theme.colors.background,
    backgroundColor: 'white',
    // padding: 16,
  },

  productList: {
    // justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default ProductsByCategory;
