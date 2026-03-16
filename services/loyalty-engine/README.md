# @pointflow/loyalty-engine

<div align="center">
  <p><strong>The core points calculation and transaction engine for PointFlow.</strong></p>
  <img src="https://img.shields.io/badge/nestjs-11.x-e0234e" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/transport-TCP-blue" alt="TCP Transport" />
  <img src="https://img.shields.io/badge/orm-Drizzle-yellow" alt="Drizzle ORM" />
</div>

## 🚀 Overview

The Loyalty Engine is the computational heart of the PointFlow platform. It is a strictly internal microservice responsible for processing point allocations, managing loyalty tiers, and securely storing visit histories.

By operating purely within the isolated backend network (via TCP), it ensures that business-critical logic remains inaccessible to the public internet, accepting trusted commands exclusively from the API Gateway. Once a transaction is finalized, the Loyalty Engine acts as a producer, emitting high-fidelity domain events to the Apache Kafka broker.

## ✨ Key Responsibilities

- **Points Calculation Engine**: Accurately computes earned points based on robust, TDD-backed logic and currency precision (cents).
- **Tier Management**: Progresses users through loyalty tiers and maintains the "SettingSnapshot" history for unalterable auditing.
- **Data Persistence**: Interfaces safely with CockroachDB using Drizzle ORM to ensure distributed SQL consistency.
- **Internal TCP Transport**: Listens to `@MessagePattern` commands from the API Gateway instead of exposing HTTP REST routes.
- **Event Producer**: Pushes idempotency-ready events (e.g., `PointsAwardedEvent`, `TierChangedEvent`) to the Kafka broker for downstream consumers (like Notifications and Analytics).
- **Event Consumer (Hybrid Mode)**: Reacts to `USER_CREATED` events published by the Auth service to maintain a robust Read Model projection natively via `UsersRepository`.

## 🛠️ Tech Stack

- **Framework**: NestJS 11 Microservices (Hybrid TCP + Kafka)
- **Database**: CockroachDB v25.2.x
- **ORM**: Drizzle ORM `0.45.x` with Postgres.js driver
- **Message Broker integration**: Kafka 4.2 KRaft (Producer & Consumer)
- **Logging**: Pino (`nestjs-pino`)

## 🏗️ Development

The Loyalty Engine runs internally on port `3002` by default.

### 1. Configuration

Copy the `.env.example` file to create your local `.env`. It is required for Kafka coordinates and Database connection:

```bash
cp .env.example .env
```

### 2. Start

```bash
# Start the service in watch mode (from the monorepo root)
pnpm --filter @pointflow/loyalty-engine run dev
```

Remember to run database migrations from the monorepo root (`pnpm run db:migrate`) before initiating the Loyalty Engine to ensure schema parity.
