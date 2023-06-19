import { Router } from "express";
import supabase from "../../db/supabase.js";

const products = new Router();

/**
 * Fetches all products table data
 */
products.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id,sku,name,price");
    res.json({ data });
  } catch (error) {
    res.status(500);
    res.json({ data: null, message: error.message });
  }
});

/**
 * Fetches all discounts table data
 */
products.get("/discounts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("discounts")
      .select("id,sku,qty,discount_value");
    res.json({ data });
  } catch (error) {
    res.status(500);
    res.json({ data: null, message: error.message });
  }
});

export default products;
