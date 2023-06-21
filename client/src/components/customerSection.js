import SearchCustomer from "./searchCustomer";
import CreateCustomer from "./createCustomer";

export default function CustomerSection() {
  return (
    <div>
      <h3 className="text-lg font-medium">Create New Transaction</h3>
      <div className="sm:w-1/4">
        <SearchCustomer />
      </div>
      <div>
        <CreateCustomer />
      </div>
    </div>
  );
}
