import { api } from '@/api/SecureAPI';
import React, { useEffect, useState } from 'react';
import { Box, Text, theme } from '@/atoms';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { useNavigation } from '@react-navigation/native';
import { createCustomerBasket } from '@/redux/createBasketApi/CreateBasketApiAsyncThunk';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerBasketApi } from '@/redux/basket/BasketApiAsyncThunk';
import {getGuestCustomerCartItems} from '@/redux/GuestCartApi/GuestCartApiAsyncThunk';
// import { customerId } from '@/utils/appUtils';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';
import CommonOptionsSelector from '@/components/CommonOptionsSelector/CommonOptionsSelector';
import { getShippmentMethods } from '@/redux/shippmentMethodApi/ShippmentMethodApiAsyncThunk';
import config from '@/config';
import HomeShimmers from '@/components/shimmers/HomeShimmers';
import CheckoutShimmer from '@/components/shimmers/CheckoutShimmer';
import OrderSummaryShimmer from '@/components/shimmers/OrderSummaryShimmer';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { storage } from '@/store';
import { getPaymentMethods } from '@/redux/paymentMethodApi/paymentMethodApiAsyncThunk';

const CheckoutScreen = props => {
  console.log('propsss',props)
  const navigation = useNavigation();
  const customerIdFromStorage = storage.getString('customerId');
  const [customerId, setCustomerId] = useState(customerIdFromStorage);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const basketId = props.route.params?.basketId;
  console.log('basketIdsss',basketId)
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderConfirm, setIsOrderConfirm] = useState(false);
  const [orderSummaryLoading, setOrderSummaryLoading] = useState(false);
  const [selectedShippmentIndex, setSelectedShippmentIndex] = useState(0);
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);
  const [flag, setFlag] = useState(false);
  const [cartData, setCartData] = useState(0);  
  const dispatch = useDispatch();


  const ADDRESSES_DATA = useSelector(
    state => state?.getCustomerDetailsApiSlice?.customerDetails?.data,
  );
  console.log('ADDRESSES_DATA: ', ADDRESSES_DATA);
  console.log('selectedAddressIndex',selectedAddressIndex)

  const paymentMethods = useSelector(
    state =>
        state?.getPaymentMethodsApiSlice?.paymentMethods?.data?.paymentMethods,
  );
  console.log('paymentMethods',paymentMethods)

  useEffect(() =>{
    setFlag(false);
    const fetchPaymentMethods = async () => {
      setIsLoading(true);
      await dispatch(
        getPaymentMethods(
          `${config.checkoutUrl}checkoutData/${basketId}/shipmentId/me?user=guest`,
          // `${config.checkoutUrl}checkoutData/${basketId}/shipmentId/me`,

        ),
      ).then(()=>{
        setFlag(true);
      });
      setIsLoading(false);
    };
    fetchPaymentMethods();
  },[basketId, selectedPaymentIndex]);
  console.log("selectedPaymentIndex",selectedPaymentIndex)

  const shippmentMethods = useSelector(
    state =>
      state?.getShippmentMethodsApiSlice?.shippmentMethods?.data
        ?.shipmentMethods,
  );
  console.log('shippmentMethods',shippmentMethods)



// useEffect(()=>{
// api.getWithGuestEndpoint()
// },[])

    const guestCustomerUniqueId =  AsyncStorage.getItem(
      'guestCustomerUniqueId',
    );
console.log('guestCustomerUniqueIdddd',guestCustomerUniqueId)

