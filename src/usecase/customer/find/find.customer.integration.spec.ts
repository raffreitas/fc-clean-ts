import { DataSource } from "typeorm";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/typeorm/customer.entity";
import CustomerRepository from "../../../infrastructure/customer/repository/typeorm/customer.repository";
import { FindCustomerUseCase } from "./find.customer.usecase";

describe("Test find customer use case", () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [CustomerModel],
    });

    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should find a customer", async () => {
    // Arrange
    const customerRepository = new CustomerRepository(dataSource);
    const useCase = new FindCustomerUseCase(customerRepository);

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

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
    expect(output).toEqual(expectedOutput);
  });
});
