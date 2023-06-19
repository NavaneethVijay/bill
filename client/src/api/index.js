export async function searchCustomer({email}) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/customer`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  }).then((res) => res.json());
}

export async function createCustomer(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const name = event.target.name.value;
  const mobile = event.target.mobile.value;

  return fetch(`${process.env.REACT_APP_API_BASE_URL}/customer/create/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      mobile,
    }),
  }).then((res) => res.json());
}

export async function fetchCustomerCart(customer) {
  console.log("fetching customer cart");
  console.log(customer);
  if (customer) {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id: customer.cart.cartId,
      }),
    }).then((res) => res.json());
  }
}

export async function addProductToCart({ cart_id, sku, qty }) {
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_id,
      sku,
      qty,
    }),
  }).then((res) => res.json());
}


export async function removeItemFromCart({cart_id, cart_item_id}){
  return fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/remove`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cart_id,
      cart_item_id
    }),
  }).then((res) => res.json());
}

export async function generateInvoice(customer) {
  if (customer) {
    return fetch(`${process.env.REACT_APP_API_BASE_URL}/customer/invoice`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
      }),
    }).then((res) => res.json());
  }
}
