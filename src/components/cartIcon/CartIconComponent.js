import React from 'react';
import { Box, FONT, Text, theme } from '@/atoms';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icons from '@/assets/constants/Icons';
import { useAuthRoute } from '@/hooks/useAuthRoute';
const CartIconComponent = () => {
  const navigation = useNavigation();
  const { getAuthRoute } = useAuthRoute();
  const customerCartItems = useSelector(
    state => state?.getCustomerCartItemsAliSlice?.customerCartItems?.data,
  );
  const totalCount = customerCartItems?.products?.reduce(
    (total, currentValue, currentIndex) => {
      const itemCount = currentValue?.quantity || 0;
      return total + itemCount;
    },
    0,
  );

  const onPressCart = () => {
    getAuthRoute('CartScreen', {});
  };
  return (
    <Box>
      <TouchableOpacity style={{ padding: 6 }} onPress={onPressCart}>
        {totalCount > 0 ? (
          <Box
            style={{
              backgroundColor: '#F50157',
              zIndex: 2,
              position: 'absolute',
              alignItems: 'center',
              width: 16,
              height: 16,
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 100,
              marginLeft: 16,
            }}
          >
            <Text fontSize={12} variant="bold18" ml="s2">
              {totalCount}
            </Text>
          </Box>
        ) : (
          <></>
        )}
        <Image source={Icons.cartIcon} style={styles.cartIcon} />
      </TouchableOpacity>
    </Box>
  );
};

export default CartIconComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.paddingHorizontal,
    marginBottom: theme.spacing.s8,
    justifyContent: 'space-between',
    flexShrink: 1,
    width: '100%',
  },
  cartContainer: {
    padding: 6,
  },
  input: {
    backgroundColor: theme.colors.inputGrey,
    height: 40,
    width: '100%',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    fontFamily: FONT.Primary,
  },
  cartIcon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
});
