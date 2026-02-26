# Laravel Inertia Toast

Beautiful toast notifications for Laravel + Inertia.js applications. Fluent PHP API, multi-toast support, redirect-safe, with Vue 3 and React adapters.

## Features

- Fluent PHP API: `toast('Saved!')->success()` or `Toast::success('Saved!')`
- Multi-toast support — queue multiple toasts per request
- Redirect-safe — toasts survive redirect chains
- Zero config — no middleware or `HandleInertiaRequests` changes needed
- Vue 3 and React adapters with TypeScript support
- Position-aware with 6 positions (top-right, top-left, top-center, bottom-right, bottom-left, bottom-center)
- Tailwind CSS styling (v3 & v4 compatible)
- Client-side toast API via `useToast()` composable/hook

## Installation

### 1. PHP Package

```bash
composer require veekthoven/laravel-inertia-toast
```

Optionally publish the config:

```bash
php artisan vendor:publish --tag=inertia-toast-config
```

### 2. Frontend Adapter

**Vue 3:**

```bash
npm install @laravel-inertia-toast/vue
```

**React:**

```bash
npm install @laravel-inertia-toast/react
```

### 3. Tailwind CSS

Since the toast components use Tailwind classes internally, you need to add the package to Tailwind's source detection so the required classes are generated.

Add the following `@source` directive to your main CSS file (e.g. `resources/css/app.css`):

**Vue 3:**

```css
@source "../../node_modules/@laravel-inertia-toast/vue/dist/**/*.js";
```
<!-- Tailwind v3 -->

<!-- ```js
@source "../../node_modules/@laravel-inertia-toast/vue/src/**/*.vue";
``` -->

**React:**

```css
@source "../../node_modules/@laravel-inertia-toast/react/dist/**/*.js";
```

> The relative path assumes your CSS file is at `resources/css/app.css`. Adjust accordingly if your setup differs.

## Setup

### Vue 3

Register the plugin in your `app.js`:

```js
import { createApp } from 'vue'
import { InertiaToast } from '@laravel-inertia-toast/vue'

const app = createApp(App)
app.use(InertiaToast, {
  // Optional config overrides
  // duration: 5000,
  // position: 'top-right',
  // maxVisible: 5,
})
app.mount('#app')
```

Add the `<Toasts />` component to your layout:

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

Wrap your app with `<ToastProvider>` and add `<Toasts />`:

```jsx
import { ToastProvider, Toasts } from '@laravel-inertia-toast/react'

function Layout({ children }) {
  return (
    <ToastProvider config={{ position: 'top-right' }}>
      {children}
      <Toasts />
    </ToastProvider>
  )
}
```

## Server-Side Usage

### Using the Facade

```php
use InertiaToast\Facades\Toast;

// In a controller
Toast::success('Profile updated!');
Toast::error('Something went wrong.');
Toast::info('Check your email for a confirmation link.');
Toast::warning('Your subscription is about to expire.');

return redirect()->route('dashboard');
```

### Using the Helper

```php
// Fluent builder
toast('Profile updated!')->success();
toast('Something went wrong.')->error();
toast('Slow message.')->duration(10000)->warning();

// Direct access to Toaster
toast()->success('Quick shorthand');
```

### Custom Duration

```php
// Via facade
Toast::success('Saved!', 3000); // 3 seconds

// Via helper
toast('Done!')->duration(3000)->success();
```

## Client-Side Usage

Both adapters expose a `useToast()` composable/hook for triggering toasts from the frontend:

### Vue 3

```vue
<script setup>
import { useToast } from '@laravel-inertia-toast/vue'

const { success, error, info, warning } = useToast()

function handleClick() {
  success('Copied to clipboard!')
}
</script>
```

### React

```jsx
import { useToast } from '@laravel-inertia-toast/react'

function MyComponent() {
  const { success, error, info, warning } = useToast()

  return (
    <button onClick={() => success('Copied to clipboard!')}>
      Copy
    </button>
  )
}
```

## Configuration

Publish the config file:

```bash
php artisan vendor:publish --tag=inertia-toast-config
```

```php
// config/inertia-toast.php
return [
    'duration' => 5000,         // Default auto-dismiss duration (ms)
    'position' => 'top-right',  // Toast position on screen
    'max_visible' => 5,         // Max simultaneous toasts
    'prop_key' => 'toasts',     // Inertia flash key
];
```

Frontend config can be passed when registering the plugin (Vue) or via the `config` prop on `<ToastProvider>` (React).

## Packages

| Package | Description |
|---------|-------------|
| `veekthoven/laravel-inertia-toast` | PHP package — Facade, helper, Inertia flash integration |
| [`@laravel-inertia-toast/vue`](vue) | Vue 3 adapter — Plugin, composable, components |
| [`@laravel-inertia-toast/react`](react) | React adapter — Provider, hook, components |

## Requirements

- PHP 8.1+
- Laravel 10, 11, or 12
- Inertia.js v2.3.3+
- Vue 3.3+ or React 18+

## License

MIT
