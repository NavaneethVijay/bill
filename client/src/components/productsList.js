import {
  addProductToCart,
  fetchCustomerCart,
  searchCustomer,
} from "../api/index";
import { connect } from "react-redux";
import {
  setCartData,
  searchAction,
  setIsLoading,
  setBillingInfo,
  setCustomerData,
} from "../store/action";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

const mapStateToProps = (state) => ({
  products: state.billingReducer.products,
  searchProducts: state.billingReducer.searchProducts,
  searchText: state.billingReducer.searchText,
  customer: state.billingReducer.customer,
});

const mapDispatchToProps = (dispatch) => ({
  setCartData: (cart) => dispatch(setCartData(cart)),
  searchAction: (searchText) => dispatch(searchAction(searchText)),
  setIsLoading: (status) => dispatch(setIsLoading(status)),
  setBillingInfo: (info) => dispatch(setBillingInfo(info)),
  setCustomerData: (customer) => dispatch(setCustomerData(customer)),
});

function ProductsList({
  products,
  searchProducts,
  customer,
  setCartData,
  searchText,
  searchAction,
  setIsLoading,
  setCustomerData,
  setBillingInfo,
}) {
  async function handleAddToCart(event) {
    event.preventDefault();
    const cart_id = customer?.cart?.cartId;
    const sku = event.target.sku.value;
    const qty = event.target.qty.value;
    if(!isNaN(Number(qty))){
      try {
        setIsLoading(true);
        await addProductToCart({
          cart_id,
          sku,
          qty,
        });
        const { data } = await fetchCustomerCart(customer);
        setCartData(data);
        setIsLoading(false);
      } catch (error) {
        const { data } = await searchCustomer(customer);
        setCustomerData(data);
        const { data: cart } = await fetchCustomerCart(data);
        setCartData(cart);
        setBillingInfo(null);
        await addProductToCart({
          cart_id: cart.id,
          sku,
          qty,
        });
        const { data: updatedCart } = await fetchCustomerCart(data);
        setCartData(updatedCart);
      }
      setIsLoading(false);
    }

  }

  const productsToShow = searchText ? searchProducts : products;
  if (productsToShow && products.length) {
    return (
      <div>
        {customer ? (
          <input
            type="search"
            name="search"
            id="search"
            onInput={(event) => {
              searchAction(event.target.value);
            }}
            placeholder="Search Products"
            className="my-4 block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
          />
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {productsToShow.map((product) => (
            <div className="bg-white shadow p-4 rounded-lg" key={product.id}>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 text-sm">{product.sku}</p>
              <p className="font-medium mt-2">
                {formatter.format(product.price)}
              </p>
              <div>
                <form
                  onSubmit={handleAddToCart}
                  className="flex gap-2 items-center"
                >
                  <input type="hidden" name="sku" value={product.sku} />
                  <input
                    type="text"
                    name="qty"
                    defaultValue="1"
                    required
                    placeholder="Qty"
                    className="my-4 block w-1/4 h-10 rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    className="flex w-full h-10 items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-2 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    type="submit"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
