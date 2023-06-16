import { Router } from 'express';
import Cart from '../../models/Cart.js';

const cartRoute = new Router();

cartRoute.post('/add', async (req, res) => {
  const { cart_id, sku, qty } = req.body
  const cart = new Cart(cart_id);
  // Sync cart object with Database
  await cart.get();

  cart.addItem(sku, qty)
    .then(() => {
      res.json({
        status: true,
        message: "Successfully added !"
      })
    })
    // .catch(error => {
    //   res.status(500)
    //   res.json({
    //     status: false,
    //     message: error.message
    //   })
    // })
});


cartRoute.get('/remove', (req, res) => {
  const { cart_id, cart_item_id} = req.body
  res.send('Removing item to cart')
});


cartRoute.get('/', async (req, res) => {
  const { cart_id} = req.body
  const cart = new Cart(cart_id);
  // Sync cart object with Database
  await cart.get();
  res.json(cart)
});



export default cartRoute;