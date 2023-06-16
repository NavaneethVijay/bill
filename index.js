import express from "express";
import bodyParser from "body-parser";
import { productsRouter } from "./routes/products/index.js";
import { cartRouter } from "./routes/cart/index.js";
import { customerRouter } from "./routes/customer/index.js";

const app = express();
app.use(bodyParser.json());

// Mounting Products Router
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/customer", customerRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
