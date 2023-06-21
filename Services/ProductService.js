import supabase from "../lib/supabase.js"

export default class ProductService {
  async getProductBySku(sku) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("sku", sku)
      .single();
    if (error) {
      return false;
    }
    return data;
  }

  async getProductDiscounts(sku) {
    const { data, error } = await supabase
      .from("discounts")
      .select("*")
      .eq("sku", sku);

    if (error) {
      return false;
    }
    return data;
  }

  async getDiscounts() {
    const { data, error } = await supabase.from("discounts").select("*");
    return data;
  }
}
