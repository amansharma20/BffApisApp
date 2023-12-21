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
import { useNavigation, useRoute} from '@react-navigation/native';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import {getGuestCustomerCartItems} from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartItem from './CartItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { customerId } from '@/utils/appUtils';
import { storage } from '@/store';
import CartScreenShimmer from '@/components/shimmers/CartScreenShimmer';
import { useAuthRoute } from '@/hooks/useAuthRoute';
import GuestCartScreen from '@/screens/guestcart/GuestCartScreen'
import config from '@/config';

const CartScreen = () => {
  const route = useRoute();
  const queryStringParams = route?.params?.queryString;
  console.log(queryStringParams,"consoled log")

  const navigation = useNavigation();
  const { getAuthRoute } = useAuthRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const [id, setId] = useState('');

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
  console.log("customerCartItems",customerCartItems)
  const renderItem = () => {
    20;
  };

    
  const guestUserUniqueId = id;
  console.log(guestUserUniqueId,'id is coming...')

  useEffect(() => {
    const guestCart = async () => {
      setIsLoading(true);
      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );
      setId(guestCustomerUniqueId);

      if (guestCustomerUniqueId) {
        const headers = {
          'Mysterious-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          getGuestCustomerCartItems(`${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`),
        ).then(() => {
          setIsLoading(false);
          console.log('redux called successfully',guestCustomerUniqueId);
        });
        setIsLoading(false);
      } else {
        const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
        AsyncStorage.setItem('guestCustomerUniqueId', guestUserUniqueId);
        const headers = {
          'Mysterious-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          getGuestCustomerCartItems(`${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`),
        ).then(() => {
          setIsLoading(false);
        });
        setIsLoading(false);
        console.log('redux called ya successfully',guestUserUniqueId);
      }
    };
    guestCart();
  }, []);

  useEffect(() => {
    dispatch(
      getCustomerCartItems(`${config.cartUrl}cartDetail/${customerCartId}`),
    ).then(res => {
      if (res.payload.status === 200) {
        console.log('carts api call successful');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log('carts api call not successful');
      }
    });
  }, []);

//   const guestUserBasketId = useSelector(
//     state =>
//     state?.getGuestCustomerCartItemsApiSlice?.baskets[0].basket_id
//   );
// console.log("guestUserBasketId",guestUserBasketId)

  const [cartData,setCartData] = useState()

  useEffect(() => {
    dispatch(
      getGuestCustomerCartItems(`${config.cartUrl}guestCartDetail/${queryStringParams}?uniqueId=${guestUserUniqueId}`),
    ).then(res => {
      if (res.payload.status === 200) {
        setCartData(res.payload.data.products)
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log('guest carts api call not successful');
      }
    });
  }, [guestUserUniqueId]);

  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in cart.</Text>
      </Box>
    );
  };

  console.log(cartData,"this is the cart Data")
  
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
         
      
            {/* <GuestCartScreen /> */}
        
         </> 
        )}
      </Box>
      {/* {customerCartItems?.products?.length && isUserLoggedIn ? ( */}
      <>
        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton
            title="Proceed to Checkout"
            disabled={
              isLoading || customerCartItems?.products?.length <= 0
                ? true
                : false
            }
            onPress={() =>
              getAuthRoute('CheckoutScreen', {
                basketId: customerCartId,
              })
            }
          />
        </Box>
      </>
    </SafeAreaView>
  );
};
export default CartScreen;
