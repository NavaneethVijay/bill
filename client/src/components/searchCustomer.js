import { useState } from "react";
import { searchCustomer, fetchCustomerCart } from "../api/index.js";
import { setCartData, setCustomerData, setIsLoading } from "../store/action";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  customer: state.billingReducer.customer,
});
const mapDispatchToProps = (dispatch) => ({
  setCustomerData: (customer) => dispatch(setCustomerData(customer)),
  setCartData: (cart) => dispatch(setCartData(cart)),
  setIsLoading: (status) => dispatch(setIsLoading(status)),
});

function SearchCustomer({
  setCustomerData,
  setCartData,
  customer,
  setIsLoading,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.search.value;
    setIsLoading(true);
    searchCustomer({ email })
      .then(async (res) => {
        const { data } = res;
        if (data) {
          setCustomerData(data);
          const { data: cart } = await fetchCustomerCart(data);
          setCartData(cart);
        }
      })
      .catch((error) => {
        setErrorMessage("Customer not available, Please create an account !");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="search"
          id="search"
          placeholder="Search for email"
          required
          className="my-4 block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
        />
        <button
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-2 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          type="submit"
        >
          Search for Customer
        </button>
        {errorMessage ? (
          <div className="bg-amber-50 p-2 mt-4 border-l-4 border-amber-500 text-amber-800 ">
            {errorMessage}
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCustomer);
