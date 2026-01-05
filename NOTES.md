# NOTES.md

This document describes the assumptions, technical decisions, business logic design, testing approach, and trade-offs made during the implementation of the Inventory Management System recruitment task.

It also explicitly documents which parts of the original specification were **not implemented**, along with the intended design for those features.

---

## 1. Assumptions & Simplifications

### Key Assumptions

1. **Customer model**
   - A customer entity would contain at least:
     - `id`
     - `location` (US, EU, ASIA)
   - Customer data was assumed to exist but was not implemented, as order processing was not completed.

2. **Product model**
   - Products contain `name`, `description`, `price`, and `stock`.
   - `name` and `description` are limited to 50 characters.
   - `price` must be a positive number.
   - Initial stock is assumed to be non-negative.

3. **Currency**
   - A single base currency is assumed for product prices.
   - Location-based pricing would be applied using percentage modifiers.

### Intentional Simplifications

- Authentication and authorization were excluded.
- Only basic product management was implemented.
- No admin configuration for pricing rules or promotions.
- No background jobs or asynchronous processing.

These simplifications were made to keep the scope reasonable for a recruitment task.

---

## 2. Unimplemented Requirements (Explicit)

The following requirements from the task specification were **not implemented due to time constraints**, but their intended behavior is documented below:

- Stock management (restock / sell)
- Order creation with stock validation
- Location-based pricing
- Discount system (volume-based and promotional)

---

## 3. Intended Business Logic (Design Only)

### Stock Management (Planned)

- `POST /products/:id/restock`
  - Increase product stock by a given quantity.
- `POST /products/:id/sell`
  - Decrease product stock by a given quantity.
  - Stock must never go below zero.

**Planned consistency rules:**

- Stock updates should be atomic.
- Requests attempting to reduce stock below zero should be rejected with a conflict error.

---

### Order Creation (Planned)

- `POST /orders`
  - Accepts `customerId` and a list of `{ productId, quantity }`.

**Planned behavior:**

- Validate that all products exist.
- Validate that sufficient stock is available for all products.
- Update stock levels atomically (all-or-nothing).
- Reject the entire order if any product is unavailable.

---

### Location-Based Pricing (Planned)

Prices would be adjusted based on customer location:

- United States (US): base price
- Europe (EU): +15% (VAT)
- Asia (ASIA): −5% (logistics adjustment)

Location data would come from the Customer entity and would not be resolved dynamically.

---

### Discount System (Planned)

The following discounts were planned:

#### Volume-Based Discounts

- 5+ units → 10%
- 10+ units → 20%
- 50+ units → 30%

#### Promotional Discounts

- Black Friday → 25% discount on all products
- Holiday Sales → 15% discount on selected categories  
  (based on Polish bank holidays)

#### Discount Rules

- Discounts cannot be combined.
- Only the highest applicable discount would be applied.
- Discount selection would be based on the customer’s best outcome.

---

## 4. Technical Decisions

### Technology Stack

- **Express 5 + TypeScript** for API development.
- **Prisma ORM with PostgreSQL** for data persistence.
- **Zod** for input validation and schema definitions.
- **zod-to-openapi + Swagger UI** for API documentation.
- **Vitest + Supertest** for testing.
- **Pino** for structured logging.

### Project Structure

- Code is organized by feature modules.
- Validation, routing, and business logic are kept separate.
- The structure was designed to support CQRS-style separation.

### CQRS Approach (Planned)

- **Commands**: state-changing operations (create product, restock, sell, create order).
- **Queries**: read-only operations (fetch products).

Separate read/write databases were intentionally not introduced to avoid over-engineering.

---

## 5. Testing Strategy

### Implemented Tests

- Basic tests for implemented endpoints.
- Validation and error-handling scenarios.
- API integration tests using Supertest.

### Planned but Not Implemented

- Tests for stock consistency and concurrent updates.
- Order creation success and failure scenarios.
- Discount calculation logic.
- Edge cases related to pricing rules.

---

## 6. Trade-offs & Alternatives

### Primary Trade-off

**Scope vs completeness**

- Priority was given to clean structure, validation, and tooling.
- Complex business logic (orders, discounts, pricing) was intentionally postponed to avoid rushed or incorrect implementations.

### Alternative Considered

**File-based persistence (e.g. lowdb)**

Rejected because:

- It complicates atomic stock updates.
- It does not handle concurrency safely.
- It would make future extension of the system harder.

### What Would Be Improved With More Time

- Full implementation of order processing and stock management.
- Proper transactional handling of stock updates.
- A dedicated pricing and discount engine with unit tests.
- Better test coverage for business rules and edge cases.

---

## Final Remarks

This implementation focuses on **code quality, structure, and explicit documentation of missing features**, rather than providing an incomplete or incorrect implementation of complex business rules.

All unimplemented requirements are clearly documented, along with the intended design, making the project a solid foundation for further development.
