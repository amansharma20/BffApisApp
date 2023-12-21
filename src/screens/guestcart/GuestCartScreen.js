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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { getGuestCustomerCartItems } from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GuestCartItem from './GuestCartItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { customerId } from '@/utils/appUtils';
import { storage } from '@/store';
import CartScreenShimmer from '@/components/shimmers/CartScreenShimmer';
import { useAuthRoute } from '@/hooks/useAuthRoute';
import config from '@/config';

const GuestCartScreen = () => {
  const route = useRoute();
  const queryStringParams = route?.params?.queryString;
  console.log(queryStringParams, 'consoled guest log');

  const navigation = useNavigation();
  const { getAuthRoute } = useAuthRoute();
  const [isLoading, setIsLoading] = useState(true);
  // const [cartItemsArray, setCartItemsArray] = useState([]);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const [id, setId] = useState('');

  const dispatch = useDispatch();

  

  const guestUserUniqueId = id;
  console.log(guestUserUniqueId, 'id is coming...');

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
          getGuestCustomerCartItems(
            `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
          ),
        ).then(() => {
          setIsLoading(false);
          console.log('redux called successfully', guestCustomerUniqueId);
        });
        setIsLoading(false);
      } else {
        const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
        AsyncStorage.setItem('guestCustomerUniqueId', guestUserUniqueId);
        const headers = {
          'Mysterious-Customer-Unique-Id': guestCustomerUniqueId,
        };
        dispatch(
          getGuestCustomerCartItems(
            `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
          ),
        ).then(() => {
          setIsLoading(false);
        });
        setIsLoading(false);
        console.log('redux called ya successfully', guestUserUniqueId);
      }
    };
    guestCart();
  }, []);

  const guestUserBasketId = useSelector(
    state => state?.getGuestCustomerCartItemsApiSlice?.guestCustomerCartItems,
  );
  console.log('guestUserBasketId', guestUserBasketId);

  const guestUserBasketItems = useSelector(
    state =>
      state?.getGuestCustomerCartItemsApiSlice?.guestCustomerCartItems?.data
        ?.products,
  );
  console.log('guestUserBasketItems', guestUserBasketItems);

  const [cartData, setCartData] = useState();

  useEffect(() => {
    dispatch(
      getGuestCustomerCartItems(
        `${config.cartUrl}guestCartDetail/${queryStringParams}?uniqueId=${guestUserUniqueId}`,
      ),
    ).then(res => {
      if (res.payload.status === 200) {
        setCartData(res.payload.data.products);
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

  console.log(cartData, 'this is the guest cart Data');

  // console.log("dataaaa",data)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        {!isUserLoggedIn ? (
          <>
            <CommonHeader title={'Your Guest Cart'} />
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
                  hi
                  <Box>
                    <FlatList
                      data={guestUserBasketItems}
                      renderItem={item => {
                        console.log('itemssss', item);
                        return <GuestCartItem item={item} />;
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
              isLoading || guestUserBasketItems?.length <= 0
                ? true
                : false
            }
            onPress={() =>{
              navigation.navigate('CheckoutScreen', {
                basketId:queryStringParams,
              })
            }
          }
          />
        </Box>
      </>
    </SafeAreaView>
  );
};

export default GuestCartScreen;
