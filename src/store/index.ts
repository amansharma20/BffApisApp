import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import thunkMiddleware from 'redux-thunk';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  Storage,
} from 'redux-persist';
import { ThunkDispatch } from 'redux-thunk';
import { MMKV } from 'react-native-mmkv';
import { api } from '../services/api';
import theme from './theme';
import getProductsByCategoryApiSlice from '../redux/productsApi/ProductsApiSlice';
import getProductDetailsApiSlice from '../redux/productDetails/ProductDetailsApiSlice';
import getNewArrivalApiSlice from '../redux/newArrivalApi/NewArrivalApiSlice';
import getBestSellingsApiSlice from '../redux/bestSellingProductApi/BestSellingProductApiSlice';
import getCollectionsApiSlice from '../redux/collectionsApi/CollectionsApiSlice';
import getProductsBySubCategoryApiSlice from '../redux/productsBySubCategory/SubCategoryProductsApiSlice';
import getCustomerDetailsApiSlice from '../redux/profileApi/ProfileApiSlice';
import getCustomerBasketApiSlice from '../redux/basket/BasketApiSlice';
import createCustomerBasketSlice from '../redux/createBasketApi/CreateBasketApiSlice';
import getCustomerCartItemsAliSlice from '../redux/cartItemsApi/CartItemsSlice';
import getOrdersDataApiSlice from '../redux/ordersApi/OrdersApiSlice';
import getShippmentMethodsApiSlice from '../redux/shippmentMethodApi/ShippmentMethodApiSlice';

const reducers = combineReducers({
  theme,
  createCustomerBasketSlice,
  getCustomerDetailsApiSlice,
  getCustomerCartItemsAliSlice,
  getCustomerBasketApiSlice,
  getProductsByCategoryApiSlice,
  getProductDetailsApiSlice,
  getNewArrivalApiSlice,
  getBestSellingsApiSlice,
  getCollectionsApiSlice,
  getProductsBySubCategoryApiSlice,
  getOrdersDataApiSlice,
  getShippmentMethodsApiSlice,
  [api.reducerPath]: api.reducer,
});

export const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['theme', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  // middleware: getDefaultMiddleware => {
  //   const middlewares = getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }).concat(api.middleware);

  //   if (__DEV__ && !process.env.JEST_WORKER_ID) {
  //     const createDebugger = require('redux-flipper').default;
  //     middlewares.push(createDebugger());
  //   }

  //   return middlewares;
  // },
  middleware: [thunkMiddleware],
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type ThunkDispatch = typeof store.dispatch;
