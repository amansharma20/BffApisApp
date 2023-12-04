import { Box, Button, Text, theme } from '@/atoms';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { useNavigation } from '@react-navigation/native';
import { api } from '@/api/SecureAPI';
import config from '@/config';
import { storage } from '@/store';


import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { customerId } from '@/utils/appUtils';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';

const UpdateAddress = () => {
  const [firstName, setFirstName] = useState('aamir');
  const [lastName, setLastName] = useState('bohra');
  const [phoneNumber, setPhoneNumber] = useState('912345678');
  const [country, setCoutry] = useState('india');
  const [postalCode, setPostalCode] = useState('56565');
  const [city, setCity] = useState('indore');
  const [state, setState] = useState('mp');
  const [addressLine1, setAddressLine1] = useState('malhar mall');
  const [addressLine2, setAddressLine2] = useState('c21');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onChangeFirstName = fname => {
    setFirstName(fname);
  };
  const onChangeLastName = lname => {
    setLastName(lname);
  };
  const onChangePhoneNumber = phone => {
    setPhoneNumber(phone);
  };

  const onChangeCity = city => {
    setCity(city);
  };
  const onChangeCountry = country => {
    setCoutry(country);
  };
  const onChangePostalCode = postal_code => {
    setPostalCode(postal_code);
  };
  const onChangeState = state => {
    setState(state);
  };
  const onChangeAddressLine1 = add1 => {
    setAddressLine1(add1);
  };
  const onChangeAddressLine2 = add2 => {
    setAddressLine2(add2);
  };
  const navigation = useNavigation();

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
        <Box ml="s16" mr="s16" paddingHorizontal="paddingHorizontal">
          <Text mt="s30" mb="s4" variant="bold14">
            Contact Information
          </Text>
          <Text variant="bold14" mb="s10" mt="s16">
            First Name
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeFirstName}
            value={firstName}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            Last Name
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeLastName}
            value={lastName}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            Phone Number
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePhoneNumber}
            value={phoneNumber}
          />
        </Box>
        <Box
          ml="s16"
          mt="s30"
          mr="s16"
          mb="s20"
          paddingHorizontal="paddingHorizontal"
        >
          <Text mt="s20" mb="s20" variant="bold14">
            Shipping Address
          </Text>
          <Text variant="bold14" mb="s10" mt="s16">
            Country
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCountry}
            value={country}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            Postal Code
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePostalCode}
            value={postalCode}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            State
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeState}
            value={state}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            City
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCity}
            value={city}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            Address Line 1
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeAddressLine1}
            value={addressLine1}
          />
          <Text variant="bold14" mb="s10" mt="s16">
            Address Line 2
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeAddressLine2}
            value={addressLine2}
          />
        </Box>
        <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton
            title={loading ? 'loading' : 'Add Address'}
            onPress={updateAddressHandler}
          />
        </Box>
      </ScrollView>
    </>
  );
};
export default UpdateAddress;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});
