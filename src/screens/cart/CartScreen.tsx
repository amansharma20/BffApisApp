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
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import CartItem from './CartItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { customerId } from '@/utils/appUtils';

import { storage } from '@/store';
import CartScreenShimmer from '@/components/shimmers/CartScreenShimmer';
import navigateAuthRoutes from '@/hooks/navigateAuthRoutes';
const CartScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const dispatch = useDispatch();

  const customerCartId = useSelector(
    state =>
      state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
        ?.basket_id,
  );

  console.log('customerCartId: ', customerCartId);

  const customerCartItems = useSelector(
    state => state?.getCustomerCartItemsAliSlice?.customerCartItems?.data,
  );

  const renderItem = () => {
    20;
  };

  useEffect(() => {
    dispatch(getCustomerCartItems(`sfcc/cartDetail/${customerCartId}`)).then(
      res => {
        if (res.payload.status === 200) {
          console.log('carts api call successful');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('carts api call not successful');
        }
      },
    );
  }, []);

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in cart.</Text>
      </Box>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        {isUserLoggedIn ? (
          <>
            <CommonHeader title={'Your Cart'} />
            {isLoading ? (
              <>
                <CartScreenShimmer />
              </>
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: theme.spacing.paddingHorizontal,
                  }}
                >
                  <Box>
                    <FlatList
                      data={customerCartItems?.products}
                      renderItem={item => {
                        const data = item?.item;
                        return <CartItem item={data} />;
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
                    {/* {customerCartItems?.totalizers?.Items > 0 ? (
                      <>
                        <Box
                          justifyContent="flex-end"
                          flexDirection="row"
                          paddingVertical="s8"
                        >
                          <Text>
                            Total Discount : $
                            {Math.floor(
                              customerCartItems?.totalizers?.Discounts,
                            )}
                          </Text>
                        </Box>
                        <Box justifyContent="flex-end" flexDirection="row">
                          <Text>
                            Shipping Amount : $
                            {customerCartItems?.totalizers?.Shipping}
                          </Text>
                        </Box>
                        <Box justifyContent="flex-end" flexDirection="row">
                          <Text>
                            Tax Included : ${customerCartItems?.totalizers?.Tax}
                          </Text>
                        </Box>
                        <Box
                          justifyContent="flex-end"
                          flexDirection="row"
                          paddingVertical="s8"
                        >
                          <Text variant="bold24">
                            Total : {customerCartItems?.totalizers?.CartTotal}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <></>
                    )} */}
                  </Box>
                </ScrollView>
              </>
            )}
          </>
        ) : (
          <>
            <Box flex={1} justifyContent="center">
              <Text textAlign="center">Please logged in first</Text>
            </Box>
          </>
        )}
      </Box>
      {customerCartItems?.products?.length && isUserLoggedIn ? (
        <>
          <Box
            padding="s16"
            style={theme.cardVariants.bottomButtonShadow}
            backgroundColor="white"
          >
            <CommonSolidButton
              title="Proceed to Checkout"
              disabled={isLoading ? true : false}
              onPress={() =>
                navigateAuthRoutes('CheckoutScreen', {
                  basketId: customerCartId,
                })
              }
            />
          </Box>
        </>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};
export default CartScreen;
