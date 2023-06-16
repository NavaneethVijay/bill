import CartItem from './CartItem.js';
import supabase from '../db/supabase.js'
import { getProductBySku, getProductDiscounts } from '../lib/productHelper.js'
import { getCart, saveCart } from '../lib/cartHelper.js'

export default class Cart {

  constructor(cartId) {
    this.cartId = cartId;
    this.items = []
  }

  async get() {
    const data = await getCart(this.cartId)

    if (!data) {
      throw new Error('Error fetching customer cart');
    }

    const { subtotal, grand_total, discount, customer_id, cart_item } = data
    this.customer_id = customer_id;
    this.subtotal = subtotal;
    this.grand_total = grand_total;
    this.discount = discount;
    this.items = cart_item
    this.calculateTotal();
  }

  async save() {
    await this.get();
    const data = {
      customer_id: this.customer_id,
      subtotal: this.subtotal,
      grand_total: this.grand_total,
      discount: this.discount
    }
    await saveCart(data);
  }

  async addItem(sku, qty = 1) {
    const product = await getProductBySku(sku);

    if (!product) {
      throw new Error('Invalid Product !')
    }

    let finalPrice = product.price * qty
    const discountData = await getProductDiscounts(sku)

    if (discountData) {
      const { qty: discountQty, discount_value, discount_type } = discountData

      switch (discount_type) {
        case 'fixed':
          if (qty === discountQty) {
            finalPrice = finalPrice - discount_value
            this.discount = discount_value
            await this.save();
          }
          break;

        default:
          if (qty === discountQty) {
            finalPrice = finalPrice - discount_value
          }
          break;
      }
    }

    const item = new CartItem();
    item.setData({
      cartId: this.cartId,
      sku: product.sku,
      name: product.name,
      price: finalPrice,
      qty: product.qty
    })
    await item.save();
    this.items.push(item);
    await this.save();
  }

  calculateTotal() {
    if (this.items.length > 0) {
      const subtotal = this.items.reduce((acc, item) => acc + item.price, 0)
      this.subtotal = subtotal
    }
    return 0;
  }
}
