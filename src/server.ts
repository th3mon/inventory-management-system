import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import {
  type Product,
  ProductReadRepository,
  ProductWriteRepository,
  productRouter,
} from "@/api/product";
import {
  type CreateProductCommand,
  CreateProductsHandler,
} from "@/api/product/create-product";
import {
  GetProductsHandler,
  type GetProductsQuery,
} from "@/api/product/get-products";
import { userRouter } from "@/api/user/userRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { CommandBus, EventBus, QueryBus } from "./common/cqrs";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);

const productReadRepository = new ProductReadRepository();
const queryBus = new QueryBus();
queryBus.register<GetProductsQuery, Product[]>(
  new GetProductsHandler(productReadRepository),
);

const productWriteRepository = new ProductWriteRepository();
const events = new EventBus();
const commandBus = new CommandBus();
commandBus.register<CreateProductCommand, Product>(
  new CreateProductsHandler(productWriteRepository, events),
);

app.use("/products", productRouter(queryBus, commandBus));

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
