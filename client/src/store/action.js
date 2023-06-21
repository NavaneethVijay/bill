export function setProducts(payload) {
  return {
    type: "SET_PRODUCTS",
    payload: payload,
  }
}
export function setIsLoading(payload){
  return{
    type: "SET_LOADING",
    payload: payload
  }
}
export function setCustomerData(payload){
  return{
    type: "SET_CUSTOMER",
    payload: payload
  }
}
export function setCartData(payload){
  return {
    type: "SET_CART",
    payload: payload
  }
}

export function searchAction(searchText){
  return {
    type: "SEARCH_PRODUCTS",
    payload: searchText
  }
}

export function setBillingInfo(payload){
  return {
    type: "SET_BILLING_INFO",
    payload: payload
  }
}