import { randomUUID } from "node:crypto";
import Product from "../entity/product";
import type ProductInterface from "../entity/product.interface";
import ProductB from "../entity/product-b";

export default class ProductFactory {
  public static create(
    type: string,
    name: string,
    price: number,
  ): ProductInterface {
    switch (type) {
      case "a":
        return new Product(randomUUID(), name, price);
      case "b":
        return new ProductB(randomUUID(), name, price);
      default:
        throw new Error("Product type not supported");
    }
  }
}
