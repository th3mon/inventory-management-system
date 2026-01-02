import { prisma } from "../../../prisma/client";
import type { ProductCreate } from "./product.model";

export class ProductWriteRepository {
  async createProduct(product: ProductCreate) {
    return prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
  }
}
