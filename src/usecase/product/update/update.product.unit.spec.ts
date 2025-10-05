import ProductFactory from "../../../domain/product/factory/product.factory";
import type { InputUpdateProductDto } from "./update.product.dto";
import { UpdateProductUseCase } from "./update.product.usecase";

const product = ProductFactory.create("a", "Product 1", 100);

const input: InputUpdateProductDto = {
  id: product.id,
  name: "Product 1 Updated",
  price: 150,
};

const MockRepository = () => {
  return {
    find: vitest.fn().mockResolvedValue(product),
    update: vitest.fn(),
    findAll: vitest.fn(),
    create: vitest.fn(),
  };
};

describe("Unit Test Update Product Use Case", () => {
  it("should update a product", async () => {
    // Arrange
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toStrictEqual(input);
  });
});
