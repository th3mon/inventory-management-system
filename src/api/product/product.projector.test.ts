import {
  type Product,
  ProductProjector,
  type ProductReadRepository,
} from "@/api/product";
import { EventBus } from "@/common/cqrs";

describe("ProductProjector", () => {
  it("Instantiate", () => {
    const readRepo = {} as ProductReadRepository;
    const events = new EventBus();
    const productProjector = new ProductProjector(readRepo, events);

    expect(productProjector).toBeDefined();
  });

  it("should update read model on ProductCreated", async () => {
    const product: Product = {
      id: 1,
      name: "name",
      description: "description",
      price: 5500,
      stock: 44,
    };
    const updatedProduct = { ...product, name: "updated name" };
    const readRepo = {
      upsert: vi.fn(),
    } as unknown as ProductReadRepository;
    const events = new EventBus();

    new ProductProjector(readRepo, events);
    events.publish("ProductCreated", updatedProduct);

    expect(readRepo.upsert).toHaveBeenCalledWith(updatedProduct);
  });
});
