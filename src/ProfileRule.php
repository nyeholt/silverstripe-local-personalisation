<?php


namespace Symbiote\Personalisation;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\ToggleCompositeField;
use SilverStripe\ORM\DataObject;
use Symbiote\MultiValueField\Fields\MultiValueTextField;
use Symbiote\MultiValueField\ORM\FieldType\MultiValueField;

class ProfileRule extends DataObject
{
    private static $table_name = 'ProfileRule';

    private static $db = [
        'Title' => 'Varchar(128)',

        'AppliesTo' => "Enum('content,url,useragent,click,referrer')",
        "ExtractFrom" => "Enum('content,url,useragent,referrer')",
        'Target' => 'Varchar(255)',

        'Selector' => 'Varchar(128)',
        'ExtractSelector' => 'Varchar(255)',
        'Attribute' => 'Varchar(255)',
        'ExtractAttribute' => 'Varchar(255)',

        'Regex' => 'Varchar(2000)',
        'ExtractRegex' => 'Varchar(2000)',
        // 'Timeframe' => 'Varchar(128)',
        'EventData' => 'Varchar(255)',
        'Timeblock' => 'Varchar(128)',
        'TimeOnPage' => 'Int',
        'Apply' => MultiValueField::class,
    ];

    private static $applies_to = [
        'content' => 'Page content',
        'url' => 'Current page URL',
        'useragent' => 'Browser user agent',
        'click' => 'A user click event',
    ];

    public function getCMSFields()
    {
        $eventDoc = '<p class="form__field-label">For click events, the $0 and $1 attributes are set to the href attribute and innerHTML of the element.</p>';
        $eventDoc .= '<p class="form__field-label">However, if you set a selector or regex in the extract section, the rules around those are used for populating attributes for tags</p> ';

        $fields = FieldList::create([
            TextField::create('Title', 'Rule name'),
            DropdownField::create('AppliesTo', 'Applies to', self::config()->applies_to),
            MultiValueTextField::create('Apply', 'Tags to apply')
                ->setRightTitle('Use $0, $1 etc for parameter replacements'),
            $selectorFields = ToggleCompositeField::create('selector_rules', 'CSS match', [
                TextField::create('Selector', 'CSS Selector'),

            ]),
            $regexFields = ToggleCompositeField::create('regex_fields', 'Regex match', [
                TextField::create('Regex', 'Regex to match')
            ]),
            $eventFields = ToggleCompositeField::create('event_fields', 'Event options', [
                LiteralField::create('event_doc', $eventDoc),
                TextField::create('Target', 'CSS selector to bind event to'),
            ]),
            $timeFields = ToggleCompositeField::create('time_fields', 'Time options', [
                DropdownField::create('TimeOnPage', 'Time on page', ['0' => '0', '3' => '3', '10' => '10', '30' => '30', '120' => '120'])
                    ->setRightTitle("User must be on page at least this many seconds before tagging")
                // TextField::create('Timeblock', 'Timeblock')
                //     ->setRightTitle('(NOT IMPLEMENTED) ie 8:00-10:30 to indicate that this is only triggered during this window of the day')
            ]),
            $extractFields = ToggleCompositeField::create('extract_fields', 'Extraction rules', [
                LiteralField::create('extract_help', '<p class="form__field-label">Rules for extracting content for tagging if different from above</p>'),
                DropdownField::create('ExtractFrom', 'Extract content from', self::config()->applies_to),
                TextField::create('ExtractSelector', 'CSS Selector'),
                TextField::create('Attribute', 'Element attribute extracted')
                    ->setRightTitle("Use #content for innerHTML"),
                TextField::create('ExtractRegex', 'Regex to extract content')
            ])
        ]);

        $selectorFields->setStartClosed($this->AppliesTo != 'content' || strlen($this->Selector) === 0);
        $regexFields->setStartClosed(strlen($this->Regex) === 0);
        $eventFields->setStartClosed(strlen($this->Target) === 0);
        $timeFields->setStartClosed(!$this->TimeOnPage);

        $extractFields->setStartClosed(false);

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
