/* eslint-disable no-shadow */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import VariantChildItem from './VariantChildItem';
import { Box, Text } from '@/atoms';

const VariantParentItem = ({ item, setSelectedVariants }) => {
  for (const [key, values] of Object.entries(item)) {
    const [newArray, setNewArray] = useState([]);

    const getSelectedObject = dataArray => {
      return dataArray?.find(item => item.isSelected);
    };

    useEffect(() => {
      const selectedObject = getSelectedObject(newArray);
      if (selectedObject) {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          setSelectedVariants(selectedObject);
        });
      }
    }, [newArray]);

    useEffect(() => {
      // Function to add isSelected key
      const addIsSelectedKey = arr =>
        arr.map((obj, index) => ({
          ...obj,
          isSelected: index === 0,
          key,
        }));

      // Use effect to update newArray when item changes
      for (const [key, values] of Object.entries(item)) {
        const originalArray = values;
        const updatedArray = addIsSelectedKey(originalArray, key);
        setNewArray(updatedArray);
      }
    }, [item]);

    return (
      <Box flex={1} key={key}>
        <Box marginTop="s8">
          <Text variant="regular14LightBlack">
            {key.toString().toUpperCase()} :
          </Text>
          <FlatList
            data={newArray}
            keyExtractor={(item, index) => `${item.id || index}`}
            contentContainerStyle={{
              flexDirection: 'row',
              flexBasis: 1,
              justifyContent: 'space-between',
              paddingHorizontal: 4,
            }}
            numColumns={4}
            renderItem={({ item }) => (
              <VariantChildItem
                item={item}
                setNewArray={setNewArray}
                newArray={newArray}
              />
            )}
            scrollEnabled={false}
          />
        </Box>
      </Box>
    );
  }
};

export default VariantParentItem;
