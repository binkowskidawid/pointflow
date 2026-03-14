# @pointflow/web

<div align="center">
  <p><strong>The official Admin Dashboard and Reception Portal for PointFlow.</strong></p>
  <img src="https://img.shields.io/badge/next.js-16.x-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/react-19.x-blue" alt="React 19" />
  <img src="https://img.shields.io/badge/tailwindcss-4.x-38bdf8" alt="Tailwind CSS 4" />
</div>

## 🚀 Overview

PointFlow Web is the primary user interface for the platform, acting as the cockpit for business owners, receptionists, and administrators. Built with Next.js 16 (App Router) and React 19, it delivers a high-performance, responsive experience tailored for fast-paced retail and service environments.

Presently, it connects directly (in development mode) or via the API Gateway to manage the full lifecycle of a loyalty customer: from checking point balances and tier status to securely registering new visits.

## ✨ Key Responsibilities

- **Reception Panel**: Optimized interface for staff to quickly register new visits and search for loyalty cards using keyboard shortcuts and minimal clicks.
- **Data Visualization**: Presents customer history, tier progression, and points accumulation in a clear, highly readable format (Geist typography).
- **Professional Design System**: Implements a customized `shadcn/ui` foundation layered with Tailwind CSS 4.0 for a premium, dark-mode emerald aesthetic.
- **State Management**: Utilizes `@tanstack/react-query` to ensure instant UI updates, caching, and optimistic responses during slow network operations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: React 19, TypeScript 5.x
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Data Fetching**: [React Query 5](https://tanstack.com/query) & Axios
- **UI Components**: shadcn/ui (Tailwind 4 optimized)
- **Validation**: Zod 4

## 📁 Project Structure

```text
apps/web/
├── src/
│   ├── app/            # Next.js App Router (Layouts, Pages, Providers)
│   ├── components/     # Reusable UI components
│   ├── constants/      # Constants
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Shared utilities (api-client, utils)
│   └── styles/         # Global styles and Tailwind config
├── public/             # Static assets (icons, images)
└── ...config files
```

## 🏗️ Development

The Web Dashboard runs on port `3000` by default.

```bash
# Start the Next.js development server (from the monorepo root)
pnpm --filter @pointflow/web run dev
```

## 🎨 Design Principles

- **Clarity**: High contrast and readable typography (Geist Sans).
- **Efficiency**: Optimized for quick visit registration (keyboard shortcuts, minimal clicks).
- **Responsiveness**: Mobile-first design for receptionists using tablets.

### Environment Variables

| Variable                      | Description                       | Default                 |
| ----------------------------- | --------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_GATEWAY_URL` | Endpoint to internal Core/Gateway | `http://localhost:3001` |
