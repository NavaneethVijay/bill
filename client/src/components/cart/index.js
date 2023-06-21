import CartItem from "./cartItem";
import { connect } from "react-redux";
import {
  removeItemFromCart,
  fetchCustomerCart,
  generateInvoice,
  searchCustomer,
} from "../../api";
import {
  setCartData,
  setIsLoading,
  setBillingInfo,
  setCustomerData,
} from "../../store/action";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

const mapStateToProps = ({ billingReducer }) => ({
  customer: billingReducer.customer,
  cart: billingReducer.cart,
  billingInfo: billingReducer.billingInfo,
});

const mapDispatchToProps = (dispatch) => ({
  setCartData: (cart) => dispatch(setCartData(cart)),
  setIsLoading: (status) => dispatch(setIsLoading(status)),
  setBillingInfo: (info) => dispatch(setBillingInfo(info)),
  setCustomerData: (customer) => dispatch(setCustomerData(customer)),
});

function Cart({
  cart,
  customer,
  billingInfo,
  setCartData,
  setIsLoading,
  setBillingInfo,
  setCustomerData,
}) {
  async function handleOnRemove({ cart_item_id }) {
    setIsLoading(true);
    await removeItemFromCart({ cart_id: cart.id, cart_item_id });
    const { data } = await fetchCustomerCart(customer);
    setCartData(data);
    setIsLoading(false);
  }

  async function resetCart() {
    setIsLoading(true);
    const { data } = await searchCustomer(customer);
    setCustomerData(data);
    const { data: cart } = await fetchCustomerCart(customer);
    setCartData(cart);
    setBillingInfo(null);
    setIsLoading(false);
  }

  async function fetchBilling() {
    try {
      setIsLoading(true);
      const data = await generateInvoice(customer);
      setIsLoading(false);
      setBillingInfo(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!customer) {
    return null;
  }
  return (
    <>
      <h2 className="text-2xl font-bold mt-10 sm:mt-2 border-b py-2">
        Billing Info - {cart?.items.length} items
      </h2>
      <div className="flex flex-col gap-1 border-b py-4 sm:py-2 mb-2">
        <p>
          <span className="font-medium">Name:</span> {customer?.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {customer?.email}
        </p>
        <p>
          <span className="font-medium">Mobile:</span> {customer?.mobile}
        </p>
      </div>
      {cart && cart.items.length ? (
        <>
          <ul className="flex flex-col gap-2 sm:max-h-[65vh] pb-4 overflow-auto ">
            {cart.items.map((item) => (
              <CartItem
                key={item.sku}
                cartId={cart.id}
                item={item}
                onRemove={handleOnRemove}
              />
            ))}
          </ul>

          <div className="sm:absolute bottom-0 mt-10 sm:mt-0 left-0 right-0 p-4 bg-white rounded-lg">
            <dl className="divide-y w-full divide-gray-400">
              <div className="px-4 py-2 grid grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-md font-medium leading-6 text-gray-900">
                  Subtotal
                </dt>
                <dd className="mt-1 text-md leading-6 font-bold text-gray-700 text-right sm:mt-0">
                  {formatter.format(cart.subtotal)}
                </dd>
              </div>
              <div className="px-4 py-2 grid grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-md font-medium leading-6 text-gray-900">
                  Discount
                </dt>
                <dd className="mt-1 text-md font-bold leading-6 text-gray-700 text-right sm:mt-0">
                  {formatter.format(cart.discount)}
                </dd>
              </div>
              <div className="px-4 py-2 grid grid-cols-2 sm:gap-4 sm:px-0">
                <dt className="text-lg font-bold leading-6 text-gray-900">
                  Grand Total
                </dt>
                <dd className="mt-1 text-lg leading-6 font-bold text-gray-700 text-right sm:mt-0">
                  {formatter.format(cart.grand_total)}
                </dd>
              </div>
            </dl>
            <div>
              {billingInfo ? (
                <div className="bg-emerald-100 p-4 rounded-lg mb-2">
                  <p>
                    <span className="font-bold">Invoice ID: </span>
                    {billingInfo?.invoice_id}
                  </p>
                  <span className="font-bold">Status: </span>
                  {billingInfo?.status}
                  <button
                    onClick={resetCart}
                    className="flex mt-4 w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-2 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    type="button"
                  >
                    Create New
                  </button>
                </div>
              ) : (
                <button
                  onClick={fetchBilling}
                  className="flex mt-4 w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-2 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  type="button"
                >
                  Generate Bill
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No items in cart</p>
      )}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
