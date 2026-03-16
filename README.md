<div align="center">
  <h1><img src="apps/web/public/icon.png" width="32" height="32" alt="PointFlow Logo" /> PointFlow</h1>
  <p><strong>The open-source loyalty platform you can self-host in 5 minutes.</strong></p>
  <p>
    <a href="https://github.com/binkowskidawid/pointflow/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://github.com/binkowskidawid/pointflow/actions"><img src="https://img.shields.io/github/actions/workflow/status/binkowskidawid/pointflow/ci.yml?label=CI" alt="CI" /></a>
    <img src="https://img.shields.io/badge/node-%3E%3D24-brightgreen" alt="Node" />
    <img src="https://img.shields.io/badge/pnpm-10.x-orange" alt="pnpm" />
    <img src="https://img.shields.io/badge/kafka-4.2%20KRaft-red" alt="Kafka" />
    <img src="https://img.shields.io/badge/nestjs-11.x-e0234e" alt="NestJS" />
  </p>
</div>

---

PointFlow is a free, open-source, self-hostable loyalty platform for small and medium businesses. Any business — a dental clinic, coffee shop, barbershop, or retail store — can run their own loyalty programme without paying for an external SaaS.

> **Real problem, real niche.** Existing SaaS solutions (Smile.io, LoyaltyLion) cost hundreds of dollars per month. No good open-source alternatives exist. PointFlow fills that gap.

## ✨ Features

- 🏆 **Points & Tiers** — configurable points-per-visit rules with automatic tier progression
- 🔔 **Real-time Notifications** — email alerts on points earned and tier changes
- 📊 **Analytics Dashboard** — visit history, point balances, and tier distribution
- 👤 **Customer Portal** — self-service portal for customers to track their rewards
- 🔐 **JWT Auth** — stateless authentication with per-tenant isolation
- 🐘 **Event-Driven Core** — built on Apache Kafka 4.2 KRaft (no Zookeeper!)
- 🚀 **Self-hosted** — single `docker compose up` to run the entire stack

## 🏗️ Architecture

```
Browser (Next.js 16)
        │ HTTPS + JWT
        ▼
  API Gateway (NestJS 11, port 3001)
  ├── Auth Service    (TCP, port 3003)
  ├── Loyalty Engine  (TCP, port 3002)  ──► Kafka 4.2 KRaft
  └── Analytics       (HTTP + Kafka, port 3004)
                                              │
                                    Notification Service
                                      (Kafka consumer)

  All services ↔ CockroachDB v25.2 LTS via Drizzle ORM 0.45
  (Database per Service: pf_loyalty, pf_notifications)
```

## 🛠️ Tech Stack

| Layer           | Technology         | Version         |
| --------------- | ------------------ | --------------- |
| Monorepo        | Turborepo          | 2.8.12          |
| Runtime         | Node.js            | 24.x LTS        |
| Language        | TypeScript         | 5.9.x           |
| Backend         | NestJS             | 11.1.x          |
| Frontend        | Next.js + React    | 16.1.x + 19.2.x |
| Database        | CockroachDB        | v25.2.13 LTS    |
| ORM             | Drizzle ORM        | 0.45.x          |
| Message Broker  | Apache Kafka KRaft | 4.2.0           |
| Styling         | Tailwind CSS       | 4.x             |
| Package Manager | pnpm               | 10.x            |

> **Kafka 4.x = no Zookeeper.** Kafka 4.0 (March 2025) removed Zookeeper entirely. PointFlow uses KRaft mode — one container, zero extra coordination overhead.

## 📁 Project Structure

```
pointflow/
├── apps/
│   ├── web/              # Admin dashboard (Next.js 16, port 3000)
│   └── portal/           # Customer self-service portal (Next.js 16, port 3005)
├── services/
│   ├── api-gateway/      # Public HTTP entry point (NestJS 11, port 3001)
│   ├── loyalty-engine/   # Points & tiers logic (NestJS TCP, port 3002)
│   ├── auth/             # JWT authentication (NestJS, port 3003)
│   ├── notification/     # Email delivery (NestJS Kafka consumer)
│   └── analytics/        # Statistics & reporting (NestJS HTTP + Kafka)
├── packages/
│   ├── typescript-config/ # Shared tsconfig (base / nextjs / nestjs)
│   ├── eslint-config/     # Shared ESLint rules
│   ├── contracts/         # TypeScript interfaces, DTOs & Kafka events
│   ├── drizzle-schemas/   # Database schemas
│   ├── types/             # Pure domain models (Settings, Entities)
│   └── utils/             # Shared helper functions (code generation, etc.)
├── infrastructure/
│   ├── docker-compose.yml        # Dev stack
│   └── docker-compose.prod.yml   # Production stack
└── scripts/
    ├── db-migrate-all.ts         # Global database migration runner
    └── db-seed-all.ts            # Global database seeding runner
```

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ and pnpm 10+
- Docker & Docker Compose v2

### 1. Clone & install

```bash
git clone https://github.com/binkowskidawid/pointflow.git
cd pointflow
pnpm install
```

### 2. Start infrastructure

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

This starts: CockroachDB (pf_loyalty and pf_notifications databases), Kafka 4.2 KRaft, MailHog (local email), and Kafka UI.

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your local values
```

### 4. Database Setup (Migrations & Seeding)

PointFlow uses a "Database per Service" architecture. We use global scripts to manage all databases at once.

```bash
# Apply migrations to all service databases
pnpm run db:migrate

# (Optional) Seed all databases with demo data
pnpm run db:seed
```

### 5. Start development

```bash
pnpm run dev
```

| Service         | URL                     |
| --------------- | ----------------------- |
| Admin Dashboard | <http://localhost:3000> |
| API Gateway     | <http://localhost:3001> |
| Loyalty Engine  | <http://localhost:3002> |
| Customer Portal | <http://localhost:3005> |
| Kafka UI        | <http://localhost:8090> |
| CockroachDB UI  | <http://localhost:8080> |
| MailHog         | <http://localhost:8025> |

## 🗺️ Roadmap

- [x] **Stage 1** — Monorepo foundation (Turborepo, shared packages, tsconfig)
- [x] **Stage 1** — `@pointflow/contracts` shared package (inter-service DTOs, Kafka event types)
- [x] **Stage 1** — Code quality toolchain (Prettier, Husky, lint-staged, GitHub Actions CI)
- [x] **Stage 1** — Loyalty Engine (NestJS 11, Drizzle ORM, CockroachDB)
- [x] **Stage 1** — Admin Dashboard (Next.js 16 + React Query + Tailwind 4)
- [x] **Stage 2** — Kafka 4.2 KRaft integration
- [x] **Stage 2** — API Gateway + TCP Internal Communication
- [ ] **Stage 2** — Notification Service (Kafka Consumer)
- [ ] **Stage 3** — Analytics Service + Customer Portal
- [ ] **Stage 3** — v1.0.0 release with `quickstart.sh`
- [ ] **Stage 4** — WebSockets real-time dashboard
- [ ] **Stage 4** — JavaScript/TypeScript SDK
- [ ] **Stage 4** — Swagger API docs

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

Good first issues to look for:

- Adding new notification channels (SMS via Twilio)
- Building a JavaScript SDK
- Improving test coverage
- Writing documentation

## 📄 License

MIT © [Dawid Bińkowski](https://github.com/binkowskidawid)

See [LICENSE](./LICENSE) for details.