useEffect(() => {
  // const guestCart = async () => {
  //   const guestCustomerUniqueId = await AsyncStorage.getItem(
  //     'guestCustomerUniqueId',
  //   );
  dispatch(
    getGuestCustomerCartItems(`${config.cartUrl}guestCartDetail/${basketId}?uniqueId=idb90f3bf18d1dc8`),
    // getCustomerCartItems(`${config.cartUrl}cartDetail/${basketId}`)

  ).then(res => {
    if (res.payload.status === 200 || res.payload.status == 201) {
      console.log('checkout api call successful',res.payload.data);
      setCartData(res.payload.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      console.log('checkout api call not successful');
    }
  });
// };
// guestCart();
}, []);

  useEffect(() => {
    setFlag(false);
    const fetchShippmentMethods = async () => {
      setIsLoading(true);
      await dispatch(
        getShippmentMethods(
          `${config.checkoutUrl}checkoutData/${basketId}/shipmentId/me?user=guest`,
          // `${config.checkoutUrl}checkoutData/${basketId}/shipmentId/me`,

        ),
      ).then(() => {
        setFlag(true);
      });
      setIsLoading(false);
    };
    fetchShippmentMethods();
  }, [basketId, selectedShippmentIndex]);

  useEffect(() => {
    setOrderSummaryLoading(true);
    const reqBody = {
      address1: 'Ocapi',
      address2: 'Demo',
      city: ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.city,
      first_name:
        ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.firstName,
      full_name:
        ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.firstName +
        ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.lastName,
      id: ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.addressNumber,
      last_name: ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.lastName,
      phone: ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.phone,
      postal_code: '45200',
      state_code: '45200',
      title: 'OcapiDemo',
    };
    console.log("reqbodyyy",reqBody)

    const shipment = async () => {
      const reqBodyShippment = {
        id: shippmentMethods?.[selectedShippmentIndex]?.id,
      };

      if (shippmentMethods?.length > 0 && flag === true) {
        // const response = await api.putWithEndPoint(
        //   `${config.checkoutUrl}sfcc/new_shippment_method/${basketId}?shipment_id=me`,
        //   reqBodyShippment,
        // );
        // const shippment_address = await api.putWithEndPoint(
        //   `${config.checkoutUrl}sfcc/new_shipping_address/${basketId}?shipment_id=me`,
        //   reqBody,
        // );
        // const billingAddress = await api.putWithEndPoint(
        //   `${config.checkoutUrl}sfcc/new_billing_address/${basketId}`,
        //   reqBody,
        // );
        // setCheckoutDetails(billingAddress?.data?.data);

        // const reqBodyPayment = {
        //   payment_card: {
        //     card_type: 'Visa',
        //     credit_card_expired: false,
        //     credit_card_token: '123',
        //     expiration_month: 8,
        //     expiration_year: 2024,
        //     holder: 'shubham verma',
        //     issue_number: '123',
        //     number: '411111111111',
        //     security_code: '123',
        //     valid_from_month: 4,
        //     valid_from_year: 21,
        //   },
        //   amount: billingAddress?.data?.data?.amount,
        //   payment_method_id: 'CREDIT_CARD',
        // };
        // const confirmPayment = await api.postWithEndpoint(
        //   `${config.checkoutUrl}sfcc/confirmPayment/${basketId}`,
        //   reqBodyPayment,
        // );
        setOrderSummaryLoading(false);
      }
    };
    shipment();
  }, [basketId, selectedAddressIndex, selectedShippmentIndex, flag]);

  console.log("selectedShippmentIndex",selectedShippmentIndex)
  



console.log("www",cartData)
  
  // console.log("wwww",cartData.products.map((item)=>item.itemId))
  // console.log("wwww",shippmentMethods.map((item)=>item.id))
  console.log("ggg",shippmentMethods)


  const orderConfirm = async () => {
    if (!isUserLoggedIn) {
      setIsOrderConfirm(true);
      const reqBody = {
        "type":"guest",
          "cart": {
              "cartId": basketId,
              "cartTotal": cartData.totalizers.CartTotal,
              "cartItem": cartData.products.map((item)=>item.itemId),
              
          },
          "shippingDetail": {
              "id": shippmentMethods?.[selectedShippmentIndex]?.Id || me,
              "shipmentId": shippmentMethods?.[selectedShippmentIndex]?.id || "EUR001",
              "shippingAddress": {
                  "salutation": "Mr",
                  "firstName": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.firstName || "AMMIR",
                  "lastName": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.lastName || "bohra",
                  "address1": "c21 mall indore",
                  "address2": "c21 mall indore",
                  "zipCode": "12345",
                  "country": "United States",
                  "city": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.city || "Indore",
                  "countryCode": "",
                  "phone":  ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.phone || "12345678"
              }
          },
          "billingAddress": {
              "salutation": "Ms",
              "firstName": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.firstName || "ammir",
              "lastName": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.lastName || "bohra",
              "address1": "c21 mall indore",
              "address2": "c21 mall indore",
              "zipCode": "1234",
              "country": "United States",
              "city": ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.city || "Indore",
              "countryCode": "",
              "phone":  ADDRESSES_DATA?.userProfile?.[selectedAddressIndex]?.phone || "12345678"
          },
          "paymentData": {
              "paymentId": paymentMethods?.[selectedPaymentIndex]?.id || "9",
              "paymentMethodName": paymentMethods?.[selectedPaymentIndex].name || "Debit Card",
              "paymentProviderName": paymentMethods?.[selectedPaymentIndex]?.payment_processor_id || "DummyPayment",
              "cardDetails": {
                  "cardType": "Visa",
                  "creditCardExpired": false,
                  "credit_card_token": "123",
                  "expirationMonth": 8,
                  "expirationYear": 2024,
                  "holderName": "",
                  "issue_number": "123",
                  "cardNumber": "411111111111",
                  "securityCode": "123",
                  "validFromMonth": 4,
                  "validFromYear": 21
              }
          }
      };
      const confirmOrder = await api.postWithGuestEndpoint(
        `${config.checkoutUrl}placeOrder`,

        reqBody,
      );
      console.log('reqBoddy',reqBody)
      if (confirmOrder?.data?.status === 204 || confirmOrder?.data?.status === 201 || confirmOrder?.data?.status === 200) {
        dispatch(
          createCustomerBasket(`${config.cartUrl}${config.createCartUrl}`),
        ).then(() => {
          dispatch(
            getCustomerBasketApi(
              `${config.cartUrl}getCustomerCart/${customerId}`,
            ),
          )
          .then(res => {
            dispatch(
              getCustomerCartItems(
                `${config.cartUrl}cartDetail/${res?.payload?.data?.baskets?.[0]?.basket_id}`,
              ),
            );
          });
        });



        Alert.alert('Order Placed', 'Your order is placed successfully');
        navigation.replace('OrdersScreen');
      }
      setIsOrderConfirm(false);
    } else {
      navigation.navigate('LoginScreen');
    }
  };


  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        <ScrollView>
          {/* contentContainerStyle={{ flexGrow: 1 }} */}
          <CommonHeader title={'Checkout'} />
          {!isLoading ? (
            <>
              <Box paddingHorizontal="paddingHorizontal">
                <Box mb="s16">
                  <Text mb="s8" variant="regular16">
                    Select address
                  </Text>
                  <CommonOptionsSelector
                    DATA={ADDRESSES_DATA?.userProfile}
                    selectedIndex={selectedAddressIndex}
                    setSelectedIndex={setSelectedAddressIndex}
                    hideContinueButton
                  />

                  {/* <ShipmentAddress checkoutDetails={checkoutDetails} /> */}
                </Box>
                <Box mb="s16">
                  <Text mb="s16" variant="regular16">
                    Select shipment method
                  </Text>
                  <CommonOptionsSelector
                    DATA={shippmentMethods}
                    selectedIndex={selectedShippmentIndex}
                    setSelectedIndex={setSelectedShippmentIndex}
                    hideContinueButton
                  />
                  {/* <ShippingMethod checkoutDetails={checkoutDetails} /> */}
                </Box>
                {/* <Box mb="s16">
                  <Text mb="s16" variant="regular16">
                    Select Payment method
                  </Text>
                  <CommonOptionsSelector
                    DATA={paymentMethods}
                    selectedIndex={selectedPaymentIndex}
                    setSelectedIndex={setSelectedPaymentIndex}
                    hideContinueButton
                  />
                </Box> */}
              </Box>
            </>
          ) : (
            <>
              <CheckoutShimmer />
            </>
          )}

          {!isLoading ? (
            <>
              <Box paddingHorizontal="paddingHorizontal">
                            
                   <Box mb="s16">
                  <Text mb="s16" variant="regular16">
                    Select Payment method
                  </Text>
                  <CommonOptionsSelector
                    DATA={paymentMethods}
                    selectedIndex={selectedPaymentIndex}
                    setSelectedIndex={setSelectedPaymentIndex}
                    hideContinueButton
                  />
                </Box> 

              </Box>
            </>
          ) : (
            <>
              <CheckoutShimmer />
            </>
          )}
          
          {/* {checkoutDetails || !orderSummaryLoading ? (
            <Box paddingHorizontal={'paddingHorizontal'} marginTop="s16">
              <Box style={styles.borderBox}>
                <Text variant="bold14">Order Summary</Text>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text>Subtotal</Text>
                  {checkoutDetails?.product_sub_total ? (
                    <Text>$ {checkoutDetails?.product_sub_total || 0}</Text>
                  ) : (
                    ''
                  )}
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text>Shipping</Text>
                  {checkoutDetails?.shipping_total ? (
                    <Text>$ {checkoutDetails?.shipping_total || 0}</Text>
                  ) : (
                    ''
                  )}
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text>Sales Tax</Text>

                  {checkoutDetails?.tax_total ? (
                    <Text>$ {checkoutDetails?.tax_total || 0}</Text>
                  ) : (
                    ''
                  )}
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text variant="bold14">Total</Text>
                  {checkoutDetails?.order_total ? (
                    <Text>$ {checkoutDetails?.order_total || 0}</Text>
                  ) : (
                    ''
                  )}
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              <OrderSummaryShimmer />
            </>
          )} */}
        </ScrollView>
        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton
            title={isOrderConfirm ? 'Loading' : 'Place Order'}
            onPress={!isOrderConfirm ? orderConfirm : () => {}}
          />
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
