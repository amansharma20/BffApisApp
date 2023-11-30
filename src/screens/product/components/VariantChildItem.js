import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, theme, Text } from '@/atoms';

const VariantChildItem = ({ item, setNewArray, newArray }) => {
  const handlePress = () => {
    // Create an updatedArray with only the current item selected
    const updatedArray = newArray.map(prevItem => ({
      ...prevItem,
      isSelected: prevItem.value.name === item.value.name,
    }));

    // Update newArray with the updatedArray
    setNewArray(updatedArray);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Box
        style={[
          item?.isSelected === true ? styles?.selectedItem : styles?.item,
        ]}
      >
        <Text>{item?.value?.name}</Text>
      </Box>
    </TouchableOpacity>
  );
};

export default VariantChildItem;

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    marginRight: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedItem: {
    marginVertical: 4,
    marginRight: 4,
    padding: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.black,
  },
});
