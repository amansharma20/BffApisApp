import Config from 'react-native-ultimate-config';

export const { ENV } = Config;

const environments = {
  vtex: {
    baseUrl: 'http://103.113.36.20:9005/',
    addToCart: 'vtex/additem',
    collections: {
      newArrivals: 'vtex/new-arrivals',
      bestSelling: 'vtex/best-selling-products',
    },
    productsDetailsById: 'vtex/product-by-id',
    categoryTree: 'vtex/category-tree',
    productsByCategory: 'vtex/products-by-category',
    productsBySubCategory: 'vtex/products-by-sub-category',
    createCart: 'vtex/createCart',
    login: 'vtex/login',
  },
  spryker: {
    baseUrl: 'http://103.113.36.20:9005/',
    addToCart: 'spryker/addItems',
    collections: {
      newArrivals: 'spryker/new-arrivals',
      bestSelling: 'spryker/best-selling-products',
    },
    productsDetailsById: 'spryker/product-by-id',
    categoryTree: 'spryker/category-tree',
    productsByCategory: 'spryker/products-by-category',
    productsBySubCategory: 'spryker/products-by-sub-category',
    createCart: 'spryker/createCart',
    login: 'spryker/login',
  },
  sfcc: {
    baseUrl: 'http://103.113.36.20:9005/',
    productsDetailsById: 'sfcc/product-by-id',
    addToCart: 'sfcc/addItem',
    collections: {
      newArrivals: 'sfcc/new-arrivals',
      bestSelling: 'sfcc/best-selling-products',
    },
    categoryTree: 'sfcc/category-tree',
    productsByCategory: 'sfcc/products-by-category',
    productsBySubCategory: 'sfcc/products-by-sub-category',
    createCart: 'sfcc/createCart',
    login: 'sfcc/login',
  },
  nx: {
    // baseUrl: 'http://localhost:4000/',
    // cartUrl: 'http://localhost:4001/',
    // loginUrl: 'http://localhost:4002/',
    // checkoutUrl: 'http://localhost:4003/',
    baseUrl: 'https://ecomm-dev-catalogue.up.railway.app/',
    cartUrl: 'https://ecomm-dev-cart.up.railway.app/',
    // baseUrl: 'https://catalogue-mobile.up.railway.app/',
    // cartUrl: 'https://cart-mobile.up.railway.app/',
    loginUrl: 'https://ecomm-dev-login.up.railway.app/',
    checkoutUrl: 'https://ecomm-dev-checkout.up.railway.app/',

    productsDetailsById: 'product-by-id',
    addToCart: 'addItemCart',
    addToGuestCart: 'guestAddItemCart',
    collections: {
      newArrivals: 'new-arrivals',
      bestSelling: 'best-selling-products',
    },
    categoryTree: 'category-tree',
    productsByCategory: 'products-by-category',
    productsBySubCategory: 'products-by-sub-category',
    createCart: 'createCart',
    login: 'login',
  },
};

export default {
  app: {
    isSfcc: ENV === 'sfcc',
    isSpryker: ENV === 'spryker',
    isVtex: ENV === 'vtex',
    isNx: ENV === 'nx',
  },
  baseUrl: environments[ENV].baseUrl,
  cartUrl: environments[ENV].cartUrl,
  checkoutUrl: environments[ENV].checkoutUrl,
  collections: {
    newArrivals: environments[ENV].collections.newArrivals,
    bestSelling: environments[ENV].collections.bestSelling,
  },
  productsDetailsById: environments[ENV].productsDetailsById,
  addToCartUrl: environments[ENV].addToCart,
  addToGuestCartUrl: environments[ENV].addToGuestCart,
  categoryTreeUrl: environments[ENV].categoryTree,
  productsByCategoryUrl: environments[ENV].productsByCategory,
  productsBySubCategoryUrl: environments[ENV].productsBySubCategory,
  createCartUrl: environments[ENV].createCart,
  loginUrl: environments[ENV].loginUrl,
};
