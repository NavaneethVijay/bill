const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

export default function CartItem({ item, onRemove }) {
  return (
    <li
      key={item.sku}
      className="flex py-6 bg-white shadow-sm border border-gray-500 p-4 rounded-lg"
    >
      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="mt-0 text-sm text-gray-500">{item.sku}</p>
            </div>
            <div className="text-right">
              <p className="ml-4 tex-lg font-bold">
                {formatter.format(item.price)}
              </p>
              <p className="text-sm text-red-500">
                {item.discount_value > 0 ? (
                  <>{formatter.format(item.discount_value)} off !</>
                ) : null}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <p className="text-gray-500 mt-4">Qty: {item.qty}</p>

          <div className="flex">
            <button
              onClick={() => onRemove({cart_item_id: item.id})}
              type="button"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
