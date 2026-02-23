<?php

namespace InertiaToast;

use Illuminate\Support\Facades\Session;
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

        return $this;
    }

    /**
     * Flash all pending toasts to the session, merging with any existing.
     */
    public function flash(): void
    {
        if (empty($this->pending)) {
            return;
        }

        $existing = Session::get($this->getSessionKey(), []);

        $toasts = array_merge(
            $existing,
            array_map(fn (ToastMessage $t) => $t->toArray(), $this->pending),
        );

        Session::flash($this->getSessionKey(), $toasts);

        $this->pending = [];
    }

    /**
     * Read toasts from the session (used by middleware to share with Inertia).
     *
     * @return array<int, array{message: string, level: string, duration: int|null}>
     */
    public function read(): array
    {
        return Session::get($this->getSessionKey(), []);
    }

    public function getSessionKey(): string
    {
        return config('inertia-toast.session_key', '_toasts');
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
