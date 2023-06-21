export default class Cart {
  constructor(cart) {
    const { id, subtotal, grand_total, discount, customer_id, cart_item } =
      cart;
    this.id = id;
    this.subtotal = subtotal;
    this.grand_total = grand_total;
    this.discount = discount;
    this.customer_id = customer_id;
    this.items = cart_item;
  }

  calculateTotals() {
    if (this.items.length === 0) {
      this.subtotal = 0;
      this.grand_total = 0;
      this.discount = 0;
    }
    if (this.items.length > 0) {
      let subtotal = 0;
      let grandTotal = 0;
      let discount = 0;
      this.items.map((item) => {
        subtotal = subtotal + item.price;
        grandTotal = grandTotal + item.regular_price;
        discount = discount + item.discount_value;
      });

      this.subtotal = subtotal;
      this.grand_total = grandTotal;
      this.discount = discount;
    }
  }
}
