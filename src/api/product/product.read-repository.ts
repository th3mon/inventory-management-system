import { prisma } from "../../../prisma/client";
import type { Product } from "./product.model";

export class ProductReadRepository {
  async findAll(): Promise<Product[]> {
    return prisma.productRead.findMany();
  }
}
