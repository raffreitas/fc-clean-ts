import supertest from "supertest";
import CustomerEntity from "../../customer/repository/typeorm/customer.entity";
import { app, typeorm } from "../express";

const request = supertest(app);

describe("E2E test for: Customer", () => {
  beforeEach(async () => {
    await typeorm.getRepository(CustomerEntity).clear();
  });

  afterAll(async () => {
    if (typeorm?.isInitialized) {
      await typeorm.destroy();
    }
  });

  it("should create a new customer", async () => {
    const response = await request.post("/customers").send({
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });
  });

  it("should not create a customer", async () => {
    const response = await request.post("/customers").send({
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        zip: "12345",
      },
    });

    expect(response.status).toBe(500);
  });

  it("should list all customers", async () => {
    await request.post("/customers").send({
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });

    await request.post("/customers").send({
      name: "Jane Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });

    const response = await request.get("/customers").send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        customers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            address: expect.objectContaining({
              street: expect.any(String),
              city: expect.any(String),
              zip: expect.any(String),
              number: expect.any(Number),
            }),
          }),
        ]),
      }),
    );

    const listResponseXML = await request
      .get("/customers")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`,
    );
    expect(listResponseXML.text).toContain(`<customers>`);
    expect(listResponseXML.text).toContain(`<customer>`);
    expect(listResponseXML.text).toContain(`<name>John Doe</name>`);
    expect(listResponseXML.text).toContain(`<address>`);
    expect(listResponseXML.text).toContain(`<street>Main St</street>`);
    expect(listResponseXML.text).toContain(`<city>Anytown</city>`);
    expect(listResponseXML.text).toContain(`<number>123</number>`);
    expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
    expect(listResponseXML.text).toContain(`</address>`);
    expect(listResponseXML.text).toContain(`</customer>`);
    expect(listResponseXML.text).toContain(`<name>Jane Doe</name>`);
    expect(listResponseXML.text).toContain(`<street>Main St</street>`);
    expect(listResponseXML.text).toContain(`</customers>`);
  });

  it("should find a customer", async () => {
    const createResponse = await request.post("/customers").send({
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });

    const customerId = createResponse.body.id;

    const response = await request.get(`/customers/${customerId}`).send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: customerId,
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });
  });

  it("should not find a customer", async () => {
    const response = await request.get("/customers/invalid-id").send();

    expect(response.status).toBe(500);
  });

  it("should update a customer", async () => {
    const createResponse = await request.post("/customers").send({
      name: "John Doe",
      address: {
        street: "Main St",
        city: "Anytown",
        number: 123,
        zip: "12345",
      },
    });

    const customerId = createResponse.body.id;

    const response = await request.put(`/customers/${customerId}`).send({
      name: "John Updated",
      address: {
        street: "Updated St",
        city: "Updated City",
        number: 456,
        zip: "54321",
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: customerId,
      name: "John Updated",
      address: {
        street: "Updated St",
        city: "Updated City",
        number: 456,
        zip: "54321",
      },
    });
  });

  it("should not update a customer", async () => {
    const response = await request.put("/customers/invalid-id").send({
      name: "John Updated",
      address: {
        street: "Updated St",
        city: "Updated City",
        number: 456,
        zip: "54321",
      },
    });

    expect(response.status).toBe(500);
  });
});
