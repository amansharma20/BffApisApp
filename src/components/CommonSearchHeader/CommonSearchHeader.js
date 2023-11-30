/* eslint-disable react-native/no-inline-styles */
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Text, Box } from '@/atoms';
import Icons from '@/assets/constants/Icons';
import { IS_IOS } from '@/utils/appUtils';
import { useNavigation } from '@react-navigation/native';
import CartIconComponent from '../cartIcon/CartIconComponent';

const CommonSearchHeader = () => {
  const navigation = useNavigation();

  return (
    <Box paddingHorizontal="s16" backgroundColor="white">
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingVertical="s8"
      >
        <TouchableOpacity
          style={{ flex: 1, height: 32 }}
          onPress={() => {
            navigation.navigate('SearchScreenAlgolia');
          }}
        >
          <Box
            flex={1}
            backgroundColor="white"
            borderWidth={IS_IOS ? 0.5 : 1}
            borderColor="black"
            justifyContent="center"
            paddingHorizontal="s8"
          >
            <Box flexDirection="row" alignItems="center">
              <Image source={Icons.searchIcon} style={styles.searchIcon} />
              <Box>
                <Text>Search products here</Text>
              </Box>
            </Box>
          </Box>
        </TouchableOpacity>
        <Box flexDirection="row">
          <TouchableOpacity>
            <Box>
              <Image source={Icons.icon} style={styles.icon} />
            </Box>
          </TouchableOpacity>
          <CartIconComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default CommonSearchHeader;

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
    paddingLeft: 14,
    // height: 22,
    // width: 22,
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 4,
  },
});
