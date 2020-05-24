<?php


namespace Symbiote\Personalisation;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\NumericField;
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

        'AppliesTo' => "Enum('content,url,useragent,click,referrer,location')",
        "ExtractFrom" => "Enum('content,url,useragent,referrer,location')",
        'Target' => 'Varchar(255)',

        'Selector' => 'Varchar(128)',
        'ExtractSelector' => 'Varchar(255)',
        'Attribute' => 'Varchar(255)',
        'ExtractAttribute' => 'Varchar(255)',

        'NearestPoint' => 'Boolean',      // lat, lon format
        'MaxPointDistance' => 'Int',       // metres distance

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
        'referrer' => 'Referrer',
        'click' => 'A user click event',
        'location' => 'Distance from points',
    ];

    public function getCMSFields()
    {
        $eventDoc = '<p class="form__field-label">For click events, the $0 and $1 attributes are set to the href attribute and innerHTML of the element.</p>';
        $eventDoc .= '<p class="form__field-label">However, if you set a selector or regex in the extract section, the rules around those are used for populating attributes for tags</p> ';

        $availableFields = [
            TextField::create('Title', 'Rule name'),
            DropdownField::create('AppliesTo', 'Applies to', self::config()->applies_to),
            MultiValueTextField::create('Apply', 'Tags to apply')
                ->setRightTitle('Use $0, $1 etc for parameter replacements'),

        ];

        if ($this->AppliesTo == 'content') {
            $selectorFields = ToggleCompositeField::create('selector_rules', 'CSS match', [
                TextField::create('Selector', 'CSS Selector')
            ]);

            $selectorFields->setStartClosed($this->AppliesTo != 'content' || strlen($this->Selector) === 0);
            $availableFields[] = $selectorFields;
        }

        if ($this->AppliesTo != 'click' && $this->AppliesTo != 'location') {
            $regexFields = ToggleCompositeField::create('regex_fields', 'Regex match', [
                TextField::create('Regex', 'Regex to match')
            ]);
            $regexFields->setStartClosed(strlen($this->Regex) === 0);
            $availableFields[] = $regexFields;
        }

        if ($this->AppliesTo == 'click') {
            $eventFields = ToggleCompositeField::create('event_fields', 'Event options', [
                LiteralField::create('event_doc', $eventDoc),
                TextField::create('Target', 'CSS selector to bind event to'),
            ]);
            $eventFields->setStartClosed(strlen($this->Target) === 0);
            $availableFields[] = $eventFields;
        }

        if ($this->AppliesTo == 'location') {
            $distance = ToggleCompositeField::create('distance_fields', 'Distance options', [
                CheckboxField::create('NearestPoint', 'Match nearest point')
                    ->setRightTitle("If selected, will match the nearest point regardless of distance setting"),
                NumericField::create('MaxPointDistance', 'Maximum point distance to match')
                // TextField::create('Timeblock', 'Timeblock')
                //     ->setRightTitle('(NOT IMPLEMENTED) ie 8:00-10:30 to indicate that this is only triggered during this window of the day')
            ]);

            $distance->setStartClosed(!$this->NearestPoint && !$this->MaxPointDistance);

            $availableFields[] = $distance;
        }




        $timeFields = ToggleCompositeField::create('time_fields', 'Time options', [
            DropdownField::create('TimeOnPage', 'Time on page', ['0' => '0', '3' => '3', '10' => '10', '30' => '30', '120' => '120'])
                ->setRightTitle("User must be on page at least this many seconds before tagging occurs")
            // TextField::create('Timeblock', 'Timeblock')
            //     ->setRightTitle('(NOT IMPLEMENTED) ie 8:00-10:30 to indicate that this is only triggered during this window of the day')
        ]);

        $availableFields[] = $timeFields;
        $timeFields->setStartClosed(!$this->TimeOnPage);

        $extractFields = ToggleCompositeField::create('extract_fields', 'Extraction rules', [
            LiteralField::create('extract_help', '<p class="form__field-label">Rules for extracting content for tagging if different from above</p>'),
            DropdownField::create('ExtractFrom', 'Extract content from', self::config()->applies_to),
            TextField::create('ExtractSelector', 'CSS Selector'),
            TextField::create('Attribute', 'Element attribute extracted')
                ->setRightTitle("Use #content for innerHTML"),
            TextField::create('ExtractRegex', 'Regex to extract content')
        ]);

        $extractFields->setStartClosed(false);

        $availableFields[] = $extractFields;

        $fields = FieldList::create($availableFields);
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
