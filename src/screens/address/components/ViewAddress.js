import { api } from '@/api/SecureAPI';
import { Box, Button, Text } from '@/atoms';
import { customerId } from '@/utils/appUtils';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';
import { ActivityIndicator } from 'react-native';

const ViewAddress = ({ userAddress }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const address = userAddress.item;
  const [isLoading, setIsLoading] = useState(false);
  const removeAddressHandler = async () => {
    setIsLoading(true);
    const res = await api.Delete(
      `sfcc/removeCustomerAddress/${customerId}/address/${address?.addressNumber}`,
    );
    console.log('res?.data?.status: ', res?.data?.status);

    if (res?.data?.status == 204) {
      dispatch(getCustomerDetails(`sfcc/user-details/${customerId}`)).then(
        () => {
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
              {address.firstName} {address.lastName}
            </Text>
            <Text>{address.addressNumber}</Text>
            <Text>
              {address.city} {address.country ? ',' : ''} {address.country}
            </Text>
            <Text>
              {address.state} {address.postalCode}
            </Text>
            <Text>{address.phone}</Text>
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
              onPress={() => navigation.navigate('AddAddress')}
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
