import { Text, Box, theme } from '@/atoms';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import OrderItem from './components/OrderItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
const OrderDetailsScreen = props => {
  const orderData = props?.route?.params?.orderData;

  console.log(
    '🚀 ~ file: OrderDetailsScreen.js:13 ~ OrderDetailsScreen ~ orderData?.creation_date:',
    orderData?.creation_date,
  );

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

  const timestamp = orderData?.creation_date;
  const readableFormat = convertToReadableFormat(timestamp);

  console.log(
    '🚀 ~ file: OrderDetailsScreen.js:33 ~ OrderDetailsScreen ~ readableFormat:',
    readableFormat,
  );

  return (
    <>
      <CommonHeader
        title={'Order details'}
        searchIcon={true}
        showCartIcon={true}
      />
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
              <Text>Order: {orderData?.order_no}</Text>
            </Box>
            <Box width={'50%'}>
              <Text>{readableFormat}</Text>
            </Box>
          </Box>
          <Box flexDirection="row" mt="s12" justifyContent="space-between">
            <Text>Order total: ${orderData?.order_total} </Text>
          </Box>
          <Box mt="s20">
            <Text variant="bold14" mb="s10">
              Items in your order
            </Text>
            <FlatList
              data={orderData?.product_items}
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
          <Box flexDirection="row" justifyContent="space-between" mt="s20">
            <Text>Subtotal</Text>
            <Text>${orderData?.product_sub_total}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mt="s14">
            <Text>Shipping</Text>
            <Text>${orderData?.shipping_total}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mt="s14">
            <Text>Total Tax</Text>
            <Text>{orderData?.tax_total}</Text>
          </Box>
          <Box
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              marginTop: 10,
            }}
          ></Box>
          <Box flexDirection="row" justifyContent="space-between" mt="s10">
            <Text>Grand Total</Text>
            <Text>{orderData?.order_total}</Text>
          </Box>

          <Box flexDirection="row" justifyContent="space-between" mt="s20">
            <Text>Payment Status</Text>
            <Text>{orderData?.payment_status}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mt="s20">
            <Text variant="bold14">Delivery details</Text>
          </Box>
          <Box flexDirection="row" justifyContent="space-between" mt="s20">
            <Text>Shipping address</Text>
          </Box>
          <Text mt="s10">
            {orderData?.shipments?.[0]?.shipping_address?.full_name}
          </Text>
          <Text mt="s10">
            {orderData?.shipments?.[0]?.shipping_address?.address1}
          </Text>
          <Text mt="s10" mb="s10">
            {orderData?.shipments?.[0]?.shipping_address?.city}({' '}
            {orderData?.shipments?.[0]?.shipping_address?.postal_code})
          </Text>
        </Box>
      </ScrollView>
      <Box
        padding="s16"
        style={theme.cardVariants.bottomButtonShadow}
        backgroundColor="white"
      >
        <CommonSolidButton title="Return order" />
      </Box>
    </>
  );
};
export default OrderDetailsScreen;
