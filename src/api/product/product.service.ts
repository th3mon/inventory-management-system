import { StatusCodes } from "http-status-codes";
import type { QueryBus } from "@/common/cqrs";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { Product } from "./product.model";

export class ProductService {
  constructor(private queryBus: QueryBus) {}

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
}
