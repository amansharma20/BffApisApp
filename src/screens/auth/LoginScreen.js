import React, { useCallback, useContext, useRef, useState } from 'react';
import { Box, FONT, Text, theme } from '@atoms';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { commonApi } from '@/api/CommanAPI';
import { AuthContext } from '@/navigators/MainNavigator';
import { useNavigation } from '@react-navigation/native';
import CommonSolidButton from '../../components/CommonSolidButton/CommonSolidButton';
import SelectAuthMethod from './components/SelectAuthMethod';
import { useDispatch } from 'react-redux';
import SignUpScreen from './SignUpScreen';
import { CrossIcon } from '@/assets/svgs';
import { reduxStorage } from '@/store';
import { createCustomerBasket } from '@/redux/createBasketApi/CreateBasketApiAsyncThunk';
import config from '@/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCustomerBasketApi } from '@/redux/basket/BasketApiAsyncThunk';
import { getCustomerCartItems } from '@/redux/cartItemsApi/CartItemsAsyncThunk';

export default function LoginScreen(props) {
  const dispatch = useDispatch();
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('login');
  const [userEmail, setUserEmail] = useState('amber@gmail.com');
  const [password, setPassword] = useState('Amber@123');
  const [isLoading, setIsLoading] = useState(false);

  const onPressLogin = async () => {
    setIsLoading(true);
    // CommonLoading.show();
    const apiData = {
      email: userEmail,
      password: password,
    };
    const response = await commonApi.post(config.loginUrl + 'login', apiData, {
      'Content-Type': 'Application/json',
    });

    if (response.data?.status === 201 || response.data?.status === 200) {
      console.log('HERE');
      // await AsyncStorage.setItem(
      //   'tokenExpiry',
      //   response?.data?.data?.validation?.authCookie?.Value,
      // );
      // var token = response?.data?.data?.validation?.authCookie?.Value;
      var token = response?.data?.data?.bearerToken;
      
      const customerId = response?.data?.data?.customer_id;
      reduxStorage.setItem('customerId', customerId);
      await AsyncStorage.setItem('tokenExpiry', token);
      signIn(token);
      dispatch(
        getCustomerBasketApi(`${config.cartUrl}getCustomerCart/${customerId}`),
        
      ).then(res => {
        console.log("baasketId",customerId)
        dispatch(
          getCustomerCartItems(
            `${config.cartUrl}cartDetail/${res?.payload?.data?.baskets?.[0]?.basket_id}`,
          ),
        );
      });

      // dispatch(getCustomerBasketApi(`sfcc/getCustomerCart/${customerId}`));
      // dispatch(createCustomerBasket(`${config.cartUrl}createCart`));
    } else {
      Alert.alert('server error');
      setIsLoading(false);
      // CommonLoading.hide();
    }
  };

  // SIGN UP

  const bottomSheetRef = useRef(null);

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // const onPressSubmit = () => {
  //   onPressLogin();
  // };

  function isValidEmail(email) {
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  const getButtonStatus = () => {
    if (isValidEmail(userEmail) === false || password.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} padding="s16" backgroundColor="white">
        <Box alignItems="flex-end">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Box padding="s4">
              <CrossIcon />
            </Box>
          </TouchableOpacity>
        </Box>
        <Box mt="s4">
          <SelectAuthMethod
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </Box>
        {/* <Text variant="bold24" mb="s16">
        Login to continue
      </Text> */}
        {selectedOption === 'login' ? (
          <Box>
            <Text variant="regular14" color="lightBlack" mr="s4" mb="s12">
              Enter your email to get started
            </Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={userEmail}
              onChangeText={text => {
                setUserEmail(text);
              }}
              keyboardType="email-address"
              placeholderTextColor={theme.colors.lightGrey}
            />
            <Text
              variant="regular14"
              color="lightBlack"
              mr="s4"
              marginVertical="s12"
            >
              Password
            </Text>
            <TextInput
              style={styles.input}
              placeholder="password"
              value={password}
              onChangeText={text => {
                setPassword(text);
              }}
              placeholderTextColor={theme.colors.lightGrey}
            />
            <Box mt="s16">
              {!isLoading ? (
                <>
                  <CommonSolidButton
                    title="LOGIN"
                    onPress={onPressLogin}
                    disabled={getButtonStatus()}
                  />
                </>
              ) : (
                <Box
                  backgroundColor="black"
                  height={40}
                  borderRadius={theme.spacing.lml}
                  alignItems="center"
                  justifyContent="center"
                >
                  <ActivityIndicator color={'white'} />
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <>
            <SignUpScreen setSelectedOption={setSelectedOption} />
          </>
        )}
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.inputGrey,
    height: 54,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    fontFamily: FONT.Primary,
  },
});
