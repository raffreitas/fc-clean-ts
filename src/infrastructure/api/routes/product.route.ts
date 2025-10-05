import { type Request, type Response, Router } from "express";
import type { InputCreateProductDto } from "../../../usecase/product/create/create.product.dto";
import { CreateProductUseCase } from "../../../usecase/product/create/create.product.usecase";
import type { InputFindProductDto } from "../../../usecase/product/find/find.product.dto";
import { FindProductUseCase } from "../../../usecase/product/find/find.product.usecase";
import { ListProductUseCase } from "../../../usecase/product/list/list.product.usecase";
import type { InputUpdateProductDto } from "../../../usecase/product/update/update.product.dto";
import { UpdateProductUseCase } from "../../../usecase/product/update/update.product.usecase";
import ProductRepository from "../../product/repository/typeorm/product.repository";
import { typeorm } from "../express";

export const productRoute = Router();

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const usecase = new CreateProductUseCase(new ProductRepository(typeorm));
    const productDto: InputCreateProductDto = {
      name: req.body.name,
      price: req.body.price,
      type: req.body.type,
    };
    const output = await usecase.execute(productDto);
    return res.status(201).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});

productRoute.get("/", async (_: Request, res: Response) => {
  try {
    const usecase = new ListProductUseCase(new ProductRepository(typeorm));
    const output = await usecase.execute();
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});

productRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const usecase = new FindProductUseCase(new ProductRepository(typeorm));
    const productDto: InputFindProductDto = {
      id: req.params.id,
    };
    const output = await usecase.execute(productDto);
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});

productRoute.put("/:id", async (req: Request, res: Response) => {
  try {
    const usecase = new UpdateProductUseCase(new ProductRepository(typeorm));
    const productDto: InputUpdateProductDto = {
      id: req.params.id,
      name: req.body.name,
      price: req.body.price,
    };
    const output = await usecase.execute(productDto);
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json(error);
  }
});
