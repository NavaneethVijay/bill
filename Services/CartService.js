import supabase from "../lib/supabase.js"
import Cart from "../Model/Cart.js";
import CartItemService from "./CartItemService.js";
import ProductService from './ProductService.js'

export default class CartService {

  async getCartById(cartId) {
    try {
      const { data: cart, error } = await supabase
        .from("cart")
        .select(
          `*, cart_item(
                id,
                cart_id,
                sku,
                name,
                price,
                regular_price,
                discount_value,
                qty
            )`
        )
        .eq('id', cartId)
        .eq("is_active", true)
        .single();

      if (error || !cart) {
        console.error(error);
        throw new Error(`Cart with ID ${cartId} not found !`);
      }
      return new Cart(cart);
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addItemToCart({ cartId, sku, qty }) {
    return new Promise(async (resolve, reject) => {
      const productService = new ProductService();
      const product = await productService.getProductBySku(sku);

      if (!product) {
        reject(new Error("Invalid Product !"));
      }
      const cartItem = new CartItemService({ cartId, product, qty });

      try {
        await cartItem.save();
        await this.updateTotals(cartId);
        resolve();
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async removeItemFromCart({ cartId, cart_item_id }) {
    return new Promise(async (resolve, reject) => {
      const cartItem = new CartItemService({ cartId, cart_item_id });
      try {
        await cartItem.remove();
        await this.updateTotals(cartId);
        resolve();
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  }

  async updateTotals(cartId) {
    const cart = await this.getCartById(cartId);
    cart.calculateTotals();
    await supabase
      .from("cart")
      .update({
        subtotal: cart.subtotal,
        grand_total: cart.grand_total,
        discount: cart.discount,
      })
      .eq("id", cart.id);
  }
}
