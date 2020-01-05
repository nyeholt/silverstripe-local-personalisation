import * as uuidv4 from "uuid/v4";

let profile;

const PROFILE_NAME = 'user_state';

const MAX_FREQ = 3;

const MAX_TAGS = 50;

class Profile {

    /**
     * {
     *    tags: {
     *      tag: {
     *          freq: [
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
     *      attribute: 'attr-name' | '#content'
     *      apply: [
     *          'tag',
     *          integer index into regex
     *      ]
     *  }
     * ]
     */
    ruleset;

    constructor(rules) {
        this.ruleset = rules;
    }

    evaluateRequest() {
        for (let rule of this.ruleset) {
            let matchData = null;
            if (rule.selector) {
                matchData = this.isRelevant(rule);
            } else if (rule.regex) {
                matchData = this.isMatch(rule);
            }

            if (matchData) {
                this.applyRule(rule, matchData);
            }
        }
    }

    isMatch(rule) {
        let checkAgainst = '';
        if (rule.appliesTo == 'url') {
            checkAgainst = location.href;
        } else if (rule.appliesTo == 'content') {
            checkAgainst = document.querySelector('body').innerHTML;
        } else if (rule.appliesTo == 'useragent') {
            checkAgainst = navigator.userAgent;
        }

        if (checkAgainst.length <= 0) {
            return null;
        }

        // check the regex
        const matchInfo = (new RegExp(rule.regex)).exec(checkAgainst);
        return matchInfo;
    }

    isRelevant(rule) {
        let data = [];

        if (rule.selector && rule.attribute) {
            let matches = document.querySelectorAll(rule.selector);

            matches.forEach((elem) => {
                if (rule.attribute === '#content') {
                    data.push(elem.innerHTML);
                } else {
                    data.push(elem.getAttribute(rule.attribute));
                }
            });
        }

        return data.length > 0 ? data : null;
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
            // do some replacements for each match data
            for (let i = 0; i < rule.apply.length; i++) {
                let tag = rule.apply[i];
                if (tag.indexOf('$') >= 0 && matchData && matchData.length > 0) {
                    matchData.forEach((match, j) => {
                        tag = tag.replace("$" + j, match);
                    });
                }
                this.addTag(tag);
            }
        }
    }

    addTag(tag) {
        if (!this.data['tags']) {
            this.data.tags = {};
        }

        let existing = this.data.tags[tag];

        if (!existing) {
            existing = {
                freq: []
            };
        }

        // get rid of the oldest
        while (existing.freq.length >= MAX_FREQ) {
            existing.freq.pop();
        }
        existing.freq.unshift((new Date()).getTime());
        this.data.tags[tag] = existing;
    }

    findOldestTag() {
        let oldestTag = null;
        let oldTime = null;

        const now = (new Date()).getTime();

        for (let tag in this.data.tags) {
            let existing = this.data.tags[tag];

            if (!existing.freq || existing.freq.length === 0) {
                return tag;
            }

            // oldest time is the last in the list
            let t = existing.freq[existing.freq.length - 1];

            if (!oldTime || oldTime > t) {
                oldTime = t;
                oldestTag = tag;
            }
        }

        return oldestTag;
    }



    loadFromStore() {
        const localData = localStorage.getItem(PROFILE_NAME);
        if (localData && localData.length > 0) {
            const profileData = JSON.parse(localData);
            if (profileData.uid) {
                this.data = profileData;
                return true;
            }
        }
        return false;
    }

    writeToStore() {
        if (!this.data) {
            this.data = {
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

    save() {
        this.writeToStore();
    }
}


export function loadProfile(ruleset) {
    profile = new Profile(ruleset);
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

