import express from "express";
import bodyParser from "body-parser";
import { productsRouter } from "./Routes/products/index.js";
import { cartRouter } from "./Routes/cart/index.js";
import { customerRouter } from "./Routes/customer/index.js";
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors())

// Mounting Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/customer", customerRouter);

const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
