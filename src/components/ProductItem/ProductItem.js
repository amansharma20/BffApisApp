/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icons from '@/assets/constants/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Text } from '@/atoms';
import { api } from '@/api/SecureAPI';
import config from '@/config';
import { customerId } from '@/utils/appUtils';
import { storage } from '@/store';
import {getCustomerWishlist} from '@/redux/wishlistApi/WishlistApiAsyncThunk'



const ProductItem = React.memo(({ item }) => {
  console.log(item,"this is mera item")
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onPressAddToShoppingList = async (productId) => {
    const reqBody = {
        customerId:`${storage.getString('customerId')}`,
        productId:productId,
        type:"product"
    
    }
    console.log("reqBody of wishlist",reqBody)
    const response = await api.postWithEndpoint(
      `${config.cartUrl}wishlistAddItem/943c76423cd374f626d7b1cad9`,
      reqBody,
    );

    console.log("response of wishlist",response?.data?.status)

    if (response?.data?.status === 201 || response?.data?.status == 200) {
      dispatch(getCustomerWishlist(`${config.cartUrl}customerWishlist?customerId=${storage.getString('customerId')}`));
    
    }
    else {
     console.log("errordd")
    }
  }
// });



  return (
    <Box
      marginHorizontal="s4"
      backgroundColor="white"
      flexShrink={1}
      mb="s12"
      flex={1}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetailsScreen', {
            item: item,
          });
        }}
      >
        <Box alignItems="center">
          <Image
            source={{
              uri:
                item?.skuImageUrl ||
                item?.product_image ||
                item?.images?.image1 ||
                item?.skus?.[0]?.images ||
                item?.productImage ||
                item?.SkuImageUrl,
            }}
            style={[styles.productImage, { resizeMode: 'cover' }]}
          />
        </Box>
        <Box maxWidth="95%">
          <Text
            style={styles.productTitle}
            variant="semiBold18"
            color="darkText"
            numberOfLines={2}
          >
            {item?.ProductName ||
              item?.product_name ||
              item?.name ||
              item?.productName}
          </Text>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingVertical="s2"
        >
          <Box>
            <Text variant="semiBold14" color="darkText">
              $
              {item?.basePrice ||
                item?.productPrice?.listPrice ||
                item?.productPrice?.DEFAULT ||
                item?.product_price?.sellingPrice ||
                item?.productPrice?.sellingPrice}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
      <Box position="absolute" alignSelf="flex-end" >
        <TouchableOpacity style={{ padding: 6 }} onPress={()=>onPressAddToShoppingList(item?.productId)} >
        {/* onPress={() => {
          navigation.navigate('WishlistScreen');
        }} */}
          <Image
            source={Icons.wishlistIcon}
            style={{
              width: 24,
              height: 24,
              tintColor: 'white',
            }}
          />
        </TouchableOpacity>
      </Box>
    </Box>
  );
});


export default ProductItem;

const styles = StyleSheet.create({
  productImage: {
    width: '100%',
    height: 250,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  productTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    borderRadius: 14,
  },
});
