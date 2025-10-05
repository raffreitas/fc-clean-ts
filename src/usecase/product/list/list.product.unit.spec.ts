import ProductFactory from "../../../domain/product/factory/product.factory";
import { ListProductUseCase } from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product 1", 100);
const product2 = ProductFactory.create("a", "Product 2", 200);

const RepositoryMock = () => {
  return {
    find: vitest.fn(),
    findAll: vitest.fn().mockReturnValue([product1, product2]),
    create: vitest.fn(),
    update: vitest.fn(),
  };
};

describe("Unit Test List Product Use Case", () => {
  it("should list all products", async () => {
    // Arrange
    const productRepository = RepositoryMock();
    const useCase = new ListProductUseCase(productRepository);

    // Act
    const output = await useCase.execute();

    // Assert
    expect(output.products.length).toBe(2);
    expect(output.products[0]).toStrictEqual({
      id: product1.id,
      name: product1.name,
      price: product1.price,
    });
    expect(output.products[1]).toStrictEqual({
      id: product2.id,
      name: product2.name,
      price: product2.price,
    });
  });
});
