import * as uuidv4 from "uuid/v4";

let profile;

const PROFILE_NAME = 'lp_user_state';

const MAX_FREQ = 10;

const MAX_TAGS = 50;

const VERSION = 2;

class Profile {

    /**
     * {
     *    tags: {
     *      tag: {
     *          acc: [
     *              date-added
     *          ]
     *      }
     *    }
     * }
     */
    data;

    /**
     * [
     *  {
     *      name: '',
     *      appliesTo: 'url' | 'content' | 'useragent' | 'click'
     *      regex: '',
     *      selector: 'string'
     *      attribute: 'attr-name' | '#content' // the attribute to use as the value, or #content for innerHTML
     *      apply: [
     *          'tag',
     *          integer index into regex
     *      ]
     *  }
     * ]
     */
    ruleset;

    /**
     * [{
     *      title: '',
     *      lat: '',
     *      lon: ''
     * }]
     */
    points;

    /**
     * Same as above, but sorted in distance order
     */
    sortedPoints;

    /**
     * What rule set version are we on?
     */
    version;


    /**
     * A mapping of rule selector to an index into
     * ruleset
     */
    clickRules;

    /**
     * Captures time based rules
     */
    timeRules;

    /**
     * {
     *  latitude,
     *  longitude
     * }
     */
    myPosition;

    constructor(rules, points, version) {
        this.ruleset = rules;
        this.points = points;
        this.version = version || 1;
        this.clickRules = {};

    }

