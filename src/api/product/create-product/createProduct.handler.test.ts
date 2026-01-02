import { ProductWriteRepository } from "@/api/product";
import { CreateProductsHandler } from "@/api/product/create-product";

describe("CreateProductsHandler", () => {
  it("Instantiate", () => {
    const writeRepository = new ProductWriteRepository();
    const createProductsHandler = new CreateProductsHandler(writeRepository);

    expect(createProductsHandler).toBeTruthy();
  });

  it("add product", async () => {
    const writeRepository = {
      createProduct: vi.fn(),
    } as ProductWriteRepository;
    const createProductsHandler = new CreateProductsHandler(writeRepository);

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
});
