import { Box, Button, Text } from '@/atoms';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import { getOrdersData } from '@/redux/ordersApi/OrdersApiAsyncThunk';
// import { customerId } from '@/utils/appUtils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OrderItem from './components/OrderItem';
import { storage } from '@/store';
import OrderListShimmer from '@/components/shimmers/OrderListShimmer';
import config from '@/config';
const OrderScreen = () => {
  const customerIdFromStorage = storage.getString('customerId');
  const [customerId, setCustomerId] = useState(customerIdFromStorage);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const customerOrders = useSelector(
    state => state?.getOrdersDataApiSlice?.ordersData?.data || [],
  );

  const renderItem = ({ item }) => {
    console.log("item",item)
    return (
      <Box
        bg="white"
        padding="s4"
        borderRadius={8}
        borderWidth={1}
        mb="s4"
        borderColor="border"
      >
        <Box m="s6">
          <Box mb="s2" flexDirection="row" justifyContent="flex-start">
            <Text fontSize={14} fontWeight="dark">
              Order Id:
            </Text>
            <Text paddingLeft="s4">{item?.id}</Text>
          </Box>
          {/* <Box mb="s2" mt="s12">
            <Text fontSize={14}>
              Status:{' '}
              {item?.payment_status == 'not_paid' ? 'PENDING' : 'FULFILLED'}
            </Text>
          </Box> */}
          <Box mt="s20">
            <Text variant="bold14" mb="s10">
              Items in your order
            </Text>
            <FlatList
              data={item?.items}
              renderItem={item => {
                const data = item?.item;
                return <OrderItem item={data} />;
              }}
              scrollEnabled={false}
            />
          </Box>
          <Box mb="s2" mt="s12">
            <Text fontSize={14}>
              {/* {item?.payment_status == 'not_paid'
                ? 'Amount to be paid'
                : 'Amount paid'}
              {'  '}${item?.order_total} */}
              Amount paid : ${item?.attributes?.totals?.grandTotal}
            </Text>
          </Box>
          <Box mb="s2" mt="s12" flexDirection="row">
            <Box mr="s14">
              <Button
                title="View Order Details"
                textColor="#0a0a0a"
                borderColor="#0a0a0a"
                borderWidth={1}
                borderRadius={4}
                padding={4}
                onPress={() =>
                  navigation.navigate('OrderDetailsScreen', {
                    orderData: item,
                  })
                }
              />
            </Box>
            <Button
              title="Track Order"
              textColor="#0a0a0a"
              borderColor="#0a0a0a"
              borderWidth={1}
              borderRadius={4}
              padding={4}
            />
          </Box>
        </Box>
      </Box>
    );
  };
  useEffect(() => {
    setIsLoading(true);
    dispatch(getOrdersData(`${config.cartUrl}orderDetail/${customerId}`))
      .then(res => {
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <CommonHeader title={'Order List'} showCartIcon={true} />
      <ScrollView
        flex={1}
        backgroundColor="white"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 'paddingHorizontal',
        }}
      >
        <Box paddingHorizontal="paddingHorizontal">
          {isLoading ? (
            <OrderListShimmer />
          ) : (
            <FlatList
              data={customerOrders}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          )}
        </Box>
      </ScrollView>
    </>
  );
};
export default OrderScreen;

const styles = StyleSheet.create({});
