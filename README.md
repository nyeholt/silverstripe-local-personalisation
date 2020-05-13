# Local Profiles

[![Build Status](https://travis-ci.org/symbiote/silverstripe-local-profile.svg?branch=master)](https://travis-ci.org/symbiote/silverstripe-local-profile)
[![Latest Stable Version](https://poser.pugx.org/symbiote/silverstripe-local-profile/version.svg)](https://github.com/symbiote/silverstripe-local-profile/releases)
[![Latest Unstable Version](https://poser.pugx.org/symbiote/silverstripe-local-profile/v/unstable.svg)](https://packagist.org/packages/symbiote/silverstripe-local-profile)
[![Total Downloads](https://poser.pugx.org/symbiote/silverstripe-local-profile/downloads.svg)](https://packagist.org/packages/symbiote/silverstripe-local-profile)
[![License](https://poser.pugx.org/symbiote/silverstripe-local-profile/license.svg)](https://github.com/symbiote/silverstripe-local-profile/blob/master/LICENSE.md)

Builds a profile of a site user in their browser. DOM elements can then have 
certain CSS classes added to allow the display / hide of those elements based on the
user profile. 

## Composer Install

```
composer require symbiote/silverstripe-local-profile:~1.0
```

## Documentation


### Rules for profile segmentation

Rules are defined in the CMS 

They can be triggered for;

* A regex match against content


### Applying rules

It is up to you as a developer to apply these rules to content. The key aspects

* add the lp-item css class 
* Add the 'data-lp-tags' attribute to list (comma separated) the tags applied on the profile
  to trigger this element
* Add the data-lp-type attribute to indicate whether to "show" (default) or "hide" the element 
* Add the data-lp-times attribute (optional) to indicate how many times the user's profile 
  has to have been tagged 
* Add the data-lp-timeframe attribute to indicate what timeframe (ie -1 week) the tagging
  must have happened


```

<div class="this-thing lp-item" data-lp-tags="route-detail" data-lp-times="5" data-lp-type="hide">
    <h1>What this is</h1>
</div>

```
