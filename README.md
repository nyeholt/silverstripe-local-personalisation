# Local Profiles

[![Build Status](https://travis-ci.org/symbiote/silverstripe-local-profile.svg?branch=master)](https://travis-ci.org/symbiote/silverstripe-local-profile)
[![Latest Stable Version](https://poser.pugx.org/symbiote/silverstripe-local-profile/version.svg)](https://github.com/symbiote/silverstripe-local-profile/releases)
[![Latest Unstable Version](https://poser.pugx.org/symbiote/silverstripe-local-profile/v/unstable.svg)](https://packagist.org/packages/symbiote/silverstripe-local-profile)
[![Total Downloads](https://poser.pugx.org/symbiote/silverstripe-local-profile/downloads.svg)](https://packagist.org/packages/symbiote/silverstripe-local-profile)
[![License](https://poser.pugx.org/symbiote/silverstripe-local-profile/license.svg)](https://github.com/symbiote/silverstripe-local-profile/blob/master/LICENSE.md)

## Overview

Builds a profile of a visitor, "tagging" behaviour based on
the pages visited, actions performed, location, or device characteristics.
Preserves privacy since the profile is stored in the browser only,
without relying on server data or logged-in user information.

This module enables marketers and developers to collaborate effectively,
by providing both a CMS user interface and an API.

CMS users can define "rule sets" to group one or more "rules".
Each rule determines when and how behaviour should be tagged.
For example, "if URL contains 'marketing', then add 'interested-in-marketing' tag".

These tags can then be used for matching rules against objects managed in the CMS
(such as pages or content blocks), and show/hide them based on in-browser decisions.
Alternatively, you can control this behaviour programmatically,
enabling sophisticated rule definitions that wouldn't be feasible in a CMS UI.

Because all decision making happens in the browser,
you can still serve cached responses with all variations delivered to the browser,
but only some variations shown to the visitor.

Example use cases:

 * Show location-specific announcements on the homepage
 * List featured products from the closest store (via browser geolocation)
 * Show topic-specific content blocks based on the pages the visitor has previously viewed
 * Show promotions for a specific marketing campaign, based on traffic coming in with a campaign URL parameter
 * Hide welcome message if the visitor has seen it before
 * Show "Contact helpdesk?" call-to-action if visitors view a FAQ entry for longer than 30 seconds

Limitations:

 * All variations are visible to all visitors (for example, this can't be used for targeted promo codes)
 * All decision making is visible in the browser (including any built-in bias and dodgy marketing tactics)
## Installation

### Composer

```
composer require symbiote/silverstripe-local-personalisation:~1.0
```

### Javascript and CSS

Add the required frontend logic into your main template:

```
<% require javascript('symbiote/silverstripe-local-personalisation:app/dist/main.js') %>
<% require css('symbiote/silverstripe-local-personalisation:app/dist/main.css') %>
```

Alternatively, check `app/webpack.config.js` on how to compile the requirements into your own frontend bundle.

### Metadata

Personalisation rules are loaded as JavaScript metadata.

```
<script type="application/javascript" src="/__personalisation/rules"></script>
```

By loading this as a separate route, you avoid inline scripts and make it easier
to secure your website with a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
It also helps with caching: Personalisation rules apply immediately on save,
even when the page output might be cached (via HTTP caching or static publishing).

### Apply the extension

In order for the frontend logic to be triggered, you generally want to apply an extension
to at least one content object. This adds a new "Personalisation" tab in the CMS.

Apply on pages:

```yml
SilverStripe\CMS\Model\SiteTree:
  extensions:
    - Symbiote\Personalisation\PersonalisationExtension
```

Apply on [content blocks](https://github.com/silverstripe/silverstripe-elemental):

```yml
DNADesign\Elemental\Models\BaseElement:
  extensions:
    - Symbiote\Personalisation\PersonalisationExtension
```

### Modify templates

Now add some metadata to the markup for the content object you're rendering:
`$p13nClasses` to your `class` attribute, and `$p13nAttributes` to the element.

Example for the content blocks holder template
(store in `themes/mytheme/templates/DNADesign/Elemental/Layout/ElementHolder.ss`):

```html
<div
    class="
        element
        $SimpleClassName.LowerCase
        <% if $StyleVariant %> $StyleVariant<% end_if %>
        <% if $ExtraClass %> $ExtraClass<% end_if %>
        $p13nClasses.RAW
    "
    id="$Anchor"
    $p13nAttributes.RAW
>
	$Element
</div>
```


### Test Operation

You should be ready to define rules now. Check for `Profile.js` console messages in your browser
to ensure everything is set up correctly.

## Developer Usage

### Rules for profile segmentation

Rules are defined in the CMS 

They can be triggered for;

* A regex match against content


### Manually applying rules

By applying the `PersonalisationExtension` to a content object,
you can use `$p13nClasses` and `$p13nAttributes` in your templates.

Alternatively, you can build the required markers from scratch:

* add the `lp-item css` class 
* Add the `data-lp-tags` attribute to list (comma separated) the tags applied on the profile
  to trigger this element
* Add the `data-lp-type` attribute to indicate whether to "show" (default) or "hide" the element 
* Add the `data-lp-times` attribute (optional) to indicate how many times the user's profile 
  has to have been tagged 
* Add the `data-lp-timeframe` attribute to indicate what timeframe (ie `-1 week`) the tagging
  must have happened


```

<div class="this-thing lp-item" data-lp-tags="route-detail" data-lp-times="5" data-lp-type="hide">
    <h1>What this is</h1>
</div>
```

## Events

The following events are triggered and can be responded to in custom code

* `local_profile_match_tag`
* `local_profile_apply_rule`
* `local_profile_add_tag`

Bind to these as `document.addEventListener('local_profile_add_tag', function (eventData) {})`

## Local Development

### Build

The frontend assets are stored in `app/`.
You can use `yarn` to install dependencies and kick off a build:

```
cd app/
yarn install
yarn build
```

### Javascript, HTTPS and hot reloading

To fully test the functionality locally, you'll need to run your webserver on HTTPS
which is required for geolocation in most browsers now.

When developing the Javascript code for the module, it can be helpful
to get source maps (breakpoints!) and hot reloading. The module already
has a `yarn devserver` command. You'll need to extend the `webpack.config.js`
to work around CORS issues when including it in your page
(see [webpack devserver docs](https://webpack.js.org/configuration/dev-server/#devserverhttps)).


```js
module.exports = {
    // ...
    devServer: {
        disableHostCheck: true
    }
};
```

Now you can use the dev server (usually on port `4200`)
with the preferred hostname for your Silverstripe website:

```html
<script src="https://your-hostname:4200/main.js" type="application/javascript"></script>
```

Caution: In order to use geolocation without HTTPS in Chrome, you need to
[allow insecure origins](https://stackoverflow.com/questions/39366758/geolocation-without-ssl-connection).
