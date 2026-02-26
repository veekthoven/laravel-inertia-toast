# @laravel-inertia-toast/vue

Vue 3 adapter for [Laravel Inertia Toast](https://github.com/veekthoven/laravel-inertia-toast) — beautiful toast notifications for Laravel + Inertia.js applications.

## Demo

**Vue:**
![Vue](../demo/vue.png)

**See it in action:**
![Vue](../demo/toast-demo.gif)

## Installation

```bash
npm install @laravel-inertia-toast/vue
```

## Setup

### 1. Register the Plugin

Register the plugin in your `app.js`:

```js
// in your resources/js/app.js

import { createApp } from 'vue'
import { InertiaToast } from '@laravel-inertia-toast/vue'

const app = createApp(App)
app.use(InertiaToast, {
    duration: 5000,
    position: 'top-right',
    maxVisible: 5,
})
app.mount('#app')
```

### 2. Add the Toasts Component

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

### 3. Tailwind CSS

Since the toast components use Tailwind classes internally, add the package to Tailwind's source detection.

**Tailwind v4** — add this `@source` directive to your CSS file (e.g. `resources/css/app.css`):

```css
@source "../../node_modules/@laravel-inertia-toast/vue/dist/**/*.js";
```

**Tailwind v3** — add to `tailwind.config.js`:

```js
module.exports = {
    content: [
        // ...
        './node_modules/@laravel-inertia-toast/vue/dist/**/*.js',
    ],
}
```

> The relative paths above assume standard Laravel project structure. Adjust if your setup differs.

## Client-Side Usage

Use the `useToast()` composable to trigger toasts from your components:

```vue
<script setup>
import { useToast } from '@laravel-inertia-toast/vue'

const { success, error, info, warning } = useToast()

function handleClick() {
  success('Copied to clipboard!')
}
</script>
```

## Server-Side Usage

Pair with the PHP package for server-side toasts:

```bash
composer require veekthoven/laravel-inertia-toast
```

```php
use InertiaToast\Facades\Toast;

Toast::success('Profile updated!');
Toast::error('Something went wrong.');
Toast::info('Check your email for a confirmation link.');
Toast::warning('Your subscription is about to expire.');

return redirect()->route('dashboard');
```

For full documentation, configuration options, and the PHP helper API, see the [main repository](https://github.com/veekthoven/laravel-inertia-toast).

## Requirements

- Vue 3.3+
- Inertia.js v2.3.3+
- Tailwind CSS v3 or v4

## License

MIT
