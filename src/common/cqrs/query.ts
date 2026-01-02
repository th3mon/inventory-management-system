export type Query = { type: string };

export interface QueryHandler<Q extends Query, R> {
  type: Q["type"];
  execute(query: Q): Promise<R>;
}
