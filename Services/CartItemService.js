import supabase from "../lib/supabase.js";
import ProductService from "./ProductService.js";

export default class CartItemService {
  constructor({ cartId, product, qty, cart_item_id } = {}) {
    this.id = cart_item_id;
    this.price = 0;
    this.regular_price = 0;
    this.discount_value = 0;
    this.cartId = cartId;
    this.product = product;
    this.qty = qty;
  }

  async remove() {
    const { error } = await supabase
      .from("cart_item")
      .delete()
      .eq("id", this.id)
      .eq("cart_id", this.cartId);

    if (error) {
      console.error(error);
      throw new Error(
        "Error while removing product, please check cart_item_id."
      );
    }
  }

  async save() {
    try {
      const productService = new ProductService();
      const discountData = await productService.getProductDiscounts(
        this.product.sku
      );
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

      const { data } = await supabase
        .from("cart_item")
        .select("*")
        .eq("cart_id", this.cartId)
        .eq("sku", this.product.sku)
        .single();

      if (data) {
        // Update Qty
        const { error } = await supabase
          .from("cart_item")
          .update(finalData)
          .eq("id", data.id);
        if (error) {
          console.error(error.message);
          throw new Error("error updating cart Item");
        }
      } else {
        // Add new Item
        const { error } = await supabase.from("cart_item").insert(finalData);
        if (error) {
          console.error(error.message);
          throw new Error("error saving cart Item");
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong while adding product!");
    }
  }
}
