import type { Product, ProductReadRepository } from "@/api/product";
import { GetProductsHandler } from "@/api/product/get-products";
import { products as productFromDB } from "../product.read-repository.mock";

describe("GetProductsHandler", () => {
  it("Instantiate", () => {
    const readRepository = {} as ProductReadRepository;
    const getProductsHandler = new GetProductsHandler(readRepository);

    expect(getProductsHandler).toBeTruthy();
  });

  it("get products", async () => {
    const readRepository = {
      findAll: vi.fn().mockReturnValue(productFromDB),
    } as unknown as ProductReadRepository;
    const getProductsHandler = new GetProductsHandler(readRepository);

    const products: Product[] = await getProductsHandler.execute();

    expect(products.length).toBeGreaterThan(0);
  });
});
