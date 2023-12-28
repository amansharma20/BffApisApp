import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, FlatList, StatusBar } from 'react-native';
import { Box, theme } from '@/atoms';
import ContentFullSection from './contentFull/ContentFullSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommonSearchHeader from '@/components/CommonSearchHeader/CommonSearchHeader';
import { getNewArrival } from '@/redux/newArrivalApi/NewArrivalApiAsyncThunk';
import config, { ENV } from '@/config';
import HomePlp from './homePlp/HomePlp';
import { getBestSellings } from '@/redux/bestSellingProductApi/BestSellingProductApiAsyncThunk';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';
import { createCustomerBasket } from '@/redux/createBasketApi/CreateBasketApiAsyncThunk';
import { getCustomerBasketApi } from '@/redux/basket/BasketApiAsyncThunk';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { reduxStorage, storage } from '@/store';
import {getGuestCustomerCartItems} from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/SecureAPI';



const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [isLoadingNewArival, setIsloadingNewArrival] = useState(false);
  const [isLoadingBestSelling, setIsLoadingBestSelling] = useState(false);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const [isLoading, setIsLoading] = useState(true);
  const customerIdFromStorage = storage.getString('customerId');

  const [customerId, setCustomerId] = useState(customerIdFromStorage);

  const customerBasket = useAppSelector(
    state => state.getCustomerBasketApiSlice?.customerBasket?.data,
  );

  useEffect(() => {
    const listener = storage.addOnValueChangedListener(changedKey => {
      const newValue = storage.getString(changedKey);
      console.log(`"${changedKey}" new value: ${newValue}`);
      if (changedKey === 'customerId') {
        console.log('CUSTOMER ID CHANGED');
        setCustomerId(newValue);
      }
    });
    return () => {
      listener.remove();
      console.log('LISTENER REMOVED');
    };
  }, []);

  console.log('customerId: ', customerId);

  useEffect(() => {
    if (customerId) {
      dispatch(
        getCustomerBasketApi(`${config.cartUrl}getCustomerCart/${customerId}`),
      );
      dispatch(getCustomerDetails(`${config.cartUrl}userDetail/${customerId}`));
    }
    dispatch(
      createCustomerBasket(`${config.cartUrl}${config.createCartUrl}`),
    ).then(() => {});
  }, [isUserLoggedIn]);



  const newArrivals = useAppSelector(
    state => state?.getNewArrivalApiSlice?.newArrivals?.data,
  );

  const bestSellings = useAppSelector(
    state => state?.getBestSellingsApiSlice?.bestSellings?.data,
  );

  const ViewData = ['ContentFullSection', 'NewArrival', 'BestSelling'];

  console.log('🚀 ~ file: HomeScreen.tsx:70 ~ HomeScreen ~ ENV:', ENV);
  config.collections.newArrivals;
  console.log(
    '🚀 ~ file: HomeScreen.tsx:71 ~ HomeScreen ~ config.collections.newArrivals:',
    config.collections.newArrivals,
  );
  console.log(
    '🚀 ~ file: HomeScreen.tsx:76 ~ HomeScreen ~ config.baseUrl:',
    config.baseUrl,
  );

  useEffect(() => {
    setIsloadingNewArrival(true);
    setIsLoadingBestSelling(false);
    // dispatch(getNewArrival('sfcc/new-arrivals'));
    dispatch(getNewArrival(config.collections.newArrivals)).then(() => {
      setIsloadingNewArrival(false);
    });
    dispatch(getBestSellings(config.collections.bestSelling)).then(() => {
      setIsLoadingBestSelling(false);
    });
  }, []);


  useEffect(() => {
    
  const guestCart = async () => {
    // await AsyncStorage.removeItem('guestCustomerUniqueId');
    // await AsyncStorage.removeItem('guestBearerToken');
    // await AsyncStorage.removeItem('guestBasketIds');
    setIsLoading(true);
    const guestCustomerUniqueId = await AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
    console.log('ddd', guestCustomerUniqueId);
    // setId(guestCustomerUniqueId);

    if (guestCustomerUniqueId) {
      dispatch(
        getGuestCustomerCartItems(
          `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
        ),
      )
        .then(res => {
          if (res?.payload?.status === 200 || res?.payload?.status === 201) {
            console.log('guest carts api call successful', res?.payload?.data);
            // const queryString = res?.payload?.data;
            const guestBasketIds = res?.payload?.data?.baskets[0].basket_id;
            console.log(guestBasketIds, 'this is the personal queryString');
             AsyncStorage.setItem(
              'guestBasketIds',
              guestBasketIds,
            );
            // navigation.navigate('GuestCartScreen', { queryString });
            // setIsLoadingAddToGuestCart(false);
            setIsLoading(false);
          }
        })
        .then(() => {
          setIsLoading(false);
          console.log('redux called successfully', guestCustomerUniqueId);
        });
        setIsLoading(false);
    } else {
      // const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
      const guestUserUniqueId = await api.postWithGuestEndpoint(
        `${config.cartUrl}guestCreateCart`,
      );
      console.log('guestCreateCartssss', guestUserUniqueId.data.data.uniqueId);
      const guestCustomerUniqueId = guestUserUniqueId.data.data.uniqueId;
      console.log('guestCustomerUniqueIdg', guestCustomerUniqueId);
      const guestBearerToken = guestUserUniqueId.data.data.bearerToken;
      console.log('guestBearerToken', guestUserUniqueId.data.data.bearerToken);
      await AsyncStorage.setItem(
        'guestCustomerUniqueId',
        guestCustomerUniqueId,
      );
      await AsyncStorage.setItem('guestBearerToken', guestBearerToken);
      dispatch(
        getGuestCustomerCartItems(
          `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
        ),
      ).then(() => {
        setIsLoading(false);
      });
      setIsLoading(false);
      console.log('redux called ya successfully', guestCustomerUniqueId);
    }
  };
  guestCart();
})
  

  const renderHomeItems = useCallback(
    ({item }) => {
      switch (item) {
        case 'ContentFullSection':
          return <ContentFullSection />;
        case 'NewArrival':
          return (
            <HomePlp
              isLoadingNewArival={isLoadingNewArival}
              isLoadingBestSelling={isLoadingBestSelling}
              productList={newArrivals}
              listTitle={'New Arrivals'}
            />
          );
        case 'BestSelling':
          return (
            <HomePlp
              isLoadingNewArival={isLoadingNewArival}
              isLoadingBestSelling={isLoadingBestSelling}
              productList={bestSellings}
              listTitle={'Best Selling'}
            />
          );
        default:
          return <></>;
      }
    },
    [ViewData],
  );

  return (
    <Box flex={1} backgroundColor="white">
      <StatusBar animated={true} backgroundColor={theme.colors.background} />
      <CommonSearchHeader />
      <FlatList
        data={ViewData}
        renderItem={renderHomeItems}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
        }}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 16,
  },
});

export default HomeScreen;
