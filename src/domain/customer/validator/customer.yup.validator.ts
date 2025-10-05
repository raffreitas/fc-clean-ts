import * as yup from "yup";
import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type Customer from "../entity/customer";

export class CustomerYupValidator implements ValidatorInterface<Customer> {
  validate(data: Customer): void {
    try {
      const schema = yup.object().shape({
        id: yup.string().required("Id is required"),
        name: yup.string().required("Name is required"),
      });
      schema.validateSync(data, { abortEarly: false });
    } catch (errors) {
      const errorsYup = errors as yup.ValidationError;
      errorsYup.inner.forEach((error) => {
        if (error.path) {
          data.notification.addError({
            message: error.message,
            context: "customer",
          });
        }
      });
    }
  }
}
