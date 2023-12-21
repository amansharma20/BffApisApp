import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@/atoms';
import { TouchableOpacity, Image } from 'react-native';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import GuestCartItemQuantity from './GuestCartItemQuantity';
import { RemoveIcon } from '@/assets/svgs';
import { api } from '@/api/SecureAPI';
// import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import { getGuestCustomerCartItems } from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import config from '@/config';

const GuestCartItem = ({ item }) => {

    const route = useRoute();
    const queryStringParams = route?.params?.queryString;
    console.log(queryStringParams,"consoled guestCartnnnn log")

    console.log("newone",item)

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const guestUserBasketItems = useSelector(
    state =>
    state?.getGuestCustomerCartItemsApiSlice?.guestCustomerCartItems?.data?.products
  );
console.log("guestUserBasketItemsss",guestUserBasketItems)

  const removeItem = async itemId => {
    console.log("balbalaanurag",item);
    console.log("aaaaaaam",itemId);
    setIsLoading(true);
    const response = await api
      .deleteWithEndpoint(`${config.cartUrl}guestDeleteCartItem/${queryStringParams}/items/${item?.item?.indexId}`)
      console.log("api response",response.data)
      .then(res => {
        if (res?.data?.status === 200 || res?.data?.status === 204) {
          dispatch(
            getGuestCustomerCartItems(
              `${config.cartUrl}guestCartDetail/${queryStringParams}?uniqueId=${guestUserUniqueId}`,
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
                    uri: item?.item?.imageUrl,
                  }}
                />
              </Box>
            </Box>
            <Box justifyContent="space-between">
              <Box width={'90%'}>
                <Text variant="bold16">{item?.item?.productName}</Text>
                <Text variant="bold16" style={{ marginTop: 4 }}>
                  ${item?.item?.price}
                </Text>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <GuestCartItemQuantity
                    cartItem={item}
                    removeItemTrigger={removeItem}
                    customerCartId={queryStringParams}
                  />
                </Box>
                {/* <Box>
                  <TouchableOpacity onPress={() => removeItem(item?.itemId)}>
                    <Text>
                      <RemoveIcon />
                    </Text>
                  </TouchableOpacity>
                </Box> */}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GuestCartItem;
