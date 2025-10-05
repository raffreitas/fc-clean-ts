import { DataSource } from "typeorm";
import ProductModel from "../../../infrastructure/product/repository/typeorm/product.entity";
import ProductRepository from "../../../infrastructure/product/repository/typeorm/product.repository";
import { CreateProductUseCase } from "./create.product.usecase";

describe("Test create product use case", () => {
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

  it("should create a product", async () => {
    // Arrange
    const productRepository = new ProductRepository(dataSource);
    const useCase = new CreateProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      price: 100,
      type: "a",
    };

    const expectedOutput = {
      id: expect.any(String),
      name: "Product 1",
      price: 100,
    };

    // Act
    const output = await useCase.execute(input);

    // Assert
    expect(output).toEqual(expectedOutput);
  });
});
