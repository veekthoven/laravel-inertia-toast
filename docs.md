# Documentation

## Installation

### Server (PHP)

```bash
composer require veekthoven/laravel-inertia-toast
```

The package auto-registers its service provider. No manual setup needed.

To publish the config file:

```bash
php artisan vendor:publish --tag=inertia-toast-config
```

### Client

Pick the adapter for your frontend framework:

```bash
# Vue 3
npm install @laravel-inertia-toast/vue

# React
npm install @laravel-inertia-toast/react
```

---

## Setup

### Vue 3

```js
// app.js
import { createApp } from 'vue'
import { InertiaToast } from '@laravel-inertia-toast/vue'

const app = createApp(App)
app.use(InertiaToast)
app.mount('#app')
```

Add `<Toasts />` to your layout:

```vue
<script setup>
import { Toasts } from '@laravel-inertia-toast/vue'
</script>

<template>
  <div>
    <slot />
    <Toasts />
  </div>
</template>
```

### React

Wrap your app with `<ToastProvider>` and render `<Toasts />`:

```jsx
import { ToastProvider, Toasts } from '@laravel-inertia-toast/react'

function Layout({ children }) {
  return (
    <ToastProvider>
      {children}
      <Toasts />
    </ToastProvider>
  )
}
```

---

## Server-Side API

### Facade

```php
use InertiaToast\Facades\Toast;

Toast::success('Profile updated!');
Toast::error('Something went wrong.');
Toast::info('Check your email.');
Toast::warning('Subscription expiring soon.');

return redirect()->route('dashboard');
```

Pass a custom duration (in milliseconds) as the second argument:

```php
Toast::success('Saved!', 3000);
```

### Helper Function

Call `toast()` with a message to get a fluent builder:

```php
toast('Profile updated!')->success();
toast('Oops!')->error();
toast('Heads up.')->duration(8000)->warning();
```

Call `toast()` without arguments to access the `Toaster` instance directly:

```php
toast()->success('Shorthand');
toast()->error('Also works');
```

### Multiple Toasts

Queue as many toasts as you like in a single request:

```php
Toast::success('Order placed!');
Toast::info('Confirmation email sent.');

return back();
```

### Redirects

Toasts automatically survive redirects. No extra work needed — the package uses `Inertia::flash()` which persists data through redirects automatically.

```php
toast('Welcome back!')->success();

return redirect()->route('dashboard'); // toast still shows
```

---

## Client-Side API

Both adapters provide a `useToast()` composable/hook for triggering toasts without a server round-trip.

### Vue 3

```vue
<script setup>
import { useToast } from '@laravel-inertia-toast/vue'

const { success, error, info, warning, remove, clear, items } = useToast()
</script>

<template>
  <button @click="success('Copied!')">Copy</button>
  <button @click="clear()">Dismiss all</button>
</template>
```

### React

```jsx
import { useToast } from '@laravel-inertia-toast/react'

function CopyButton() {
  const { success } = useToast()

  return <button onClick={() => success('Copied!')}>Copy</button>
}
```

### API

| Method | Description |
|--------|-------------|
| `success(message, duration?)` | Show a success toast |
| `error(message, duration?)` | Show an error toast |
| `info(message, duration?)` | Show an info toast |
| `warning(message, duration?)` | Show a warning toast |
| `remove(id)` | Dismiss a specific toast |
| `clear()` | Dismiss all toasts |
| `items` | Reactive list of active toasts (Vue: `ComputedRef`, React: array) |

---

## Configuration

```php
// config/inertia-toast.php
return [
    // Auto-dismiss duration in milliseconds
    'duration' => 5000,

    // Position: top-right, top-left, top-center,
    //           bottom-right, bottom-left, bottom-center
    'position' => 'top-right',

    // Maximum toasts visible at once
    'max_visible' => 5,

    // Inertia flash key
    'prop_key' => 'toasts',
];
```

Frontend config can also be passed at setup time:

**Vue:**

```js
app.use(InertiaToast, {
  duration: 3000,
  position: 'bottom-right',
  maxVisible: 3,
})
```

**React:**

```jsx
<ToastProvider config={{ duration: 3000, position: 'bottom-right', maxVisible: 3 }}>
```

---

## Toast Levels

| Level | Style | Icon |
|-------|-------|------|
| `success` | Green | Checkmark circle |
| `error` | Red | X circle |
| `warning` | Yellow | Exclamation triangle |
| `info` | Blue | Information circle |

---

## Migrating from Raw Session Flash

If you currently do this:

```php
return back()->with('toast', [
    'message' => 'Saved!',
    'level' => 'success',
]);
```

Replace with:

```php
toast('Saved!')->success();
return back();
```

Then remove `'toast' => session('toast')` from your `HandleInertiaRequests::share()` method — the package handles sharing via `Inertia::flash()` automatically.
