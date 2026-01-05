import type { Product, ProductReadRepository } from "@/api/product";
import type { EventBus } from "@/common/cqrs";

export class ProductProjector {
  constructor(
    private readRepository: ProductReadRepository,
    private events: EventBus,
  ) {
    this.setupEvents();
  }

  private setupEvents() {
    this.events.on("ProductCreated", (product: Product) => {
      this.update(product);
    });
  }

  private async update(product: Product): Promise<Product> {
    return this.readRepository.upsert(product);
  }
}
