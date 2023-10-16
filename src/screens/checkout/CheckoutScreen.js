import { api } from '@/api/SecureAPI';
import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@atoms';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import CommonHeader from '@/components/CommonHeader/CommonHeader';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import ShipmentAddress from './ShipmentAddress';
import ShippingMethod from './ShippingMethod';
import { useNavigation } from '@react-navigation/native';
import { createCustomerBasket } from '@/redux/createBasketApi/CreateBasketApiAsyncThunk';
import { useDispatch } from 'react-redux';
import { getCustomerBasketApi } from '@/redux/basket/BasketApiAsyncThunk';
import { customerId } from '@/utils/appUtils';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
const CheckoutScreen = props => {
  const basketId = props.route.params?.basketId;
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const holderName =
    checkoutDetails?.shipments?.[0]?.shipping_address?.full_name;

  useEffect(() => {
    setIsLoading(true);
    const shipment = async () => {
      const shippment_method = await api.put(
        `sfcc/shippment_method/${basketId}`,
      );
      const shippment_address = await api.put(
        `sfcc/shipping_address/${basketId}`,
      );
      const billing_address = await api.put(`sfcc/billing_address/${basketId}`);
      setCheckoutDetails(billing_address?.data?.data);
      setIsLoading(false);
    };
    shipment();
  }, [basketId]);

  //   useEffect(() => {
  //     const token = async () => {
  //       var userToken = await Keychain.getGenericPassword();
  //       console.log('userToken: ', userToken);
  //     };
  //     token();
  //   }, []);

  const orderConfirm = async () => {
    const reqBody = {
      payment_card: {
        card_type: 'Visa',
        credit_card_expired: false,
        credit_card_token: '123',
        expiration_month: 8,
        expiration_year: 2024,
        holder: holderName,
        issue_number: '123',
        number: '411111111111',
        security_code: '123',
        valid_from_month: 4,
        valid_from_year: 21,
      },

      amount: checkoutDetails?.order_total,

      payment_method_id: 'CREDIT_CARD',
    };
    const confirmPayment = await api.post(
      `sfcc/confirmPayment/${basketId}`,
      reqBody,
    );

    if (confirmPayment?.data?.status == 401) {
      Alert.alert('Unauthorised', 'Your session is expired , Please login!');
      navigation.navigate('LoginScreen');
    }
    if (confirmPayment?.data?.status == 201) {
      const reqBody = {
        basket_id: basketId,
      };

      const confirmOrder = await api.post(`sfcc/placeOrder`, reqBody);
      if (confirmOrder?.data?.status === 201) {
        dispatch(createCustomerBasket(`sfcc/createCart`));
        dispatch(getCustomerBasketApi(`sfcc/getCustomerCart/${customerId}`));
        dispatch(getCustomerCartItems(`sfcc/cartDetail/${basketId}`));
        Alert.alert('Order Placed', 'Your order is placed successfully');
        navigation.navigate('HomeScreen');
      }
    } else {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <CommonHeader title={'Checkout'} />
          {!isLoading ? (
            <>
              <Box paddingHorizontal="paddingHorizontal">
                <Box mb="s16">
                  <Text mb="s8" variant="regular16">
                    Select Address
                  </Text>
                  <ShipmentAddress checkoutDetails={checkoutDetails} />
                </Box>
                <Box mb="s16">
                  <Text mb="s16" variant="regular16">
                    Select shipment method
                  </Text>
                  <ShippingMethod checkoutDetails={checkoutDetails} />
                </Box>
                <Box style={styles.borderBox}>
                  <Text variant="bold14">Order Summary</Text>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text>Subtotal</Text>
                    <Text>$ {checkoutDetails?.product_sub_total}</Text>
                  </Box>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text>Shipping</Text>
                    <Text>$ {checkoutDetails?.shipping_total}</Text>
                  </Box>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text>Sales Tax</Text>
                    <Text>$ {checkoutDetails?.tax_total}</Text>
                  </Box>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text variant="bold14">Total</Text>
                    <Text>$ {checkoutDetails?.order_total}</Text>
                  </Box>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <ActivityIndicator color={theme.colors.sushiittoRed} />
            </>
          )}
        </ScrollView>
        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton title="Place Order" onPress={orderConfirm} />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  borderBox: {
    borderWidth: 1, // Set the border width
    borderColor: 'black', // Set the border color
    borderRadius: 5, // Optional: Set border radius for rounded corners
    padding: 10, // Optional: Add padding inside the border
  },
});
export default CheckoutScreen;