<?php


namespace Symbiote\Personalisation;

use SilverStripe\ORM\DataObject;

class ProfileRulePoint extends DataObject
{
    private static $table_name = 'ProfileRulePoint';

    private static $db = [
        'Title' => 'Varchar(255)',
        'Location' => 'Varchar(128)',
    ];

    public function onBeforeWrite() {
        parent::onBeforeWrite();

        $this->Location = str_replace(' ', '', $this->Location);
    }

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->dataFieldByName('Location')->setRightTitle('The centre point of a named radius');

        return $fields;
    }
}
