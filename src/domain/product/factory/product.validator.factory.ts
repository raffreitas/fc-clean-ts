import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type ProductInterface from "../entity/product.interface";
import { ProductYupValidator } from "../validator/product.yup.validator";

export class ProductValidatorFactory {
  static create(): ValidatorInterface<ProductInterface> {
    return new ProductYupValidator();
  }
}
