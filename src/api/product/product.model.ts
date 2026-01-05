import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Product = z.infer<typeof ProductSchema>;
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  description: z.string().max(50),
  price: z.number().positive(),
  stock: z.number().positive(),
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export const ProductCreateSchema = ProductSchema.omit({
  id: true,
});
