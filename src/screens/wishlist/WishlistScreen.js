/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import BottomSheet,{BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import { Box, Text, theme } from '@/atoms';
import { useSelector, useDispatch } from 'react-redux';
import CommonHeader from '@/components/CommonHeader/CommonHeader';
import { useNavigation } from '@react-navigation/native';
import { useIsUserLoggedIn } from '@/hooks/useIsUserLoggedIn';
import { getCustomerWishlist } from '@/redux/wishlistApi/WishlistApiAsyncThunk';
import { getWishlistById } from '@/redux/wishlistApi/WishlistByIdApiAsyncThunk';
import WishlistItem from './WishlistItem';
import CommonSolidButton from '@/components/CommonSolidButton/CommonSolidButton';
import { customerId } from '@/utils/appUtils';
import { storage } from '@/store';
import CartScreenShimmer from '@/components/shimmers/CartScreenShimmer';
import { useAuthRoute } from '@/hooks/useAuthRoute';
import config from '@/config';
import { api } from '@/api/SecureAPI';
import {RemoveIcon} from '../../assets/svgs';


const WishlistScreen = () => {
  const navigation = useNavigation();
  const { getAuthRoute } = useAuthRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItemsArray, setCartItemsArray] = useState([]);
  const { isUserLoggedIn } = useIsUserLoggedIn();
  const dispatch = useDispatch();
  const [newWishlistName, setNewWishlistName] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '75%', '95%'], []);

  // const customerCartId = useSelector(
  //   state =>
  //     state?.getCustomerBasketApiSlice?.customerBasket?.data?.baskets?.[0]
  //       ?.basket_id,
  // );
  // console.log('customerCartId: ', customerCartId);

  // const customerCartItems = useSelector(
  //   state => state?.getCustomerCartItemsAliSlice?.customerCartItems?.data,
  // );

  const wishlistAllItems = useSelector(
    state => state?.getCustomerWishlistApiSlice?.customerWishlist?.data,
  );
  console.log(wishlistAllItems, 'wishlistItemsfff');

  const wishlistByIdItems = useSelector(
    state => state?.getWishlistByIdApiSlice?.WishlistById?.data,
  );
  console.log('wishlistByIdItems', wishlistByIdItems);

  const renderItem = () => {
    20;
  };

  useEffect(() => {
    dispatch(
      getCustomerWishlist(
        `${config.cartUrl}customerWishlist?customerId=${storage.getString(
          'customerId',
        )}`,
      ),
    );
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     getWishlistById(
  //       `${
  //         config.cartUrl
  //       }wishlistById/943c76423cd374f626d7b1cad9?customerId=${storage.getString(
  //         'customerId',
  //       )}`,
  //     ),
  //   );
  // }, []);

  
  const removeItem = async productData => {
    console.log(productData,"jajaaj")
    setIsLoading(true);
    const response = await api
      .deleteWithEndpoint(`${config.cartUrl}deleteCustomerWishlist/${productData}?customerId=${storage.getString(
        'customerId',
      )}`)
  };

  const addNewWishlist = async () => {
    const respBody = {
      customerId: `${storage.getString('customerId')}`,
      name: newWishlistName,
      type: 'wish_list',
    };
    console.log('respBody', respBody);
    const response = await api.postWithEndpoint(
      `${config.cartUrl}createWishlist`,
      respBody,
    );
    console.log('responser', response);
    if (response?.data?.status === 201 || response?.data?.status == 200) {
      dispatch(
        getCustomerWishlist(
          `${config.cartUrl}customerWishlist?customerId=${storage.getString(
            'customerId',
          )}`,
        ),
      );
    } else {
      alert('error');
    }
  };


  const ListEmptyComponent = () => {
    return (
      <Box flex={1} justifyContent="center">
        <Text textAlign="center">No Items in wishlist.</Text>
      </Box>
    );
  };


  const handleWishlistItemClick = async (wishlistItem) => {
    console.log("Clicked wishlist item: ", wishlistItem.id);
    
    dispatch(
      getWishlistById(
        `${
          config.cartUrl
        }wishlistById/${wishlistItem.id}?customerId=${storage.getString(
          'customerId',
        )}`,
      )
    )
    .then(response => {
      console.log("Response of getWishlistById:", response?.payload?.data);
      // Handle the response here
    })
    .catch(error => {
      console.error("Error fetching wishlist by ID:", error);
      // Handle errors here
    });
  };
  
  // const productData = item;

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} backgroundColor="white">
        {isUserLoggedIn ? (
            <>
            <CommonHeader title={'Your Shopping List'} />
          
            <ScrollView
              contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: theme.spacing.paddingHorizontal,
                }}
            >
              <Box>
                <FlatList
                  data={wishlistByIdItems?.wishlistItems}
                  renderItem={item => {
                      const productData = item?.item;
                    console.log(productData, 'productData');
                    return <WishlistItem item={productData} />;
                  }}
                  ListEmptyComponent={
                      isLoading === false ? (
                      <ListEmptyComponent />
                    ) : (
                        <ActivityIndicator />
                    )
                  }
                  scrollEnabled={false}
                />
              </Box>
            </ScrollView>
          </>
        ) : (
          <>
            <Box flex={1} justifyContent="center">
              <Text textAlign="center">Please logged in first</Text>
            </Box>
          </>
        )}
      </Box>
      <>
    
      <BottomSheet
        snapPoints={snapPoints}
        index={1}
      >
      <BottomSheetTextInput
      style={styles.input}
      value={newWishlistName}
      onChangeText={text => setNewWishlistName(text)}
      placeholder="Enter wishlist name" />
      <FlatList
                  data={wishlistAllItems?.wishlist}
                  renderItem={item => {
                      const productData = item?.item;
                    console.log(productData, 'productDatawishlist');
                    // return <WishlistItem item={productData} />;

                    return (
                      <View style={styles.listItemContainer}>
                       <View style={styles.roundButton}>
            {/* Your button design goes here */}
                      </View>
                          <ScrollView>
          <Text key={productData.id} textAlign="center" onPress={() => handleWishlistItemClick(productData)}>
            {productData.name}
          </Text>
                </ScrollView>
                <TouchableOpacity style={styles.removeButton}  onPress={() => removeItem(productData.id)}>
                  <RemoveIcon />
                </TouchableOpacity>
       
      </View> )
 }}
                />
      <Box
          padding="s16"
          style={theme.cardVariants.bottomButtonShadow}
          backgroundColor="white"
        >
          <CommonSolidButton
            title="Add new Shopping list"
            onPress={() => addNewWishlist()}
          />
        </Box>
      </BottomSheet>
      </>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
    input: {
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)',
      },
      listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
      },
      roundButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'darkgray', // Change this to your desired button color
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
      },
      removeButton: {
        // Styling for the RemoveIcon button
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',

      },
    //   scrollableText: {
    //     flex: 1,
    //     textAlign: 'center',
    //     paddingVertical: 8,
    //     borderBottomWidth: 1,
    //     borderBottomColor: 'lightgray',
    //     // Add additional styles to enable scrolling
    //     overflow: 'scroll', // For Android
    //     overflowY: 'scroll', // For iOS
    //   },
    
  });

export default WishlistScreen;
