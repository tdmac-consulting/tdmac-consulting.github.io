<?php

namespace App\Listeners;

use Statamic\Events\GlobalSetSaved;
use Statamic\Facades\GlobalSet;

class UpdateBrandingSettings
{
    /**
     * Handle the event.
     *
     * @param  GlobalSetSaved  $event
     * @return void
     */
    public function handle(GlobalSetSaved $event)
    {
        // Fetch the existing branding configuration
        $brandingConfig = config('branding');
    
        // Check if the saved global set is 'branding' or 'browser_appearance'
        if ($event->globals->handle() === 'branding') {
            // Access the saved values
            $mainLogo = $event->globals->inDefaultSite()->get('rectangular_logo');
            $favicon = $event->globals->inDefaultSite()->get('favicon');
    
            // Prepend the relative path
            $mainLogo = '/assets/' . $mainLogo;
            $mainLogo = '/assets/' . $favicon;
    
            // Update the branding configuration
            $brandingConfig['nav_logo'] = $mainLogo;
            $brandingConfig['outside_logo'] = $mainLogo;
            $brandingConfig['favicon'] = $favicon;
        }
    
        // Write the updated branding configuration back to the branding.php file
        $configPath = config_path('branding.php');
        $configContent = "<?php\n\nreturn " . var_export($brandingConfig, true) . ";\n";
        file_put_contents($configPath, $configContent);
    }
}