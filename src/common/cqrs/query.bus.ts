import type { Query, QueryHandler } from "./query";

export class QueryBus {
  private handlers = new Map<string, QueryHandler<any, any>>();

  register(handler: QueryHandler<any, any>) {
    this.handlers.set(handler.type, handler);
  }

  async execute<Q extends Query, R>(query: Q): Promise<R> {
    const handler = this.handlers.get(query.type);

    if (!handler) {
      throw new Error(`No query handler for: ${query.type}`);
    }

    return handler.execute(query);
  }
}
