import { api } from '@/api/SecureAPI';
import { Box, Button, Text } from '@/atoms';
import { customerId } from '@/utils/appUtils';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import config from '@/config';
import { storage } from '@/store';

import React, { useState } from 'react';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';
import { ActivityIndicator } from 'react-native';

const ViewAddress = ({ userAddress }) => {
  console.log('userAddress: see', userAddress);
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const address = userAddress.item;
  const [isLoading, setIsLoading] = useState(false);

  const updateAddressHandler = async () => {
    setIsLoading(true);
    const reqBody = {
      firstName: firstName,
      lastName: lastName,
      address1: addressLine1,
      address2: addressLine2,
      salutation:"Mr",
      city: city,
      countryCode: 'IN',
      phone: phoneNumber,
      zipCode: postalCode,
    };
    console.log(reqBody,"reqbobdy")

    
    const res = await api.patch(`${config.cartUrl}patchUpdateCustomerAddress/${customerId || storage.getString('customerId')}/addresses/${address?.addressId}`,reqBody,)
    console.log('res?.data?.status: ', res, storage.getString('customerId'));
    console.log('res?.data: ', res?.data);
   
    
    if (res?.data?.status == 204 || res?.data?.status == 200) {
      // dispatch(getCustomerDetails(`sfcc/user-details/${customerId || storage.getString('customerId')}`)).then(
      dispatch(getCustomerDetails(`${config.cartUrl}getCustomerAddress/${customerId || storage.getString('customerId')}`)).then(

        (res) => {
          console.log(res?.payload?.data,"show it");
          console.log("its coming");
          setIsLoading(false);
        },
      );
    }

  }

  const removeAddressHandler = async () => {
    setIsLoading(true);
    console.log("afafaf",address)

    const res = await api.deleteWithEndpoint(
      `${config.cartUrl}deleteDeleteCustomerAddress/${customerId || storage.getString('customerId')}/addresses/${address?.addressId}`,
    );
    console.log('res?.data?.status.data: ', res, storage.getString('customerId'));

    if (res?.data?.status == 204 || res?.data?.status == 200) {
      // dispatch(getCustomerDetails(`sfcc/user-details/${customerId || storage.getString('customerId')}`)).then(
      dispatch(getCustomerDetails(`${config.cartUrl}getCustomerAddress/${customerId || storage.getString('customerId')}`)).then(

        (res) => {
          console.log(res?.payload?.data,"show me");
          console.log("not coming");
          setIsLoading(false);
        },
      );
    }
  };

  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      flex={1}
      style={{ backgroundColor: '#f8f9fa' }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Box mt="s14">
            <Text>
              {address?.firstName} {address?.lastName}
            </Text>
            <Text>{address?.addressId}</Text>
            <Text>
              {address?.city} {address?.country ? ',' : ''} {address?.country}
            </Text>
            <Text>
              {address?.state} {address?.postalCode}
            </Text>
            <Text>{address?.phone}</Text>
          </Box>
          <Box
            mt="s12"
            mb="s12"
            justifyContent="space-between"
            flexDirection="row"
          >
            <Button
              title="EDIT ADDRESS"
              textColor="#0a0a0a"
              // onPress={() => navigation.navigate('AddAddress')}

              // onPress={() => navigation.navigate('UpdateAddress')}
              onPress={updateAddressHandler}
            />
            <Button
              title="REMOVE ADDRESS"
              textColor="#0a0a0a"
              onPress={removeAddressHandler}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
export default ViewAddress;
