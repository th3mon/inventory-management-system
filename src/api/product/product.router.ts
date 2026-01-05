import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { type Request, type Response, Router } from "express";
import { z } from "zod";
import {
  ProductCreateSchema,
  ProductSchema,
  ProductService,
} from "@/api/product";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import type { CommandBus, QueryBus } from "@/common/cqrs";

export const productRegistry = new OpenAPIRegistry();
productRegistry.register("Product", ProductSchema);
productRegistry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

productRegistry.register("ProductCreate", ProductCreateSchema);
productRegistry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductCreateSchema), "Success"),
});

export function productRouter(
  queryBus: QueryBus,
  commandBus: CommandBus,
): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const productService = new ProductService(queryBus, commandBus);
    const serviceResponse = await productService.findAll();

    res.status(serviceResponse.statusCode).send(serviceResponse);
  });

  router.post("/", async (req: Request, res: Response) => {
    const productService = new ProductService(queryBus, commandBus);
    const serviceResponse = await productService.create(req);

    res.status(serviceResponse.statusCode).send(serviceResponse);
  });

  return router;
}
