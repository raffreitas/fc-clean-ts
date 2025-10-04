import type { DataSource, Repository } from "typeorm";
import Customer from "../../../../domain/customer/entity/customer";
import type CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../../domain/customer/value-object/address";
import CustomerEntity from "./customer.entity";

export default class CustomerRepository implements CustomerRepositoryInterface {
  private repository: Repository<CustomerEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(CustomerEntity);
  }

  async create(entity: Customer): Promise<void> {
    const customerModel = this.repository.create({
      id: entity.id,
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });

    await this.repository.save(customerModel);
  }

  async update(entity: Customer): Promise<void> {
    await this.repository.update(entity.id, {
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
  }

  async find(id: string): Promise<Customer> {
    const customerModel = await this.repository.findOne({
      where: { id },
    });

    if (!customerModel) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city,
    );
    customer.changeAddress(address);
    customer.addRewardPoints(customerModel.rewardPoints);

    if (customerModel.active) {
      customer.activate();
    }

    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await this.repository.find();

    const customers = customerModels.map((customerModel) => {
      const customer = new Customer(customerModel.id, customerModel.name);
      customer.addRewardPoints(customerModel.rewardPoints);
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipcode,
        customerModel.city,
      );
      customer.changeAddress(address);
      if (customerModel.active) {
        customer.activate();
      }
      return customer;
    });

    return customers;
  }
}
