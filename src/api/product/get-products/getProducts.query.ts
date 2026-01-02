import { Query } from "@/common/cqrs/query";

export type GetProductsQuery = Query & {
  type: "GetProducts";
};
