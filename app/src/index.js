import { loadProfile } from "./profile/Profile";



const profile = loadProfile([
    {
        name: "RouteTimetable",
        appliesTo: 'url',
        regex: 'route/timetable/(\\d+)/([^/]+)',
        apply: [
            'route-timetable',
            'route-$2',
        ]
    }
]);

profile.evaluateRequest();
profile.save();

console.log(profile);
