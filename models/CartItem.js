import supabase from "../db/supabase.js";
import { getProductDiscounts } from "../lib/productHelper.js";

export default class CartItem {
  constructor() {
    this.price = 0;
    this.regular_price = 0;
    this.discount_value = 0;
  }

  setData({ cartId, product, qty }) {
    this.cartId = cartId;
    this.product = product;
    this.qty = qty;
  }

  getData() {
    return {
      cartId: this.cartId,
      sku: this.product.sku,
      name: this.product.name,
      price: this.price,
      regular_price: this.regular_price,
      qty: this.qty,
      discount_value: this.discount_value,
    };
  }

  async save() {
    const discountData = await getProductDiscounts(this.product.sku);
    this.price = this.product.price * this.qty;
    this.regular_price = this.product.price * this.qty;

    if (discountData && discountData.length) {
      // Find Discount for the purchasing Qty
      const discount = discountData.find(
        (discount) => discount.qty == this.qty
      );
      // If there a discount for purchasing Qty
      if (discount) {
        const { discount_value } = discount;
        this.price = this.price - discount_value;
      }
    }

    this.discount_value = this.regular_price - this.price;
    const finalData = {
      cart_id: this.cartId,
      sku: this.product.sku,
      qty: this.qty,
      name: this.product.name,
      price: this.price,
      regular_price: this.regular_price,
      discount_value: this.discount_value,
    };

    // TODO:: Move this to Helper
    const { data, error } = await supabase
      .from("cart_item")
      .select("*")
      .eq("cart_id", this.cartId)
      .eq("sku", this.product.sku)
      .single();

    if (data) {
      // Update Qty
      console.log("updating cart item");
      const { error } = await supabase
        .from("cart_item")
        .update(finalData)
        .eq("id", data.id);
      if (error) {
        console.log("error saving cart Item");
        console.log(error);
      }
    } else {
      // Add new Item
      const { error } = await supabase.from("cart_item").insert(finalData);
      if (error) {
        console.log("error saving cart Item");
        console.log(error);
      }
    }
  }
}
