# Dashboard Architecture Guide

This document describes the architecture patterns, conventions, and best practices for the dashboard application. Follow these patterns to maintain consistency and AI-friendliness.

## Tech Stack

- **Framework**: TanStack Start (React 19, Vite, Tailwind v4)
- **Routing**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query
- **Forms**: TanStack Form + Zod validation
- **State Management**: Jotai (atoms)
- **UI Components**: @workspace/ui (shadcn-based)

---

## Project Structure

```
apps/dashboard/src/
├── components/           # Shared UI components
│   ├── layouts/          # Layout components (DashboardLayout, AuthLayout)
│   └── common/           # Reusable components (PageHeader, ErrorFallback, etc.)
│       └── form/         # Form field wrappers
├── features/             # Feature modules (domain-specific)
│   ├── auth/             # Authentication feature
│   └── participants/     # Participants feature (example pattern)
├── hooks/                # Shared hooks
├── lib/                  # Core utilities
│   ├── api/              # API client, errors, token management
│   └── utils/            # Formatting helpers
├── routes/               # TanStack Router file-based routes
│   ├── _dashboard/       # Dashboard layout routes (authenticated)
│   └── login.tsx         # Public routes
├── stores/               # Jotai atoms (global state)
├── types/                # Shared type definitions
└── integrations/         # Third-party integrations (Query, Jotai providers)
```

---

## Feature Module Pattern

Each feature follows this structure:

```
features/{feature-name}/
├── api/
│   ├── {feature}.api.ts       # API calls
│   └── {feature}.queries.ts   # TanStack Query hooks + query keys
├── components/
│   ├── {Feature}List.tsx      # List view
│   ├── {Feature}Card.tsx      # Card component
│   ├── {Feature}Form.tsx      # Create/Edit form
│   ├── {Feature}Detail.tsx    # Detail view
│   └── {Feature}Skeleton.tsx  # Loading skeletons
├── hooks/
│   └── use-{feature}.ts       # Feature-specific hooks
├── schemas/
│   └── {feature}.schema.ts    # Zod validation schemas
├── types/
│   └── {feature}.types.ts     # TypeScript types
└── index.ts                   # Public exports
```

### Creating a New Feature

1. Create the folder structure under `features/`
2. Define types in `types/{feature}.types.ts`
3. Create Zod schemas in `schemas/{feature}.schema.ts`
4. Implement API calls in `api/{feature}.api.ts`
5. Create query hooks with key factory in `api/{feature}.queries.ts`
6. Build components
7. Export public API from `index.ts`

---

## Query Key Factory Pattern

Always use a query key factory for TanStack Query:

```typescript
// features/participants/api/participants.queries.ts

export const participantKeys = {
  all: ['participants'] as const,
  lists: () => [...participantKeys.all, 'list'] as const,
  list: (filters: ParticipantFilters) => [...participantKeys.lists(), filters] as const,
  details: () => [...participantKeys.all, 'detail'] as const,
  detail: (id: string) => [...participantKeys.details(), id] as const,
} as const;

// Usage in hooks
export function useParticipants(filters: ParticipantFilters = {}) {
  return useQuery({
    queryKey: participantKeys.list(filters),
    queryFn: () => participantsApi.list(filters),
  });
}
```

---

## API Layer Pattern

### API Client (`lib/api/client.ts`)

```typescript
import { api } from '@/lib/api';

// GET request
const data = await api.get<ResponseType>('/endpoint');

// POST request
const result = await api.post<ResponseType>('/endpoint', payload);

// With query params
const items = await api.get<ResponseType>('/endpoint', {
  params: { search: 'term', page: 1 }
});
```

### Feature API Module

```typescript
// features/{feature}/api/{feature}.api.ts

const BASE_PATH = '/api/v1/{feature}';

export const featureApi = {
  list: (filters = {}) => api.get(`${BASE_PATH}`, { params: filters }),
  get: (id: string) => api.get(`${BASE_PATH}/${id}`),
  create: (data) => api.post(BASE_PATH, data),
  update: (id: string, data) => api.patch(`${BASE_PATH}/${id}`, data),
  delete: (id: string) => api.delete(`${BASE_PATH}/${id}`),
} as const;
```

---

## Jotai State Management

### Atom Patterns

```typescript
// stores/auth.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Persisted atom (survives page refresh)
export const userAtom = atomWithStorage<User | null>('auth:user', null);

// Derived atom
export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  return user !== null;
});

// Action atom (write-only)
export const clearAuthAtom = atom(null, (_get, set) => {
  set(userAtom, null);
});
```

### Using Atoms

```typescript
import { useAtomValue, useSetAtom, useAtom } from 'jotai';

// Read-only
const user = useAtomValue(userAtom);

// Write-only
const clearAuth = useSetAtom(clearAuthAtom);

// Read + Write
const [theme, setTheme] = useAtom(themeAtom);
```

---

## Form Handling with TanStack Form

### Form Component Pattern

