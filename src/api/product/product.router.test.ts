import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { products, type Product } from "@/api/product";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Products API Endpoints", () => {
  describe("GET /products", () => {
    it("should return a list of products", async () => {
      const response = await request(app).get("/products");
      const responseBody: ServiceResponse<Product[]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Products found");
      expect(responseBody.responseObject.length).toBeGreaterThan(0);
      expect(responseBody.responseObject).toEqual(products);
    });
  });
});
