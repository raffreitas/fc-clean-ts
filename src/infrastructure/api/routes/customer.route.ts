import { type Request, type Response, Router } from "express";
import type { InputCreateCustomerDto } from "../../../usecase/customer/create/create.customer.dto";
import { CreateCustomerUseCase } from "../../../usecase/customer/create/create.customer.usecase";
import type { InputFindCustomerDto } from "../../../usecase/customer/find/find.customer.dto";
import { FindCustomerUseCase } from "../../../usecase/customer/find/find.customer.usecase";
import { ListCustomerUseCase } from "../../../usecase/customer/list/list.customer.usecase";
import type { InputUpdateCustomerDto } from "../../../usecase/customer/update/update.customer.dto";
import { UpdateCustomerUseCase } from "../../../usecase/customer/update/update.customer.usecase";
import CustomerRepository from "../../customer/repository/typeorm/customer.repository";
import { typeorm } from "../express";
import { CustomerPresenter } from "../presenters/customer.presenter";

export const customerRoute = Router();

customerRoute.post("/", async (req: Request, res: Response) => {
  try {
    const usecase = new CreateCustomerUseCase(new CustomerRepository(typeorm));
    const customerDto: InputCreateCustomerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip,
      },
    };
    const output = await usecase.execute(customerDto);
    return res.status(201).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});

customerRoute.get("/", async (_: Request, res: Response) => {
  try {
    const usecase = new ListCustomerUseCase(new CustomerRepository(typeorm));
    const output = await usecase.execute();
    return res.status(200).format({
      json: () => res.json(output),
      xml: () => res.send(CustomerPresenter.listXML(output)),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

customerRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const usecase = new FindCustomerUseCase(new CustomerRepository(typeorm));
    const customerDto: InputFindCustomerDto = {
      id: req.params.id,
    };
    const output = await usecase.execute(customerDto);
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});

customerRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const usecase = new UpdateCustomerUseCase(new CustomerRepository(typeorm));
    const customerDto: InputUpdateCustomerDto = {
      id: req.params.id,
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip,
      },
    };
    const output = await usecase.execute(customerDto);
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});
