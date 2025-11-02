# NIDS Platforms

A modern, scalable monorepo built with Turborepo, Next.js, shadcn/ui, and Tailwind CSS v4. This project architecture supports multiple interconnected applications (Client and Provider) with shared UI components and configurations.

## 🚀 Project Structure

- **apps/client** - Main client-facing application
- **apps/provider** - Provider-facing application  
- **packages/ui** - Shared UI component library with shadcn/ui
- **packages/eslint-config** - Shared ESLint configurations
- **packages/typescript-config** - Shared TypeScript configurations

## 🛠 Technology Stack

- **Turborepo** - Monorepo management and build optimization
- **Next.js 15** - React framework with server components
- **React 19** - Modern UI library
- **shadcn/ui** - High-quality, accessible component library
- **Tailwind CSS v4** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **pnpm** - Fast, disk space efficient package manager

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation & Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

This will start all applications in the monorepo with hot module reloading.

## 🎨 Adding Components

To add shadcn/ui components to the shared UI package:

```bash
pnpm dlx shadcn@latest add button -c apps/client
```

Components will be placed in `packages/ui/src/components` and available across all applications.

## 💡 Using Components

Import shared UI components in your applications:

```tsx
import { Button } from '@workspace/ui/components/ui/button';
```

## 📚 Resources

- [shadcn/ui Documentation - Monorepo Setup](https://ui.shadcn.com/docs/monorepo)
- [Turborepo Documentation - shadcn/ui Integration](https://turbo.build/repo/docs/guides/tools/shadcn-ui)
- [Tailwind CSS v4 - Source Detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)

## 📄 License

MIT

