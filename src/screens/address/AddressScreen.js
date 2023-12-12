import { Box, Button, Text } from '@/atoms';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import ViewAddress from './components/ViewAddress';

const AddressScreen = () => {
  const navigation = useNavigation();

  const userAddresses = useSelector(
    state => state?.getCustomerDetailsApiSlice?.customerDetails?.data,
  );

  return (
    <>
      <CommonHeader title={'Manage Delivery Address'} showCartIcon={true} />

      <ScrollView
        flex={1}
        backgroundColor="white"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 'paddingHorizontal',
        }}
      >
        <Box paddingHorizontal="paddingHorizontal">
          <Box justifyContent="flex-start" flexDirection="row">
            <Button
              title="ADD A NEW ADDRESS"
              textColor="#0a0a0a"
              onPress={() => navigation.navigate('AddAddress')}
            />
          </Box>
          <Box mt="s20" mb="s10">
            <Text>Delivery Address</Text>
          </Box>
          <FlatList
            data={userAddresses?.userProfile}
            renderItem={userAddress => (
              <ViewAddress userAddress={userAddress || []} /> 
            )}
          />
        </Box>
      </ScrollView>
    </>
  );
};

export default AddressScreen;
