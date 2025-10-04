import type { DataSource, Repository } from "typeorm";
import Product from "../../../../domain/product/entity/product";
import type ProductRepositoryInterface from "../../../../domain/product/repository/product-repository.interface";
import ProductEntity from "./product.entity";

export default class ProductRepository implements ProductRepositoryInterface {
  private repository: Repository<ProductEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ProductEntity);
  }

  async create(entity: Product): Promise<void> {
    const productModel = this.repository.create({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });

    await this.repository.save(productModel);
  }

  async update(entity: Product): Promise<void> {
    await this.repository.update(entity.id, {
      name: entity.name,
      price: entity.price,
    });
  }

  async find(id: string): Promise<Product> {
    const productModel = await this.repository.findOne({
      where: { id },
    });

    if (!productModel) {
      throw new Error("Product not found");
    }

    return new Product(productModel.id, productModel.name, productModel.price);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await this.repository.find();

    return productModels.map(
      (productModel) =>
        new Product(productModel.id, productModel.name, productModel.price),
    );
  }
}
