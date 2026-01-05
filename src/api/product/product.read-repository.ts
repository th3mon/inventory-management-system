import { prisma } from "../../../prisma/client";
import type { Product } from "./product.model";

export class ProductReadRepository {
  async findAll(): Promise<Product[]> {
    return prisma.productRead.findMany();
  }

  async upsert(product: Product): Promise<Product> {
    return await prisma.productRead.upsert({
      where: {
        id: product.id,
      },
      create: product,
      update: product,
    });
  }
}
