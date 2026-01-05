# Inventory Management System (REST API)

[![CI](https://github.com/edwinhern/express-typescript/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/edwinhern/express-typescript-2024/actions/workflows/ci.yml)

Inventory Management System implemented as a recruitment task.  
The application exposes a RESTful API for managing products and serves as a foundation for more advanced inventory, pricing, and order-processing logic.

## Project Scope

The goal of the project is to demonstrate:

- API design with Express and TypeScript
- Clear project structure
- Input validation and error handling
- Separation of responsibilities
  - CQRS-inspired approach
  - Vertical Slices
- Readable, testable code

Some business features described in the task specification were planned but not fully implemented (see **TODO** section below).

## Tech Stack

### Runtime & Frameworks

- Node.js
- Express 5
- TypeScript

### Data & Persistence

- PostgreSQL
- Prisma ORM

### Validation & API Docs

- Zod
- zod-to-openapi
- Swagger UI

### Tooling & Quality

- Vitest (unit & integration tests)
- Supertest
- Biome (linting & formatting)
- TSUP (build)
- TSX (dev runtime)

### Security & Observability

- Helmet
- CORS
- express-rate-limit
- Pino (logging)

## Getting Started

### Prerequisites

- Node.js (ES2020 compatible)
- PNPM (v10+)
- PostgreSQL database

### Environment Setup

Create a `.env` file based on the template:

```bash
cp .env.template .env
```

Configure the database connection and other required variables.

### Install Dependencies

```bash
pnpm install
```

### Database Setup

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

### Running the Application

Development mode (watch mode):

```bash
pnpm dev
```

Build the application:

```bash
pnpm build
```

Run the production build:

```bash
pnpm start
```

### API Documentation

Run development mode and go to `http://localhost:8080/`.

### API Endpoints (Current State)

#### Products

- GET /products
  - Returns a list of all products.
- POST /products
  - Creates a new product.

```json
{
  "name": "Coffee Mug",
  "description": "Ceramic mug",
  "price": 29.99,
  "stock": 100
}
```

**Note**: Product creation includes basic validation (required fields, positive price).

### TODO / Not Implemented Yet

The following features were **part of the original task requirements but were not fully implemented** due to time constraints:

- Stock management (restock / sell)
  Endpoints for increasing and decreasing product stock levels are not implemented yet.
  As a result, stock consistency rules (preventing negative stock) are not enforced.
- Order creation with stock validation
  Order creation logic is incomplete.
  Validation of product availability and atomic stock updates during order placement are not implemented.
- Location-based pricing
  Price modifiers based on customer location (US / Europe / Asia) are not implemented.
  Prices are currently treated as base values without regional adjustments.
- Discount system (volume-based and promotional)
  The discount engine (volume-based discounts, Black Friday, and Holiday Sales) has not been implemented.
  Discount prioritization rules (highest discount only, no combination) are not applied.

These items are explicitly listed to clarify the current scope of the implementation and to document the remaining work required to fully satisfy the task specification.

### Validation & Error Handling

- Request payloads are validated using Zod.
- Standard HTTP status codes are used:
  - `400` – invalid input
  - `404` – resource not found
  - `500` – internal server error

### Testing

Run all tests in watch mode:

```bash
pnpm test
```

Additional scripts:

- `pnpm test:ci` – CI-friendly run (without watch mode)
- `pnpm test:cov` – test coverage report

Current test coverage focuses on implemented functionality and basic API behavior.
