/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\nvar byteToHex = [];\nfor (var i = 0; i < 256; ++i) {\n  byteToHex[i] = (i + 0x100).toString(16).substr(1);\n}\n\nfunction bytesToUuid(buf, offset) {\n  var i = offset || 0;\n  var bth = byteToHex;\n  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4\n  return ([bth[buf[i++]], bth[buf[i++]], \n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]], '-',\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]],\n\tbth[buf[i++]], bth[buf[i++]]]).join('');\n}\n\nmodule.exports = bytesToUuid;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/bytesToUuid.js?");

/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Unique ID creation requires a high quality random # generator.  In the\n// browser this is a little complicated due to unknown quality of Math.random()\n// and inconsistent support for the `crypto` API.  We do the best we can via\n// feature-detection\n\n// getRandomValues needs to be invoked in a context where \"this\" is a Crypto\n// implementation. Also, find the complete implementation of crypto on IE11.\nvar getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||\n                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));\n\nif (getRandomValues) {\n  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto\n  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef\n\n  module.exports = function whatwgRNG() {\n    getRandomValues(rnds8);\n    return rnds8;\n  };\n} else {\n  // Math.random()-based (RNG)\n  //\n  // If all else fails, use Math.random().  It's fast, but is of unspecified\n  // quality.\n  var rnds = new Array(16);\n\n  module.exports = function mathRNG() {\n    for (var i = 0, r; i < 16; i++) {\n      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;\n      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;\n    }\n\n    return rnds;\n  };\n}\n\n\n//# sourceURL=webpack:///./node_modules/uuid/lib/rng-browser.js?");

