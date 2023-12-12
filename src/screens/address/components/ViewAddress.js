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
  console.log("address he kya ",address)
  const [isLoading, setIsLoading] = useState(false);

  // const updateAddressHandler = async () => {
  //   try {
  //   setIsLoading(true);
  //   const reqBody = {
  //     address1: addressLine1,
  //     address2: addressLine2,
  //     city: city,
  //     countryCode: 'IN',
  //     firstName: firstName,
  //     lastName: lastName,
  //     phone: phoneNumber,
  //     salutation:"Mr",
  //     zipCode: postalCode,
  //   };
  //   console.log(reqBody,"reqbobdy")
  //     const res = await api.patch(
  //       `${config.cartUrl}patchUpdateCustomerAddress/${customerId || storage.getString('customerId')}/addresses/${address?.addressId}`,
  //       reqBody,
  //     );
      
  //     console.log('res?.data?.status: ', res?.data?.status, res );
  //     console.log('res?.data: ', res?.data);
  
  //     if (res?.data?.status === 204 || res?.data?.status === 200) {
  //     dispatch(getCustomerDetails(`${config.cartUrl}userDetail/${customerId || storage.getString('customerId')}`))
  
  //       console.log("Update successful");
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.error('Error occurred:', error);
  //     setIsLoading(false);
  //   }
  // };
    
 

  const removeAddressHandler = async () => {
    try {
      setIsLoading(true);
  
      const res = await api.deleteWithEndpoint(
        `${config.cartUrl}deleteDeleteCustomerAddress/${customerId || storage.getString('customerId')}/addresses/${address?.addressId}`,
      );
  
      if (res?.data?.status === 204 || res?.data?.status === 200) {
       dispatch(getCustomerDetails(`${config.cartUrl}userDetail/${customerId || storage.getString('customerId')}`));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error('Address deletion failed');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setIsLoading(false);
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

              onPress={() =>{ 
                if (address) {  navigation.navigate('AddAddress', { address:address })
            
            
              } else {
                console.log('Address data is not available');
              }
            }
          }

              // onPress={updateAddressHandler}
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
