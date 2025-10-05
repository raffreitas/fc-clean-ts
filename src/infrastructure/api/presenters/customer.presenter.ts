import { toXML, type XmlOptions } from "jstoxml";
import type { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";

export class CustomerPresenter {
  static listXML(data: OutputListCustomerDto) {
    const xmlOption: XmlOptions = {
      header: true,
      indent: "  ",
    };

    return toXML(
      {
        customers: {
          customer: data.customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            address: {
              street: customer.address.street,
              number: customer.address.number,
              zip: customer.address.zip,
              city: customer.address.city,
            },
          })),
        },
      },
      xmlOption,
    );
  }
}
