import { Router } from "express";
import CartService from "../../Services/CartService.js";

const cartRoute = new Router();

cartRoute.post("/add", async (req, res) => {
  const { cart_id, sku, qty } = req.body;

  if (!cart_id || !sku || !qty) {
    res.status(400);
    res.json({ status: false, message: "Missing required fields!" });
  }

  const cartService = new CartService();

  try {
    await cartService.addItemToCart({ cartId: cart_id, sku, qty });
    res.json({
      status: true,
      message: "Successfully added to cart!",
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: false,
      message: error.message,
    });
  }
});

cartRoute.post("/remove", async (req, res) => {
  const { cart_id, cart_item_id } = req.body;

  if (!cart_id || !cart_item_id) {
    res.status(400);
    res.json({ status: false, message: "missing required fields!" });
  }

  const cartService = new CartService();

  try {
    await cartService.removeItemFromCart({ cartId: cart_id, cart_item_id });
    res.json({
      status: true,
      message: "Successfully removed from cart!",
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: false,
      message: error.message,
    });
  }
});

cartRoute.get("/get/:cart_id", async (req, res) => {
  const { cart_id } = req.params;
  const cartService = new CartService();

  try {
    const cart = await cartService.getCartById(cart_id);
    res.json({ data: cart, status: true, message: "Success" });
  } catch (error) {
    res.json({ data: null, status: false, message: error.message });
  }
});

export default cartRoute;
