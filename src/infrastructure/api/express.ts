import type { Express } from "express";
import express from "express";
import { DataSource } from "typeorm";
import CustomerEntity from "../customer/repository/typeorm/customer.entity";
import ProductEntity from "../product/repository/typeorm/product.entity";
import { customerRoute } from "./routes/customer.route";
import { productRoute } from "./routes/product.route";

export const app: Express = express();

app.use(express.json());
app.use("/customers", customerRoute);
app.use("/products", productRoute);

export let typeorm: DataSource;

async function setupDatabase() {
  typeorm = new DataSource({
    type: "better-sqlite3",
    database: ":memory:",
    logging: false,
    synchronize: true,
    entities: [CustomerEntity, ProductEntity],
  });

  await typeorm.initialize();
}

setupDatabase();
