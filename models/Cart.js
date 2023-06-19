import CartItem from "./CartItem.js";
import { getProductBySku } from "../lib/productHelper.js";
import { getCart, updateCart, removeItemFromCart } from "../lib/cartHelper.js";

export default class Cart {
  constructor(cartId) {
    this.cartId = cartId;
    this.items = [];
  }

  /**
   * Return required cart info from the model
   * @returns Object
   */
  getData() {
    return {
      cartId: this.cartId,
      items: this.items,
      subtotal: this.subtotal,
      grand_total: this.grand_total,
      discount: this.discount,
      customer_id: this.customer_id,
    };
  }
  /**
   * Sync Cart from Database
   */
  async get() {
    const data = await getCart(this.cartId);
    if (!data) {
      throw new Error("Error fetching customer cart");
    }
    const { subtotal, grand_total, discount, customer_id, cart_item } = data;
    this.customer_id = customer_id;
    this.subtotal = subtotal;
    this.grand_total = grand_total;
    this.discount = discount;
    this.items = cart_item;
    this.calculateTotal();
  }

  /**
   * Update the cart with latest data
   */
  async update() {
    await this.get();
    this.calculateTotal();
    const data = {
      id: this.cartId,
      customer_id: this.customer_id,
      subtotal: this.subtotal,
      grand_total: this.grand_total,
      discount: this.discount,
    };
    await updateCart(data);
  }

  /**
   * Adds new product to Shopping Cart
   * @param {String} sku
   * @param {Number} qty
   */
  async addItem(sku, qty = 1) {
    return new Promise(async (resolve, reject) => {
      const product = await getProductBySku(sku);

      if (!product) {
        reject(new Error("Invalid Product !"));
      }

      const item = new CartItem();
      item.setData({
        cartId: this.cartId,
        product,
        qty,
      });
      await item.save();
      await this.update();
      resolve({
        status: true,
        message: "Successfully added !",
        data: this.getData(),
      });
    });
  }

  /**
   * Removes an Item from cart
   * @param {cartId, cartItemId}
   * @returns Boolean
   */
  async removeItem({ cartId, cartItemId }) {
    return new Promise(async (resolve, reject) => {
      const status = await removeItemFromCart({ cartId, cartItemId });
      if (!status) {
        reject(
          new Error("Error while removing product, please check cart_item_id.")
        );
      }
      await this.update();
      resolve({
        status,
        message: "Successfully updated cart",
        data: this.getData(),
      });
    });
  }

  /**
   * Recalculates new totals for the cart.
   */
  calculateTotal() {
    if (this.items.length === 0) {
      this.subtotal = 0;
      this.grand_total = 0;
      this.discount = 0;
    }
    if (this.items.length > 0) {
      let subtotal = 0;
      let grandTotal = 0;
      let discount = 0;
      this.items.map((item) => {
        subtotal = subtotal + item.price;
        grandTotal = grandTotal + item.regular_price;
        discount = discount + item.discount_value;
      });

      this.subtotal = subtotal;
      this.grand_total = grandTotal;
      this.discount = discount;
    }
  }
}
