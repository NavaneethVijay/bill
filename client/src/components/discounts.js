import { connect } from "react-redux";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

const mapStateToProps = (state) => ({
  discounts: state.billingReducer.discounts,
});

export function Discounts({ discounts }) {
  return (
    <>
      <h2 className="font-medium text-xl mb-4">Available Discounts !</h2>
      <div className="grid grid-cols-4 font-bold mb-2 gap-2 border-t border-b py-2 border-gray-600">
        <div className="break-all col-span-2">SKU</div>
        <div>Qty</div>
        <div>Discount</div>
      </div>
      <ul className="list-decimal ml-4">
        {discounts.map((discount) => (
          <li key={discount.id}>
            <div className="grid grid-cols-4 gap-2">
              <div className="break-all col-span-2">{discount.sku}</div>
              <div> {discount.qty}</div>
              <div> {formatter.format(discount.discount_value)}</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default connect(mapStateToProps, null)(Discounts);
