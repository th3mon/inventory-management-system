import type { Product, ProductWriteRepository } from "@/api/product";
import type { CreateProductCommand } from "@/api/product/create-product";
import type { CommandHandler } from "@/common/cqrs";

export class CreateProductsHandler implements CommandHandler<CreateProductCommand> {
  type: CreateProductCommand["type"] = "CreateProduct";

  constructor(private writeRepository: ProductWriteRepository) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    return await this.writeRepository.createProduct(command.payload);
  }
}
