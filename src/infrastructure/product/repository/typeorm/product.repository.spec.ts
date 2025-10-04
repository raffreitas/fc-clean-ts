import "reflect-metadata";
import { DataSource } from "typeorm";
import Product from "../../../../domain/product/entity/product";
import ProductModel from "./product.entity";
import ProductRepository from "./product.repository";

describe("Product repository test", () => {
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
    const productRepository = new ProductRepository(dataSource);
    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    const productModel = await dataSource
      .getRepository(ProductModel)
      .findOne({ where: { id: "123" } });

    expect(productModel).toMatchObject({
      id: "123",
      name: "Product 1",
      price: 100,
    });
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository(dataSource);
    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    product.changeName("Product 2");
    product.changePrice(200);

    await productRepository.update(product);

    const productModel = await dataSource
      .getRepository(ProductModel)
      .findOne({ where: { id: "123" } });

    expect(productModel).toMatchObject({
      id: "123",
      name: "Product 2",
      price: 200,
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository(dataSource);
    const product = new Product("123", "Product 1", 100);

    await productRepository.create(product);

    const productResult = await productRepository.find("123");

    expect(productResult).toStrictEqual(product);
  });

  it("should throw error when product is not found", async () => {
    const productRepository = new ProductRepository(dataSource);

    await expect(async () => {
      await productRepository.find("456ABC");
    }).rejects.toThrow("Product not found");
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository(dataSource);
    const product1 = new Product("123", "Product 1", 100);
    const product2 = new Product("456", "Product 2", 200);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const products = await productRepository.findAll();

    expect(products).toHaveLength(2);
    expect(products).toContainEqual(product1);
    expect(products).toContainEqual(product2);
  });
});