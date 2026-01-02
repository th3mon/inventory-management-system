import type { Product, ProductReadRepository } from "@/api/product";
import type { GetProductsQuery } from "@/api/product/get-products";
import type { QueryHandler } from "@/common/cqrs";

export class GetProductsHandler
  implements QueryHandler<GetProductsQuery, Product[]>
{
  type: GetProductsQuery["type"] = "GetProducts";

  constructor(private readRepository: ProductReadRepository) {}

  async execute(): Promise<Product[]> {
    return await this.readRepository.findAll();
  }
}
