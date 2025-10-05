import { DataSource } from "typeorm";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import CustomerModel from "../../../infrastructure/customer/repository/typeorm/customer.entity";
import CustomerRepository from "../../../infrastructure/customer/repository/typeorm/customer.repository";
import { ListCustomerUseCase } from "./list.customer.usecase";

describe("Test list customer use case", () => {
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

  it("should list all customers", async () => {
    // Arrange
    const customerRepository = new CustomerRepository(dataSource);
    const useCase = new ListCustomerUseCase(customerRepository);

    const customer1 = new Customer("123", "Customer 1");
    const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer1.changeAddress(address1);

    const customer2 = new Customer("456", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);

    await customerRepository.create(customer1);
    await customerRepository.create(customer2);

    // Act
    const output = await useCase.execute();

    // Assert
    expect(output.customers.length).toBe(2);
    expect(output.customers[0]).toEqual({
      id: "123",
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "Zipcode 1",
        city: "City 1",
      },
    });
    expect(output.customers[1]).toEqual({
      id: "456",
      name: "Customer 2",
      address: {
        street: "Street 2",
        number: 2,
        zip: "Zipcode 2",
        city: "City 2",
      },
    });
  });
});
