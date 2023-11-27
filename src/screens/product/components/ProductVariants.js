/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList } from 'react-native';
import VariantParentItem from './VariantParentItem';

const ProductVariants = ({
  variants,
  selectedVariants,
  setSelectedVariants,
}) => {
  return (
    <FlatList
      data={variants}
      renderItem={({ item }) => {
        return (
          <VariantParentItem
            item={item}
            selectedVariants={selectedVariants}
            setSelectedVariants={setSelectedVariants}
          />
        );
      }}
      scrollEnabled={false}
    />
  );
};

export default ProductVariants;
