# Server Actions + TanStack Query Pattern

This document demonstrates how to use Server Actions with TanStack Query and axios to replace `useEffect` patterns in your application.

## Core Pattern

### 1. Server Actions (lib/actions/*.ts)

Server actions run on the server and can access server-side resources securely:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import axios from "axios";

// Example 1: Using Supabase directly
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Example 2: Using axios for external APIs
export async function fetchExternalData(endpoint: string) {
  try {
    const response = await axios.get(`https://api.example.com/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Example 3: Combining Supabase + axios
export async function getUserWithExternalData(userId: string) {
  const supabase = await createClient();
  
  // Fetch from Supabase
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  // Fetch additional data from external API
  const externalData = await axios.get(
    `https://api.example.com/users/${userId}/stats`
  );
  
  return {
    ...user,
    stats: externalData.data,
  };
}
```

### 2. TanStack Query Hooks (hooks/*.ts)

Create custom hooks that use TanStack Query to call server actions:

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, fetchExternalData } from "@/lib/actions/user-actions";

// Example 1: Simple query hook
export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { user, loading: isLoading };
}

// Example 2: Query with parameters
export function useExternalData(endpoint: string) {
  return useQuery({
    queryKey: ["external", endpoint],
    queryFn: () => fetchExternalData(endpoint),
    enabled: !!endpoint, // Only run if endpoint is provided
  });
}

// Example 3: Mutation for updates
export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      // Call your server action
      return await updateUserAction(userData);
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
```

### 3. Usage in Components

```tsx
"use client";

import { useUser } from "@/hooks/useUser";
import { useExternalData } from "@/hooks/useExternalData";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const { data: stats, isLoading: statsLoading } = useExternalData("stats");

  if (loading || statsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
```

## Benefits Over useEffect

### ❌ Old Pattern (useEffect)
```typescript
// Problems: manual loading states, no caching, race conditions, memory leaks
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;
  
  async function fetchData() {
    const result = await fetch('/api/data');
    if (!cancelled) {
      setData(result);
      setLoading(false);
    }
  }
  
  fetchData();
  return () => { cancelled = true; };
}, []);
```

### ✅ New Pattern (Server Actions + TanStack Query)
```typescript
// Benefits: automatic caching, loading states, error handling, refetching
const { data, isLoading } = useQuery({
  queryKey: ["data"],
  queryFn: fetchDataAction,
});
```

## Key Advantages

1. **No useEffect needed** - TanStack Query handles data fetching lifecycle
2. **Automatic caching** - Reduces unnecessary API calls
3. **Server-side execution** - Server actions run on the server, keeping secrets safe
4. **Type safety** - Full TypeScript support end-to-end
5. **Error handling** - Built-in error states and retry logic
6. **Optimistic updates** - Easy to implement with mutations
7. **DevTools** - React Query DevTools for debugging

## When to Use Each Approach

### Use Supabase Client Directly (in Server Actions)
- Database queries
- Authentication operations
- File storage operations

### Use Axios (in Server Actions)
- External API calls
- REST endpoints
- Third-party services
- When you need custom headers, interceptors, or request/response transformation

### Keep Minimal useEffect
- Real-time subscriptions (Supabase auth state changes)
- WebSocket connections
- DOM manipulation
- Browser APIs (localStorage, window events)

## Migration Checklist

When converting a useEffect to this pattern:

- [ ] Create server action in `lib/actions/`
- [ ] Add `"use server"` directive
- [ ] Move data fetching logic to server action
- [ ] Create custom hook using `useQuery` or `useMutation`
- [ ] Replace `useState` + `useEffect` with the custom hook
- [ ] Remove manual loading/error state management
- [ ] Test the new implementation

## Example: Complete Migration

### Before
```typescript
// ❌ Old approach
"use client";
import { useEffect, useState } from "react";

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      });
  }, []);

  return { payments, loading };
}
```

### After
```typescript
// ✅ New approach

// lib/actions/payment-actions.ts
"use server";
import { createClient } from "@/lib/supabase/server";

export async function getPayments() {
  const supabase = await createClient();
  const { data } = await supabase.from('payments').select('*');
  return data;
}

// hooks/usePayments.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/lib/actions/payment-actions";

export function usePayments() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
  });

  return { payments: payments ?? [], loading: isLoading };
}
```

## Advanced Patterns

### Dependent Queries
```typescript
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: getCurrentUser,
});

const { data: userPosts } = useQuery({
  queryKey: ["posts", user?.id],
  queryFn: () => getUserPosts(user!.id),
  enabled: !!user, // Only run when user exists
});
```

### Parallel Queries
```typescript
const queries = useQueries({
  queries: [
    { queryKey: ["user"], queryFn: getCurrentUser },
    { queryKey: ["payments"], queryFn: getPayments },
    { queryKey: ["events"], queryFn: getEvents },
  ],
});

const [userQuery, paymentsQuery, eventsQuery] = queries;
```

### Infinite Queries (Pagination)
```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```
