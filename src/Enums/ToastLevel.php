<?php

namespace InertiaToast\Enums;

enum ToastLevel: string
{
    case Success = 'success';
    case Error = 'error';
    case Info = 'info';
    case Warning = 'warning';
}
