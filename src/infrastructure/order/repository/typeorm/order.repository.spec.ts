import "reflect-metadata";
import { DataSource } from "typeorm";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import CustomerModel from "../../../customer/repository/typeorm/customer.entity";
import ProductModel from "../../../product/repository/typeorm/product.entity";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import OrderItemModel from "./order-item.model";

describe("Order repository test", () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      logging: false,
      synchronize: true,
      entities: [CustomerModel, ProductModel, OrderModel, OrderItemModel],
    });

    await dataSource.initialize();

    // Create test data
    const customerRepository = dataSource.getRepository(CustomerModel);
    const productRepository = dataSource.getRepository(ProductModel);

    await customerRepository.save({
      id: "123",
      name: "Customer 1",
      street: "Street 1",
      number: 1,
      zipcode: "Zipcode 1",
      city: "City 1",
      active: true,
      rewardPoints: 0,
    });

    await productRepository.save({
      id: "123",
      name: "Product 1",
      price: 10,
    });

    await productRepository.save({
      id: "456",
      name: "Product 2",
      price: 20,
    });
  });

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it("should create a new order", async () => {
    const orderRepository = new OrderRepository(dataSource);

    const orderItem1 = new OrderItem("1", "Item 1", 10, "123", 1);
    const orderItem2 = new OrderItem("2", "Item 2", 20, "456", 2);

    const order = new Order("123", "123", [orderItem1, orderItem2]);

    await orderRepository.create(order);

    const orderModel = await dataSource.getRepository(OrderModel).findOne({
      where: { id: "123" },
      relations: ["items"],
    });

    expect(orderModel).toBeDefined();
    if (orderModel) {
      expect(orderModel.id).toBe("123");
      expect(orderModel.customer_id).toBe("123");
      expect(orderModel.total).toBe(50);
      expect(orderModel.items).toHaveLength(2);
      expect(orderModel.items[0].id).toBe("1");
      expect(orderModel.items[1].id).toBe("2");
    }
  });

  it("should find an order", async () => {
    const orderRepository = new OrderRepository(dataSource);

    const orderItem1 = new OrderItem("1", "Item 1", 10, "123", 1);
    const orderItem2 = new OrderItem("2", "Item 2", 20, "456", 2);

    const order = new Order("123", "123", [orderItem1, orderItem2]);

    await orderRepository.create(order);

    const orderResult = await orderRepository.find("123");

    expect(orderResult.id).toBe(order.id);
    expect(orderResult.customerId).toBe(order.customerId);
    expect(orderResult.items).toHaveLength(2);
    expect(orderResult.total()).toBe(50);
  });

  it("should throw error when order is not found", async () => {
    const orderRepository = new OrderRepository(dataSource);

    await expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const orderRepository = new OrderRepository(dataSource);

    const orderItem1 = new OrderItem("1", "Item 1", 10, "123", 1);
    const orderItem2 = new OrderItem("2", "Item 2", 20, "456", 2);

    const order1 = new Order("123", "123", [orderItem1]);
    const order2 = new Order("456", "123", [orderItem2]);

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders[0].id).toBe("123");
    expect(orders[1].id).toBe("456");
  });

  it("should update an order", async () => {
    const orderRepository = new OrderRepository(dataSource);

    const orderItem1 = new OrderItem("1", "Item 1", 10, "123", 1);
    const order = new Order("123", "123", [orderItem1]);

    await orderRepository.create(order);

    const orderItem2 = new OrderItem("2", "Item 2", 20, "456", 2);
    const updatedOrder = new Order("123", "123", [orderItem1, orderItem2]);

    await orderRepository.update(updatedOrder);

    const orderModel = await dataSource.getRepository(OrderModel).findOne({
      where: { id: "123" },
      relations: ["items"],
    });

    if (orderModel) {
      expect(orderModel.items).toHaveLength(2);
      expect(orderModel.total).toBe(50);
    }
  });
});
