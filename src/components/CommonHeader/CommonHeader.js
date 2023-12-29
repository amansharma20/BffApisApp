/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Box, Text, theme } from '@/atoms';
import GoBackButton from '../GoBackButton/GoBackButton';
import { CartIcon } from '../../assets/svgs';
import { useNavigation } from '@react-navigation/native';
import { FONT } from '@/atoms';
import { useSelector } from 'react-redux';
import CartIconComponent from '../cartIcon/CartIconComponent';


const CommonHeader = ({
  title,
  onPress,
  searchIcon = false,
  showCartIcon = false,
  ...props
}) => {
  return (
    <Box flexDirection="row" style={{ backgroundColor: 'white' }}>
      <SafeAreaView style={styles.container} {...props}>
        <Box flexDirection="row" alignItems="center" maxWidth={'80%'}>
          <GoBackButton onPress={onPress} />
          <Text variant="bold18" style={{ maxWidth: '90%' }} numberOfLines={1}>
            {title}
          </Text>
        </Box>
        {showCartIcon && (
          <>
            <CartIconComponent />
          </>
        )}

      </SafeAreaView>
    </Box>
  );
};

export default CommonHeader;

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
  wishlistIcon: {
    resizeMode: 'contain',
    height: 22,
    width: 22,
  },
});
