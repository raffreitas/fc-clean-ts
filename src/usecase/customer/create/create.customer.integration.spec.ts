import { DataSource } from "typeorm";
import CustomerModel from "../../../infrastructure/customer/repository/typeorm/customer.entity";
import CustomerRepository from "../../../infrastructure/customer/repository/typeorm/customer.repository";
import { CreateCustomerUseCase } from "./create.customer.usecase";

describe("Test create customer use case", () => {
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

  it("should create a customer", async () => {
    // Arrange
    const customerRepository = new CustomerRepository(dataSource);
    const useCase = new CreateCustomerUseCase(customerRepository);

    const input = {
      name: "Customer 1",
      address: {
        street: "Street 1",
        number: 1,
        zip: "Zipcode 1",
        city: "City 1",
      },
    };

    const expectedOutput = {
      id: expect.any(String),
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
