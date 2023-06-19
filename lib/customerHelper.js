import supabase from "../db/supabase.js";

export async function getCustomer({ email, customerId }) {
  if (email) {
    const { data, error } = await supabase
      .from("customer")
      .select("*")
      .eq("email", email)
      .single();
    if (error) {
      console.log(error);
      throw new Error("Customer does not exists !");
    }
    return data;
  }
  if (customerId) {
    const { data, error } = await supabase
      .from("customer")
      .select("*")
      .eq("id", customerId)
      .single();
    if (error) {
      console.log(error);
      throw new Error("Customer does not exists !");
    }
    return data;
  }
}

export async function getCustomerCart({ customerId }) {
  const { data, error } = await supabase
    .from("cart")
    .select(
      `
      *, cart_item(
        id,
        sku,
        name,
        price,
        regular_price,
        qty,
        discount_value,
        discount_type
      )
    `
    )
    .eq("customer_id", customerId)
    .eq("is_active", true);
  if (error) {
    console.log(error);
    throw new Error("Error fetching cart!");
  }

  if (data.length) {
    return data[0];
  }
  return false;
}

export async function generateInvoiceForCustomer({ email }) {
  const {
    id: customer_id,
    name,
    email: customer_email,
    mobile,
  } = await getCustomer({ email });
  const { id: cart_id, grand_total } = await getCustomerCart({
    customerId: customer_id,
  });
  if(grand_total == 0 ){
    return {
      status: false,
      cart: null,
      customer: {
        name: name,
        email: customer_email,
        mobile,
      },
    };
  }

  if (cart_id) {
    const { data, error } = await supabase
      .from("invoice")
      .insert({
        customer_id,
        cart_id,
        status: "paid",
      })
      .select()
      .single();
    if (error) {
      console.log(error);
    }
    if (data) {
      const { data: cartData } = await supabase
        .from("cart")
        .update({ is_active: false })
        .eq("id", cart_id)
        .select()
        .single();
      return {
        status: true,
        ...data,
        cart: cartData,
        customer: {
          name: name,
          email: customer_email,
          mobile,
        },
      };
    }
  }
  return {
    status: false,
    cart: null,
    customer: {
      name: name,
      email: customer_email,
      mobile,
    },
  };
}
