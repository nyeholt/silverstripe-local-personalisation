
import { loadProfile } from '../profile/Profile';

const rules = [
    {
        name: "RouteTimetable",
        appliesTo: 'url',
        extractor: {
            appliesTo: "url",
            selector: "",
            attribute: "",
            regex: "route/timetable/(\\d+)/([^/]+)",
        },
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
        selector: 'meta[name="title"]',
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

describe('Profile.js', () => {
    beforeAll(() => {
        delete window.location;
        window.location = { reload: jest.fn(), href: "" };
    });


    test('Profile can be created', () => {
        const profile = loadProfile(rules, [], 1);
        expect(profile).not.toBeNull();

        const stored = JSON.parse(localStorage.getItem('lp_user_state'));
        expect(stored.version).toEqual("2.1");

        localStorage.clear();

    });

    test('Profile reloads data', () => {
        let profile = loadProfile(rules, [], 1);
        expect(profile).not.toBeNull();

        const stored = JSON.parse(localStorage.getItem('lp_user_state'));

        profile = loadProfile(rules, [], 1);

        expect(profile.data.uid == stored.uid);

        localStorage.clear();

        profile = loadProfile(rules, [], 1);

        expect(profile.data.uid).not.toEqual(stored.uid);

        localStorage.clear();

    });


    test('Profile URL rule evaluated', () => {
        let profile = loadProfile([rules[0]], [], 1);

        location.href = "localhost/route/timetable/16/werribee"

        profile.checkRules();

        expect(profile.data.tags['route-timetable'].acc.length).toBe(1);

        const div = document.createElement('div')
        div.innerHTML = `
        <label for="username">Username</label>
        <input id="username" />
        <button>Print Username</button>
    `
    });


});
