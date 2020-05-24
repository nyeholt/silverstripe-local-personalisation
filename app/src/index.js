import { loadProfile } from "./profile/Profile";

import './style/profile.scss';

if (window.PERSONSALISATION_RULESET) {

    const profile = loadProfile(window.PERSONSALISATION_RULESET.rules, window.PERSONSALISATION_RULESET.points, window.PERSONSALISATION_RULESET.version);

    const dummy_Data = [
        {
            name: "RouteTimetable",
            appliesTo: 'url',
            regex: 'route/timetable/(\\d+)/([^/]+)',
            apply: [
                'route-timetable',
                'route-$2',
            ]
        },
        {
            name: "RouteDetail",
            appliesTo: 'url',
            regex: 'route/(\\d+)/([^/]+)',
            apply: [
                'route-detail',
                'route-$2',
            ]
        },
        {
            name: "Subject",
            appliesTo: 'content',
            selector: 'meta[name="dcterms.subject"]',
            attribute: 'content',
            apply: [
                '$0',
            ]
        },
        {
            name: "JourneyPlanner",
            event: "click",
            target: '.dropdown-menu a[href*="/journey"]',
            apply: [
                '$0',
                '$1',
                'journey-planner',
            ]
        },
        {
            name: "Favourite Stop",
            event: "click",
            target: '.lp-stop-fvt',
            appliesTo: 'url',
            regex: 'stop/(\\d+)/([^/]+)',
            apply: [
                'favouriter',
                'fvt-stop-$1',
                'fvt-stop-route-$2',
                'stop-favourite',
            ]
        }
    ];

    profile.evaluateRequest();

    window.DEBUG_SHOW_PROFILE = function () {
        console.log(profile.data);
    }

} else {
    console.warn("Profile.js: PERSONSALISATION_RULESET not found");
}
