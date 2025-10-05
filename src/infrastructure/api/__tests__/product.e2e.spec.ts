import supertest from "supertest";
import ProductEntity from "../../product/repository/typeorm/product.entity";
import { app, typeorm } from "../express";

const request = supertest(app);

describe("E2E test for: Product", () => {
  beforeEach(async () => {
    await typeorm.getRepository(ProductEntity).clear();
  });

  afterAll(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should create a new product", async () => {
    const response = await request.post("/products").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: "Product 1",
      price: 100,
    });
  });

  it("should not create a product", async () => {
    const response = await request.post("/products").send({
      name: "Product 1",
      type: "a",
    });

    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    await request.post("/products").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    await request.post("/products").send({
      name: "Product 2",
      price: 200,
      type: "b",
    });

    const response = await request.get("/products").send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            price: expect.any(Number),
          }),
        ]),
      }),
    );
  });

  it("should find a product", async () => {
    const createResponse = await request.post("/products").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    const productId = createResponse.body.id;

    const response = await request.get(`/products/${productId}`).send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: productId,
      name: "Product 1",
      price: 100,
    });
  });

  it("should not find a product", async () => {
    const response = await request.get("/products/invalid-id").send();

    expect(response.status).toBe(500);
  });

  it("should update a product", async () => {
    const createResponse = await request.post("/products").send({
      name: "Product 1",
      price: 100,
      type: "a",
    });

    const productId = createResponse.body.id;

    const response = await request.put(`/products/${productId}`).send({
      name: "Product Updated",
      price: 150,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: productId,
      name: "Product Updated",
      price: 150,
    });
  });

  it("should not update a product", async () => {
    const response = await request.put("/products/invalid-id").send({
      name: "Product Updated",
      price: 150,
    });

    expect(response.status).toBe(500);
  });
});
