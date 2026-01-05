import {
  type Product,
  type ProductCreate,
  ProductWriteRepository,
} from "@/api/product";
import { CreateProductsHandler } from "@/api/product/create-product";
import { EventBus } from "@/common/cqrs";

function createFakeEventBus(): EventBus {
  // biome-ignore lint: suspicious/noExplicitAny
  const listeners = new Map<string, Array<(...args: any[]) => void>>();

  return {
    // biome-ignore lint: suspicious/noExplicitAny
    on: vi.fn((eventName: string, handler: (...args: any[]) => void) => {
      const arr = listeners.get(eventName) ?? [];
      arr.push(handler);
      listeners.set(eventName, arr);
    }),

    publish: vi.fn((eventName: string, payload?: unknown) => {
      const arr = listeners.get(eventName) ?? [];
      for (const handler of arr) handler(payload);
    }),
  } as unknown as EventBus;
}

describe("CreateProductsHandler", () => {
  it("Instantiate", () => {
    const writeRepository = new ProductWriteRepository();
    const events = new EventBus();
    const createProductsHandler = new CreateProductsHandler(
      writeRepository,
      events,
    );

    expect(createProductsHandler).toBeTruthy();
  });

  it("add product", async () => {
    const writeRepository = {
      createProduct: vi.fn(),
    } as ProductWriteRepository;
    const events = new EventBus();
    const createProductsHandler = new CreateProductsHandler(
      writeRepository,
      events,
    );

    await createProductsHandler.execute({
      type: "CreateProduct",
      payload: {
        name: "iPhone 6 SE",
        description: "iPhone 6 SE",
        price: 66600,
        stock: 4,
      },
    });

    expect(writeRepository.createProduct).toHaveBeenCalled();
  });

  it("should publish event ProductCreated", async () => {
    const product: ProductCreate = {
      name: "iPhone 6 SE",
      description: "iPhone 6 SE",
      price: 66600,
      stock: 4,
    };

    const productFromDB: Product = {
      id: 1,
      name: "iPhone 6 SE",
      description: "iPhone 6 SE",
      price: 66600,
      stock: 4,
    };

    const writeRepository = {
      createProduct: vi.fn().mockReturnValue(productFromDB),
    } as unknown as ProductWriteRepository;
    const events = createFakeEventBus();
    const handler = new CreateProductsHandler(writeRepository, events);

    const productCreatedListener = vi.fn();
    events.on("ProductCreated", productCreatedListener);

    await handler.execute({
      type: "CreateProduct",
      payload: product,
    });

    expect(events.publish).toHaveBeenCalledWith(
      "ProductCreated",
      productFromDB,
    );
    expect(productCreatedListener).toHaveBeenCalled();
  });
});
