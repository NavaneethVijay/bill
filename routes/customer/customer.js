import { Router } from "express";
import { getFormattedCartInfo } from "../../lib/cartHelper.js";
import CustomerService from "../../Services/CustomerService.js";

const customerRoute = new Router();

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
    const customerService = new CustomerService();
    const customer = await customerService.createCustomer({
      email,
      name,
      mobile,
    });
    if (!customer) {
      res.status(500);
      return res.json({
        message: "Something went wrong while creating customer",
      });
    }
    const cartData = await customerService.createCart(customer.id);

    const cartInfo = {
      cartId: cartData.id,
      items: cartData.cart_item ?? [],
      subtotal: cartData.subtotal,
      grand_total: cartData.grand_total,
      discount: cartData.discount,
      customer_id: cartData.customer_id,
    };

    return res.json({
      data: { ...customer, cart: cartInfo },
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
    const customerService = new CustomerService();
    const customer = await customerService.getCustomer({ email });

    const { id: customerId } = customer;

    const cartData = await customerService.getCart({ customerId });
    let cartInfo = getFormattedCartInfo(cartData);

    // Create new cart if it is not available
    if (!cartData) {
      const cart = await customerService.createCart(customerId);
      cartInfo = getFormattedCartInfo(cart);

      return res.json({
        data: {
          ...customer,
          cart: cartInfo,
        },
      });
    }

    return res.json({
      data: {
        ...customer,
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
    const customerService = new CustomerService();
    const response = await customerService.generateInvoiceForCustomer({
      email,
    });
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
