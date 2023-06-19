import { useEffect, useState } from "react";
import SearchCustomer from "./components/searchCustomer";
import CreateCustomer from "./components/createCustomer";
import {
  searchCustomer,
  createCustomer,
  fetchCustomerCart,
  addProductToCart,
  removeItemFromCart,
  generateInvoice,
} from "./api/index";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

function renderProducts({ products, handleAddToCart }) {
  if (products && products.length) {
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {products.map((product) => (
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

function App() {
  const [products, setProducts] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [searchProducts, setSearchProducts] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState(null);
  const [isCustomerAvailable, setIsCustomerAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [billingInfo, setBillingInfo] = useState(null);

  useEffect(() => {
    async function getProducts() {
      const { data } = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products`
      ).then((res) => res.json());
      if (data) {
        setIsLoading(false);
        setProducts(data);
        setSearchProducts(data);
      }

      const { data: discountsData } = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/discounts`
      ).then((res) => res.json());
      if (discountsData) {
        setDiscounts(discountsData);
      }
    }

    async function fetchCart() {
      const { data } = await fetchCustomerCart(customer);
      if (data) {
        setCart(data);
      }
    }

    if (!products && customer) getProducts();
    if (!cart && customer && isCustomerAvailable) fetchCart();

    if (searchText !== "") {
      if (searchText.length > 2) {
        const tempProducts = products.filter((product) => {
          return (
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchText.toLowerCase())
          );
        });
        setSearchProducts(tempProducts);
      }
    }
  }, [customer, isCustomerAvailable, searchText]);

  function Loader() {
    if (!isLoading) {
      return null;
    }
    return (
      <div className="bg-white/70 absolute inset-0 flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  async function resetCart(){
    const { email } = customer
    setIsLoading(true);
    const { data } = await searchCustomer({email});
    setIsLoading(false);
    if (data && data?.status) {
      setIsCustomerAvailable(true);
      setCustomer(data);
      setBillingInfo(null);
      setCart(null);
    }
  }
  async function handleSearch(event) {
    event.preventDefault();
    const email = event.target.search.value;
    setIsLoading(true);
    const { data } = await searchCustomer({email});
    setIsLoading(false);
    if (data) {
      setIsCustomerAvailable(true);
      setCustomer(data);
    }
  }

  async function handleCustomerCreate(event) {
    event.preventDefault();
    setIsLoading(true);
    const { data } = await createCustomer(event);
    setIsLoading(false);
    if (data) {
      setIsCustomerAvailable(true);
      setCustomer(data);
    }
  }

  function renderCustomerSection() {
    return (
      <div>
        <h3 className="text-lg font-medium">Create New Transaction</h3>
        <div className="sm:w-1/4">
          <SearchCustomer handleSearch={handleSearch} />
        </div>
        <div>
          {!isCustomerAvailable ? (
            <CreateCustomer handleCustomerCreate={handleCustomerCreate} />
          ) : null}
        </div>
      </div>
    );
  }

  async function handleAddToCart(event) {
    event.preventDefault();
    const cart_id = customer?.cart?.cartId;
    const sku = event.target.sku.value;
    const qty = event.target.qty.value;
    setIsLoading(true);
    const { data, status } = await addProductToCart({
      cart_id,
      sku,
      qty,
    }).finally(() => {
      setIsLoading(false);
    });
    if (status) {
      setCart(data);
    }
  }

  async function fetchBilling() {
    if (customer) {
      setIsLoading(true);
      const billingData = await generateInvoice(customer);
      setIsLoading(false);
      if (billingData) {
        setBillingInfo(billingData);
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 ">
      <div className="w-full order-last sm:order-first sm:w-1/4 px-4 border-r-2 relative bg-gray-50">
        {customer ? (
          <>
            <h2 className="text-2xl font-bold mt-10 sm:mt-2 border-b py-2">
              Billing Info - {cart?.items.length} items{" "}
            </h2>
            <div className="flex flex-col gap-1 border-b py-4 sm:py-2 mb-2">
              <p>
                <span className="font-medium">Name:</span> {customer.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customer.email}
              </p>
              <p>
                <span className="font-medium">Mobile:</span> {customer.mobile}
              </p>
            </div>
          </>
        ) : null}
        <div>
          {customer && cart && cart.items.length ? (
            <>
              <ul className="flex flex-col gap-2 sm:max-h-[65vh] pb-4 overflow-auto ">
                {cart.items.map((item) => (
                  <li
                    key={item.sku}
                    className="flex py-6 bg-white shadow-sm border border-gray-500 p-4 rounded-lg"
                  >
                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.name}
                            </h3>
                            <p className="mt-0 text-sm text-gray-500">
                              {item.sku}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="ml-4 tex-lg font-bold">
                              {formatter.format(item.price)}
                            </p>
                            <p className="text-sm text-red-500">
                              {item.discount_value > 0 ? (
                                <>
                                  {formatter.format(item.discount_value)} off !
                                </>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 mt-4">Qty: {item.qty}</p>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={async () => {
                              const cart_id = customer?.cart?.cartId;
                              const cart_item_id = item.id;
                              setIsLoading(true);
                              const { status, data } = await removeItemFromCart(
                                {
                                  cart_id,
                                  cart_item_id,
                                }
                              );
                              setIsLoading(false);
                              if (status) {
                                setCart(data);
                              }
                            }}
                            className="font-medium text-emerald-600 hover:text-emerald-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
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
          ) : null}
          {cart && cart.items.length === 0 ? <p>No items in cart</p> : null}
        </div>
      </div>
      <div className="px-4 w-full sm:w-3/4 relative">
        <Loader />
        <h1 className="text-2xl font-bold my-10">
          Welcome ! {customer?.name}{" "}
        </h1>
        {customer ? (
          <input
            type="search"
            name="search"
            id="search"
            onInput={(event) => {
              setSearchText(event.target.value);
            }}
            value={searchText}
            placeholder="Search Products"
            className="my-4 block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
          />
        ) : null}
        {customer ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 items-start gap-2">
            <div className="col-span-2 sm:col-span-2">
              {renderProducts({
                products: searchText ? searchProducts : products,
                handleAddToCart,
              })}
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-yellow-200 rounded-lg shadow-lg">
              <h2 className="font-medium text-xl mb-4">
                Available Discounts !
              </h2>
              <div className="grid grid-cols-4 font-bold mb-2 gap-2 border-t border-b py-2 border-gray-600">
                <div className="break-all col-span-2">SKU</div>
                <div>Qty</div>
                <div>Discount</div>
              </div>
              <ul className="list-decimal ml-4">
                {discounts.map((discount) => (
                  <li key={discount.id}>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="break-all col-span-2">{discount.sku}</div>
                      <div> {discount.qty}</div>
                      <div> {formatter.format(discount.discount_value)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          renderCustomerSection()
        )}
      </div>
    </div>
  );
}

export default App;
