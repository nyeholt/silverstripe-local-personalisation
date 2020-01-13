<?php

namespace Symbiote\Personalisation;

use SilverStripe\ORM\DataObject;

class ProfleRuleSet extends DataObject
{
    private static $db = [
        'Title' => 'Varchar(128)',
        'Active' => 'Boolean'
    ];

    private static $many_many = [
        'Rules' => ProfileRule::class
    ];

}
