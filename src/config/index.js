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
    baseUrl: 'https://catalogue-mobile.up.railway.app/',
    cartUrl: 'https://cart-mobile.up.railway.app/',
    productsDetailsById: 'product-by-id',
    addToCart: 'addItem',
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
  collections: {
    newArrivals: environments[ENV].collections.newArrivals,
    bestSelling: environments[ENV].collections.bestSelling,
  },
  productsDetailsById: environments[ENV].productsDetailsById,
  addToCartUrl: environments[ENV].addToCart,
  categoryTreeUrl: environments[ENV].categoryTree,
  productsByCategoryUrl: environments[ENV].productsByCategory,
  productsBySubCategoryUrl: environments[ENV].productsBySubCategory,
  createCartUrl: environments[ENV].createCart,
  loginUrl: environments[ENV].login,
};
