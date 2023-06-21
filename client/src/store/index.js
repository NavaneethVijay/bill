import { configureStore } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  products: null,
  searchProducts: null,
  discounts: [],
  customer: null,
  isCustomerAvailable: false,
  cart: null,
  searchText: "",
  billingInfo: null,
};

function billingReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case "SET_CART":
      return {
        ...state,
        cart: payload,
      };
    case "SET_BILLING_INFO":
      return {
        ...state,
        billingInfo: payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: payload,
      };
    case "SEARCH_PRODUCTS":
      if (!payload) {
        return {
          ...state,
          searchProducts: state.products,
          searchText: "",
        };
      }
      if (payload.length > 2) {
        const tempProducts = state.products.filter((product) => {
          return (
            product.name.toLowerCase().includes(payload.toLowerCase()) ||
            product.sku.toLowerCase().includes(payload.toLowerCase())
          );
        });
        return {
          ...state,
          searchProducts: tempProducts,
          searchText: payload,
        };
      }
      return state;
    case "SET_PRODUCTS":
      return {
        ...state,
        products: payload,
        searchProducts: payload,
      };
    case "SET_DISCOUNTS":
      return {
        ...state,
        discounts: payload,
      };
    case "SET_CUSTOMER":
      return {
        ...state,
        customer: payload,
        isCustomerAvailable: true,
      };
    default:
      return state;
  }
}

export default configureStore({
  reducer: {
    billingReducer,
  },
});
