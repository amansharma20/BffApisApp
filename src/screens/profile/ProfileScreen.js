import React, { useContext, useEffect, useState } from 'react';

// import { Box, Text, theme } from '@atoms';
import { Box, Text, theme } from '@/atoms';
import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginScreen from '../auth/LoginScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import config, { ENV } from '@/config';
import CommonSearchHeader from '@/components/CommonSearchHeader/CommonSearchHeader';
import { useSelector, useDispatch } from 'react-redux';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { AuthContext } from '@/navigators/MainNavigator';
import Icons from '@/assets/constants/Icons';
import CommonTransparentButton from '@/components/CommonSolidButton/CommonTransparentButton';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';
import { storage } from '@/store';
import ProfileShimmer from '@/components/shimmers/ProfileShimmer';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const customerIdFromStorage = storage.getString('customerId');
  const [customerId, setCustomerId] = useState(customerIdFromStorage);
  console.log('customerId: ', customerId);
  const onPressLogout = () => {
    signOut();
  };

  const { isUserLoggedIn } = useIsUserLoggedIn();
  const IS_SFCC = config.app.isSfcc;
  console.log('IS_SFCC: ', IS_SFCC);
  const IS_SPRYKER = config.app.isSpryker;
  console.log('IS_SPRYKER: ', IS_SPRYKER);
  const IS_VTEX = config.app.isVtex;
  console.log('IS_VTEX: ', IS_VTEX);

  const baseUrl = config.baseUrl;

  const userDetails = useSelector(
    state => state?.getCustomerDetailsApiSlice?.customerDetails?.data,
  );
  // console.log('userDetails:suno he kya ', userDetails?.userProfile);
  console.log('userDetails:mili ',userDetails)


  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getCustomerDetails(`${config.cartUrl}userDetail/${customerId || storage.getString('customerId')}`),
      // getCustomerDetails(`${config.cartUrl}userDetail`),

    ).then(() => {
      setIsLoading(false);
    });
  }, [customerId]);

  const dataArray = [
    // {
    //   name: 'Profile',
    //   subHeading: 'View your profile',
    //   icons: Icons.profileIcon,
    //   onPress: function () {
    //     isUserLoggedIn
    //       ? navigation.navigate('PersonalDetailsScreen')
    //       : navigation.navigate('LoginScreen');
    //   },
    // },
    {
      name: 'Order History',
      subHeading: 'View your past orders',
      icons: Icons.orderHistoryIcon,
      onPress: function () {
        isUserLoggedIn
          ? navigation.navigate('OrdersScreen')
          : navigation.navigate('LoginScreen');
      },
    },

    {
      name: 'My Address',
      subHeading: 'Manage your saved address',
      icons: Icons.addressIcon,
      onPress: function () {
        isUserLoggedIn
          ? navigation.navigate('AddressScreen')
          : navigation.navigate('LoginScreen');
      },
    },
    {
      name: 'Change Password',
      subHeading: 'Edit your password',
      icons: Icons.changePassword,
      onPress: function () {
        isUserLoggedIn ? () => {} : navigation.navigate('LoginScreen');
      },
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer]}
        onPress={() => {
          item.onPress();
        }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Image source={item?.icons} style={styles.wishlistIcon} />
          <Box
            flexDirection="column"
            paddingLeft="s10"
            justifyContent="flex-start"
          >
            <Text variant="regular18">{item.name}</Text>
            <Text variant="regular12">{item?.subHeading}</Text>
          </Box>
        </Box>
        <Box>
          <Text>→</Text>
        </Box>
      </TouchableOpacity>
    );
  };

  return (
    <Box
      style={{ paddingTop: insets.top }}
      backgroundColor="background"
      flex={1}
    >
      {true ? (
        <>
          <Box flex={1}>
            <CommonSearchHeader />
            {/* code here  */}
            <Box margin={'s24'}>
              <Box flexDirection="row">
                <Image
                  source={require('../../assets/images/profile.jpg')}
                  style={{ height: 100, width: 100 }}
                  borderRadius={60}
                />
                {isLoading ? (
                  <ProfileShimmer />
                ) : (
                  <Box
                    flex={1}
                    marginLeft="s16"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <Text variant="bold28">
                      Hello {userDetails?.userProfile?.[0]?.firstName},
                    </Text>
                    <Text>{userDetails?.userProfile?.[0]?.email}</Text>
                  </Box>
                )}
              </Box>
            </Box>
            <FlatList
              data={dataArray}
              renderItem={renderItem}
              key={Math.random()}
            />
            <Box
              padding="s16"
              // style={theme.cardVariants.bottomButtonShadow}
              backgroundColor="white"
            >
              <CommonTransparentButton
                title={'LOG OUT'}
                onPress={onPressLogout}
              />
              {/* <CommonSolidButton title="LOGOUT" onPress={onPressLogout} /> */}
            </Box>
          </Box>
        </>
      ) : (
        <>
          <LoginScreen />
        </>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.paddingHorizontal,
    justifyContent: 'space-between',
  },
  wishlistIcon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
});
