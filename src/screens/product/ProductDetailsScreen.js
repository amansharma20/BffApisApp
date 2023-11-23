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
  const customerId = storage.getString('customerId');
  const { width } = useWindowDimensions();
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [variantValue, setSelectedVariants] = useState([]);
  const [customerSelectedVariants, setCustomerSelectedVariants] = useState([]);

  const productDetails = useSelector(
    state => state?.getProductDetailsApiSlice?.productDetails?.data,
  );

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

  const [selectedSkuId, setSelectedSkuId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageCarousel, setImageCarousel] = useState([]);
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false);
  const [productImage, setProductImage] = useState('');

  const onCustomerSelectedVariant = selectedVariant => {
    const key = Object.keys(selectedVariant)[0];
    const value = selectedVariant[key];
    const index = customerSelectedVariants.findIndex(
      item => Object.keys(item)[0] === key,
    );
    if (index !== -1) {
      setCustomerSelectedVariants(prevVariants => {
        const updatedVariants = [...prevVariants];
        updatedVariants[index][key] = value;
        return updatedVariants;
      });
    } else {
      setCustomerSelectedVariants(prevVariants => [
        ...prevVariants,
        selectedVariant,
      ]);
    }
  };
  const onPressAddToCart = () => {
    setIsLoadingAddToCart(true);

    if (isUserLoggedIn && basketId) {
      const addToCart = async () => {
        userToken = await Keychain.getGenericPassword();
        let response = await axios.post(
          config.cartUrl + `${config.addToCartUrl}/${basketId}`,
          {
            itemId: selectedSkuId,
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
        console.log('response: ', response?.data);
        console.log('response: ', response?.status);
        if (response?.status == 401) {
          setIsLoadingAddToCart(false);
          Alert.alert('Unauthorize', 'Your session is expired , Please login!');
          navigation.navigate('LoginScreen');
        } else if (response.status == 200) {
          setIsLoadingAddToCart(false);
          dispatch(
            getCustomerCartItems(`${config.cartUrl}cartDetail/${basketId}`),
          ).then(res => {
            console.log('res.payload.status: ', res.payload.status);
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
      Alert.alert('basket Id is not specified');
    }
  };

  useEffect(() => {
    const getToken = async () => {
      userToken = await Keychain.getGenericPassword();
    };
    getToken();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getProductDetails(`${config.productsDetailsById}/${productId}`),
    ).then(() => {
      setIsLoading(false);
    });
  }, [productId]);

  useEffect(() => {
    if (
      !productDetails?.error &&
      productDetails?.skus &&
      productDetails?.skus[selectedVariantIndex]
    ) {
      setProductImage(productDetails?.skus[selectedVariantIndex]?.image);
      setSelectedSkuId(productDetails?.skus[selectedVariantIndex]?.sku);
      setImageCarousel(productDetails?.skus);
    }
  }, [productDetails, selectedVariantIndex]);

  const Item = ({ item, onPress, backgroundColor, textColor, index }) => {
    const itemWidth = width / 4;

    return (
      <Box style={{ width: itemWidth }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedSkuId(item?.sku);
            setProductImage(productDetails?.skus[index]?.image);
          }}
          style={[styles.item, { backgroundColor }]}
        >
          <Text style={[styles.title, { color: textColor }]}>{item?.sku}</Text>
        </TouchableOpacity>
      </Box>
    );
  };

  // const renderItem = ({ item, index }) => {
  //   console.log('item: ', item);
  //   Object.keys(item).map(key => {
  //     console.log('key: ', item?.[key]);
  //   });
  //   return (
  //     <Box paddingVertical="s8">
  //       {Object.keys(item).map(key => {
  //         // console.log('item?.[key]: ', item?.[key]);
  //         if (item?.[key]?.length == 1) {
  //           setSelectedVariants(item);
  //         }
  //         return (
  //           <>
  //             <Text fontSize="16" key={key}>{`${key}`}</Text>
  //             <FlatList
  //               contentContainerStyle={{
  //                 flexDirection: 'row',
  //                 flexBasis: 1,
  //                 justifyContent: 'space-between',
  //                 paddingHorizontal: 4,
  //               }}
  //               numColumns={4}
  //               data={item?.[key]}
  //               renderItem={renderChildFlatlist}
  //             />
  //           </>
  //         );
  //       })}
  //     </Box>
  //   );
  // };

  // const renderChildFlatlist = ({ item }) => {
  //   const borderColor = item?.value?.value === variantValue ? 'black' : 'black';
  //   const selectedVariantStyle = {
  //     borderColor: borderColor,
  //     borderWidth: 2,
  //     borderRadius: 5,
  //   };
  //   return (
  //     <TouchableOpacity onPress={() => setSelectedVariants(item?.value?.value)}>
  //       <Box
  //         marginRight="s10"
  //         style={[
  //           styles.item,
  //           item?.value?.value === variantValue ? selectedVariantStyle : '',
  //         ]}
  //         alignItems="center"
  //         justifyContent="center"
  //       >
  //         <Text>{item?.value?.value}</Text>
  //       </Box>
  //     </TouchableOpacity>
  //   );
  // };

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
              contentContainerStyle={{
                paddingHorizontal: theme.spacing.paddingHorizontal,
                flexGrow: 1,
              }}
            >
              {!productDetails?.error && imageCarousel && !isLoading ? (
                <Box style={styles.productDetails}>
                  <CarouselCards images={imageCarousel} crosSelling={null} />
                  <Box>
                    <Text variant="bold24">{productName}</Text>
                    <Text variant="bold16" mt="s6">
                      ${productDetails?.skus?.[0]?.bestPrice}
                    </Text>
                    <Box mt="s6">
                      {productDetails?.skus?.[0]?.available ? (
                        <Text variant="bold16" color="green">
                          Available
                        </Text>
                      ) : (
                        <Text variant="regular18" color="red">
                          Not Available
                        </Text>
                      )}
                    </Box>
                    <Box flex={1}>
                      {productDetails?.skus?.length >= 1 && imageCarousel && (
                        <Box flex={1}>
                          <Text variant="bold16" mt="s8">
                            Choose Variation :{' '}
                          </Text>
                          {/* <FlatList
                              data={productDetails?.variationValues}
                              renderItem={renderItem}
                              keyExtractor={(item, index) => index.toString()}
                              contentContainerStyle={{
                                flexDirection: 'column',
                                flexBasis: 1,
                                paddingHorizontal: 4,
                              }}
                            /> */}
                          <ProductVariants
                            variants={productDetails?.variationValues}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Text mt="s6" variant="regular16"></Text>
                </Box>
              ) : (
                <Text>Product is not available</Text>
              )}
              <Box></Box>
            </ScrollView>
            <Box
              padding="s16"
              backgroundColor="white"
              style={theme.cardVariants.bottomButtonShadow}
            >
              <CommonSolidButton
                title={!isLoadingAddToCart ? 'Add to Cart' : 'Loading...'}
                onPress={!isLoadingAddToCart ? onPressAddToCart : () => {}}
                disabled={!productDetails?.skus?.[0]?.available}
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
