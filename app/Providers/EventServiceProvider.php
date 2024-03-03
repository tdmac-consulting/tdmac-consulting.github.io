<?php

namespace App\Providers;

use App\Listeners\RecompileMixAfterBrandingSaved;
use App\Listeners\UpdateBrandingSettings;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use Statamic\Events\GlobalSetSaved;
use Statamic\Events\FormSubmitted;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        GlobalSetSaved::class => [
            RecompileMixAfterBrandingSaved::class,
            UpdateBrandingSettings::class,
        ],
        FormSubmitted::class => [
            FormListener::class,
        ],
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
