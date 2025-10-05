import type ProductInterface from "../../../domain/product/entity/product.interface";
import type ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import type { OutputListProductDto } from "./list.product.dto";

export class ListProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(): Promise<OutputListProductDto> {
    const products = await this.productRepository.findAll();
    return OutputMapper.toOutput(products);
  }
}

class OutputMapper {
  static toOutput(products: ProductInterface[]): OutputListProductDto {
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      })),
    };
  }
}
