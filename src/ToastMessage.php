<?php

namespace InertiaToast;

use Illuminate\Contracts\Support\Arrayable;
use InertiaToast\Enums\ToastLevel;
use JsonSerializable;

class ToastMessage implements Arrayable, JsonSerializable
{
    public function __construct(
        public readonly string $message,
        public readonly ToastLevel $level = ToastLevel::Info,
        public readonly ?int $duration = null,
    ) {}

    /** @return array{message: string, level: string, duration: int|null} */
    public function toArray(): array
    {
        return [
            'message' => $this->message,
            'level' => $this->level->value,
            'duration' => $this->duration,
        ];
    }

    /** @return array{message: string, level: string, duration: int|null} */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
