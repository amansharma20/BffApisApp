/* eslint-disable react/no-unstable-nested-components */
import { Box, Text } from '@/atoms';
import React, { useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { IS_IOS } from '@/utils/appUtils';
import GoBackButton from '@/components/GoBackButton/GoBackButton';
import ProductItem from '@/components/ProductItem/ProductItem';
import { searchProducts } from '@/redux/searchApi/SearchApiAsyncThunk';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import ProductListShimmer from '@/components/shimmers/ProductListShimmer';

const SearchScreen = () => {
  const [value, setValue] = useState('');
  const dispatch = useAppDispatch();
  //   const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyItemFlag, setEmptyItemFlag] = useState(false);

  const products = useAppSelector(
    state => state?.searchProductsApiSlice?.products?.data?.ProductData,
  );

  const handleSearch = () => {
    setIsLoading(true);
    dispatch(searchProducts(`sfcc/products-by-query/${value}`)).then(resp => {
      if (resp?.payload?.data?.ProductData?.length == 0) {
        setEmptyItemFlag(true);
      }
      setIsLoading(false);
    });
  };

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Products Found</Text>
      </Box>
    );
  };

  const renderItem = ({ item, index }) => (
    <>
      <ProductItem item={item} />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box
        flexDirection="row"
        paddingHorizontal="s16"
        alignItems="center"
        paddingTop="s8"
      >
        <GoBackButton />
        <Box
          borderWidth={IS_IOS ? 0.5 : 1}
          borderColor="black"
          flexDirection="row"
          flex={1}
          height={32}
        >
          <TextInput
            onChangeText={text => setValue(text)}
            value={value}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            style={styles.textInput}
          />
        </Box>
      </Box>
      <Box mt="s8" flex={1}>
        {isLoading ? (
          <ProductListShimmer />
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            ListEmptyComponent={
              emptyItemFlag === true ? <ListEmptyComponent /> : <></>
            }
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  productList: {
    paddingHorizontal: 16,
  },
  textInput: {
    width: '100%',
    fontSize: 12,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default SearchScreen;
