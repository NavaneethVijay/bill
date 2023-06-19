function CreateCustomer({handleCustomerCreate}) {
  return (
    <form onSubmit={handleCustomerCreate} className="mt-10 sm:w-1/4 ">
      <h3 className="text-lg font-medium">Create Account</h3>
      <input
        type="text"
        name="name"
        id="name"
        required
        placeholder="Name"
        className="my-4 w-full block rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
      />
      <input
        type="email"
        name="email"
        id="email"
        required
        placeholder="Email"
        className="my-4 w-full block rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
      />
      <input
        type="text"
        name="mobile"
        id="mobile"
        required
        placeholder="Mobile"
        className="my-4 w-full block rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
      />
      <button
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-emerald-600 px-8 py-2 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        type="submit"
      >
        Create
      </button>
    </form>
  );
}
export default CreateCustomer
