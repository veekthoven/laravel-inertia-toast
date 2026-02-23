<?php

namespace InertiaToast\Tests;

use Illuminate\Support\Facades\Session;
use InertiaToast\Enums\ToastLevel;
use InertiaToast\Facades\Toast;
use InertiaToast\PendingToast;
use InertiaToast\Toaster;
use InertiaToast\ToastMessage;

class ToasterTest extends TestCase
{
    public function test_toaster_is_registered_as_singleton(): void
    {
        $a = app(Toaster::class);
        $b = app(Toaster::class);

        $this->assertSame($a, $b);
    }

    public function test_toaster_accumulates_pending_toasts(): void
    {
        $toaster = app(Toaster::class);

        $toaster->success('Saved!');
        $toaster->error('Something went wrong');

        $this->assertTrue($toaster->hasPending());
        $this->assertCount(2, $toaster->getPending());
    }

    public function test_toaster_flashes_to_session(): void
    {
        $toaster = app(Toaster::class);

        $toaster->success('Saved!');
        $toaster->error('Oops');
        $toaster->flash();

        $this->assertFalse($toaster->hasPending());

        $flashed = Session::get('_toasts');

        $this->assertCount(2, $flashed);
        $this->assertEquals('Saved!', $flashed[0]['message']);
        $this->assertEquals('success', $flashed[0]['level']);
        $this->assertEquals('Oops', $flashed[1]['message']);
        $this->assertEquals('error', $flashed[1]['level']);
    }

    public function test_flash_merges_with_existing_session_data(): void
    {
        Session::flash('_toasts', [
            ['message' => 'Existing', 'level' => 'info', 'duration' => null],
        ]);

        $toaster = app(Toaster::class);
        $toaster->success('New one');
        $toaster->flash();

        $flashed = Session::get('_toasts');

        $this->assertCount(2, $flashed);
        $this->assertEquals('Existing', $flashed[0]['message']);
        $this->assertEquals('New one', $flashed[1]['message']);
    }

    public function test_flash_does_nothing_when_no_pending(): void
    {
        $toaster = app(Toaster::class);
        $toaster->flash();

        $this->assertNull(Session::get('_toasts'));
    }

    public function test_read_returns_session_toasts(): void
    {
        $toasts = [
            ['message' => 'Hello', 'level' => 'info', 'duration' => null],
        ];

        Session::flash('_toasts', $toasts);

        $toaster = app(Toaster::class);

        $this->assertEquals($toasts, $toaster->read());
    }

    public function test_read_returns_empty_array_when_no_toasts(): void
    {
        $toaster = app(Toaster::class);

        $this->assertEquals([], $toaster->read());
    }

    public function test_all_level_methods(): void
    {
        $toaster = app(Toaster::class);

        $toaster->success('s');
        $toaster->error('e');
        $toaster->info('i');
        $toaster->warning('w');

        $pending = $toaster->getPending();

        $this->assertEquals(ToastLevel::Success, $pending[0]->level);
        $this->assertEquals(ToastLevel::Error, $pending[1]->level);
        $this->assertEquals(ToastLevel::Info, $pending[2]->level);
        $this->assertEquals(ToastLevel::Warning, $pending[3]->level);
    }

    public function test_custom_duration(): void
    {
        $toaster = app(Toaster::class);

        $toaster->success('Quick', 2000);
        $toaster->flash();

        $flashed = Session::get('_toasts');

        $this->assertEquals(2000, $flashed[0]['duration']);
    }

    public function test_facade_works(): void
    {
        Toast::success('Via facade');
        Toast::flash();

        $flashed = Session::get('_toasts');

        $this->assertCount(1, $flashed);
        $this->assertEquals('Via facade', $flashed[0]['message']);
    }

    public function test_helper_returns_toaster_without_arguments(): void
    {
        $this->assertInstanceOf(Toaster::class, toast());
    }

    public function test_helper_returns_pending_toast_with_message(): void
    {
        $this->assertInstanceOf(PendingToast::class, toast('Hello'));
    }

    public function test_pending_toast_builder(): void
    {
        toast('Built!')->success();

        $toaster = app(Toaster::class);

        $this->assertTrue($toaster->hasPending());

        $pending = $toaster->getPending();
        $this->assertEquals('Built!', $pending[0]->message);
        $this->assertEquals(ToastLevel::Success, $pending[0]->level);
    }

    public function test_pending_toast_with_custom_duration(): void
    {
        toast('Slow')->duration(10000)->warning();

        $toaster = app(Toaster::class);
        $toaster->flash();

        $flashed = Session::get('_toasts');

        $this->assertEquals(10000, $flashed[0]['duration']);
        $this->assertEquals('warning', $flashed[0]['level']);
    }

    public function test_toast_message_is_arrayable(): void
    {
        $msg = new ToastMessage('Test', ToastLevel::Error, 3000);

        $this->assertEquals([
            'message' => 'Test',
            'level' => 'error',
            'duration' => 3000,
        ], $msg->toArray());
    }

    public function test_toast_message_is_json_serializable(): void
    {
        $msg = new ToastMessage('Test', ToastLevel::Info);

        $json = json_encode($msg);

        $this->assertJson($json);
        $this->assertStringContainsString('"message":"Test"', $json);
        $this->assertStringContainsString('"level":"info"', $json);
    }

    public function test_config_values_are_used(): void
    {
        config(['inertia-toast.session_key' => '_custom_toasts']);
        config(['inertia-toast.prop_key' => 'custom_toasts']);

        $toaster = app(Toaster::class);

        $this->assertEquals('_custom_toasts', $toaster->getSessionKey());
        $this->assertEquals('custom_toasts', $toaster->getPropKey());
    }

    public function test_config_defaults_are_set(): void
    {
        $this->assertEquals(5000, config('inertia-toast.duration'));
        $this->assertEquals('top-right', config('inertia-toast.position'));
        $this->assertEquals(5, config('inertia-toast.max_visible'));
        $this->assertEquals('toasts', config('inertia-toast.prop_key'));
        $this->assertEquals('_toasts', config('inertia-toast.session_key'));
    }
}
