import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "customers" })
export default class CustomerEntity {
  @PrimaryColumn({ type: "varchar" })
  declare id: string;

  @Column({ type: "varchar", nullable: false })
  declare name: string;

  @Column({ type: "varchar", nullable: false })
  declare street: string;

  @Column({ type: "integer", nullable: false })
  declare number: number;

  @Column({ type: "varchar", nullable: false })
  declare zipcode: string;

  @Column({ type: "varchar", nullable: false })
  declare city: string;

  @Column({ type: "boolean", nullable: false, default: false })
  declare active: boolean;

  @Column({ type: "integer", nullable: false, default: 0 })
  declare rewardPoints: number;
}
