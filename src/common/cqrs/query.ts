export type Query = { type: string };
// TODO: Try to fix problem with any
// biome-ignore lint: suspicious/noExplicitAny
export type QueryResult = any;

export interface QueryHandler<
  Q extends Query = Query,
  R extends QueryResult = QueryResult,
> {
  type: Q["type"];
  execute(query: Q): Promise<R>;
}