    evaluateRequest() {
        this.checkRules();
        this.checkContent();

        if (this.points.length > 0 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                if (position.coords) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    let distancePoints = [];
                    for (let i = 0; i < this.points.length; i++) {
                        let point = this.points[i];
                        point.distance = this.distance(lat, lon, point.lat, point.lon);
                        distancePoints.push(point);
                    }
                    this.sortedPoints = distancePoints.sort((a, b) => {
                        return a.distance < b.distance ? -1 : (a.distance == b.distance ? 0 : 1);
                    });

                    this.checkLocation();
                }
            });
        }

        setTimeout(() => {
            console.log("Profile.js: checking 3s rules");
            this.checkRules(3);
            this.checkContent();
        }, 3000);

        setTimeout(() => {
            console.log("Profile.js: checking 10s rules");
            this.checkRules(10);
            this.checkContent();
        }, 10000);

        setTimeout(() => {
            console.log("Profile.js: checking 30s rules");
            this.checkRules(30);
            this.checkContent();
        }, 30000);

        setTimeout(() => {
            console.log("Profile.js: checking 120s rules");
            this.checkRules(120);
            this.checkContent();
        }, 120000);
    }

    checkRules(forTime) {
        let matched = false;
        for (let i = 0; i < this.ruleset.length; i++) {
            const rule = this.ruleset[i];
            const execTime = parseInt(rule.time);
            if ((forTime && execTime != forTime) || (!forTime && execTime)) {
                continue;
            }
            let isMatch = false;
            if (rule.event === 'click' && rule.target) {
                // we only evaluate this rule on a specific click action
                this.clickRules[rule.target] = i;
            } else if (rule.selector) {
                isMatch = this.isCssMatch(rule);
            } else if (rule.regex) {
                isMatch = this.isMatch(rule);
            }

            if (isMatch) {
                matched = true;
                let matchData = this.extractData(rule);
                if (matchData && matchData.length > 0) {
                    console.log("Profile.js: apply from page match", matchData);
                    this.applyRule(rule, matchData);
                }
            }
        }

        if (matched) {
            this.save();
        }

        // only bind click on the first time through
        if (!forTime && Object.keys(this.clickRules).length > 0) {
            this.bindClickEvents();
        }
    }

    checkLocation() {
        let matched = false;
        for (let i = 0; i < this.ruleset.length; i++) {
            const rule = this.ruleset[i];
            let isMatch = false;
            if (rule.appliesTo == 'location') {
                isMatch = this.nearestPoint(rule);
            }

            if (isMatch) {
                matched = true;
                let matchData = this.extractData(rule);
                if (matchData && matchData.length > 0) {
                    console.log("Profile.js: apply from location match", matchData);
                    this.applyRule(rule, matchData);
                }
            }
        }
        if (matched) {
            this.save();
        }
    }

    checkContent() {
        // find all items that are marked as special
        const elements = document.getElementsByClassName('lp-item');
        const myTags = this.data.tags;

        if (!elements) {
            return;
        }

        /**
         * Do the passed in tags match the tags on a
         * given element?
         *
         * @param {string} tags
         * @param {number} times
         */
        const matchesTags = function (tags, numberOfTimes, timeSince) {
            if (tags && tags.length > 0) {
                const matchedTags = [];
                const requireAllTags = tags[0] === '+';
                const matchTags = tags.replace("+", "").replace(" ", "").split(',');
                for (let i = 0; i < matchTags.length; i++) {
                    if (matchTags[i].length <= 0) {
                        continue;
                    }

                    const negated = matchTags[i][0] == '!';
                    const findTag = matchTags[i].replace("!", "");

                    // if we didn't find the tags in my list of tags,
                    // AND this tag isn't being used in the 'not present' sense.
                    // we shoulding continue
                    if ((!myTags[findTag] && !negated) || (myTags[findTag] && negated)) {
                        break;
                    }

                    console.log("Profile.Js: " + matchTags[i] + " matched profile");

                    const thisTag = myTags[findTag];
                    const validHits = [];
                    if (timeSince > 0 && thisTag) {
                        const timeSinceMs = timeSince * 1000;
                        validHits = thisTag.acc.filter((item) => {
                            return item.t > timeSinceMs;
                        });
                    } else {
                        validHits = thisTag ? thisTag.acc : [];
                    }

                    // check the count
                    if (numberOfTimes > 1) {
                        let timesTriggered = validHits || [];
                        if (numberOfTimes > timesTriggered.length) {
                            break;
                        }
                    }

                    // we want to match inclusive of a negation flag
                    matchedTags.push(matchTags[i]);
                }

                const hasMatch = requireAllTags ? (matchedTags.length == matchTags.length) :  matchedTags.length > 0;

                return hasMatch ? matchedTags : null;
            }
        };

        // figure out based on show / hide rules what
        // to do to elements
        for (let j = 0; j < elements.length; j++) {
            const item = elements[j];
            const showOpts = [
                item.getAttribute('data-lp-show-tags'),
                item.getAttribute('data-lp-show-times') || 1,
                item.getAttribute('data-lp-show-timeblock') || 0
            ];

            const hideOpts = [
                item.getAttribute('data-lp-hide-tags'),
                item.getAttribute('data-lp-hide-times') || 1,
                item.getAttribute('data-lp-hide-timeblock') || 0
            ];

            const showMatches = matchesTags.apply(this, showOpts);
            const hideMatches = matchesTags.apply(this, hideOpts);

            // see if the content has a preference for show / hide
            if (showMatches || hideMatches) {
                let matchType = 'show';
                if (item.hasAttribute('data-lp-prefer')) {
                    matchType = item.getAttribute('data-lp-prefer');
                }

                const tagDetail = {
                    matchType,
                    showMatches,
                    hideMatches
                };

                // trigger global event
                console.log("Profile.js: Trigger local_profile_match_tag", tagDetail);
                this.triggerEvent('local_profile_match_tag', tagDetail);

                // checking explicit show/hide preference first, otherwise
                // fall back to 'show' being higher preference than 'hide'
                if (matchType === 'show' && showMatches) {
                    item.classList.remove('lp-hide');
                    item.classList.add('lp-show');
                } else if (matchType === 'hide' && hideMatches) {
                    item.classList.remove('lp-show');
                    item.classList.add('lp-hide');
                } else if (showMatches) {
                    item.classList.remove('lp-hide');
                    item.classList.add('lp-show');
                } else if (hideMatches) {
                    item.classList.remove('lp-show');
                    item.classList.add('lp-hide');
                }
            }
        }
    }

    bindClickEvents() {
        document.addEventListener('click', (ev) => {
            let applied = false;
            for (let selector in this.clickRules) {
                const tgt = ev.target;
                if (tgt.matches(selector)) {
                    // get the rule and apply it
                    const ruleIndex = this.clickRules[selector];
                    const rule = this.ruleset[ruleIndex];

                    // click events are considered true unless
                    // there's a specific match being looked for
                    let isMatch = true;

                    if (rule.selector) {
                        isMatch = this.isCssMatch(rule);
                    } else if (rule.regex) {
                        isMatch = this.isMatch(rule);
                    }

                    if (isMatch) {
                        let matchData = this.extractData(rule);
                        if (!matchData) {
                            matchData = [
                                tgt.getAttribute('href'),
                                tgt.innerHTML,
                            ];
                        } else {
                            matchData.push(tgt.getAttribute('href'));
                            matchData.push(tgt.innerHTML);
                        }
                        if (matchData && matchData.length > 0) {
                            console.log("Profile.js: apply from event match", matchData);

                            this.applyRule(rule, matchData);
                            applied = true;
                        }
                    }
                }
            }
            if (applied) {
                this.save();
            }
        })

    }


    extractData(rule) {
        let extractor = rule.extractor;

        let data = [];
        if (extractor.selector && extractor.attribute) {
            let matches = document.querySelectorAll(extractor.selector);

            matches.forEach((elem) => {
                if (extractor.attribute === '#content') {
                    data.push(elem.innerHTML);
                } else {
                    data.push(elem.getAttribute(extractor.attribute));
                }
            });
        } else if (extractor.regex) {
            let checkAgainst = this.getContentFor(extractor);
            // check the regex
            data = (new RegExp(rule.regex)).exec(checkAgainst);
        } else if (extractor.appliesTo == 'location') {
            const point = this.nearestPoint(extractor);
            data.push(point.title);
        } else if (extractor.appliesTo == 'none') {
            data.push(document.title);
        }

        return data;
    }

    /**
     *
     * @param {Rule|Extractor} rule
     */
    getContentFor(rule) {
        let checkAgainst = null;
        if (rule.appliesTo == 'url') {
            checkAgainst = location.href;
        } else if (rule.appliesTo == 'referrer') {
            checkAgainst = document.referrer;
        } else if (rule.appliesTo == 'content' || rule.appliesTo == 'click') {
            checkAgainst = document.querySelector('body').innerHTML;
        } else if (rule.appliesTo == 'useragent') {
            checkAgainst = navigator.userAgent;
        }
        return checkAgainst;
    }

    nearestPoint(rule) {
        if (this.points && this.points.length > 0) {
            // points is sorted, so if we're just 'match nearest', just use the first result
            if (rule.matchnearest) {
                return this.points[0];
            }
            // we must have a distance set if no matchnearest rule
            if (!rule.maxdistance) {
                return;
            }
            for (let i = 0; i < this.points.length; i++) {
                if (this.points[i].distance < rule.maxdistance) {
                    return this.points[i];
                }
            }
        } else {
            console.warn("Profile.js: No position information available to check location rules");
        }

    }

    /**
     * Handles regex based content matches
     *
     * @param {ProfileRule} rule
     */
    isMatch(rule) {
        let checkAgainst = this.getContentFor(rule);
        // check the regex
        const matchInfo = (new RegExp(rule.regex)).exec(checkAgainst);
        return matchInfo && matchInfo.length > 0;
    }

    /**
     * Handles CSS based pattern matching
     *
     * @param {ProfileRule} rule
     */
    isCssMatch(rule) {
        let data = [];

        if (rule.selector) {
            let matches = document.querySelectorAll(rule.selector);

            return matches.length > 0;
        }
    }

    /**
     * Apply a given rule with the appropriate match data.
     *
     * Match data should be an array of strings indicating things
     * that were found in the 'match'
     *
     * @param {Rule} rule
     * @param {RuleMatch} matchData
     */
    applyRule(rule, matchData) {
        if (rule.apply && rule.apply.length > 0) {
            this.triggerEvent('local_profile_apply_rule', rule);
            // do some replacements for each match data
            for (let i = 0; i < rule.apply.length; i++) {
                let tag = rule.apply[i];
                if (tag.indexOf('$') >= 0 && matchData && matchData.length > 0) {
                    matchData.forEach((match, j) => {
                        tag = tag.replace("$" + j, match);
                        tag = tag ? tag.trim() : "";
                    });
                }
                this.addTag(tag);
            }
        }
    }

    addTag(tag) {
        let normalisedTag = tag.replace(/[^A-Za-z0-9_-]/g, '-').toLowerCase();
        if (!this.data['tags']) {
            this.data.tags = {};
        }

        let existing = this.data.tags[normalisedTag];

        if (!existing) {
            existing = {
                acc: []
            };
        }

        // get rid of the oldest
        while (existing.acc.length >= MAX_FREQ) {
            existing.acc.pop();
        }

        const newTag = {
            t: (new Date()).getTime(),
            u: location.href,
            r: tag
        };

        this.triggerEvent('local_profile_add_tag', newTag);

        existing.acc.unshift(newTag);

        this.data.tags[normalisedTag] = existing;
    }

    findOldestTag() {
        let oldestTag = null;
        let oldTime = null;

        const now = (new Date()).getTime();

        for (let tag in this.data.tags) {
            let existing = this.data.tags[tag];

            if (!existing.acc || existing.acc.length === 0) {
                return tag;
            }

            // oldest time is the last in the list
            let item = existing.acc[existing.acc.length - 1];

            if (!oldTime || oldTime > item.t) {
                oldTime = item.t;
                oldestTag = tag;
            }
        }

        return oldestTag;
    }



    loadFromStore() {
        const localData = localStorage.getItem(PROFILE_NAME);
        if (localData && localData.length > 0) {
            const profileData = JSON.parse(localData);
            if (profileData && profileData.uid) {
                if (profileData.version && profileData.version == this.versionString()) {
                    this.data = profileData;
                    return true;
                }
            }
        }
        return false;
    }

    writeToStore() {
        if (!this.data) {
            this.data = {
                version: this.versionString(),
                uid: uuidv4(),
                tags: {}
            };
        }

        // check length before saving
        if (Object.keys(this.data.tags).length > MAX_TAGS) {
            const tagToRemove = this.findOldestTag();
            if (tagToRemove) {
                delete this.data.tags[tagToRemove];
            }
        }

        localStorage.setItem(PROFILE_NAME, JSON.stringify(this.data));
    }

    versionString() {
        return VERSION + "." + this.version;
    }

    save() {
        this.writeToStore();
    }

    triggerEvent(name, properties, context) {
        if (!context) {
            context = document;
        }
        var param = properties ? { detail: properties } : null;
        var event = new CustomEvent(name, param);
        context.dispatchEvent(event);
    }

    distance(lat1, lon1, lat2, lon2, unit) {
        if (!unit) {
            unit = "K";
        }
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }

}


export function loadProfile(ruleset, points, version) {
    profile = new Profile(ruleset, points, version);
    if (!profile.loadFromStore()) {
        profile.writeToStore();
    }

    return profile;
}

export function getProfile() {
    if (!profile) {
        throw "Please loadProfile with rules first";
    }

    return profile;
}



/**
 * CustomEvent polyfill
 */
(function () {

    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector ||
            Element.prototype.webkitMatchesSelector;
    }


    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
