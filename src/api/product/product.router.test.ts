import express from "express";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/api/product";
import { productRouter } from "@/api/product/product.router"; // dopasuj ścieżkę
import type { QueryBus } from "@/common/cqrs";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { products } from "./product.read-repository.mock";

describe("Products API Endpoints", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const queryBus = {
        execute: vi.fn().mockResolvedValue(products),
      } as unknown as QueryBus;

      const testApp = express();
      testApp.use(express.json());
      testApp.use("/products", productRouter(queryBus));

      const response = await request(testApp).get("/products");
      const responseBody: ServiceResponse<Product[]> = response.body;

      expect(queryBus.execute).toHaveBeenCalledWith({ type: "GetProducts" });

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Products found");
      expect(responseBody.responseObject.length).toBeGreaterThan(0);
      expect(responseBody.responseObject).toEqual(products);
    });
  });
});
