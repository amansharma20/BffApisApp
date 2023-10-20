/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
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
import { applicationProperties } from '@/utils/application.properties';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import { storage } from '@/store';
import config, { ENV } from '@/config';

const ProductDetailsScreen = props => {
  const customerId = storage.getString('customerId');
  const { width } = useWindowDimensions();
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const productDetails = useSelector(
    state => state?.getProductDetailsApiSlice?.productDetails?.data,
  );
  console.log('productDetails: ', productDetails);

  const basketId = useSelector(
    state =>
      state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
        ?.basket_id,
  );

  const productId =
    props.route.params.item.ProductId || props.route.params.item.product_id;

  const productName =
    props?.route?.params?.item?.product_name ||
    props?.route?.params?.item?.ProductName;

  const [selectedSkuId, setSelectedSkuId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [imageCarousel, setImageCarousel] = useState([]);
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false);
  const [productImage, setProductImage] = useState('');
  const onPressAddToCart = () => {
    setIsLoadingAddToCart(true);

    if (isUserLoggedIn && basketId) {
      const addToCart = async () => {
        userToken = await Keychain.getGenericPassword();

        let response = await axios.post(
          applicationProperties.baseUrl + `${config.addToCartUrl}/${basketId}`,
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

        if (response?.status == 401) {
          setIsLoadingAddToCart(false);
          Alert.alert('Unauthorize', 'Your session is expired , Please login!');
          navigation.navigate('LoginScreen');
        } else if (response.status == 201) {
          setIsLoadingAddToCart(false);
          dispatch(getCustomerCartItems(`sfcc/cartDetail/${basketId}`)).then(
            res => {
              if (res.payload.status === 200) {
                console.log('carts api call successful');
                setIsLoadingAddToCart(false);
                setIsLoading(false);
              } else {
                setIsLoading(false);
                setIsLoadingAddToCart(false);
                console.log('carts api call not successful');
              }
            },
          );
          Alert.alert('Product Added to cart');
        } else {
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

  const renderItem = ({ item, index }) => {
    const backgroundColor =
      item.sku == selectedSkuId ? theme.colors.lightGrey : '#FFF';
    const color = item.sku == selectedSkuId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedSkuId(item?.sku);
          setSelectedVariantIndex(index);
        }}
        backgroundColor={backgroundColor}
        textColor={color}
        index={index}
      />
    );
  };

  return (
    <>
      <CommonHeader title={productName} searchIcon={true} showCartIcon={true} />
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator color={theme.colors.sushiittoRed} />
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
                  {/* <Image
                  style={styles.backImage}
                  source={{
                    uri: productImage,
                  }}
                /> */}
                  <CarouselCards images={imageCarousel} crosSelling={null} />
                  <Box>
                    <Text variant="bold24">
                      {productDetails?.name || productDetails?.Name}
                    </Text>
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
                          <Box style={{ flex: 1 }}>
                            <FlatList
                              data={productDetails?.skus}
                              renderItem={renderItem}
                              keyExtractor={(item, index) => index.toString()}
                              contentContainerStyle={{
                                flexDirection: 'row',
                                flexBasis: 1,
                                justifyContent: 'space-between',
                                paddingHorizontal: 4,
                                flexWrap: 'wrap',
                              }}
                              // numColumns={3}
                            />
                          </Box>
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
    flexWrap: 'wrap',
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
    width: 100,
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
