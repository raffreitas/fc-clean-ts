import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import CustomerModel from "../../../customer/repository/typeorm/customer.entity";
import OrderItemModel from "./order-item.model";

@Entity({ name: "orders" })
export default class OrderModel {
  @PrimaryColumn({ type: "varchar" })
  declare id: string;

  @Column({ type: "varchar", nullable: false })
  declare customer_id: string;

  @ManyToOne(() => CustomerModel)
  @JoinColumn({ name: "customer_id" })
  declare customer: CustomerModel;

  @OneToMany(
    () => OrderItemModel,
    (orderItem: OrderItemModel) => orderItem.order,
    { cascade: true },
  )
  declare items: OrderItemModel[];

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  declare total: number;
}
