import type { DataSource, Repository } from "typeorm";
import type Order from "../../../../domain/checkout/entity/order";
import type OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";

export default class OrderRepository implements OrderRepositoryInterface {
  private orderRepository: Repository<OrderModel>;
  private orderItemRepository: Repository<OrderItemModel>;

  constructor(private dataSource: DataSource) {
    this.orderRepository = this.dataSource.getRepository(OrderModel);
    this.orderItemRepository = this.dataSource.getRepository(OrderItemModel);
  }

  async create(entity: Order): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const orderModel = manager.create(OrderModel, {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      });

      await manager.save(orderModel);

      const orderItemModels = entity.items.map((item) =>
        manager.create(OrderItemModel, {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        }),
      );

      await manager.save(OrderItemModel, orderItemModels);
    });
  }

  async update(entity: Order): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.update(OrderModel, entity.id, {
        customer_id: entity.customerId,
        total: entity.total(),
      });

      // Remove existing items
      await manager.delete(OrderItemModel, { order_id: entity.id });

      // Add new items
      const orderItemModels = entity.items.map((item) =>
        manager.create(OrderItemModel, {
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        }),
      );

      await manager.save(OrderItemModel, orderItemModels);
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await this.orderRepository.findOne({
      where: { id },
      relations: ["items"],
    });

    if (!orderModel) {
      throw new Error("Order not found");
    }

    // Reconstruct domain entities
    const OrderItem = (
      await import("../../../../domain/checkout/entity/order_item")
    ).default;
    const Order = (await import("../../../../domain/checkout/entity/order"))
      .default;

    const orderItems = orderModel.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        ),
    );

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await this.orderRepository.find({
      relations: ["items"],
    });

    const OrderItem = (
      await import("../../../../domain/checkout/entity/order_item")
    ).default;
    const Order = (await import("../../../../domain/checkout/entity/order"))
      .default;

    return orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map(
        (item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          ),
      );

      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }
}
