import type { Query } from "@/common/cqrs/query";

export type GetProductsQuery = Query & {
  type: "GetProducts";
};
