# @pointflow/notification-service

<div align="center">
  <p><strong>The asynchronous Kafka event consumer and email dispatcher for PointFlow.</strong></p>
  <img src="https://img.shields.io/badge/nestjs-11.x-e0234e" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/transport-Kafka-red" alt="Kafka Transport" />
  <img src="https://img.shields.io/badge/orm-Drizzle-yellow" alt="Drizzle ORM" />
</div>

## 🚀 Overview

The Notification Service is an asynchronous microservice dedicated to listening for domain events from the Apache Kafka broker. By reacting to events such as `USER_CREATED` or `POINTS_AWARDED`, it handles time-consuming external communications (e.g., sending emails) without blocking the main application logic or the API Gateway.

Operating purely as a backend consumer, this service guarantees delivery and robustness using Kafka's Poison Pill (retry and backoff) strategy, ensuring no customer notification gets left behind.

## ✨ Key Responsibilities

- **Event Consumer**: Listens dynamically to Kafka topics (e.g., `user.created`) to trigger email workflows.
- **Local Read Models**: Maintains an isolated, standalone `UsersRepository` projection of users directly from events, avoiding slow synchronous queries to other microservices.
- **Template Rendering**: Translates raw JSON event payloads into HTML-formatted emails.
- **Email Delivery**: Uses `nodemailer` to asynchronously dispatch communications (currently integrated with a local MailHog environment for development).
- **Graceful Failure Handling**: Relies on KafkaJS native connection pooling and consumer restarts (5 default retries) upon hitting infrastructure or unique constraint database errors during event processing.

## 🛠️ Tech Stack

- **Framework**: NestJS 11 Microservices (Hybrid Architecture)
- **Message Broker integration**: Kafka 4.2 KRaft (Consumer)
- **Database**: CockroachDB v25.2.x (Dedicated `pf_notifications` schema isolation)
- **ORM**: Drizzle ORM `0.45.x` with Postgres.js driver
- **Mailing**: `nodemailer`
- **Logging**: Pino (`nestjs-pino`)

## 🏗️ Development

The Notification Service connects natively to Kafka (defaults to `localhost:9092`). It does not typically expose a port to the API Gateway since its primary source of truth is the log broker.

### 1. Configuration

Copy the `.env.example` file to create your local `.env`. It is required for Kafka coordinates and Database connection:

```bash
cp .env.example .env
```

### 2. Start

```bash
# Start the service in watch mode (from the monorepo root)
pnpm --filter @pointflow/notification-service run dev
```

Remember to run database migrations from the monorepo root (`pnpm run db:migrate`) before initiating the Notification Service to ensure `users` Read Model schema parity.
