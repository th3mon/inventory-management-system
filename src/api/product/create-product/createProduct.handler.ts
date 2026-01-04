import type { Product, ProductWriteRepository } from "@/api/product";
import type { CreateProductCommand } from "@/api/product/create-product";
import type { CommandHandler, EventBus } from "@/common/cqrs";

export class CreateProductsHandler
  implements CommandHandler<CreateProductCommand>
{
  type: CreateProductCommand["type"] = "CreateProduct";

  constructor(
    private writeRepository: ProductWriteRepository,
    private events: EventBus,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = await this.writeRepository.createProduct(command.payload);

    this.events.publish<Product>("ProductCreated", product);

    return product;
  }
}
