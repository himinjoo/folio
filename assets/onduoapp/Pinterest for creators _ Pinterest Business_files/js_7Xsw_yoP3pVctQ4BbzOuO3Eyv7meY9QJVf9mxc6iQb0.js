/**
 * @file
 * Establish the global datalayer object and gtag function, and establish each account.
 */

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

var google_account_ids = drupalSettings.pin_marketing_google.account_ids;
gtag('js', new Date());

for (var i = 0; i < google_account_ids.length; i++) {
  gtag('config', google_account_ids[i]);
}
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.infographics_google = PIN.infographics_google || {};

// Google Conversion upon clicking on infographic.
  PIN.infographics_google.goog_report_conversion = function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    // Adwords tracking.
    gtag('event', 'conversion', {
      'send_to': 'AW-852082959/ITTNCNOejncQj4KnlgM',
      'event_callback': callback
    });
    // Doubleclick tracking.
    gtag('event', 'conversion', {
      'allow_custom_scripts': true,
      'send_to': 'DC-8032161/et-in0/event0+unique'
    });
    return false;
  }

  // Find links with infographic URLs.
  $("[href*='business-infographic-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.infographics_google.goog_report_conversion();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.whitepapers_google = PIN.whitepapers_google || {};

// Google Conversion upon clicking on whitepaper.
  PIN.whitepapers_google.goog_report_conversion = function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    gtag('event', 'conversion', {
      'send_to': 'AW-852082959/pHVKCISgjncQj4KnlgM',
      'event_callback': callback
    });
    gtag('event', 'conversion', {
      'allow_custom_scripts': true,
      'send_to': 'DC-8032161/et-wh0/event0+unique'
    });
    return false;
  }

  // Find links with whitepaper URLs.
  $("[href*='business-whitepaper-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.whitepapers_google.goog_report_conversion();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.social_share_google_analytics = PIN.social_share_google_analytics || {};

// Google Conversion upon clicking 'Create ad'.
  PIN.social_share_google_analytics.ga_report_create_ad = function ga_report_create_ad(url) {
    ga('send', 'event', 'create_ad', 'click');
  }

// Google Conversion upon clicking 'Create ad'.
  PIN.social_share_google_analytics.ga_report_sign_up = function ga_report_sign_up(url) {
    ga('send', 'event', 'sign_up', 'click');
  }

  // Find links with infographic URLs.
  $(".menu__item [href*='ads.pinterest.com']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.social_share_google_analytics.ga_report_create_ad();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

  // Find links with infographic URLs.
  $(".menu__item [href*='www.pinterest.com/business/create']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.social_share_google_analytics.ga_report_sign_up();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.social_share_google_analytics = PIN.social_share_google_analytics || {};

// Google Conversion upon clicking 'Create ad'.
  PIN.social_share_google_analytics.ga_report_social_share = function ga_report_social_share(url) {
    ga('send', 'event', 'social', 'share');
  }

  // Find links with infographic URLs.
  $(".social-links__item a").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.social_share_google_analytics.ga_report_social_share();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.infographics_google_analytics = PIN.infographics_google_analytics || {};

// Google Conversion upon clicking on infographic.
  PIN.infographics_google_analytics.ga_report_event = function ga_report_event(url) {
    ga('send', 'event', 'infographic', 'download');
  }

  // Find links with infographic URLs.
  $("[href*='business-infographic-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.infographics_google_analytics.ga_report_event();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.whitepapers_google_analytics = PIN.whitepapers_google_analytics || {};

// Google Conversion upon clicking on whitepaper.
  PIN.whitepapers_google_analytics.ga_report_event = function ga_report_event(url) {
    ga('send', 'event', 'whitepaper', 'download');
  }

  // Find links with whitepaper URLs.
  $("[href*='business-whitepaper-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.whitepapers_google_analytics.ga_report_event();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
var pinterest_account_id = drupalSettings.pin_marketing_pinterest.account_id;

!function(e){if(!window.pintrk){window.pintrk = function () {
  window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
  n=window.pintrk;n.queue=[],n.version="3.0";var
  t=document.createElement("script");t.async=!0,t.src=e;var
  r=document.getElementsByTagName("script")[0];
  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");

  pintrk('load', pinterest_account_id);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.infographics_pinterest = PIN.infographics_pinterest || {};

// Google Conversion upon clicking on infographic.
  PIN.infographics_pinterest.pinterest_report_conversion = function pinterest_report_conversion(url) {
    pintrk('track', 'lead', {
      lead_type: 'infographic'
    });
  }

  // Find links with infographic URLs.
  $("[href*='business-infographic-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.infographics_pinterest.pinterest_report_conversion();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
/**
 * @file
 * Fire a tracking event upon click on a link to an infographic.
 */

(function ($) {

  // Namespace.
  var PIN = PIN || {};
  PIN.infographics_pinterest = PIN.infographics_pinterest || {};

// Google Conversion upon clicking on infographic.
  PIN.infographics_pinterest.pinterest_report_conversion = function pinterest_report_conversion(url) {
    pintrk('track', 'lead', {
      lead_type: 'whitepaper'
    });
  }

  // Find links with infographic URLs.
  $("[href*='business-infographic-download']").on('click', function (e) {
    // Report these for anonymous users only.
    if (drupalSettings.user.uid === 0) {
      PIN.infographics_pinterest.pinterest_report_conversion();
    }
  }).filter('[target!=_blank]').attr('target', '_blank');

})(jQuery);
;
