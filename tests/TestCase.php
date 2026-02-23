<?php

namespace InertiaToast\Tests;

use InertiaToast\InertiaToastServiceProvider;
use Orchestra\Testbench\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app): array
    {
        return [
            InertiaToastServiceProvider::class,
        ];
    }

    protected function getPackageAliases($app): array
    {
        return [
            'Toast' => \InertiaToast\Facades\Toast::class,
        ];
    }
}
