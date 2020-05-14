<?php

namespace Symbiote\Personalisation;

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;

class PersonalisationController extends Controller
{
    private static $allowed_actions = [
        'rules',
    ];

    public static function build_rules()
    {
        $activeRules = ProfileRuleSet::get()->filter('Active', 1)->sort('ID ASC');

        $version = [];

        $ruleData = [];
        foreach ($activeRules as $ruleset) {
            $version[] = $ruleset->VersionMarker;
            foreach ($ruleset->Rules() as $rule) {
                $data = [
                    'name' => $rule->Title,
                    'apply' => $rule->Apply ? $rule->Apply->getValues() : [],
                    'appliesTo' => $rule->AppliesTo,
                    'time' => $rule->TimeOnPage,
                ];

                if ($rule->Target) {
                    $data = array_merge($data, [
                        'event' => 'click',
                        'target' => $rule->Target,
                    ]);
                }

                if ($rule->Selector) {
                    $data['selector'] = $rule->Selector;
                }

                if ($rule->Regex) {
                    $data['regex'] = $rule->Regex;
                }

                $extractor = [
                    'appliesTo' => $rule->ExtractFrom,
                    'selector' => $rule->ExtractSelector,
                    'attribute' => $rule->Attribute,
                    'regex' => $rule->ExtractRegex,
                ];
                $data['extractor'] = $extractor;

                $ruleData[] = $data;
            }
        }

        $set = [
            'rules' => $ruleData,
            'version' => implode('.', $version)
        ];
        return $set;
    }

    public function rules(HTTPRequest $request)
    {
        $set = self::build_rules();
        $this->response->addHeader('Content-type', 'text/javascript');
        return 'window.PERSONSALISATION_RULESET = ' . json_encode($set) . ';';
    }
}
