import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@atoms';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '@/api/SecureAPI';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';

const CartItemQuantity = ({ cartItem, customerCartId, removeItemTrigger }) => {
  const [isloading, setIsLoading] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(cartItem?.quantity);
  const dispatch = useDispatch();

  const changeQuantity = async (itemId, count, indexId) => {
    setIsLoading(true);
    const reqBody = {
      itemId: itemId,
      quantity: count,
      indexId: indexId,
    };
    const resp = await api.patch(
      `sfcc/updateItem/${customerCartId}`,
      JSON.stringify(reqBody),
    );
    const response = resp.data;
    if (response) {
      dispatch(getCustomerCartItems(`sfcc/cartDetail/${customerCartId}`))
        .then(res => {
          if (res.payload.status === 200) {
            console.log('carts api call successful');
            setIsLoading(false);
          } else {
            setIsLoading(false);
            console.log('carts api call not successful');
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

  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        onPress={() =>
          cartItem?.quantity == 1
            ? removeItemTrigger(cartItem?.itemId)
            : changeQuantity(
                cartItem?.itemId,
                cartItem?.quantity - 1,
                cartItem?.indexId,
              )
        }
        style={styles.quantityButton}
      >
        <Text style={styles.quantityText}>-</Text>
      </TouchableOpacity>
      {isloading ? (
        <Box width={40} alignItems="center">
          <ActivityIndicator color={theme.colors.sushiittoRed} />
        </Box>
      ) : (
        <Box width={40} alignItems="center">
          <Text style={styles.quantity}>{cartItem?.quantity}</Text>
        </Box>
      )}
      <TouchableOpacity
        onPress={() =>
          changeQuantity(
            cartItem?.itemId,
            cartItem?.quantity + 1,
            cartItem?.indexId,
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

export default CartItemQuantity;
