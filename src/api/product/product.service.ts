import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import type { CommandBus, QueryBus } from "@/common/cqrs";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { CreateProductCommand } from "./create-product";
import { ProductCreateSchema, type Product } from "./product.model";

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
    const result = ProductCreateSchema.safeParse(body);

    if (!result.success) {
      return ServiceResponse.failure(
        "Validation error",
        result.error.flatten(),
        StatusCodes.BAD_REQUEST,
      );
    }

    const product = await this.commandBus.execute<
      CreateProductCommand,
      Product
    >({
      type: "CreateProduct",
      payload: body,
    });

    return ServiceResponse.success<Product>(
      "Product created",
      product,
      StatusCodes.CREATED,
    );
  }
}