/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var rng = __webpack_require__(/*! ./lib/rng */ \"./node_modules/uuid/lib/rng-browser.js\");\nvar bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ \"./node_modules/uuid/lib/bytesToUuid.js\");\n\nfunction v4(options, buf, offset) {\n  var i = buf && offset || 0;\n\n  if (typeof(options) == 'string') {\n    buf = options === 'binary' ? new Array(16) : null;\n    options = null;\n  }\n  options = options || {};\n\n  var rnds = options.random || (options.rng || rng)();\n\n  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n  rnds[6] = (rnds[6] & 0x0f) | 0x40;\n  rnds[8] = (rnds[8] & 0x3f) | 0x80;\n\n  // Copy bytes to buffer, if provided\n  if (buf) {\n    for (var ii = 0; ii < 16; ++ii) {\n      buf[i + ii] = rnds[ii];\n    }\n  }\n\n  return buf || bytesToUuid(rnds);\n}\n\nmodule.exports = v4;\n\n\n//# sourceURL=webpack:///./node_modules/uuid/v4.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _profile_Profile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./profile/Profile */ \"./src/profile/Profile.js\");\n/* harmony import */ var _style_profile_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/profile.scss */ \"./src/style/profile.scss\");\n/* harmony import */ var _style_profile_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_profile_scss__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nif (window.PERSONSALISATION_RULESET) {\n  var profile = Object(_profile_Profile__WEBPACK_IMPORTED_MODULE_0__[\"loadProfile\"])(window.PERSONSALISATION_RULESET.rules, window.PERSONSALISATION_RULESET.version);\n  var dummy_Data = [{\n    name: \"RouteTimetable\",\n    appliesTo: 'url',\n    regex: 'route/timetable/(\\\\d+)/([^/]+)',\n    apply: ['route-timetable', 'route-$2']\n  }, {\n    name: \"RouteDetail\",\n    appliesTo: 'url',\n    regex: 'route/(\\\\d+)/([^/]+)',\n    apply: ['route-detail', 'route-$2']\n  }, {\n    name: \"Subject\",\n    appliesTo: 'content',\n    selector: 'meta[name=\"dcterms.subject\"]',\n    attribute: 'content',\n    apply: ['$0']\n  }, {\n    name: \"JourneyPlanner\",\n    event: \"click\",\n    target: '.dropdown-menu a[href*=\"/journey\"]',\n    apply: ['$0', '$1', 'journey-planner']\n  }, {\n    name: \"Favourite Stop\",\n    event: \"click\",\n    target: '.lp-stop-fvt',\n    appliesTo: 'url',\n    regex: 'stop/(\\\\d+)/([^/]+)',\n    apply: ['favouriter', 'fvt-stop-$1', 'fvt-stop-route-$2', 'stop-favourite']\n  }];\n  profile.evaluateRequest();\n\n  window.DEBUG_SHOW_PROFILE = function () {\n    console.log(profile.data);\n  };\n} else {\n  console.warn(\"Profile.js: PERSONSALISATION_RULESET not found\");\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/profile/Profile.js":
/*!********************************!*\
  !*** ./src/profile/Profile.js ***!
  \********************************/
/*! exports provided: loadProfile, getProfile */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadProfile\", function() { return loadProfile; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getProfile\", function() { return getProfile; });\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid/v4 */ \"./node_modules/uuid/v4.js\");\n/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\nvar profile;\nvar PROFILE_NAME = 'lp_user_state';\nvar MAX_FREQ = 10;\nvar MAX_TAGS = 50;\nvar VERSION = 2;\n\nvar Profile =\n/*#__PURE__*/\nfunction () {\n  /**\n   * {\n   *    tags: {\n   *      tag: {\n   *          acc: [\n   *              date-added\n   *          ]\n   *      }\n   *    }\n   * }\n   */\n\n  /**\n   * [\n   *  {\n   *      name: '',\n   *      appliesTo: 'url' | 'content' | 'useragent' | 'click'\n   *      regex: '',\n   *      selector: 'string'\n   *      attribute: 'attr-name' | '#content' // the attribute to use as the value, or #content for innerHTML\n   *      apply: [\n   *          'tag',\n   *          integer index into regex\n   *      ]\n   *  }\n   * ]\n   */\n\n  /**\n   * What rule set version are we on?\n   */\n\n  /**\n   * A mapping of rule selector to an index into\n   * ruleset\n   */\n\n  /**\n   * Captures time based rules\n   */\n  function Profile(rules, version) {\n    _classCallCheck(this, Profile);\n\n    _defineProperty(this, \"data\", void 0);\n\n    _defineProperty(this, \"ruleset\", void 0);\n\n    _defineProperty(this, \"version\", void 0);\n\n    _defineProperty(this, \"clickRules\", void 0);\n\n    _defineProperty(this, \"timeRules\", void 0);\n\n    this.ruleset = rules;\n    this.version = version || 1;\n    this.clickRules = {};\n  }\n\n  _createClass(Profile, [{\n    key: \"evaluateRequest\",\n    value: function evaluateRequest() {\n      var _this = this;\n\n      this.checkRules();\n      this.checkContent();\n      setTimeout(function () {\n        console.log(\"Profile.js: checking 3s rules\");\n\n        _this.checkRules(3);\n      }, 3000);\n      setTimeout(function () {\n        console.log(\"Profile.js: checking 10s rules\");\n\n        _this.checkRules(10);\n      }, 10000);\n      setTimeout(function () {\n        console.log(\"Profile.js: checking 30s rules\");\n\n        _this.checkRules(30);\n      }, 30000);\n      setTimeout(function () {\n        console.log(\"Profile.js: checking 120s rules\");\n\n        _this.checkRules(120);\n      }, 120000);\n    }\n  }, {\n    key: \"checkContent\",\n    value: function checkContent() {\n      // find all items that are marked as special\n      var elements = document.getElementsByClassName('lp-item');\n      var myTags = this.data.tags;\n\n      if (!elements) {\n        return;\n      }\n      /**\n       * Do the passed in tags match the tags on a\n       * given element?\n       *\n       * @param {string} tags\n       * @param {number} times\n       */\n\n\n      var matchesTags = function matchesTags(tags, numberOfTimes) {\n        if (tags && tags.length > 0) {\n          var matchedTags = [];\n          var matchTags = tags.split(' ');\n\n          for (var i = 0; i < matchTags.length; i++) {\n            if (matchTags[i].length <= 0) {\n              continue;\n            }\n\n            if (!myTags[matchTags[i]]) {\n              break;\n            } // check the count\n\n\n            if (numberOfTimes > 1) {\n              var timesTriggered = myTags[matchTags[i]].acc || [];\n\n              if (numberOfTimes > timesTriggered.length) {\n                break;\n              }\n            }\n\n            matchedTags.push(matchTags[i]);\n          }\n\n          return matchedTags.length > 0 ? matchedTags : null;\n        }\n      }; // figure out based on show / hide rules what\n      // to do to elements\n\n\n      for (var j = 0; j < elements.length; j++) {\n        var item = elements[j];\n        var showMatches = matchesTags(item.getAttribute('data-lp-show-tags'), item.getAttribute('data-lp-show-times') || 1);\n        var hideMatches = matchesTags(item.getAttribute('data-lp-hide-tags'), item.getAttribute('data-lp-hide-times') || 1); // see if the content has a preference for show / hide\n\n        if (showMatches || hideMatches) {\n          var matchType = 'show';\n\n          if (item.hasAttribute('data-lp-prefer')) {\n            matchType = item.getAttribute('data-lp-prefer');\n          }\n\n          var tagDetail = {\n            matchType: matchType,\n            showMatches: showMatches,\n            hideMatches: hideMatches\n          };\n          console.log(\"Profile.js: Trigger local_profile_match_tag\", tagDetail);\n          this.triggerEvent('local_profile_match_tag', tagDetail); // checking explicit show/hide preference first, otherwise\n          // fall back to 'show' being higher preference than 'hide'\n\n          if (matchType === 'show' && showMatches) {\n            item.classList.remove('lp-hide');\n            item.classList.add('lp-show');\n          } else if (matchType === 'hide' && hideMatches) {\n            item.classList.remove('lp-show');\n            item.classList.add('lp-hide');\n          } else if (showMatches) {\n            item.classList.remove('lp-hide');\n            item.classList.add('lp-show');\n          } else if (hideMatches) {\n            item.classList.remove('lp-show');\n            item.classList.add('lp-hide');\n          }\n        }\n      }\n    }\n  }, {\n    key: \"bindClickEvents\",\n    value: function bindClickEvents() {\n      var _this2 = this;\n\n      document.addEventListener('click', function (ev) {\n        var applied = false;\n\n        for (var selector in _this2.clickRules) {\n          var tgt = ev.target;\n\n          if (tgt.matches(selector)) {\n            // get the rule and apply it\n            var ruleIndex = _this2.clickRules[selector];\n            var rule = _this2.ruleset[ruleIndex];\n            var isMatch = false;\n\n            if (rule.selector) {\n              isMatch = _this2.isCssMatch(rule);\n            } else if (rule.regex) {\n              isMatch = _this2.isMatch(rule);\n            }\n\n            if (isMatch) {\n              var matchData = _this2.extractData(rule);\n\n              if (!matchData) {\n                matchData = [tgt.getAttribute('href'), tgt.innerHTML];\n              } else {\n                matchData.push(tgt.getAttribute('href'));\n                matchData.push(tgt.innerHTML);\n              }\n\n              if (matchData && matchData.length > 0) {\n                console.log(\"Profile.js: apply from event match\", matchData);\n\n                _this2.applyRule(rule, matchData);\n\n                applied = true;\n              }\n            }\n          }\n        }\n\n        if (applied) {\n          _this2.save();\n        }\n      });\n    }\n  }, {\n    key: \"checkRules\",\n    value: function checkRules(forTime) {\n      var matched = false;\n\n      for (var i = 0; i < this.ruleset.length; i++) {\n        var rule = this.ruleset[i];\n        var execTime = parseInt(rule.time);\n\n        if (forTime && execTime != forTime || !forTime && execTime) {\n          continue;\n        }\n\n        var isMatch = false;\n\n        if (rule.event === 'click' && rule.target) {\n          // we only evaluate this rule on a specific click action\n          this.clickRules[rule.target] = i;\n        } else if (rule.selector) {\n          isMatch = this.isCssMatch(rule);\n        } else if (rule.regex) {\n          isMatch = this.isMatch(rule);\n        }\n\n        if (isMatch) {\n          matched = true;\n          var matchData = this.extractData(rule);\n\n          if (matchData && matchData.length > 0) {\n            console.log(\"Profile.js: apply from page match\", matchData);\n            this.applyRule(rule, matchData);\n          }\n        }\n      }\n\n      if (matched) {\n        this.save();\n      } // only bind click on the first time through\n\n\n      if (!forTime && Object.keys(this.clickRules).length > 0) {\n        this.bindClickEvents();\n      }\n    }\n  }, {\n    key: \"extractData\",\n    value: function extractData(rule) {\n      var extractor = rule.extractor;\n      var data = [];\n\n      if (extractor.selector && extractor.attribute) {\n        var matches = document.querySelectorAll(extractor.selector);\n        matches.forEach(function (elem) {\n          if (extractor.attribute === '#content') {\n            data.push(elem.innerHTML);\n          } else {\n            data.push(elem.getAttribute(extractor.attribute));\n          }\n        });\n      } else if (extractor.regex) {\n        var checkAgainst = this.getContentFor(extractor); // check the regex\n\n        data = new RegExp(rule.regex).exec(checkAgainst);\n      }\n\n      return data;\n    }\n  }, {\n    key: \"getContentFor\",\n    value: function getContentFor(rule) {\n      var checkAgainst = null;\n\n      if (rule.appliesTo == 'url') {\n        checkAgainst = location.href;\n      } else if (rule.appliesTo == 'referrer') {\n        checkAgainst = document.referrer;\n      } else if (rule.appliesTo == 'content' || rule.appliesTo == 'click') {\n        checkAgainst = document.querySelector('body').innerHTML;\n      } else if (rule.appliesTo == 'useragent') {\n        checkAgainst = navigator.userAgent;\n      }\n\n      return checkAgainst;\n    }\n    /**\n     * Handles regex based content matches\n     *\n     * @param {ProfileRule} rule\n     */\n\n  }, {\n    key: \"isMatch\",\n    value: function isMatch(rule) {\n      var checkAgainst = this.getContentFor(rule); // check the regex\n\n      var matchInfo = new RegExp(rule.regex).exec(checkAgainst);\n      return matchInfo && matchInfo.length > 0;\n    }\n    /**\n     * Handles CSS based pattern matching\n     *\n     * @param {ProfileRule} rule\n     */\n\n  }, {\n    key: \"isCssMatch\",\n    value: function isCssMatch(rule) {\n      var data = [];\n\n      if (rule.selector && rule.attribute) {\n        var matches = document.querySelectorAll(rule.selector);\n        return matches.length > 0;\n      }\n    }\n    /**\n     * Apply a given rule with the appropriate match data.\n     *\n     * Match data should be an array of strings indicating things\n     * that were found in the 'match'\n     *\n     * @param {Rule} rule\n     * @param {RuleMatch} matchData\n     */\n\n  }, {\n    key: \"applyRule\",\n    value: function applyRule(rule, matchData) {\n      var _this3 = this;\n\n      if (rule.apply && rule.apply.length > 0) {\n        this.triggerEvent('local_profile_apply_rule', rule); // do some replacements for each match data\n\n        var _loop = function _loop(i) {\n          var tag = rule.apply[i];\n\n          if (tag.indexOf('$') >= 0 && matchData && matchData.length > 0) {\n            matchData.forEach(function (match, j) {\n              tag = tag.replace(\"$\" + j, match);\n              tag = tag ? tag.trim() : \"\";\n            });\n          }\n\n          _this3.addTag(tag);\n        };\n\n        for (var i = 0; i < rule.apply.length; i++) {\n          _loop(i);\n        }\n      }\n    }\n  }, {\n    key: \"addTag\",\n    value: function addTag(tag) {\n      var normalisedTag = tag.replace(/[^A-Za-z0-9_-]/g, '-').toLowerCase();\n\n      if (!this.data['tags']) {\n        this.data.tags = {};\n      }\n\n      var existing = this.data.tags[normalisedTag];\n\n      if (!existing) {\n        existing = {\n          acc: []\n        };\n      } // get rid of the oldest\n\n\n      while (existing.acc.length >= MAX_FREQ) {\n        existing.acc.pop();\n      }\n\n      var newTag = {\n        t: new Date().getTime(),\n        u: location.href,\n        r: tag\n      };\n      this.triggerEvent('local_profile_add_tag', newTag);\n      existing.acc.unshift(newTag);\n      this.data.tags[normalisedTag] = existing;\n    }\n  }, {\n    key: \"findOldestTag\",\n    value: function findOldestTag() {\n      var oldestTag = null;\n      var oldTime = null;\n      var now = new Date().getTime();\n\n      for (var tag in this.data.tags) {\n        var existing = this.data.tags[tag];\n\n        if (!existing.acc || existing.acc.length === 0) {\n          return tag;\n        } // oldest time is the last in the list\n\n\n        var item = existing.acc[existing.acc.length - 1];\n\n        if (!oldTime || oldTime > item.t) {\n          oldTime = item.t;\n          oldestTag = tag;\n        }\n      }\n\n      return oldestTag;\n    }\n  }, {\n    key: \"loadFromStore\",\n    value: function loadFromStore() {\n      var localData = localStorage.getItem(PROFILE_NAME);\n\n      if (localData && localData.length > 0) {\n        var profileData = JSON.parse(localData);\n\n        if (profileData && profileData.uid) {\n          if (profileData.version && profileData.version == this.versionString()) {\n            this.data = profileData;\n            return true;\n          }\n        }\n      }\n\n      return false;\n    }\n  }, {\n    key: \"writeToStore\",\n    value: function writeToStore() {\n      if (!this.data) {\n        this.data = {\n          version: this.versionString(),\n          uid: uuid_v4__WEBPACK_IMPORTED_MODULE_0__(),\n          tags: {}\n        };\n      } // check length before saving\n\n\n      if (Object.keys(this.data.tags).length > MAX_TAGS) {\n        var tagToRemove = this.findOldestTag();\n\n        if (tagToRemove) {\n          delete this.data.tags[tagToRemove];\n        }\n      }\n\n      localStorage.setItem(PROFILE_NAME, JSON.stringify(this.data));\n    }\n  }, {\n    key: \"versionString\",\n    value: function versionString() {\n      return VERSION + \".\" + this.version;\n    }\n  }, {\n    key: \"save\",\n    value: function save() {\n      this.writeToStore();\n    }\n  }, {\n    key: \"triggerEvent\",\n    value: function triggerEvent(name, properties, context) {\n      if (!context) {\n        context = document;\n      }\n\n      var param = properties ? {\n        detail: properties\n      } : null;\n      var event = new CustomEvent(name, param);\n      context.dispatchEvent(event);\n    }\n  }]);\n\n  return Profile;\n}();\n\nfunction loadProfile(ruleset, version) {\n  profile = new Profile(ruleset, version);\n\n  if (!profile.loadFromStore()) {\n    profile.writeToStore();\n  }\n\n  return profile;\n}\nfunction getProfile() {\n  if (!profile) {\n    throw \"Please loadProfile with rules first\";\n  }\n\n  return profile;\n}\n/**\n * CustomEvent polyfill\n */\n\n(function () {\n  if (!Element.prototype.matches) {\n    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;\n  }\n\n  if (typeof window.CustomEvent === \"function\") return false;\n\n  function CustomEvent(event, params) {\n    params = params || {\n      bubbles: false,\n      cancelable: false,\n      detail: undefined\n    };\n    var evt = document.createEvent('CustomEvent');\n    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);\n    return evt;\n  }\n\n  CustomEvent.prototype = window.Event.prototype;\n  window.CustomEvent = CustomEvent;\n})();\n\n//# sourceURL=webpack:///./src/profile/Profile.js?");

/***/ }),

/***/ "./src/style/profile.scss":
/*!********************************!*\
  !*** ./src/style/profile.scss ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/style/profile.scss?");

/***/ }),

/***/ "./style/index.scss":
/*!**************************!*\
  !*** ./style/index.scss ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./style/index.scss?");

/***/ }),

/***/ 0:
/*!***********************************************!*\
  !*** multi ./src/index.js ./style/index.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/index.js */\"./src/index.js\");\nmodule.exports = __webpack_require__(/*! ./style/index.scss */\"./style/index.scss\");\n\n\n//# sourceURL=webpack:///multi_./src/index.js_./style/index.scss?");

/***/ })

/******/ });