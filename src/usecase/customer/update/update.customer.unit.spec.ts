import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import type { InputUpdateCustomerDto } from "./update.customer.dto";
import { UpdateCustomerUseCase } from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street 1", 1, "Zipcode 1", "City 1"),
);

const input: InputUpdateCustomerDto = {
  id: customer.id,
  name: "John Doe Updated",
  address: {
    street: "Street 1 Updated",
    number: 2,
    zip: "Zipcode 1 Updated",
    city: "City 1 Updated",
  },
};

const MockRepository = () => {
  return {
    find: vitest.fn().mockResolvedValue(customer),
    update: vitest.fn(),
    findAll: vitest.fn(),
    create: vitest.fn(),
  };
};

describe("Unit Test Update Customer Use Case", () => {
  it("should update a customer", async () => {
    // Arrange
    const customerRepository = MockRepository();
    const useCase = new UpdateCustomerUseCase(customerRepository);

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(input);
  });
});
