import { StatusCodes } from "http-status-codes";
import type { Product } from "@/api/product";
import { ProductService } from "@/api/product/product.service";
import type { CommandBus, QueryBus } from "@/common/cqrs";

describe("ProductService", () => {
  it("Instantiate", () => {
    const queryBus = {} as QueryBus;
    const commandBus = {} as CommandBus;
    const service = new ProductService(queryBus, commandBus);

    expect(service).toBeTruthy();
  });

  describe("findAll()", () => {
    it("success when products exist", async () => {
      const products = [{ id: "p1" }] as unknown as Product[];

      const queryBus = {
        execute: vi.fn().mockResolvedValue(products),
      } as unknown as QueryBus;
      const commandBus = {} as CommandBus;
      const service = new ProductService(queryBus, commandBus);

      const result = await service.findAll();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Products found");
      expect(result.statusCode).toBe(StatusCodes.OK);
      expect(result.responseObject).toEqual(products);
      expect(result.responseObject?.length).toBeGreaterThan(0);
    });

    it("failure when products array is empty", async () => {
      const queryBus = {
        execute: vi.fn().mockResolvedValue([]),
      } as unknown as QueryBus;
      const commandBus = {} as CommandBus;
      const service = new ProductService(queryBus, commandBus);

      const result = await service.findAll();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No Products found");
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.responseObject).toBeNull();
    });

    it("failure when products is undefined", async () => {
      const queryBus = {
        execute: vi.fn().mockResolvedValue(undefined),
      } as unknown as QueryBus;
      const commandBus = {} as CommandBus;
      const service = new ProductService(queryBus, commandBus);

      const result = await service.findAll();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No Products found");
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.responseObject).toBeNull();
    });

    it("failure when products is null", async () => {
      const queryBus = {
        execute: vi.fn().mockResolvedValue(null),
      } as unknown as QueryBus;
      const commandBus = {} as CommandBus;
      const service = new ProductService(queryBus, commandBus);

      const result = await service.findAll();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No Products found");
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(result.responseObject).toBeNull();
    });
  });
});
