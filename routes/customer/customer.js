import { Router } from "express";
const customerRoute = new Router();
import supabase from "../../db/supabase.js";
import { createCartForCustomer, getFormattedCartInfo } from "../../lib/cartHelper.js";
import {
  getCustomer,
  getCustomerCart,
  generateInvoiceForCustomer,
} from "../../lib/customerHelper.js";

/**
 * Create new customer
 */
customerRoute.post("/create", async (req, res) => {
  const { email, name, mobile } = req.body;

  if (!email || !name || !mobile) {
    res.status(400);
    return res.json({ data: null, message: "missing required fields!" });
  }

  try {
    const { data, error } = await supabase
      .from("customer")
      .upsert({ email, name, mobile }, { onConflict: "email" })
      .select()
      .single();

    if (error) {
      res.status(500);
      return res.json({ data: null, message: "Error creating account" });
    }

    const cartData = await createCartForCustomer(data.id);

    const cartInfo = {
      cartId: cartData.id,
      items: cartData.cart_item ?? [],
      subtotal: cartData.subtotal,
      grand_total: cartData.grand_total,
      discount: cartData.discount,
      customer_id: cartData.customer_id,
    };

    return res.json({
      data: { ...data, cart: cartInfo },
      message: "Successfully created account",
    });
  } catch (error) {
    res.status(500);
    return res.json({ data: null, message: error.message });
  }
});

/**
 * Search customer by email and return cart and customer details
 */
customerRoute.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    return res.json({ data: null, message: "missing required fields!" });
  }

  try {
    const customerData = await getCustomer({ email });

    const { id: customerId } = customerData;

    const cartData = await getCustomerCart({ customerId });
    let cartInfo = getFormattedCartInfo(cartData);

    // Create new cart if it is not available
    if (!cartData) {
      const cart = await createCartForCustomer(customerId);
       cartInfo = getFormattedCartInfo(cart);

      return res.json({
        data: {
          ...customerData,
          cart: cartInfo,
        },
      });
    }

    return res.json({
      data: {
        ...customerData,
        cart: cartInfo,
      },
    });
  } catch (error) {
    res.status(500);
    res.json({ data: null, message: error.message });
  }
});

customerRoute.post("/invoice", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    return res.json({ data: null, message: "missing required fields!" });
  }

  try {
    // Create new invoice entry for customer
    // Mark current cart as in active
    const response = await generateInvoiceForCustomer({ email });
    res.json(response);
  } catch (error) {
    res.status(500);
    res.json({
      status: false,
      message: error.message,
    });
  }
});
export default customerRoute;
