import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ProductSchema, ProductService } from "@/api/product";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import type { QueryBus } from "@/common/cqrs";

export const productRegistry = new OpenAPIRegistry();
productRegistry.register("Product", ProductSchema);
productRegistry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Product"],
  responses: createApiResponse(z.array(ProductSchema), "Success"),
});

export function productRouter(queryBus: QueryBus): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const productService = new ProductService(queryBus);
    const serviceResponse = await productService.findAll();

    res.status(StatusCodes.OK).send(serviceResponse);
  });

  return router;
}
