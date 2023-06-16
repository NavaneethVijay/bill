import { Router } from 'express';
const products = new Router();


// Get all products
products.get('/', (req, res) => {
  res.json({});
});

export default products;