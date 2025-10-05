import { DataSource } from "typeorm";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/typeorm/product.entity";
import ProductRepository from "../../../infrastructure/product/repository/typeorm/product.repository";
import { ListProductUseCase } from "./list.product.usecase";

describe("Test list product use case", () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [ProductModel],
    });

    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should list all products", async () => {
    // Arrange
    const productRepository = new ProductRepository(dataSource);
    const useCase = new ListProductUseCase(productRepository);

    const product1 = new Product("123", "Product 1", 100);
    const product2 = new Product("456", "Product 2", 200);

    await productRepository.create(product1);
    await productRepository.create(product2);

    // Act
    const output = await useCase.execute();

    // Assert
    expect(output.products.length).toBe(2);
    expect(output.products[0]).toEqual({
      id: "123",
      name: "Product 1",
      price: 100,
    });
    expect(output.products[1]).toEqual({
      id: "456",
      name: "Product 2",
      price: 200,
    });
  });
});
