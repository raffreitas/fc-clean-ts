import type Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import type ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import type {
  InputCreateProductDto,
  OutputCreateProductDto,
} from "./create.product.dto";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
    const product = ProductFactory.create(input.type, input.name, input.price);

    await this.productRepository.create(product as Product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
}
