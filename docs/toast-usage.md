# React Hot Toast Implementation

## Overview
The application now uses `react-hot-toast` for all toast notifications with a custom `useToast` hook for consistent styling and easy usage.

## Installation
```bash
npm install react-hot-toast
```

## Setup
The Toaster component is already configured in `components/providers.tsx` and will work across the entire application.

## Usage

### Import the hook
```typescript
import { useToast } from '@/hooks/use-toast';
```

### Basic Examples

#### 1. Success Toast
```typescript
const toast = useToast();

toast.success('Payment completed successfully!');
toast.success('Verification successful!');
```

#### 2. Error Toast
```typescript
const toast = useToast();

toast.error('Payment failed. Please try again.');
toast.error('Invalid credentials.');
```

#### 3. Info Toast
```typescript
const toast = useToast();

toast.info('Please verify your ÖSYM information first.');
```

#### 4. Loading Toast
```typescript
const toast = useToast();

const toastId = toast.loading('Processing payment...');

// Later, dismiss it
toast.dismiss(toastId);
```

#### 5. Promise Toast (Automatic loading/success/error)
```typescript
const toast = useToast();

const paymentPromise = fetch('/api/payment', { method: 'POST' });

toast.promise(paymentPromise, {
  loading: 'Processing payment...',
  success: 'Payment successful!',
  error: 'Payment failed.',
});
```

## Real-World Examples

### Example 1: Payment Page Redirect
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      toast.success('Payment completed! Welcome to DUS360 Premium!');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else if (status === 'failure') {
      toast.error('Payment failed. Please try again.');
      setTimeout(() => router.push('/dashboard/payment'), 2000);
    }
  }, [searchParams, router, toast]);

  return <div>Redirecting...</div>;
}
```

### Example 2: Form Submission
```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ /* data */ }),
      });

      if (response.ok) {
        toast.success('ÖSYM verification successful!');
      } else {
        toast.error('Verification failed. Please check your information.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

### Example 3: Using Promise Toast
```typescript
'use client';

import { useToast } from '@/hooks/use-toast';

export default function PreferencesPage() {
  const toast = useToast();

  const savePreferences = async () => {
    const savePromise = fetch('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({ /* preferences */ }),
    }).then(res => {
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    });

    await toast.promise(savePromise, {
      loading: 'Saving preferences...',
      success: 'Preferences saved successfully!',
      error: 'Failed to save preferences.',
    });
  };

  return <button onClick={savePreferences}>Save</button>;
}
```

### Example 4: Authentication Flow
```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (email: string, password: string) => {
    const toastId = toast.loading('Signing in...');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      toast.dismiss(toastId);

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('An error occurred. Please try again.');
    }
  };

  return <>{/* login form */}</>;
}
```

### Example 5: Delete Confirmation
```typescript
'use client';

import { useToast } from '@/hooks/use-toast';

export default function PreferencesList() {
  const toast = useToast();

  const deletePreference = async (id: string) => {
    // You can use native confirm or a custom modal
    if (!confirm('Are you sure you want to delete this preference?')) {
      return;
    }

    const deletePromise = fetch(\`/api/preferences/\${id}\`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error('Failed to delete');
      return res.json();
    });

    await toast.promise(deletePromise, {
      loading: 'Deleting...',
      success: 'Preference deleted successfully!',
      error: 'Failed to delete preference.',
    });
  };

  return <>{/* preferences list */}</>;
}
```

## Available Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `success()` | Show success toast | `message: string` |
| `error()` | Show error toast | `message: string` |
| `info()` | Show info toast | `message: string` |
| `loading()` | Show loading toast | `message: string` |
| `promise()` | Auto handle promise states | `promise, { loading, success, error }` |
| `dismiss()` | Dismiss a toast | `toastId?: string` (optional) |

## Styling

The toast messages are pre-styled with:
- Position: top-right
- Duration: 4 seconds
- Dark background with white text
- Smooth animations
- Responsive design

You can customize individual toasts by modifying the `useToast` hook in `hooks/use-toast.ts`.

## Best Practices

1. **Always dismiss loading toasts** when operation completes
2. **Use promise toasts** for async operations when possible
3. **Keep messages concise** and user-friendly
4. **Use appropriate toast types** (success for confirmations, error for failures, info for notifications)
5. **Don't overuse toasts** - only for important user feedback
