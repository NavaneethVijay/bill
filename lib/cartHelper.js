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
