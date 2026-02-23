<?php

namespace InertiaToast;

use InertiaToast\Enums\ToastLevel;

class PendingToast
{
    protected ?int $duration = null;

    public function __construct(
        protected string $message,
        protected Toaster $toaster,
    ) {}

    public function duration(int $milliseconds): static
    {
        $this->duration = $milliseconds;

        return $this;
    }

    public function success(): Toaster
    {
        return $this->commit(ToastLevel::Success);
    }

    public function error(): Toaster
    {
        return $this->commit(ToastLevel::Error);
    }

    public function info(): Toaster
    {
        return $this->commit(ToastLevel::Info);
    }

    public function warning(): Toaster
    {
        return $this->commit(ToastLevel::Warning);
    }

    protected function commit(ToastLevel $level): Toaster
    {
        return $this->toaster->add($this->message, $level, $this->duration);
    }
}
