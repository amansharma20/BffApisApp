/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Box, Text, theme } from '@/atoms';
import { useSelector, useDispatch } from 'react-redux';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import { useNavigation } from '@react-navigation/native';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { getCustomerWishlist } from '@/redux/wishlistApi/WishlistApiAsyncThunk';
import { getWishlistById } from '@/redux/wishlistApi/WishlistByIdApiAsyncThunk';
import WishlistItem from './WishlistItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { customerId } from '@/utils/appUtils';
import { storage } from '@/store';
import CartScreenShimmer from '@/components/shimmers/CartScreenShimmer';
import { useAuthRoute } from '@/hooks/useAuthRoute';
import config from '@/config';
import { api } from '@/api/SecureAPI';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const { getAuthRoute } = useAuthRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const dispatch = useDispatch();

  // const customerCartId = useSelector(
  //   state =>
  //     state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
  //       ?.basket_id,
  // );
  // console.log('customerCartId: ', customerCartId);

  // const customerCartItems = useSelector(
  //   state => state?.getCustomerCartItemsAliSlice?.customerCartItems?.data,
  // );

  const wishlistAllItems = useSelector(
    state => state?.getCustomerWishlistApiSlice?.customerWishlist?.data,
  );
  console.log(wishlistAllItems, 'wishlistItemsfff');

  const wishlistByIdItems = useSelector(
    state => state?.getWishlistByIdApiSlice?.WishlistById?.data,
  );
  console.log('wishlistByIdItems', wishlistByIdItems);

  const renderItem = () => {
    20;
  };

  useEffect(() => {
    dispatch(
      getCustomerWishlist(
        `${config.cartUrl}customerWishlist?customerId=${storage.getString(
          'customerId',
        )}`,
      ),
    );
  }, []);

  useEffect(() => {
    dispatch(
      getWishlistById(
        `${
          config.cartUrl
        }wishlistById/943c76423cd374f626d7b1cad9?customerId=${storage.getString(
          'customerId',
        )}`,
      ),
    );
  }, []);

  const addNewWishlist = async () => {
    const respBody = {
      customerId: `${storage.getString('customerId')}`,
      productId: productId,
      type: 'product',
    };
    console.log('respBody', respBody);
    const response = await api.post(
      `${config.cartUrl}wishlistAddItem/943c76423cd374f626d7b1cad9`,
      respBody,
    );
    console.log('responser', response);
    if (response?.data?.status === 201 || response?.data?.status == 200) {
      dispatch(
        getCustomerWishlist(
          `${config.cartUrl}customerWishlist?customerId=${storage.getString(
            'customerId',
          )}`,
        ),
      );
    } else {
      alert('error');
    }
  };

  // useEffect(() => {
  //   dispatch(
  //     getCustomerCartItems(`${config.cartUrl}cartDetail/${customerCartId}`),
  //   ).then(res => {
  //     if (res.payload.status === 200) {
  //       console.log('carts api call successful');
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);
  //       console.log('carts api call not successful');
  //     }
  //   });
  // }, []);

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in wishlist.</Text>
      </Box>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        {isUserLoggedIn ? (
          <>
            <CommonHeader title={'Your Wishlistff'} />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: theme.spacing.paddingHorizontal,
              }}
            >
              <Box>
                <FlatList
                  data={wishlistByIdItems?.wishlistItems}
                  renderItem={item => {
                    const productData = item?.item;
                    console.log(productData, 'productData');
                    return <WishlistItem item={productData} />;
                  }}
                  ListEmptyComponent={
                    isLoading === false ? (
                      <ListEmptyComponent />
                    ) : (
                      <ActivityIndicator />
                    )
                  }
                  scrollEnabled={false}
                />
              </Box>
            </ScrollView>
          </>
        ) : (
          <>
            <Box flex={1} justifyContent="center">
              <Text textAlign="center">Please logged in first</Text>
            </Box>
          </>
        )}
      </Box>
      <>
        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton
            title="Add new Shopping list"
            onPress={() => addNewWishlist()}
          />
        </Box>
      </>
    </SafeAreaView>
  );
};
export default WishlistScreen;
