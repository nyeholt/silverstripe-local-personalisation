<?php

namespace Symbiote\Personalisation;

use Psr\SimpleCache\CacheInterface;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;

class PersonalisationController extends Controller
{
    private static $allowed_actions = [
        'rules',
    ];

    /**
     * Build a personalisation rule set based on a given
     * filter
     */
    public static function build_rules($ruleSetFilter = [])
    {
        $max = ProfileRule::get()->max('LastEdited');
        $setMax = ProfileRuleSet::get()->max('LastEdited');
        $id = ProfileRule::get()->count();

        $key = md5("rules,$max,$id,$setMax," . json_encode($ruleSetFilter));

        $ruleSetFilter['Active'] = 1;

        $cache = Injector::inst()->get(CacheInterface::class . '.localPersonalisation');
        $data = $cache->get($key);

        $set = [];

        if (!$data) {
            $activeRules = ProfileRuleSet::get()->filter($ruleSetFilter)->sort('ID ASC');

            $version = [];

            $ruleData = [];
            $pointData = [];

            foreach ($activeRules as $ruleset) {
                $version[] = $ruleset->VersionMarker;
                foreach ($ruleset->Rules() as $rule) {
                    $ruleData[] = $rule->toJson();
                }
                foreach ($ruleset->Points() as $point) {
                    if (!strpos($point->Location, ',')) {
                        continue;
                    }
                    list($lat, $lon) = explode(",", $point->Location);
                    $data = [
                        'title' => $point->Title,
                        'lat' => (float) $lat,
                        'lon' => (float) $lon
                    ];
                    $pointData[] = $data;
                }
            }

            $set = [
                'rules' => $ruleData,
                'points' => $pointData,
                'version' => implode('.', $version)
            ];

            $cache->set($key, json_encode($set));
        } else {
            $set = json_decode($data);
        }

        return $set;
    }

    public function rules(HTTPRequest $request)
    {
        $set = self::build_rules();
        $this->response->addHeader('Content-type', 'text/javascript');
        return 'window.PERSONSALISATION_RULESET = ' . json_encode($set) . ';';
    }
}
