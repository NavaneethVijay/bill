import { Router } from 'express';
const customerRoute = new Router();
import supabase from '../../db/supabase.js'

/**
 * Search customer by email and return cart and customer details
 */
customerRoute.post('/', async (req, res) => {
  const { email } = req.body

  if(!email){
    res.send('Send email');
  }

  const { data: customerData, error: err } = await supabase.from('customer').select("*").eq('email', email).single();
  if (customerData) {

    const { id, name, mobile, email } = customerData;
    const { data: cartData, error: cartrError } = await supabase.from('cart').select("*").eq('customer_id', id).single();

    if (!cartData) {
      console.log(`creating cart for customerId ${id}`);
      // Create a new cart and return the cart to add products
      const { data, error } = await supabase.from('cart').insert({
        customer_id: id,
      }).select()

      res.json({
        id,
        name,
        mobile,
        email,
        cart_id: data.id
      })

    } else {
      res.json({
        id,
        name,
        mobile,
        email,
        cart_id: cartData.id
      })
    }
  }
});

export default customerRoute;