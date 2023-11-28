import React from 'react';
import { Box, Text } from '@/atoms';
import { Image } from 'react-native';

const OrderItem = ({ item }) => {
  return (
    <Box
      borderRadius={8}
      borderColor="border"
      borderWidth={1}
      mb="s8"
      padding="s8"
      flex={1}
    >
      <Box flexDirection="row" backgroundColor="white">
        <Box alignItems="center" mr="s8">
          <Box height={120} width={120}>
            <Image
              style={{ height: 120, width: 120, resizeMode: 'contain' }}
              source={{
                uri: item?.imageUrl,
              }}
            />
          </Box>
        </Box>
        <Box justifyContent="space-between">
          <Box width={'90%'}>
            <Text variant="bold14">{item?.productId}</Text>
            <Text variant="bold14" style={{ marginTop: 4 }}>
              ${item?.priceTotal}
            </Text>
          </Box>
          <Box width={'90%'}>
            <Text>Quantity: {item?.quantity}</Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderItem;
