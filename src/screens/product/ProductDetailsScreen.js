/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  View,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { Box, Text } from '@atoms';
import CarouselCards from '@/components/imageCarousel/CarouselCards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '@/atoms';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { getProductDetails } from '@/redux/productDetails/ProductDetailsApiAsyncThunk';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import axios from 'axios';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import { getGuestCustomerCartItems } from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import { storage } from '@/store';
import config, { ENV } from '@/config';
import ProductDetailsShimmer from '@/components/shimmers/ProductDetailsShimmer';
import ProductVariants from './components/ProductVariants';
import { api } from '@/api/SecureAPI';

const ProductDetailsScreen = props => {
  console.log('pros', props);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const productDetails = useSelector(
    state => state?.getProductDetailsApiSlice?.productDetails?.data,
  );

  const variants = productDetails?.variationValues;

  const [selectedVariants, setSelectedVariants] = useState();
  console.log(
    '🚀 ~ file: ProductDetailsScreen.js:44 ~ ProductDetailsScreen ~ selectedVariants:',
    selectedVariants,
  );

  const [data, setData] = useState([]);

  const pushUniqueData = newItem => {
    setData(prevData => {
      const index = prevData?.findIndex(item => item?.key === newItem?.key);

      if (index !== -1) {
        // If key already exists, update the value
        return [
          ...prevData?.slice(0, index),
          newItem,
          ...prevData?.slice(index + 1),
        ];
      } else {
        // If key doesn't exist, add a new key-value pair
        return [...prevData, newItem];
      }
    });
  };

  useEffect(() => {
    pushUniqueData(selectedVariants);
  }, [selectedVariants]);

  const findMatchingSKU = (specifications, products) => {
    const matchingProduct = products?.find(product => {
      return (
        product &&
        product?.specifications &&
        Object.keys(specifications).every(
          key => product?.specifications?.[key] === specifications?.[key],
        )
      );
    });

    return matchingProduct ? matchingProduct?.sku : null;
  };

  const [selectedSku, setSelectedSku] = useState(null);
  console.log(
    '🚀 ~ file: ProductDetailsScreen.js:92 ~ ProductDetailsScreen ~ selectedSku:',
    selectedSku,
  );

  useEffect(() => {
    // Filter out undefined elements and transform the array into the desired object
    const filteredArray = data.filter(item => item !== undefined);
    const transformedObject = filteredArray.reduce((result, item) => {
      const { key, value } = item;
      result[key] = value.value; // Assuming the desired value is in the 'value' property
      return result;
    }, {});
    console.log(
      '🚀 ~ file: ProductDetailsScreen.js:96 ~ transformedObject ~ transformedObject:',
      transformedObject,
    );

    const matchingSKU = findMatchingSKU(
      transformedObject,
      productDetails?.skus,
    );

    setSelectedSku(matchingSKU);
  }, [data]);

  const basketId = useSelector(
    state =>
      state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
        ?.basket_id,
  );
  console.log('basketIddd', basketId);

  // const guestBasketId = useSelector(
  //   state =>
  //     state?.getGuestCustomerBasketApiSlice
  // )
  // console.log('basketGuestId',guestBasketId)

  const productId =
    props.route.params.item?.productId ||
    props.route.params.item?.product_id ||
    props.route.params.item?.ProductId;

  const productName =
    props?.route?.params?.item?.product_name ||
    props?.route?.params?.item?.ProductName ||
    props?.route?.params?.item?.productName;

  const [isLoading, setIsLoading] = useState(true);
  const imageCarousel = productDetails?.skus;
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false);
  const [id, setId] = useState('');

  const [isLoadingAddToGuestCart, setIsLoadingAddToGuestCart] = useState(false);

  const guestCustomerUniqueId = id;
  console.log(id, 'id is here...');

  const onPressAddToGuestCart = () => {
    console.log('i am here ');
    setIsLoadingAddToGuestCart(true);
    if (!isUserLoggedIn) {
      console.log("This is the API testing for guestcart");
      const addToGuestCart = async () => {
        const guestBearerToken = await AsyncStorage.getItem('guestBearerToken');

        const guestCustomerUniqueId = await AsyncStorage.getItem(
          'guestCustomerUniqueId',
        );

        const guestBasketIds = await AsyncStorage.getItem('guestBasketIds');
        console.log('guestBasketIds', guestBasketIds);
        console.log('guestBearerTokensssggg', guestBearerToken);
        console.log('guestCustomerUniqueIfafafa', guestCustomerUniqueId);
        userToken = await Keychain.getGenericPassword();
        let response = await axios.post(
          config.cartUrl + `${config.addToGuestCartUrl}/${guestBasketIds}`,
          {
            itemId: selectedSku,
            quantity: 1,
            uniqueId: guestCustomerUniqueId,
          },
          {
            headers: {
              token: guestBearerToken,
            },
            validateStatus: () => true,
            withCredentials: true,
          },
        );
        console.log('respssss', response);
        console.log('guestCustomerUniqueIdddd', guestCustomerUniqueId);

        if (response?.status == 401) {
          setIsLoadingAddToGuestCart(false);
          Alert.alert(
            'Unauthorize',
            'Your guest session is expired , Please login!',
          );
          navigation.navigate('LoginScreen');
        } else if (response.status === 201 || response.status === 200) {
          setIsLoadingAddToGuestCart(false);
          dispatch(
            getGuestCustomerCartItems(
              `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
            ),
          ).then(res => {
            if (res?.payload?.status === 200 || res?.payload?.status === 201) {
              console.log(
                'guest carts api call successful',
                res?.payload?.data,
              );
              // const queryString = res?.payload?.data;
              const queryString = res?.payload?.data?.baskets[0].basket_id;
              AsyncStorage.setItem('guestBasketIds', queryString);
              console.log(queryString, 'this is the personal queryString');
              navigation.navigate('GuestCartScreen', { queryString });
              setIsLoadingAddToGuestCart(false);
              setIsLoading(false);
            } else {
              setIsLoading(false);
              setIsLoadingAddToGuestCart(false);
              console.log('guest carts api call not successful');
            }
          });
          Alert.alert('Product Added to guest cart');
        } else {
          
          setIsLoadingAddToGuestCart(false);
          Alert.alert('Something went wrong');
        }
      };
      addToGuestCart();
    } else {
      console.log('helo this is for the testing purpose');
      setIsLoadingAddToGuestCart(false);
      setIsLoading(false);
      // Alert.alert('basket Id is not specified');
      Alert.alert('Unauthorizedsss', 'Please login firstsss', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
      ]);
    }
  };

  const onPressAddToCartButton = () => {
    console.log('time to show', isUserLoggedIn);
    isUserLoggedIn ? onPressAddToCart() : onPressAddToGuestCart();
  };

  useEffect(() => {
    // guestCart();
    const getToken = async () => {
      userToken = await Keychain.getGenericPassword();
    };
    getToken();
  }, []);

  // const guestCart = async () => {
  //   // await AsyncStorage.removeItem('guestCustomerUniqueId');
  //   // await AsyncStorage.removeItem('guestBearerToken');
  //   // await AsyncStorage.removeItem('guestBasketIds');
  //   setIsLoading(true);
  //   const guestCustomerUniqueId = await AsyncStorage.getItem(
  //     'guestCustomerUniqueId',
  //   );
  //   console.log('ddd', guestCustomerUniqueId);
  //   setId(guestCustomerUniqueId);

  //   if (guestCustomerUniqueId) {
  //     dispatch(
  //       getGuestCustomerCartItems(
  //         `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
  //       ),
  //     )
  //       .then(res => {
  //         if (res?.payload?.status === 200 || res?.payload?.status === 201) {
  //           console.log('guest carts api call successful', res?.payload?.data);
  //           // const queryString = res?.payload?.data;
  //           const queryString = res?.payload?.data?.baskets[0].basket_id;
  //           console.log(queryString, 'this is the personal queryString');
  //           navigation.navigate('GuestCartScreen', { queryString });
  //           setIsLoadingAddToGuestCart(false);
  //           setIsLoading(false);
  //         }
  //       })
  //       .then(() => {
  //         setIsLoading(false);
  //         console.log('redux called successfully', guestCustomerUniqueId);
  //       });
  //     setIsLoading(false);
  //   } else {
  //     // const guestUserUniqueId = 'id' + Math.random().toString(16).slice(2);
  //     const guestUserUniqueId = await api.postWithGuestEndpoint(
  //       `${config.cartUrl}guestCreateCart`,
  //     );
  //     console.log('guestCreateCartssss', guestUserUniqueId.data.data.uniqueId);
  //     const guestCustomerUniqueId = guestUserUniqueId.data.data.uniqueId;
  //     console.log('guestCustomerUniqueIdg', guestCustomerUniqueId);
  //     const guestBearerToken = guestUserUniqueId.data.data.bearerToken;
  //     console.log('guestBearerToken', guestUserUniqueId.data.data.bearerToken);
  //     await AsyncStorage.setItem(
  //       'guestCustomerUniqueId',
  //       guestCustomerUniqueId,
  //     );
  //     await AsyncStorage.setItem('guestBearerToken', guestBearerToken);
  //     dispatch(
  //       getGuestCustomerCartItems(
  //         `${config.cartUrl}guestCustomerCart/${guestCustomerUniqueId}`,
  //       ),
  //     ).then(() => {
  //       setIsLoading(false);
  //     });
  //     setIsLoading(false);
  //     console.log('redux called ya successfully', guestCustomerUniqueId);
  //   }
  // };

  const onPressAddToCart = () => {
    console.log('log in ');
    setIsLoadingAddToCart(true);
    if (isUserLoggedIn && basketId) {
      const addToCart = async () => {
        userToken = await Keychain.getGenericPassword();
        let response = await axios.post(
          config.cartUrl + `${config.addToCartUrl}/${basketId}`,
          {
            itemId: selectedSku,
            quantity: 1,
          },
          {
            headers: {
              token: userToken.password,
            },
            validateStatus: () => true,
            withCredentials: true,
          },
          console.log('ressss', response),
        );
        if (response?.status == 401) {
          setIsLoadingAddToCart(false);
          Alert.alert('Unauthorize', 'Your session is expired , Please login!');
          navigation.navigate('LoginScreen');
        } else if (response.status === 201 || response.status === 200) {
          setIsLoadingAddToCart(false);
          dispatch(
            getCustomerCartItems(`${config.cartUrl}cartDetail/${basketId}`),
          ).then(res => {
            if (res.payload.status === 200) {
              console.log('carts api call successful');
              setIsLoadingAddToCart(false);
              setIsLoading(false);
            } else {
              setIsLoading(false);
              setIsLoadingAddToCart(false);
              console.log('carts api call not successful');
            }
          });
          Alert.alert('Product Added to cart');
        } else {
          console.log('hii');
          setIsLoadingAddToCart(false);
          Alert.alert('Something went wrong');
        }
      };
      addToCart();
    } else {
      setIsLoadingAddToCart(false);
      setIsLoading(false);
      // Alert.alert('basket Id is not specified');
      Alert.alert('Unauthorized', 'Please login first', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
      ]);
    }
  };


  // useEffect(()=>{
  // api.postWithEndpoint()
  // },[])

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getProductDetails(`${config.productsDetailsById}/${productId}`),
    ).then(() => {
      setIsLoading(false);
    });
  }, [productId]);
  console.log('isLoadingAddToCart', isLoadingAddToCart);

  return (
    <>
      <CommonHeader title={productName} searchIcon={true} showCartIcon={true} />
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ProductDetailsShimmer />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                paddingHorizontal: theme.spacing.paddingHorizontal,
                flex: 1,
              }}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
            >
              {!productDetails?.error && imageCarousel && !isLoading ? (
                <Box flex={1}>
                  <CarouselCards images={imageCarousel} crosSelling={null} />
                  <Box flex={1}>
                    <Text variant="bold24">{productName}</Text>
                    <Text variant="bold16" mt="s6">
                      ${productDetails?.skus?.[0]?.bestPrice}
                    </Text>
                    <Box mt="s6">
                      {selectedSku ? (
                        <Text variant="bold16" color="green">
                          Available
                        </Text>
                      ) : (
                        <Text variant="bold16">Not Available</Text>
                      )}
                    </Box>
                    <Box flex={1}>
                      {productDetails?.skus?.length >= 1 && imageCarousel && (
                        <Box flex={1}>
                          <Text variant="bold16" mt="s8">
                            Choose Variation :{' '}
                          </Text>
                          <ProductVariants
                            variants={variants}
                            selectedVariants={selectedVariants}
                            setSelectedVariants={setSelectedVariants}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Text>Product is not available</Text>
              )}
            </ScrollView>
            <Box
              padding="s16"
              backgroundColor="white"
              style={theme.cardVariants.bottomButtonShadow}
            >
              <CommonSolidButton
                title={!isLoadingAddToCart ? 'Add to Cart' : 'Loading...'}
                onPress={
                  !isLoadingAddToCart ? onPressAddToCartButton : () => {}
                }
                // onPress={!isLoadingAddToCart ? onPressAddToCart : () => {}}

                // onPress={!isLoadingAddToCart ? onPressAddToCart : onPressAddToGuestCart}

                disabled={selectedSku === null ? true : false}
              />
            </Box>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  productList: {
    flexDirection: 'row', // Horizontal layout
    // flexWrap: 'wrap',
  },

  backImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 200,
  },
  item: {
    marginVertical: 4,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 80,
  },
  title: {
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartButton: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'gray',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  wishListContainer: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.red,
    borderRadius: theme.spacing.lml,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    color: 'white',
  },
});

export default ProductDetailsScreen;
