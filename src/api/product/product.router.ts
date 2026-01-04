import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { type Request, type Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { ProductSchema, ProductService } from "@/api/product";
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

export function productRouter(
  queryBus: QueryBus,
  commandBus: CommandBus,
): Router {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    const productService = new ProductService(queryBus, commandBus);
    const serviceResponse = await productService.findAll();

    res.status(StatusCodes.OK).send(serviceResponse);
  });

  router.post("/", async (req: Request, res: Response) => {
    const productService = new ProductService(queryBus, commandBus);
    const serviceResponse = await productService.create(req);

    res.status(StatusCodes.CREATED).send(serviceResponse);
  });

  return router;
}
