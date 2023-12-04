/* eslint-disable quotes */
import { Box, Text, theme } from '@/atoms';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/navigators/MainNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { getCustomerDetails } from '@/redux/profileApi/ProfileApiAsyncThunk';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import { customerId } from '@/utils/appUtils';
import CommonTransparentButton from '@/components/CommonSolidButton/CommonTransparentButton';
import { getCustomerBasketApi } from '@/redux/basket/BasketApiAsyncThunk';
import config from '@/config';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';

const PersonalDetailsScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const isUserLoggedIn = useIsUserLoggedIn();
  const dispatch = useDispatch();

  const userDetails = useSelector(
    state =>
      state?.getCustomerDetailsApiSlice?.customerDetails?.data?.userProfile,
  );

  console.log("userDetails chal raha k",userDetails)

  const onPressLogout = () => {
    signOut();
  };
  useEffect(() => {
    dispatch(
      getCustomerBasketApi(`${config.cartUrl}getCustomerCart/${customerId}`),
    );
  }, [isUserLoggedIn]);
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title={'Your Account'} />
      <ScrollView>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={theme.colors.sushiittoRed} />
          </View>
        ) : (
          <>
            {userDetails ? (
              <View style={styles.profileDetailsContainer}>
                <ProfileRow
                  label="First Name"
                  value={userDetails[0]?.firstName}
                />
                <ProfileRow
                  label="Last Name"
                  value={userDetails[0]?.lastName}
                />
                <ProfileRow label="Email" value={userDetails[0]?.email} />
                <ProfileRow label="state" value={userDetails[0]?.state} />
                {/* <ProfileRow label="Date Of Birth" value={profileDataAttributes.dateOfBirth} /> */}
              </View>
            ) : (
              ''
            )}
          </>
        )}
      </ScrollView>
      <Box
        padding="s16"
        // style={theme.cardVariants.bottomButtonShadow}
        backgroundColor="white"
      >
        <CommonTransparentButton title={'LOG OUT'} onPress={onPressLogout} />
        {/* <CommonSolidButton title="LOGOUT" onPress={onPressLogout} /> */}
      </Box>
    </SafeAreaView>
  );
};

const ProfileRow = ({ label, value }) => {
  return (
    <View style={styles.profileRow}>
      <Text variant="bold18" style={styles.label}>
        {label}
      </Text>
      <Text variant="bold18" style={styles.value}>
        {value}
      </Text>
    </View>
  );
};
export default PersonalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  logoutButtonContainer: {
    padding: 20,
  },
});
