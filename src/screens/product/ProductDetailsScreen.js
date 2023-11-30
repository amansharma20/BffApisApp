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
import { theme } from '@/atoms';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { getProductDetails } from '@/redux/productDetails/ProductDetailsApiAsyncThunk';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import axios from 'axios';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import { storage } from '@/store';
import config, { ENV } from '@/config';
import ProductDetailsShimmer from '@/components/shimmers/ProductDetailsShimmer';
import ProductVariants from './components/ProductVariants';

const ProductDetailsScreen = props => {
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const productDetails = useSelector(
    state => state?.getProductDetailsApiSlice?.productDetails?.data,
  );

  const variants = productDetails?.variationValues;

  const [selectedVariants, setSelectedVariants] = useState();

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

  const findMatchingProperty = (specifications, products, propertyName) => {
    const matchingProduct = products?.find(product => {
      return (
        product &&
        product?.specifications &&
        Object.keys(specifications).every(
          key => product?.specifications?.[key] === specifications?.[key],
        )
      );
    });

    return matchingProduct ? matchingProduct?.[propertyName] : null;
  };

  const [selectedSku, setSelectedSku] = useState(null);
  console.log(
    '🚀 ~ file: ProductDetailsScreen.js:84 ~ ProductDetailsScreen ~ selectedSku:',
    selectedSku,
  );

  const [selectedImage, setSelectedImage] = useState([]);

  useEffect(() => {
    // Filter out undefined elements and transform the array into the desired object
    const filteredArray = data.filter(item => item !== undefined);
    const transformedObject = filteredArray.reduce((result, item) => {
      const { key, value } = item;
      result[key] = value.value; // Assuming the desired value is in the 'value' property
      return result;
    }, {});

    const matchingSKU = findMatchingProperty(
      transformedObject,
      productDetails?.skus,
      'sku',
    );

    const matchingImage = findMatchingProperty(
      transformedObject,
      productDetails?.skus,
      'image',
    );

    setSelectedImage(matchingImage);
    setSelectedSku(matchingSKU);
  }, [data]);

  const basketId = useSelector(
    state =>
      state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
        ?.basket_id,
  );

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

  const onPressAddToCart = () => {
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

  // useEffect(() => {
  //   const getToken = async () => {
  //     userToken = await Keychain.getGenericPassword();
  //   };
  //   getToken();
  // }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getProductDetails(`${config.productsDetailsById}/${productId}`),
    ).then(() => {
      setIsLoading(false);
    });
  }, [productId]);

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
                  <CarouselCards
                    images={selectedImage || imageCarousel}
                    // images={selectedImage}
                    crosSelling={null}
                  />
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
                onPress={!isLoadingAddToCart ? onPressAddToCart : () => {}}
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
