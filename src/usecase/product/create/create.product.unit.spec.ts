import type {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";
import { CreateProductUseCase } from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: vitest.fn(),
    findAll: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

const input: InputCreateProductDto = {
  name: "Product 1",
  price: 100,
  type: "a",
};

describe("Unit Test create product use case", () => {
  it("should create a product", async () => {
    // Arrange
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const expectedOutput: OutputCreateProductDto = {
      id: expect.any(String),
      name: input.name,
      price: input.price,
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(expectedOutput);
  });

  it("should throw an error when name is missing", async () => {
    // Arrange
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    // Act
    const act = async () => await usecase.execute({ ...input, name: "" });

    // Assert
    await expect(act).rejects.toThrow("Name is required");
  });

  it("should throw an error when price is negative", async () => {
    // Arrange
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    // Act
    const act = async () => await usecase.execute({ ...input, price: -1 });

    // Assert
    await expect(act).rejects.toThrow("Price must be greater than zero");
  });

  it("should throw an error when type is not supported", async () => {
    // Arrange
    const productRepository = MockRepository();
    const usecase = new CreateProductUseCase(productRepository);

    // Act
    const act = async () => await usecase.execute({ ...input, type: "c" });

    // Assert
    await expect(act).rejects.toThrow("Product type not supported");
  });
});
