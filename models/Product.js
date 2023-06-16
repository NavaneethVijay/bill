export default class Product {
    constructor({sku, name, price, discounts = []}) {
      this.sku = sku;
      this.name = name;
      this.price = price;
      this.discounts = discounts;
    }
  }