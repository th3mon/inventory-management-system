import type { ProductCreate } from "@/api/product";
import type { Command } from "@/common/cqrs";

export type CreateProductCommand = Command & {
  type: "CreateProduct";
  payload: ProductCreate;
};
