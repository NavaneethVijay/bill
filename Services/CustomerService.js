import supabase from "../lib/supabase.js"
import Customer from "../Model/Customer.js";
export default class CustomerService {
  async getCustomer({ email, customerId }) {
    if (email) {
      const { data, error } = await supabase
        .from("customer")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.error(error);
        throw new Error("Customer does not exists !");
      }
      return new Customer(data);
    }
    if (customerId) {
      const { data, error } = await supabase
        .from("customer")
        .select("*")
        .eq("id", customerId)
        .single();

      if (error) {
        console.error(error);
        throw new Error("Customer does not exists !");
      }
      return data;
    }
  }

  async createCustomer({ email, name, mobile }) {
    try {
      const { data: customer, error } = await supabase
        .from("customer")
        .upsert({ email, name, mobile }, { onConflict: "email" })
        .select()
        .single();

      if (error || !customer) {
        console.error(error);
        throw new Error(`Error while creating customer`);
      }
      return customer;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCart({ customerId }) {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        *, cart_item(
          id,
          sku,
          name,
          price,
          regular_price,
          qty,
          discount_value,
          discount_type
        )
      `
      )
      .eq("customer_id", customerId)
      .eq("is_active", true);
    if (error) {
      console.log(error);
      throw new Error("Error fetching cart!");
    }

    if (data.length) {
      return data[0];
    }
    return false;
  }

  async createCart(customerId) {
    try {
      const { data: currentData, error: currentDataError } = await supabase
        .from("cart")
        .select("*")
        .eq("customer_id", customerId)
        .eq("is_active", true);

      if (currentData && currentData.length > 0) {
        return currentData[0];
      }

      if (currentDataError) {
        console.error(error);
        throw new Error(
          `Error fetching customer info with customerId: ${customerId}`
        );
      }

      const { data: cart, error } = await supabase
        .from("cart")
        .insert({
          customer_id: customerId,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        throw new Error(
          `Error creating new cart for customer customerId: ${customerId}`
        );
      }
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generateInvoiceForCustomer({ email }) {
    const {
      id: customer_id,
      name,
      email: customer_email,
      mobile,
    } = await this.getCustomer({ email });

    const { id: cart_id, grand_total } = await this.getCart({
      customerId: customer_id,
    });

    if (!cart_id) {
      throw new Error(`No active cart for customer with email: ${email}`);
    }

    // Skip invoice for 0 total cart
    if (grand_total == 0) {
      throw new Error("Can not create Inovice for empty Cart!");
    }

    // Create new invoice enty
    const { data: invoiceData, error } = await supabase
      .from("invoice")
      .insert({
        customer_id,
        cart_id,
        status: "paid",
      })
      .select()
      .single();

    if (!invoiceData || error) {
      console.error(error);
      throw new Error(
        `Something went wrong while creating invoice for email : ${email}`
      );
    }

    // Mark cart as inactive
    if (invoiceData) {
      const { error } = await supabase
        .from("cart")
        .update({ is_active: false })
        .eq("id", cart_id);

      if (error) {
        console.error(error);
        throw new Error(`Error while updating cart with id ${cart_id}`);
      }

      return {
        status: true,
        ...invoiceData,
        customer: {
          name: name,
          email: customer_email,
          mobile,
        },
      };
    }
  }
}
