import supabase from '../db/supabase.js'

/**
 * Retreive cart from Database
 * @param {*} id
 * @returns
 */
export async function getCart(id) {
    const { data, error } = await supabase.from('cart').select(`
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
    `).eq('id', id).single();

    if (error) {
        console.log(error);
        return false;
    }
    return data;
}

export async function saveCart({
  customer_id,
  subtotal,
  grand_total,
  discount,
  is_active = true
}){
  //
}