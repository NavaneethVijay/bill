import supabase from '../db/supabase.js'
export default class CartItem {

  setData({
    cartId,
    sku,
    name,
    price,
    qty
  }) {
    this.cartId = cartId;
    this.sku = sku;
    this.name = name;
    this.quantity = qty;
    this.price = price
  }

  async save() {
    const { data, error } = await supabase.from('cart_item').insert({
      cart_id: this.cartId,
      sku: this.sku,
      qty: this.quantity,
      name: this.name,
      price: this.price
    }).select();

    if (error) {
      console.log('error saving cart Item');
      console.log(error);
    }

    if (data) {
      this.cartItemId = data.id;
    }
  }
}