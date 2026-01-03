import { StatusCodes } from "http-status-codes";
import type { CommandBus, QueryBus } from "@/common/cqrs";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { Product } from "./product.model";
import { type Request } from "express";
import { CreateProductCommand } from "./create-product";

export class ProductService {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async findAll() {
    const products: Product[] = await this.queryBus.execute({
      type: "GetProducts",
    });

    if (!products || products.length === 0) {
      return ServiceResponse.failure(
        "No Products found",
        null,
        StatusCodes.NOT_FOUND,
      );
    }

    return ServiceResponse.success<Product[]>("Products found", products);
  }

  async create(req: Request) {
    const body = req.body;

    const product = await this.commandBus.execute<
      CreateProductCommand,
      Product
    >({
      type: "CreateProduct",
      payload: body,
    });

    return ServiceResponse.success<Product>("Product created", product);
  }
}
