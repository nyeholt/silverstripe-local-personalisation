<?php

namespace Symbiote\Personalisation;

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;

class PersonalisationController extends Controller
{
    private static $allowed_actions = [
        'rules',
    ];

    public function rules(HTTPRequest $request)
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
                ];

                if ($rule->Target) {
                    $ruleData = array_merge($ruleData, [
                        'event' => 'click',
                        'target' => $rule->Target,
                    ]);
                }

                if ($rule->Selector) {
                    $data['selector'] = $rule->Selector;
                    $data['attribute'] = $rule->Attribute;
                }

                if ($rule->Regex) {
                    $data['regex'] = $rule->Regex;
                }

                $ruleData[] = $data;
            }
        }

        $set = [
            'rules' => $ruleData,
            'version' => implode('.', $version)
        ];

        $this->response->addHeader('Content-type', 'text/javascript');
        return 'window.PERSONSALISATION_RULESET = ' . json_encode($set) . ';';
    }
}
