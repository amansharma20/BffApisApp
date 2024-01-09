import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@/atoms';
import { TouchableOpacity, Image } from 'react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import WishlistItemQuantity from './WishlistItemQuantity';
import { RemoveIcon } from '@/assets/svgs';
import { api } from '@/api/SecureAPI';
import { getCustomerWishlist } from '@/redux/wishlistApi/WishlistApiAsyncThunk';
import {getWishlistById} from '@/redux/wishlistApi/WishlistByIdApiAsyncThunk';
import config from '@/config';
import { storage } from '@/store';


const WishlistItem = ({ item }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const customerWishlistId = useSelector(
    state =>
      state?.getWishlistByIdApiSlice?.WishlistById?.data?.wishlistId,
  );

  console.log("basketId wishlistId", customerWishlistId)

  
const wishlistByIdItems = useSelector(
  state => state?.getWishlistByIdApiSlice?.WishlistById?.data,
)
console.log("wishlistByIdItemsddd",wishlistByIdItems)

  // useEffect(()=> {
  //   dispatch(getWishlistById(`${config.cartUrl}wishlistById/943c76423cd374f626d7b1cad9?customerId=${storage.getString('customerId')}`));
  // },[])

  const removeItem = async itemId => {
    console.log("dfdd",item);
    console.log("ddddddd",itemId);
    setIsLoading(true);
    const response = await api
      .deleteWithEndpoint(`${config.cartUrl}wishlistDeleteItem/${customerWishlistId}/items/${itemId}?customerId=${storage.getString('customerId')}`)
      console.log("api response",response.data)
      .then(res => {
        if (res?.data?.status === 200 || res?.data?.status === 204) {
          dispatch(
            getWishlistById(
              `${config.cartUrl}wishlistById/${productData}?customerId=${storage.getString('customerId')}`,
            ),
          )
            .then(res => {
              if (res.payload.status === 204 || res.payload.status === 200) {
                setIsLoading(false);
              } else {
                setIsLoading(false);
              }
            })
            .catch(error => {
              console.log('error: ', error);
              setIsLoading(false);
            });
        }
      });
    // console.log("handlingerror", await response);
  };

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      flex={1}
    >
      {isLoading === true ? (
        <ActivityIndicator color={theme.colors.sushiittoRed} />
      ) : (
        <>
          <Box flexDirection="row" backgroundColor="white">
            <Box alignItems="center" mr="s8">
              <Box height={120} width={120}>
                <Image
                  style={{ height: 120, width: 120, resizeMode: 'contain' }}
                  source={{
                    uri: item?.image,
                  }}
                />
              </Box>
            </Box>
            <Box justifyContent="space-between">
              <Box width={'90%'}>
                <Text variant="bold16">{item?.productName}</Text>
                <Text variant="bold16" style={{ marginTop: 4 }}>
                  ${item?.productPrice}
                </Text>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  {/* <WishlistItemQuantity
                    wishlistItem={item}
                    removeItemTrigger={removeItem}
                    customerWishlistId={customerWishlistId}
                  /> */}

                  <TouchableOpacity onPress={() => removeItem(item?.itemId)}>
                  <RemoveIcon />
                </TouchableOpacity>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WishlistItem;
