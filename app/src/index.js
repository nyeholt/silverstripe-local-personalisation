import { loadProfile } from "./profile/Profile";

import './style/profile.scss';


const profile = loadProfile([
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
    }
]);

profile.evaluateRequest();
profile.save();

console.log(profile);
