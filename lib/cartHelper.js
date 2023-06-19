import supabase from "../db/supabase.js";

export async function createCartForCustomer(customerId) {
  const { data: currentData, error: currentDataError } = await supabase
    .from("cart")
    .select("*")
    .eq("customer_id", customerId)
    .eq("is_active", true);

  if (currentData && currentData.length > 0) {
    return currentData[0];
  }
  const { data, error } = await supabase
    .from("cart")
    .insert({
      customer_id: customerId,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.log("error from cart");
    throw new Error("cart error");
  }
  return data;
}
/**
 * Retreive cart from Database
 * @param {*} id
 * @returns
 */
export async function getCart(id) {
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
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    throw new Error("No active cart found");
  }
  return data;
}

export async function updateCart({
  id,
  customer_id,
  subtotal,
  grand_total,
  discount,
  is_active = true,
}) {
  const { data, error } = await supabase
    .from("cart")
    .update({
      customer_id,
      subtotal,
      grand_total,
      discount,
    })
    .eq("id", id)
    .select();
  console.log(error);
  return data;
}

export async function removeItemFromCart({ cartId, cartItemId }) {
  const { error } = await supabase
    .from("cart_item")
    .delete()
    .eq("id", cartItemId)
    .eq("cart_id", cartId);

  if (error) {
    return false;
  }
  return true;
}

export function getFormattedCartInfo(cart) {
  return {
    cartId: cart.id,
    items: cart.cart_item,
    subtotal: cart.subtotal,
    grand_total: cart.grand_total,
    discount: cart.discount,
    customer_id: cart.customer_id,
  };
}
