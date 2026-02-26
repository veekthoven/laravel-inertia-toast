<?php

namespace InertiaToast;

use Inertia\Inertia;
use InertiaToast\Enums\ToastLevel;

class Toaster
{
    /** @var ToastMessage[] */
    protected array $pending = [];

    public function success(string $message, ?int $duration = null): static
    {
        return $this->add($message, ToastLevel::Success, $duration);
    }

    public function error(string $message, ?int $duration = null): static
    {
        return $this->add($message, ToastLevel::Error, $duration);
    }

    public function info(string $message, ?int $duration = null): static
    {
        return $this->add($message, ToastLevel::Info, $duration);
    }

    public function warning(string $message, ?int $duration = null): static
    {
        return $this->add($message, ToastLevel::Warning, $duration);
    }

    public function add(string $message, ToastLevel $level = ToastLevel::Info, ?int $duration = null): static
    {
        $this->pending[] = new ToastMessage($message, $level, $duration);

        Inertia::flash(
            $this->getPropKey(),
            array_map(fn (ToastMessage $t) => $t->toArray(), $this->pending),
        );

        return $this;
    }

    public function getPropKey(): string
    {
        return config('inertia-toast.prop_key', 'toasts');
    }

    /**
     * Check if there are pending (not yet flashed) toasts.
     */
    public function hasPending(): bool
    {
        return ! empty($this->pending);
    }

    /**
     * Get pending toasts (mainly for testing).
     *
     * @return ToastMessage[]
     */
    public function getPending(): array
    {
        return $this->pending;
    }
}
