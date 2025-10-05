import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import { FindCustomerUseCase } from "./find.customer.usecase";

const customer = new Customer("123", "Customer 1");
const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
customer.changeAddress(address);

const RepositoryMock = () => {
  return {
    find: vitest.fn().mockReturnValue(customer),
    findAll: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

describe("Unit Test find customer use case", () => {
  it("should find a customer", async () => {
    // Arrange
    const customerRepository = RepositoryMock();
    const useCase = new FindCustomerUseCase(customerRepository);
    const input = { id: "123" };
    const expectedOutput = {
      id: "123",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "Zipcode 1",
        city: "City 1",
      },
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(expectedOutput);
  });

  it("should not find a customer", async () => {
    // Arrange
    const customerRepository = RepositoryMock();
    customerRepository.find.mockRejectedValue(new Error("Customer not found"));
    const useCase = new FindCustomerUseCase(customerRepository);
    const input = { id: "123" };

    // Act
    const act = async () => await useCase.execute(input);

    // Assert
    await expect(act).rejects.toThrow("Customer not found");
  });
});
