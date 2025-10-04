import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "products" })
export default class ProductEntity {
  @PrimaryColumn({ type: "varchar" })
  declare id: string;

  @Column({ type: "varchar", nullable: false })
  declare name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  declare price: number;
}
