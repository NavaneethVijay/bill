import { Router } from "express";
import Cart from "../../models/Cart.js";

const cartRoute = new Router();

cartRoute.post("/add", async (req, res) => {
  const { cart_id, sku, qty } = req.body;

  if (!cart_id || !sku || !qty) {
    res.status(400);
    res.json({ data: null, message: "missing required fields!" });
  }

  const cart = new Cart(cart_id);
  // Sync cart object with Database
  await cart.get();

  try {
    const { status, message, data } = await cart.addItem(sku, qty);
    res.json({
      status,
      message,
      data,
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
});

cartRoute.post("/remove", async (req, res) => {
  const { cart_id, cart_item_id } = req.body;

  if (!cart_id || !cart_item_id) {
    res.status(400);
    res.json({ data: null, message: "missing required fields!" });
  }

  const cart = new Cart(cart_id);
  await cart.get();
  try {
    const { status, message, data } = await cart.removeItem({
      cartId: cart_id,
      cartItemId: cart_item_id,
    });
    return res.json({
      status,
      message,
      data,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
});

cartRoute.post("/", async (req, res) => {
  const { cart_id } = req.body;

  if (typeof cart_id !== "number") {
    return res.json({
      data: null,
      status: false,
      message: "Invalid input received for cart_id, expected integer!",
    });
  }
  const cart = new Cart(cart_id);

  try {
    await cart.get();
    await cart.update();
    res.json({ data: cart.getData(), status: true, message: "Successful" });
  } catch (error) {
    res.json({ data: null, status: false, message: error.message });
  }
});

export default cartRoute;
