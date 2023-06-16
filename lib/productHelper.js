import supabase from '../db/supabase.js'

export async function getProductBySku(sku) {
    const { data, error } = await supabase.from('products')
        .select("*")
        .eq('sku', sku)
        .single();
    if (error) {
        console.log(error);
        return false;
    }
    return data
}

export async function getProductDiscounts(sku) {
    const { data, error } = supabase.from('discounts')
        .select('*')
        .eq('sku', sku)
        .single();// possible
    if (error) {
        console.log(error);
        return false;
    }
    return data;
}