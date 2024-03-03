<?php

namespace App\Listeners;

use Statamic\Events\GlobalSetSaved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class RecompileMixAfterBrandingSaved
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  GlobalSetSaved  $event
     * @return void
     */
    public function handle(GlobalSetSaved $event)
    {
        // Check if the saved global set is 'branding'
        if ($event->globals->handle() === 'branding') {
            // Checks the environment status
            if ( env('APP_ENV') === 'production' ) {
                // Run the 'npm run prod' command
                exec('npm run prod');
            } else {
                // Run the 'npm run dev' command
                exec('npm run dev');
            }
        }
    }
}