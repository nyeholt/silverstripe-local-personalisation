<?php

namespace Symbiote\Personalisation;

use SilverStripe\Admin\ModelAdmin;

class PersonalisationManagement extends ModelAdmin
{
    private static $url_segment = 'personalisation';

    private static $menu_title = 'Personalisation';

    private static $managed_models = [
        ProfileRuleSet::class,
        PersonalisationProfile::class,
    ];
}
