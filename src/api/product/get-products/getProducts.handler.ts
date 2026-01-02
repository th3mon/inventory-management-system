import { QueryHandler } from "@/common/cqrs";
import { GetProductsQuery } from "@/api/product/get-products";
import { Product, ProductReadRepository } from "@/api/product";

export class GetProductsHandler implements QueryHandler<
  GetProductsQuery,
  Product[]
> {
  type: GetProductsQuery["type"] = "GetProducts";

  constructor(private readRepository: ProductReadRepository) {}

  async execute(): Promise<Product[]> {
    return await this.readRepository.findAll();
  }
}
