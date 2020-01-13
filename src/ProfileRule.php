<?php


namespace Symbiote\Personalisation;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\ToggleCompositeField;
use SilverStripe\ORM\ArrayLib;
use SilverStripe\ORM\DataObject;
use Symbiote\MultiValueField\Fields\MultiValueTextField;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

class ProfileRule extends DataObject
{
    private static $db = [
        'Title' => 'Varchar(128)',
        'Selector' => 'Varchar(128)',
        'AppliesTo' => "Enum('content,url,useragent,click')",
        'Regex' => 'Varchar(2000)',
        'Attribute' => 'Varchar(128)',
        'Apply' => MultiValueField::class,
    ];

    private static $applies_to = [
        'content',
        'url',
        'useragent',
        'click'
    ];

    public function getCMSFields()
    {
        $appliesOpt = ArrayLib::valuekey(self::config()->applies_to);

        $fields = FieldList::create([
            TextField::create('Title', 'Rule name'),
            DropdownField::create('AppliesTo', 'Applies to data', $appliesOpt),
            MultiValueTextField::create('Apply', 'Tags to apply')
                ->setRightTitle('Use $0, $1 etc for parameter replacements'),
            $selectorFields = ToggleCompositeField::create('selector_rules', 'CSS Based', [
                TextField::create('Selector', 'CSS Selector'),
                TextField::create('Attribute', 'Element attribute extracted')
                    ->setRightTitle("Use #content for innerHTML"),
            ]),
            $regexFields = ToggleCompositeField::create('regex_fields', 'Regex options', [
                TextField::create('Regex', 'Regex for content')
            ])
        ]);

        $selectorFields->setStartClosed($this->AppliesTo != 'content' || strlen($this->Selector) === 0);
        $regexFields->setStartClosed(strlen($this->Regex) === 0);

        $this->extend('updateCMSFields', $fields);

        return $fields;
    }

    public function toJson()
    {
        return [
            'name' => $this->Title,
            'appliesTo' => $this->AppliesTo,
            'regex' => $this->Regex,
            'selector' => $this->Selector,
            'attrbiute' => $this->Attribute,
            'apply' => $this->Apply->getValues(),
        ];
    }
}
