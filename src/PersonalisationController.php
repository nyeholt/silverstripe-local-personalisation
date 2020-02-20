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
        $activeRules = ProfileRuleSet::get()->filter('Active', 1);

        $set = [
            'rules' => [
                'name' => "RouteTimetable",
                'appliesTo' => 'url',
                'regex' => 'route/timetable/(\\d+)/([^/]+)',
                'apply' => [
                    'route-timetable',
                    'route-$2',
                ]
            ]
        ];

        $this->response->addHeader('Content-type', 'text/javascript');
        return 'window.PERSONSALISATION_RULESET = ' . json_encode($set) . ';';
    }
}
