# Deployment Guide - NDIS Platforms (TanStack Start)

## Table of Contents
1. [Overview](#overview)
2. [Architecture History](#architecture-history)
3. [Current Configuration](#current-configuration)
4. [Vercel Setup](#vercel-setup)
5. [Troubleshooting](#troubleshooting)
6. [Known Issues](#known-issues)
7. [References](#references)

---

## Overview

The `ndis-platforms` monorepo contains a TanStack Start application (`apps/dashboard`) deployed to Vercel. This document explains the deployment configuration, common issues, and solutions.

**Key Facts:**
- **Framework:** TanStack Start v1.132.0 (Vite-based)
- **Deployment Platform:** Vercel
- **Monorepo Tool:** Turborepo + pnpm workspaces
- **Build Output:** Vercel Build Output API v3 format

---

## Architecture History

### The Migration Problem (January 2026)

**What Happened:**
- TanStack Start migrated from **Vinxi/Nitro** to **Vite** in v1.121.0 (October 2025)
- This was a **breaking change** that required configuration updates
- Deployments that worked in December 2025 broke after upgrading to v1.132.0

**Key Architectural Change:**
> "we don't use nitro internally anymore in start" - TanStack Maintainer (Oct 2025)

However, the Vercel deployment preset still requires Nitro for build output generation.

### Configuration Evolution

**Before (Vinxi/Nitro Era):**
```
✅ app.config.ts (Nitro config)
✅ nitro.config.ts (Nitro build config)
✅ nitro dependency
✅ nitro() Vite plugin
```

**After Migration (Vite Era):**
```
✅ app.config.ts (TanStack Start config using @tanstack/react-start/config)
❌ nitro.config.ts (DELETED - no longer needed)
✅ nitro dependency (still needed for Vercel preset)
✅ nitro() Vite plugin (still needed for build output)
```

---

## Current Configuration

### File Structure

```
apps/dashboard/
├── app.config.ts          # TanStack Start server configuration
├── vite.config.ts         # Vite + plugins configuration
├── package.json           # Dependencies including nitro
├── src/
│   ├── routes/           # File-based routes
│   ├── router.tsx        # Router setup
│   └── ...
└── dist/                 # Build output (gitignored)
    ├── client/           # Client-side assets
    └── server/           # Server-side bundle

.vercel/                   # Vercel Build Output (gitignored)
├── config.json           # Vercel configuration
├── functions/            # Serverless functions
└── static/               # Static assets
```

### Configuration Files

#### 1. `app.config.ts`
```typescript
import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'vercel',
  },
});
```

**Purpose:** Tells TanStack Start to build for Vercel deployment.

#### 2. `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite';
import viteReact from '@vitejs/plugin-react';
// ... other imports

export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),      // TanStack Start plugin
    nitro({                // Nitro plugin for Vercel output
      preset: 'vercel',
    }),
    viteReact(),
    devtools(),
  ],
  // ... rest of config
});
```

**Purpose:**
- `tanstackStart()` - Handles routing and SSR
- `nitro({ preset: 'vercel' })` - Generates Vercel Build Output API structure

#### 3. `package.json` (relevant parts)
```json
{
  "scripts": {
    "dev": "NODE_OPTIONS='--import ./instrument.server.mjs' vite dev --port 3000",
    "build": "vite build",
    "start": "node --import ./.vercel/output/static/_server/instrument.server.mjs ./.vercel/output/static/_server/index.mjs"
  },
  "dependencies": {
    "@tanstack/react-start": "^1.132.0",
    // ... other deps
  },
  "devDependencies": {
    "nitro": "3.0.1-alpha.2",  // Required for Vercel preset
    // ... other dev deps
  }
}
```

#### 4. `turbo.json` (monorepo root)
```json
{
  "tasks": {
    "build": {
      "outputs": [
        ".next/**",
        ".output/**",
        ".vercel/**",
        "dist/**"  // Added for TanStack Start output
      ]
    }
  }
}
```

**Purpose:** Tells Turborepo where to find build outputs for caching.

---

## Vercel Setup

### Project Settings (Vercel Dashboard)

Go to: **Vercel Dashboard → Your Project → Settings → General**

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `TanStack Start` | Critical! Auto-detects build config |
| **Root Directory** | `apps/dashboard` | Points to dashboard app in monorepo |
| **Build Command** | (empty/auto-detect) | Vercel auto-detects `pnpm turbo run build --filter=dashboard` |
| **Output Directory** | (empty/auto-detect) | Nitro generates `.vercel/` automatically |
| **Install Command** | `pnpm install` | Uses pnpm for monorepo |
| **Node.js Version** | 20.x or 22.x | TanStack Start compatible versions |

### Environment Variables

Required environment variables in Vercel:

```bash
VITE_API_BASE_URL=<your-api-url>
VITE_SENTRY_DSN=<sentry-dsn>  # Optional, for error tracking
```

### Build Process

1. **Install:** `pnpm install` at monorepo root
2. **Build:** `pnpm turbo run build --filter=dashboard`
3. **Turbo:** Runs `vite build` in `apps/dashboard`
4. **Vite:**
   - Builds client assets → `dist/client/`
   - Builds server bundle → `dist/server/`
5. **Nitro:** Transforms output → `.vercel/` (Build Output API v3)
6. **Vercel:** Deploys from `.vercel/` directory

### Deployment Methods

#### 1. GitHub Integration (Recommended)
- **Auto-deploy** on push to `main` branch
- Uses settings from Vercel Dashboard
- Best for production deployments

#### 2. Vercel CLI (Manual)
```bash
# From monorepo root
cd ndis-platforms
vercel --prod
```

#### 3. Deploy Script (Legacy)
```bash
# From ndis-platforms/
./deploy.sh
```
⚠️ **Note:** `deploy.sh` is for manual CLI deploys. GitHub deployments use Vercel UI settings instead.

---

## Troubleshooting

### Common Issues

#### Issue 1: "No Output Directory found after Build"

**Symptoms:**
```
Error: No Output Directory named ".vercel" found after the Build completed.
```

**Cause:** Nitro isn't generating the Vercel output structure.

**Solutions:**
1. Verify `nitro` is in `devDependencies`
2. Check `vite.config.ts` includes `nitro({ preset: 'vercel' })` plugin
3. Check `app.config.ts` has `server: { preset: 'vercel' }`
4. Clear Vercel build cache and redeploy

#### Issue 2: Build Succeeds but 404 on Deployment

**Symptoms:**
- Build completes successfully in ~1 minute
- Deployment shows as completed
- Visiting URL returns 404 Not Found

**Possible Causes:**
1. **Wrong Framework Preset** - Must be "TanStack Start", not "Other" or "Vite"
2. **Missing serverless function** - Check `.vercel/functions/` exists after build
3. **Routing configuration** - Check `.vercel/config.json` has correct routes
4. **Monorepo path issue** - Root directory must be `apps/dashboard`

**Debug Steps:**
1. Run local build: `cd apps/dashboard && pnpm build`
2. Check `.vercel/` directory exists
3. Verify `.vercel/config.json` contains routing rules
4. Check `.vercel/functions/` has server function
5. Review Vercel Runtime Logs for actual error

#### Issue 3: "Invalid lazy handler" Runtime Error

**Symptoms:**
```
TypeError: Invalid lazy handler
    at file:///var/task/index.mjs:777:48
```

**Cause:** Conflicting Nitro configurations or old Nitro artifacts.

**Solution:**
1. Delete old config files:
   ```bash
   rm apps/dashboard/nitro.config.ts  # If exists
   ```
2. Use `app.config.ts` with `@tanstack/react-start/config` only
3. Clear `.vercel/`, `dist/`, and `node_modules/`
4. Fresh install: `pnpm install`
5. Rebuild: `pnpm build`

#### Issue 4: Turbo Warning "no output files found"

**Symptoms:**
```
WARNING no output files found for task dashboard#build.
Please check your `outputs` key in `turbo.json`
```

**Cause:** Turborepo doesn't know about TanStack Start output directories.

**Solution:**
Add to `turbo.json`:
```json
{
  "tasks": {
    "build": {
      "outputs": [
        ".next/**",
        ".output/**",
        ".vercel/**",
        "dist/**"      // ← Add this
      ]
    }
  }
}
```

### Debugging Commands

```bash
# Check build output structure locally
cd apps/dashboard
pnpm build
ls -la .vercel/
find .vercel/ -type f | head -20

# Check Vercel CLI status
vercel ls --yes

# Inspect specific deployment
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>

# Check git status for uncommitted changes
git status

# Verify dependencies are correct
cat package.json | grep -A 5 "devDependencies"
```

---

## Known Issues

### 1. Node.js Version Warning
**Warning:** `You are using Node.js 20.12.1. Vite requires Node.js version 20.19+ or 22.12+`

**Impact:** Non-blocking warning during local builds.

**Solution:** Upgrade Node.js to 20.19+ or 22.12+ for local development.

### 2. Sentry Instrumentation
The build script used to copy `instrument.server.mjs` for Sentry:
```json
"build": "vite build && mkdir -p .output/server && cp instrument.server.mjs .output/server/"
```

**Current Status:** Simplified to `"build": "vite build"` - Sentry instrumentation may need reconfiguration.

**Todo:** Verify Sentry works in production after migration.

### 3. Peer Dependency Warnings
```
jotai-devtools requires React ^16/17/18 but found 19.2.3
```

**Impact:** Warnings only, functionality works.

**Reason:** React 19 is newer than jotai-devtools expects.

---

## References

### Documentation
- [TanStack Start on Vercel](https://vercel.com/docs/frameworks/full-stack/tanstack-start)
- [TanStack Start Hosting Guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Vercel Build Output API](https://vercel.com/docs/build-output-api/v3)
- [Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo)

### Migration Guides
- [Migrating TanStack Start from Vinxi to Vite (LogRocket)](https://blog.logrocket.com/migrating-tanstack-start-vinxi-vite/)
- [Why TanStack Start is Ditching Adapters](https://tanstack.com/blog/why-tanstack-start-is-ditching-adapters)

### Community Solutions
- [TanStack Start in pnpm Turborepo - Vercel Community](https://community.vercel.com/t/deployment-of-tanstack-start-on-vercel-in-a-pnpm-turborepo/29739)
- [TanStack Router Issue #4432 - Invalid lazy handler](https://github.com/TanStack/router/issues/4432)
- [Sentry + TanStack Start Vercel Deployment](https://github.com/getsentry/sentry-javascript/issues/18794)

### Key GitHub Issues
- [TanStack Router #4431 - Invalid lazy handler result](https://github.com/TanStack/router/issues/4431)
- [TanStack Router #4021 - vercel.json doesn't work](https://github.com/TanStack/router/issues/4021)
- [Nitro #3905 - Prerender broken on Vercel](https://github.com/nitrojs/nitro/issues/3905)

---

## Changelog

### 2026-01-31
- **Migration:** Completed Vinxi → Vite migration
- **Removed:** `nitro.config.ts` (no longer needed)
- **Updated:** `app.config.ts` to use `@tanstack/react-start/config`
- **Added:** `nitro()` plugin to `vite.config.ts` for Vercel preset
- **Added:** `dist/**` to `turbo.json` outputs
- **Status:** Deployment builds successfully but returns 404 (troubleshooting in progress)

### Previous (December 2025)
- Initial deployment working with Vinxi/Nitro setup
- Used old `app.config.ts` and `nitro.config.ts` configuration

---

## Contact

For deployment issues:
1. Check this documentation first
2. Review Vercel deployment logs
3. Check [GitHub Issues](https://github.com/greenway-au/frontend/issues)
4. Ask in team Slack channel

**Last Updated:** 2026-01-31
