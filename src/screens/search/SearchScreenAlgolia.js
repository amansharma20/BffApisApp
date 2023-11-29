/* eslint-disable react/no-unstable-nested-components */
import { Box, Text } from '@/atoms';
import React, { useEffect, useState, useRef } from 'react';

import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { IS_IOS } from '@/utils/appUtils';
import GoBackButton from '@/components/GoBackButton/GoBackButton';
import ProductItem from '@/components/ProductItem/ProductItem';
import { searchProducts } from '@/redux/searchApi/SearchApiAsyncThunk';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import ProductListShimmer from '@/components/shimmers/ProductListShimmer';
import { revertAll } from '@/redux/searchApi/SearchApiSlice';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  useSearchBox,
  useInfiniteHits,
  useInstantSearch,
} from 'react-instantsearch-core';
import { useNavigation } from '@react-navigation/native';
import config from '@/config';
import CollectionShimmer from '@/components/shimmers/CollectionShimmer';
const searchClient = algoliasearch(
  'JPGU0W12QM',
  'fdf9bb1eee77806d253fe20946b3d0b1',
);

const SearchScreenAlgolia = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box flex={1} flexDirection="column">
        <InstantSearch searchClient={searchClient} indexName="salesforce">
          <SearchBox />
          <InfiniteHits hitComponent={Hit} />
        </InstantSearch>
      </Box>
    </SafeAreaView>
  );
};

function Hit({ hit }) {
  return <Text>{hit.name}</Text>;
}

const SearchBox = props => {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyItemFlag, setEmptyItemFlag] = useState(false);

  const inputRef = useRef(null);
  function setQuery(newQuery) {
    setInputValue(newQuery);
    refine(newQuery);
  }
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  const dispatch = useAppDispatch();
  const handleSearch = () => {
    setIsLoading(true);
    dispatch(searchProducts(`sfcc/products-by-query/${inputValue}`)).then(
      resp => {
        if (resp?.payload?.data?.ProductData?.length == 0) {
          setEmptyItemFlag(true);
        }
        setIsLoading(false);
      },
    );
  };
  useEffect(() => {
    return () => {
      dispatch(revertAll());
      console.log('test'); // set reducer state empty array here.
    };
  }, []);
  return (
    <Box
      flexDirection="row"
      paddingHorizontal="s16"
      alignItems="center"
      paddingTop="s8"
    >
      <GoBackButton />
      <Box
        borderWidth={IS_IOS ? 0.5 : 1}
        borderColor="black"
        flexDirection="row"
        flex={1}
        height={32}
      >
        <TextInput
          ref={inputRef}
          value={inputValue}
          onChangeText={setQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          autoComplete="off"
          onSubmitEditing={handleSearch}
          style={styles.textInput}
        />
      </Box>
    </Box>
  );
};

function InfiniteHits({ hitComponent: Hit, ...props }) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { status } = useInstantSearch();
  console.log('status: ', status);

  const [isLoading, setIsLoading] = useState(false);
  const { hits, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  const renderSubCategory = ({ item }) => {
    const data = item?.Id ? item : item?.children?.[0];
    return (
      <Box padding="s14" style={{ backgroundColor: '#f5f5f5' }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductsByCategory', {
              item: data,
              isCategoryTrue: false,
            })
          }
        >
          <Hit hit={item} />
        </TouchableOpacity>
      </Box>
    );
  };
  return (
    <Box paddingHorizontal="s16">
      {status == 'stalled' ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={hits}
          keyExtractor={item => item.objectID}
          ItemSeparatorComponent={() => <Box style={styles.separator} />}
          onEndReached={() => {
            if (!isLastPage) {
              showMore();
            }
          }}
          renderItem={({ item }) => {
            const itemId = item?.objectID?.split('-')[0];
            const itemObject = {
              Id: itemId,
              name: item?.name,
            };
            return (
              <Box style={styles.item}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductsByCategory', {
                      item: itemObject,
                      isCategoryTrue: false,
                    })
                  }
                >
                  <Box paddingBottom="s10">
                    <Hit hit={item} />
                  </Box>
                </TouchableOpacity>
                {item?.hasChildren ? (
                  <FlatList
                    data={item?.children}
                    renderItem={renderSubCategory}
                    ItemSeparatorComponent={() => (
                      <Box style={styles.separator} />
                    )}
                  />
                ) : (
                  ''
                )}
              </Box>
            );
          }}
        />
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  productList: {
    paddingHorizontal: 16,
  },
  textInput: {
    width: '100%',
    fontSize: 12,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
  },

  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 18,
  },
});

export default SearchScreenAlgolia;
