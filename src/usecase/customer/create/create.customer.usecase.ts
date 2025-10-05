import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import type CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import type {
  InputCreateCustomerDto,
  OutputCreateCustomerDto,
} from "./create.customer.dto";

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(
    input: InputCreateCustomerDto,
  ): Promise<OutputCreateCustomerDto> {
    const address = new Address(
      input.address.street,
      input.address.number,
      input.address.zip,
      input.address.city,
    );

    const customer = CustomerFactory.createWithAddress(input.name, address);

    await this.customerRepository.create(customer);

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        number: customer.address.number,
        zip: customer.address.zip,
        city: customer.address.city,
      },
    };
  }
}
