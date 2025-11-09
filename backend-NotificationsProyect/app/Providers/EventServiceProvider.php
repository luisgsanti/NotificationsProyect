<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\NotificationCreated;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Los eventos que se deben registrar.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        NotificationCreated::class => [],
    ];

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        parent::boot();
        
    }


}
