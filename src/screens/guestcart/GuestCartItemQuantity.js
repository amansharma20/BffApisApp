import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@atoms';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/api/SecureAPI';
// import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import { getGuestCustomerCartItems } from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
import config from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const GuestCartItemQuantity = ({ cartItem, customerCartId,removeItemTrigger }) => {
    console.log("quantityddd",cartItem)
    console.log("iddd",customerCartId)
    console.log("hhhh",removeItemTrigger)
  const [isloading, setIsLoading] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(cartItem?.item?.quantity);
  const dispatch = useDispatch();

  const changeQuantity = async (itemId, count, indexId) => {
    setIsLoading(false);
    const reqBody = {
      itemId: itemId,
      quantity: count,
      indexId: indexId,
      uniqueId:guestUserUniqueId,
    };

    const resp = await api.patch(
      `${config.cartUrl}guestUpdateCartItem/${customerCartId}`,
      JSON.stringify(reqBody),
    );

    const response = resp.data;
    if (response) {
      dispatch(
        getGuestCustomerCartItems(`${config.cartUrl}guestCartDetail/${customerCartId}?uniqueId=${guestUserUniqueId}`),
      )
        .then(res => {
          if (res.payload.status === 200) {
            console.log('guestcarts api call successful');
            setIsLoading(false);
          } else {
            setIsLoading(false);
            console.log('guestcarts api call not successful');
          }
        })
        .catch(error => {
          console.log('error: ', error);
          setIsLoading(false);
        });
    } else {
      Alert.alert('something error');
    }
  };

 const [id, setId] = useState('') 
 
 const guestUserUniqueId = id;
 console.log(guestUserUniqueId, 'id is quantity coming...');


  useEffect(() => {
    const guestCart = async () => {
      setIsLoading(true);
      const guestCustomerUniqueId = await AsyncStorage.getItem(
        'guestCustomerUniqueId',
      );
      setId(guestCustomerUniqueId);

      }
    guestCart();
  }, []);

  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        onPress={() =>
          cartItem?.item?.quantity == 1
            ? removeItemTrigger(cartItem?.item?.itemId)
            : changeQuantity(
                cartItem?.item?.itemId,
                cartItem?.item?.quantity - 1,
                cartItem?.item?.indexId,
              )
        }
        style={styles.quantityButton}
      >
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {!isloading ? (
        <Box width={40} alignItems="center">
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </Box>
      ) : (
        <Box width={40} alignItems="center">
          <Text style={styles.quantity}>{cartItem?.item?.quantity}</Text>
        </Box>
      )}
      <TouchableOpacity
        onPress={() =>
          changeQuantity(
            cartItem?.item?.itemId,
            cartItem?.item?.quantity + 1,
            cartItem?.item?.indexId,
          )
        }
      >
        <Text style={styles.quantityText}>+</Text>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  quantityText: {
    fontSize: 20,
    color: 'black',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default GuestCartItemQuantity;
