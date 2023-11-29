import { Text, Box, theme } from '@/atoms';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import OrderItem from './components/OrderItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsAsyncThunk } from '@/redux/orderDetailsApi/OrderDetailsApiAsyncThunk';
import config from '@/config';
const OrderDetailsScreen = props => {
  const orderData = props?.route?.params?.orderData;
  const [isLoading, setIsloading] = useState(true);
  const dispatch = useDispatch();
  const orderDetails = useSelector(
    state => state?.getOrdersDetailsApiSlice?.orderDetails?.data || [],
  );

  useEffect(() => {
    setIsloading(true);
    dispatch(
      getOrderDetailsAsyncThunk(
        `${config.cartUrl}orderDetailById/${orderData.id}`,
      ),
    ).then(() => {
      setIsloading(false);
    });
  }, [orderData]);

  function convertToReadableFormat(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    return date.toLocaleString('en-US', options);
  }

  const timestamp = orderData?.attributes?.createdAt;
  const readableFormat = convertToReadableFormat(timestamp);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Box flex={1} backgroundColor="white">
          <CommonHeader
            title={'Order details'}
            searchIcon={true}
            showCartIcon={true}
          />
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView
              flex={1}
              backgroundColor="white"
              contentContainerStyle={{
                flexGrow: 1,
                paddingHorizontal: 'paddingHorizontal',
              }}
            >
              <Box mt="s14" paddingHorizontal="paddingHorizontal">
                <Box flexDirection="row" justifyContent="space-between">
                  <Box width={'50%'}>
                    <Text>Order: {orderData?.id}</Text>
                  </Box>
                  <Box width={'50%'}>
                    <Text>{readableFormat}</Text>
                  </Box>
                </Box>
                <Box
                  flexDirection="row"
                  mt="s12"
                  justifyContent="space-between"
                >
                  <Text>
                    Order total: ${orderData?.attributes?.totals?.grandTotal}{' '}
                  </Text>
                </Box>
                <Box mt="s20">
                  <Text variant="bold14" mb="s10">
                    Items in your order
                  </Text>
                  <FlatList
                    data={orderDetails?.transformedData}
                    renderItem={item => {
                      const data = item?.item;
                      return <OrderItem item={data} />;
                    }}
                    scrollEnabled={false}
                  />
                </Box>
                <Text variant="bold16" mt="s14">
                  Payment Details
                </Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s20"
                >
                  <Text>Subtotal</Text>
                  <Text>${orderDetails?.totals?.subtotal}</Text>
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s14"
                >
                  <Text>Shipping</Text>
                  <Text>${orderDetails?.shipments?.[0]?.netPrice}</Text>
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s14"
                >
                  <Text>Total Tax</Text>
                  <Text>{orderDetails?.totals?.taxTotal}</Text>
                </Box>
                <Box
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginTop: 10,
                  }}
                ></Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s10"
                >
                  <Text>Grand Total</Text>
                  <Text>{orderDetails?.totals?.grandTotal}</Text>
                </Box>

                {/* <Box flexDirection="row" justifyContent="space-between" mt="s20">
            <Text>Payment Status</Text>
            <Text>{orderData?.payment_status}</Text>
          </Box> */}
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s20"
                >
                  <Text variant="bold14">Delivery details</Text>
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  mt="s20"
                >
                  <Text>Shipping address</Text>
                </Box>
                <Text mt="s10">
                  {orderDetails?.billingAddress?.firstName}{' '}
                  {orderDetails?.billingAddress?.lastName}
                </Text>
                <Text mt="s10">{orderDetails?.billingAddress?.address1}</Text>
                <Text mt="s10" mb="s10">
                  {orderDetails?.billingAddress?.city}
                  {orderDetails?.billingAddress?.zipCode}
                </Text>
              </Box>
            </ScrollView>
          )}
        </Box>

        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton title="Return order" />
        </Box>
      </SafeAreaView>
    </>
  );
};
export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
