# @pointflow/auth

<div align="center">
  <p><strong>The source of truth for identity, multi-tenant authentication, and JWT issuance.</strong></p>
  <img src="https://img.shields.io/badge/nestjs-11.x-e0234e" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/transport-TCP_/_Kafka-blue" alt="TCP/Kafka Transport" />
  <img src="https://img.shields.io/badge/orm-Drizzle-yellow" alt="Drizzle ORM" />
</div>

## 🚀 Overview

The Auth Service is the central identity provider for PointFlow. It manages user accounts, performs secure password validation (bcrypt), and issues signed JWT tokens. It operates in a hybrid mode: responding synchronously to API Gateway requests via TCP and emitting domain events to Kafka when users are registered or updated.

## ✨ Key Responsibilities

- **Identity Provider**: Acts as the single source of truth for user accounts across all tenants.
- **JWT Issuance**: Generates stateless JSON Web Tokens for authenticated requests.
- **Password Security**: Handles robust password hashing using `bcrypt`.
- **Multi-tenancy**: Ensures strict user isolation per `tenantId` (the same email can exist in different tenants).
- **Event Producer**: Emits `user.created` events to Kafka to synchronize other services (Read Models).

## 🛠️ Tech Stack

- **Framework**: NestJS 11 Microservices (Hybrid: TCP + Kafka)
- **Authentication**: Passport.js + JWT
- **Security**: `bcrypt` for hashing
- **Database**: CockroachDB v25.2.x (Dedicated `pf_auth` database)
- **ORM**: Drizzle ORM `0.45.x` with Postgres.js driver
- **Logging**: Pino (`nestjs-pino`)

## 🏗️ Development

The Auth Service listens on TCP for internal service communication and connects to Kafka for event broadcasting.

### 1. Configuration

Copy the `.env.example` file to create your local `.env`.

```bash
cp .env.example .env
```

### 2. Start

```bash
# Start the service in watch mode (from the monorepo root)
pnpm --filter @pointflow/auth run dev
```

Remember to run database migrations from the monorepo root (`pnpm run db:migrate`) before initiating the Auth Service.
