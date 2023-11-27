import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCollections } from '@/redux/collectionsApi/CollectionsApiAsyncThunk';
import { Box, Text, theme } from '@/atoms';
import CommonSearchHeader from '@/components/CommonSearchHeader/CommonSearchHeader';
import config from '@/config';
import CollectionShimmer from '@/components/shimmers/CollectionShimmer';

const CollectionsScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  const [categoriesData, setCategoriesData] = useState([]);

  const [expandedItem, setExpandedItem] = useState(firstItem);
  const animation = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();
  const categories = useSelector(
    state => state?.getCollectionsApiSlice?.collections?.data,
  );

  const firstItem = categories?.[0]?.Id || null;

  useEffect(() => {
    dispatch(getCollections(config.categoryTreeUrl));
  }, []);

  const handleItemPress = parent_Id => {
    setExpandedItem(expandedItem === parent_Id ? null : parent_Id);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    });
  };

  useEffect(() => {
    setExpandedItem(firstItem);
  }, [firstItem]);

  const renderSubCategory = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ProductsByCategory', {
            item: item,
          });
        }}
        style={styles.subCategoryItem}
      >
        <Text style={styles.expandedText}>{item?.name}</Text>
        <Text style={styles.expandedText}>→</Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => {
    const expandStyle = {
      maxHeight: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
      }),
      opacity: animation,
    };

    const onPressHeader = () => {
      if (item?.children?.length === 0) {
        navigation.navigate('ProductsByCategory', {
          item: item,
          isCategoryTrue: true,
        });
      } else {
        handleItemPress(item?.parent_Id);
      }
    };

    return (
      <Box>
        <TouchableOpacity
          style={styles.item}
          onPress={onPressHeader}
          activeOpacity={0.8}
        >
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>
              {item.name}{' '}
              {item?.children?.length !== 0 ? (
                <>
                  <Text>({item?.children?.length})</Text>
                </>
              ) : (
                <></>
              )}
            </Text>
            <Text>{expandedItem === item.parent_Id ? '-' : '+'}</Text>
          </View>

          {expandedItem === item.parent_Id && (
            <>
              <Animated.View style={[styles.expandedView, { expandStyle }]}>
                <FlatList
                  data={item?.children}
                  renderItem={renderSubCategory}
                  keyExtractor={item => item.parent_Id}
                  scrollEnabled={false}
                />
              </Animated.View>
            </>
          )}
        </TouchableOpacity>
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="white">
      <CommonSearchHeader />
      <Box
        flex={1}
        paddingHorizontal="paddingHorizontal"
        pt="s16"
        backgroundColor="background"
      >
        <Box paddingBottom="s16">
          <Text variant="bold18">Collections</Text>
        </Box>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          // keyExtractor={item => item.nodeId.toString()}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            isLoading ? <CollectionShimmer /> : <Text>EMPTY LIST</Text>
          }
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  itemContainer: { justifyContent: 'space-between', flexDirection: 'row' },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandedView: {
    marginTop: 12,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  expandedText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  subCategoryItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default CollectionsScreen;
