import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import ProductModel from "../../../product/repository/typeorm/product.entity";
import OrderModel from "./order.model";

@Entity({ name: "order_items" })
export default class OrderItemModel {
  @PrimaryColumn({ type: "varchar" })
  declare id: string;

  @Column({ type: "varchar", nullable: false })
  declare product_id: string;

  @ManyToOne(() => ProductModel)
  @JoinColumn({ name: "product_id" })
  declare product: ProductModel;

  @Column({ type: "varchar", nullable: false })
  declare order_id: string;

  @ManyToOne(
    () => OrderModel,
    (order) => order.items,
  )
  @JoinColumn({ name: "order_id" })
  declare order: OrderModel;

  @Column({ type: "integer", nullable: false })
  declare quantity: number;

  @Column({ type: "varchar", nullable: false })
  declare name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  declare price: number;
}
