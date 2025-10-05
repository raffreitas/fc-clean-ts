import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import { ListCustomerUseCase } from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street 1", 1, "Zipcode 1", "City 1"),
);
const customer2 = CustomerFactory.createWithAddress(
  "Jane Doe",
  new Address("Street 2", 2, "Zipcode 2", "City 2"),
);

const RepositoryMock = () => {
  return {
    find: vitest.fn(),
    findAll: vitest.fn().mockReturnValue([customer1, customer2]),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

describe("Unit Test List Customer Use Case", () => {
  it("should list all customers", async () => {
    // Arrange
    const customerRepository = RepositoryMock();
    const useCase = new ListCustomerUseCase(customerRepository);

    // Act
    const output = await useCase.execute();

    // Assert
    expect(output.customers.length).toBe(2);
    expect(output.customers[0]).toStrictEqual({
      id: customer1.id,
      name: customer1.name,
      address: {
        street: customer1.address.street,
        number: customer1.address.number,
        zip: customer1.address.zip,
        city: customer1.address.city,
      },
    });
    expect(output.customers[1]).toStrictEqual({
      id: customer2.id,
      name: customer2.name,
      address: {
        street: customer2.address.street,
        number: customer2.address.number,
        zip: customer2.address.zip,
        city: customer2.address.city,
      },
    });
  });
});
