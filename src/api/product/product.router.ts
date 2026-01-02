import { Request, Response, Router } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { QueryBus } from "@/common/cqrs";
import { ProductSchema, ProductService } from "@/api/product";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

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
