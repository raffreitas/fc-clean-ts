import type {
  InputCreateCustomerDto,
  OutputCreateCustomerDto,
} from "./create.customer.dto";
import { CreateCustomerUseCase } from "./create.customer.usecase";

const MockRepository = () => {
  return {
    find: vitest.fn(),
    findAll: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

const input: InputCreateCustomerDto = {
  name: "Customer 1",
  address: {
    street: "Street 1",
    number: 1,
    zip: "Zipcode 1",
    city: "City 1",
  },
};

describe("Unit Test create customer use case", () => {
  it("should create a customer", async () => {
    // Arrange
    const customerRepository = MockRepository();
    const useCase = new CreateCustomerUseCase(customerRepository);

    const expectedOutput: OutputCreateCustomerDto = {
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(expectedOutput);
  });

  it("should throw an error when name is missing", async () => {
    // Arrange
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    // Act
    const act = async () => await usecase.execute({ ...input, name: "" });

    // Assert
    await expect(act).rejects.toThrow("Name is required");
  });

  it("should throw an error when street is missing", async () => {
    // Arrange
    const customerRepository = MockRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    // Act
    const act = async () =>
      await usecase.execute({
        ...input,
        address: { ...input.address, street: "" },
      });

    // Assert
    await expect(act).rejects.toThrow("Street is required");
  });
});
