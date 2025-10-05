import * as yup from "yup";
import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type Product from "../entity/product";

export class ProductYupValidator implements ValidatorInterface<Product> {
  validate(data: Product): void {
    try {
      const schema = yup.object().shape({
        id: yup.string().required("Id is required"),
        name: yup.string().required("Name is required"),
        price: yup.number().min(0, "Price must be greater than zero"),
      });
      schema.validateSync(data, { abortEarly: false });
    } catch (errors) {
      const errorsYup = errors as yup.ValidationError;
      errorsYup.inner.forEach((error) => {
        if (error.path) {
          data.notification.addError({
            message: error.message,
            context: "product",
          });
        }
      });
    }
  }
}
