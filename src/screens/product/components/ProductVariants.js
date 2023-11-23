import { Box, theme } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';

const ProductVariants = ({ variants }) => {
  console.log('variants: ', variants);

  const rendeChildItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <Box style={styles?.item}>
          <Text>{item?.value?.value}</Text>
        </Box>
      </TouchableOpacity>
    );
  };
  const renderItem = ({ item, index }) => {
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        const values = item[key];
        return (
          <Box>
            <Text>{key}</Text>
            <FlatList
              data={values}
              contentContainerStyle={{
                flexDirection: 'row',
                flexBasis: 1,
                justifyContent: 'space-between',
                paddingHorizontal: 4,
              }}
              numColumns={4}
              renderItem={rendeChildItem}
            />
          </Box>
        );
      }
    }
  };

  return <FlatList data={variants} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 80,
  },
});

export default ProductVariants;
