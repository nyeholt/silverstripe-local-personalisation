<?php


namespace Symbiote\Personalisation;

use SilverStripe\ORM\DataObject;

class PersonalisationProfile extends DataObject
{
    private static $table_name = 'PersonalisationProfile';

    private static $db = [
        'Title' => 'Varchar(255)',
    ];

    /**
     * We use the extension to ensure that this base generalisation has all the
     * fields that something with this applied to will have.
     * The extension will know about this base 'generalisation' of what a
     * profile looks like so it can be merged into that applied to the parent
     * data object.
     */
    private static $extensions = [
        PersonalisationExtension::class,
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $title = $fields->dataFieldByName('Title');
        $fields->insertBefore('ShowTags', $title);

        $fields->removeByName('ProfileID');

        return $fields;
    }
}
