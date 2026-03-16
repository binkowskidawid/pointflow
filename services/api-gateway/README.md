# @pointflow/api-gateway

<div align="center">
  <p><strong>The centralized public entry point for the PointFlow loyalty platform.</strong></p>
  <img src="https://img.shields.io/badge/nestjs-11.x-e0234e" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/transport-TCP-blue" alt="TCP Transport" />
</div>

## 🚀 Overview

The API Gateway acts as the single entry point ("Front Desk") for all incoming HTTP requests from the frontend applications (Admin Dashboard, Customer Portal). It is designed to shield the internal microservices from direct public access, ensuring enhanced security, simplified client communication, and centralized routing.

Instead of authenticating and parsing requests in every downstream microservice, the API Gateway handles the initial barrier, standardizing the traffic, and proxying it over high-speed internal TCP connections to the respective domain services (e.g., Loyalty Engine, Auth).

## ✨ Key Responsibilities

- **Single Entry Point**: Exposes a unified REST API (`/api/v1`) to the web clients.
- **Request Validation**: Sanitizes and validates incoming payloads using `class-validator` before they reach the core system.
- **Authentication Gateway**: Verifies JWT tokens and manages session states, proxying auth tasks to the Auth service.
- **Protocol Translation**: Translates incoming HTTP/REST requests into internal TCP microservice messages using `@nestjs/microservices`.
- **Centralized Logging**: Implements enterprise-grade JSON logging (`nestjs-pino`) to trace the ingress traffic safely.

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Logging**: Pino HTTP (`nestjs-pino`)
- **Validation**: `class-validator` & `class-transformer`
- **Transport Strategy**: TCP Microservices Client

## 🏗️ Development

The API Gateway runs on port `3001` by default and is configured to run alongside the monorepo ecosystem.

```bash
# Start the service in watch mode (from the monorepo root)
pnpm --filter @pointflow/api-gateway run dev
```

### Configuration

Each service manages its own environment variables to retain pure decoupling. Ensure you copy the template before first start:

```bash
cp .env.example .env
```
