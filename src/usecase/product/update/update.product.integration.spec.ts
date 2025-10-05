import { DataSource } from "typeorm";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/typeorm/product.entity";
import ProductRepository from "../../../infrastructure/product/repository/typeorm/product.repository";
import { UpdateProductUseCase } from "./update.product.usecase";

describe("Test update product use case", () => {
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

  it("should update a product", async () => {
    // Arrange
    const productRepository = new ProductRepository(dataSource);
    const useCase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product 1", 100);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product 1 Updated",
      price: 150,
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toEqual(input);
  });
});