```typescript
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { createSchema } from '../schemas/{feature}.schema';

export function FeatureForm() {
  const form = useForm({
    defaultValues: { field: '' },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createSchema,
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.Field name="field">
        {(field) => (
          <FieldWrapper
            label="Field Label"
            htmlFor="field"
            errors={field.state.meta.errors}
            touched={field.state.meta.isTouched}
          >
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </FieldWrapper>
        )}
      </form.Field>
    </form>
  );
}
```

---

## Type Definitions

### Shared Types (`types/`)

```typescript
// types/api.ts - API response wrappers
export interface ApiResponse<T> { data: T; message?: string; }
export interface PaginatedResponse<T> { items: T[]; meta: PaginationMeta; }

// types/common.ts - Shared entities
export interface BaseEntity { id: string; createdAt: string; updatedAt: string; }

// types/auth.ts - Auth-specific types
export interface User { id: string; email: string; name: string; role: UserRole; }
```

### Feature Types

```typescript
// features/{feature}/types/{feature}.types.ts
import type { BaseEntity } from '@/types/common';

export interface Feature extends BaseEntity {
  // feature-specific fields
}

export interface CreateFeaturePayload {
  // fields for creation
}

export interface FeatureFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
```

---

## Component Patterns

### Page Header

```typescript
import { PageHeader } from '@/components/common/PageHeader';

<PageHeader
  title="Page Title"
  description="Optional description"
  backLink={{ to: '/parent', label: 'Back' }}
  action={{ label: 'Create', href: '/create' }}
/>
```

### Error Handling

```typescript
import { ErrorFallback } from '@/components/common/ErrorFallback';

if (isError) {
  return <ErrorFallback error={error} onRetry={refetch} />;
}
```

### Empty State

```typescript
import { EmptyState } from '@/components/common/EmptyState';

if (!data?.items.length) {
  return (
    <EmptyState
      title="No items found"
      description="Get started by creating your first item"
      action={{ label: 'Create Item', href: '/items/new' }}
    />
  );
}
```

### Loading Skeleton

```typescript
import { Skeleton } from '@workspace/ui/components/skeleton';

export function FeatureSkeleton() {
  return (
    <Card>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
    </Card>
  );
}
```

---

## Routing Conventions

### File-based Routes

```
routes/
├── __root.tsx              # Root layout (providers, HTML shell)
├── _dashboard.tsx          # Dashboard layout route
├── _dashboard/
│   ├── index.tsx           # / (home)
│   ├── overview.tsx        # /overview
│   └── participants/
│       ├── index.tsx       # /participants (list)
│       ├── new.tsx         # /participants/new (create)
│       └── $participantId.tsx  # /participants/:id (detail)
└── login.tsx               # /login (public)
```

### Route Component Pattern

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/feature/')({
  component: FeaturePage,
});

function FeaturePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Feature" />
      <FeatureList />
    </div>
  );
}
```

---

## Hooks

### Custom Hooks Location

- **Shared hooks**: `hooks/` (useToast, useDebounce, useConfirm)
- **Feature hooks**: `features/{feature}/hooks/` (useFeatureFilter)

### Hook Naming

- `use{Feature}` - Get single item
- `use{Features}` - Get list
- `useCreate{Feature}` - Create mutation
- `useUpdate{Feature}` - Update mutation
- `useDelete{Feature}` - Delete mutation

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `participant-list.tsx` |
| Components | PascalCase | `ParticipantList` |
| Hooks | camelCase with `use` prefix | `useParticipants` |
| Types | PascalCase | `Participant`, `ParticipantFilters` |
| Atoms | camelCase with `Atom` suffix | `userAtom`, `themeAtom` |
| API modules | camelCase with `Api` suffix | `participantsApi` |
| Query keys | camelCase with `Keys` suffix | `participantKeys` |
| Schemas | camelCase with `Schema` suffix | `createParticipantSchema` |

---

## Import Order

```typescript
// 1. React/Framework imports
import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

// 2. Third-party imports
import { useAtomValue } from 'jotai';

// 3. Workspace imports
import { Button } from '@workspace/ui/components/button';

// 4. Absolute imports (@ alias)
import { PageHeader } from '@/components/common/PageHeader';
import { useParticipants } from '@/features/participants';

// 5. Relative imports
import { LocalComponent } from './LocalComponent';

// 6. Types (at the end)
import type { Participant } from '@/features/participants';
```

---

## Best Practices

1. **Type everything**: Use TypeScript strictly, avoid `any`
2. **Colocate by feature**: Keep related code together
3. **Single responsibility**: Each file does one thing
4. **Export from index**: Use barrel exports for features
5. **Use query keys**: Always use the key factory pattern
6. **Handle loading/error**: Every data fetch needs states
7. **Validate forms**: Use Zod schemas for all forms
8. **Persist wisely**: Only persist what's needed (auth, preferences)
9. **Document patterns**: Add JSDoc comments for complex logic
10. **Keep routes thin**: Business logic in features, not routes
