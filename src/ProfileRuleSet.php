<?php

namespace Symbiote\Personalisation;

use SilverStripe\ORM\DataObject;

class ProfileRuleSet extends DataObject
{
    private static $table_name = 'ProfileRuleSet';

    private static $db = [
        'Title' => 'Varchar(128)',
        'VersionMarker' => 'Int',
        'Active' => 'Boolean'
    ];

    private static $many_many = [
        'Rules' => ProfileRule::class,
        'Points' => ProfileRulePoint::class,
    ];
}
