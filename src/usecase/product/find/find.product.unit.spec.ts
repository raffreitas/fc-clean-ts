import Product from "../../../domain/product/entity/product";
import { FindProductUseCase } from "./find.product.usecase";

const product = new Product("123", "Product 1", 100);

const RepositoryMock = () => {
  return {
    find: vitest.fn().mockReturnValue(product),
    findAll: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

describe("Unit Test find product use case", () => {
  it("should find a product", async () => {
    // Arrange
    const productRepository = RepositoryMock();
    const useCase = new FindProductUseCase(productRepository);
    const input = { id: "123" };
    const expectedOutput = {
      id: "123",
      name: "Product 1",
      price: 100,
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(expectedOutput);
  });

  it("should not find a product", async () => {
    // Arrange
    const productRepository = RepositoryMock();
    productRepository.find.mockRejectedValue(new Error("Product not found"));
    const useCase = new FindProductUseCase(productRepository);
    const input = { id: "123" };

    // Act
    const act = async () => await useCase.execute(input);

    // Assert
    await expect(act).rejects.toThrow("Product not found");
  });
});
