/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Box, Text, theme } from '@atoms';
import { useDispatch, useSelector } from 'react-redux';
import { getNewArrival } from '@/redux/newArrivalApi/NewArrivalApiAsyncThunk';
import HomeProducts from '../components/HomeProducts';
const NewArrivals = () => {
  const dispatch = useDispatch();

  const newArrivals = useSelector(
    state => state?.getNewArrivalApiSlice?.newArrivals?.data || [],
  );

  // const renderItem = ({ item, index }) => <HomeProducts item={item} />;

  const renderItem = useCallback(({ item }) => {
    // render logic
    return <HomeProducts item={item} />;
  }, []);

  useEffect(() => {
    dispatch(getNewArrival('sfcc/new-arrivals'));
  }, []);

  return (
    <Box style={styles.container}>
      {/* <CommonHeader title={title || 'All Products'} showCartIcon /> */}
      <>
        {newArrivals.length !== 0 ? (
          <Text style={styles.heading}>New Arrivals</Text>
        ) : (
          ''
        )}

        <FlatList
          data={newArrivals}
          renderItem={renderItem}
          // key={Math.random()}
          keyExtractor={item => item?.skuId?.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      </>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
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

export default NewArrivals;
