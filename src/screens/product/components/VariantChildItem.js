import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Box, theme } from '@/atoms';

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
        style={item?.isSelected === true ? styles?.selectedItem : styles?.item}
      >
        <Text>{item?.value?.value}</Text>
      </Box>
    </TouchableOpacity>
  );
};

export default VariantChildItem;

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
    marginRight: 4,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 80,
  },
  selectedItem: {
    marginVertical: 4,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: 80,
    backgroundColor: theme.colors.lightGreen,
  },
});
