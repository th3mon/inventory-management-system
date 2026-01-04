import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import type { Product, ProductCreate } from "@/api/product";
import { productRouter } from "@/api/product/product.router"; // dopasuj ścieżkę
import type { CommandBus, QueryBus } from "@/common/cqrs";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { products } from "./product.read-repository.mock";

type SetupOptions = {
  queryResult?: unknown;
  commandPayload?: unknown;
};

function setup({ queryResult, commandPayload }: SetupOptions = {}) {
  const commandBus = {
    execute: vi.fn().mockReturnValue(commandPayload),
  } as unknown as CommandBus;
  const queryBus = {
    execute: vi.fn().mockReturnValue(queryResult),
  } as unknown as QueryBus;

  const app = express();
  app.use(express.json());
  app.use("/products", productRouter(queryBus, commandBus));

  return { app, commandBus, queryBus };
}

describe("Products API Endpoints", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const { app, queryBus } = setup({ queryResult: products });

      const response = await request(app).get("/products");
      const responseBody: ServiceResponse<Product[]> = response.body;

      expect(queryBus.execute).toHaveBeenCalledWith({ type: "GetProducts" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Products found");
      expect(responseBody.responseObject.length).toBeGreaterThan(0);
      expect(responseBody.responseObject).toEqual(products);
    });
  });

  describe("POST /products", () => {
    it("should create product", async () => {
      const commandPayload: ProductCreate = {
        name: "name",
        description: "description",
        price: 500,
        stock: 1,
      };
      const { app, commandBus } = setup({ commandPayload });

      const response = await request(app)
        .post("/products")
        .send(commandPayload);
      const responseBody: ServiceResponse<Product[]> = response.body;

      expect(commandBus.execute).toHaveBeenCalledWith({
        type: "CreateProduct",
        payload: commandPayload,
      });

      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      expect(responseBody.success).toBe(true);
      expect(responseBody.message).toContain("Product created");
      expect(responseBody.responseObject).toEqual(commandPayload);
    });

    it("should return a error when required data is not given", async () => {
      const commandPayload: ProductCreate = {
        name: "name",
        description: "description",
        price: 500,
      } as unknown as ProductCreate;

      const { app, commandBus } = setup({ commandPayload });
      const response = await request(app)
        .post("/products")
        .send(commandPayload);
      const responseBody: ServiceResponse<null> = response.body;

      expect(commandBus.execute).not.toHaveBeenCalledWith();

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toEqual("Validation error");
      expect(responseBody.responseObject).toHaveProperty("fieldErrors");
    });
  });
});
