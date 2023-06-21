import { useEffect } from "react";
import { connect } from "react-redux";
import store from "./store";
import { setProducts } from "./store/action";

import Cart from "./components/cart";
import CustomerSection from "./components/customerSection";
import ProductsList from "./components/productsList";
import Discounts from "./components/discounts";
import Loader from "./components/loader";

const mapStateToProps = ({ billingReducer }) => ({
  products: billingReducer.products,
  customer: billingReducer.customer,
  isLoading: billingReducer.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  setProductsData: (products) => dispatch(setProducts(products)),
});

function App({ products, customer, isLoading, setProductsData }) {
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products`
      ).then((res) => res.json());

      if (data) {
        setProductsData(data);
      }
      const { data: discountsData } = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/discounts`
      ).then((res) => res.json());

      if (discountsData) {
        store.dispatch({ type: "SET_DISCOUNTS", payload: discountsData });
      }
    }
    if (!products) fetchProducts();
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 ">
      <div className="w-full order-last sm:order-first sm:w-1/4 px-4 border-r-2 sm:fixed top-0 left-0 bottom-0 bg-gray-50">
        <div className="relative h-full">
          <Cart />
        </div>
      </div>
      <div className="px-4 w-full sm:w-3/4 sm:ml-auto relative">
        <Loader isLoading={isLoading} />
        <h1 className="text-2xl font-bold my-10">Welcome ! {customer?.name}</h1>

        {customer ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 items-start gap-2">
            <div className="col-span-2 sm:col-span-2 pb-10">
              <ProductsList />
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-yellow-200 rounded-lg shadow-lg">
              <Discounts />
            </div>
          </div>
        ) : (
          <CustomerSection />
        )}
      </div>
    </div>
  );
}

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
