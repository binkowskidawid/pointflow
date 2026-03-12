# 🌐 PointFlow Web — Customer & Reception Portal

> The frontend cockpit for the PointFlow ecosystem. Built with Next.js 16, React 19, and Tailwind CSS 4.

---

## 🚀 Overview

PointFlow Web is the primary interface for our loyalty platform. It consists of two main areas:

- **Reception Panel**: For clinic/store staff to register visits and manage loyalty cards.
- **Customer Portal**: For users to check their points, history, and current tiers.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: React 19, TypeScript 5.x
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Data Fetching**: [React Query 5](https://tanstack.com/query) & Axios
- **UI Components**: shadcn/ui (Tailwind 4 optimized)
- **Validation**: Zod 4

## 📂 Project Structure

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

## 🏗 Setup & Development

Inside the monorepo root:

```bash
# Install dependencies
pnpm install

# Start production-like dev server
pnpm turbo dev --filter=@pointflow/web

# Typecheck
pnpm turbo typecheck --filter=@pointflow/web
```

## 🔗 Environment Variables

| Variable                         | Description            | Default                 |
| -------------------------------- | ---------------------- | ----------------------- |
| `NEXT_PUBLIC_LOYALTY_ENGINE_URL` | Loyalty Engine API URL | `http://localhost:3002` |

---

## 🎨 Design Principles

- **Clarity**: High contrast and readable typography (Geist Sans).
- **Efficiency**: Optimized for quick visit registration (keyboard shortcuts, minimal clicks).
- **Responsiveness**: Mobile-first design for receptionists using tablets.
