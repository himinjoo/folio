/**
 * @file
 * Main theming script.
 */

/**
 * Misc. plugins not included via Bower.
 *
 * - jQuery bigTarget: No longer supported by plugin author.
 *   Included here with modifications to pass ESLint parameters.
 */

/**
 * jquery-bigTarget.js - enlarge an anchors clickzone
 * https://github.com/leevigraham/jquery-bigTarget
 * Written by: Leevi Graham <http://leevigraham.com>
 * Requires: jQuery v1.3.2 or later
 *
 * jquery-bigTarget.js takes an anchor and expands it's clickzone by adding an onclick action to a parent element (defined in the clickzone plugin option)  improving user accessibility.
 *
 * Plugin options:
 *
 * clickZone: 'div:eq(0)', // parent element selector. The element will be the big target clickzone
 * clickZoneClass: 'big-target-click-zone', // class added to the clickzone
 * clickZoneHoverClass: 'big-target-click-zone-hover', // class add on clickzone hover
 * anchorClass: 'big-target-anchor', // class added the the bigTarget anchor
 * anchorHoverClass: 'big-target-anchor-hover', // class added the the bigTarget anchor on hover
 * copyTitleToClickZone: true, // copy the anchors title element to the clickzone
 * openRelExternalInNewWindow: true // open rel="external" in a new window / tab
 *
 * Example Usage:
 *
 * $("#example2 .big-target-link").bigTarget({
 *     clickZone: '#example2',
 *     clickZoneClass: 'custom-big-target-click-zone',
 *     clickZoneHoverClass: 'custom-big-target-click-zone-hover',
 *     anchorHoverClass: 'custom-big-target-link-hover',
 *     copyTitleToClickZone: false,
 *     openRelExternalInNewWindow: false
 * });
 */

(function ($) {
  'use strict';
  var ver = '2.0';

  $.fn.bigTarget = function (options) {
    var settings = $.extend({}, $.fn.bigTarget.defaults, options);
    return this.each(function (index) {

      var $a = $(this);
      var href = this.href || false;
      var title = this.title || false;

      if (!href) {
        return;
      }

      var o = $.metadata ? $.extend({}, settings, $a.metadata()) : settings;

      $a
        .addClass(o['anchorClass'])
        .hover(function () {
          $a.toggleClass(o['anchorHoverClass']);
        })
        .parents(o['clickZone'])
        .each(function (index) {
          var $clickZone = $(this);
          if (title && o['copyTitleToClickZone']) {
            $clickZone.attr('title', title);
          }
          $clickZone
            .addClass(o['clickZoneClass'])
            .hover(function () {
              $clickZone.toggleClass(o['clickZoneHoverClass']);
            })
            .click(function (e) {
              if (!(e.metaKey || e.ctrlKey)) {
                if (getSelectedText() === '') {
                  if ($a.is('[rel*=external]') && o['openRelExternalInNewWindow']) {
                    window.open(href);
                  }
                  else {
                    window.location = href;
                  }
                }
              }
            });
        });
    });
  };

  function getSelectedText() {
    var t = false;
    if (window.getSelection) {
      t = window.getSelection().toString();
    }
    else if (document.getSelection) {
      t = document.getSelection();
    }
    else if (document.selection) {
      t = document.selection.createRange().text;
    }
    return t;
  }

  $.fn.bigTarget.ver = function () {
    return ver;
  };

  $.fn.bigTarget.defaults = {
    clickZone: 'div:eq(0)',
    clickZoneClass: 'big-target-click-zone',
    clickZoneHoverClass: 'big-target-click-zone-hover',
    anchorClass: 'big-target-anchor',
    anchorHoverClass: 'big-target-anchor-hover',
    copyTitleToClickZone: true,
    openRelExternalInNewWindow: true
  };

  // Fixes JS not working after hitting "Back" button ~ http://stackoverflow.com/a/2638357
  window.onunload = function () {};
})(jQuery);

/**
 * @file
 * Secondary theming script.
 */

/**
 * @file
 * Scroll animation for anchor tags to account for the nav header.
 */

(function anchorScroll($, Drupal, _, window) {
  'use strict';

  // How to use anchor scroll animation.
  // [1] Create a link element similar to:
  // <a id="my-id-tag" class="u-anim-anchor-scroll" tabindex="-1"></a>
  // [2] Visit the page url with the anchor tag:
  // http://example.com#my-id-tag

  /**
   * Expandable text tiles.
   */
  Drupal.behaviors.pinAnchorScroll = {
    attach: function (context) {
      function scrollToAnchor() {
        var $bodyInit = $('body:not(.pin-anchor-init-processed)', context);
        if ($bodyInit.length > 0) {
          $bodyInit.addClass('pin-anchor-init-processed');
          var $anchor = $(window.location.hash, $bodyInit).filter('.u-anim-anchor-scroll');
          if ($anchor.length > 0) {
            var $nav = $('.site__header > .navigation');
            if ($nav.length > 0) {
              var navHeight = $nav.outerHeight() || 0;
              if (navHeight) {
                var scrollTopOffset = $anchor.offset().top || 0;
                // Adjust for sticky nav.
                scrollTopOffset -= (2 * navHeight);

                // Buffer of 10px.
                scrollTopOffset -= 10;

                // Animate the scroll.
                if (scrollTopOffset > 0) {
                  $('html, body').animate({
                    scrollTop: scrollTopOffset
                  }, {
                    duration: 600
                  });
                }
              }
            }
          }
        }
      }
      // Handle page load case.
      if (window.location.hash && window.location.hash.indexOf('=') === -1) {
        scrollToAnchor();
      }
      // Handle TOC case.
      $('a.toc-link').on('click', function (event) {
        // Don't let clicking the link write the hash to location.
        event.preventDefault();
        // Use history.pushState to write the hash to location to prevent scroll.
        if (history.pushState) {
          history.pushState(null, null, $(this).attr('href'));
        }
        else {
          window.location.hash = $(this).attr('href');
        }
        // Remove class preventing scroll.
        $('body.pin-anchor-init-processed').removeClass('pin-anchor-init-processed');
        scrollToAnchor();

      });
    }
  };

}(jQuery, Drupal, _, window));

/**
 * @file
 * animations script.
 */

(function animationsScript($, Drupal, _) {
  'use strict';

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   * @param {Boolean} partial - If false, triggers when entire item is visible, if true, then if top is visible.
   * @return {Boolean} If the item is in the viewport.
   */
  $.fn.visible = function (partial) {
    var $t = $(this);
    var $w = $(window);
    var viewTop = $w.scrollTop();
    var viewBottom = viewTop + $w.height();
    var _top = $t.offset().top;
    var _bottom = _top + $t.height();
    var compareTop = partial === true ? _bottom : _top;
    var compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  };

  /**
   * animate.css -http://daneden.me/animate
   * Version - 3.6.0
   * Licensed under the MIT license - http://opensource.org/licenses/MIT
   *
   * Copyright (c) 2018 Daniel Eden
  */
  $.fn.extend({
    animateCss: function (animationName, callback) {
      var animationEnd = (function (el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd'
        };

        for (var t in animations) {
          if (el.style[t] !== undefined) { // eslint-disable-line no-undefined
            return animations[t];
          }
        }
      })(document.createElement('div'));

      this.addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);

        if (typeof callback === 'function') {
          callback();
        }
      });

      return this;
    }
  });

  // How to use animation triggers
  // All elements with an attribute of `data-anim-trigger="view"` will get an attribute of `data-anim-triggered='yes'` added - use that to trigger CSS animations. Additionally, those elements will have the `anim-trigger` JS event fired, which will execute code in a `$('.class').on('anim-trigger', function () { animate here })`.
  // Staggered Starts are done by applying this to a wrapper: `class="u-anim-staggered-start" data-anim-trigger="view"`.
  // Any children with a class of `u-anim-staggered-start__item` will get a `data-anim-triggered='yes'` attribute applied with a time delay of `staggeredDelay` between each.

  // These are just the triggers, you can use any animation; the most popular being a Fade In and Slide Up - just add a class of `u-anim-fade-in-and-slide-up` to the element. Demoes are visible in Pattern Lab under "Base > Animations".
  Drupal.behaviors.animations = {
    attach: function (context) {
      // Milliseconds between checks for visibility on scroll
      var scrollDebounceRate = 50;
      // Milliseconds in between staggered start items starting.
      var staggeredDelay = 333;
      var $items = $('[data-anim-trigger="view"]', context);
      var $staggeredContainers = $('.u-anim-staggered-start', context);

      // Make sure we've got Underscore.
      if (typeof _ === 'undefined') {
        console.error('Not able to find Underscore.'); // eslint-disable-line no-console
      }

      /**
       * Trigger animations on this element.
       * Adds data attribute and triggers event handlers
       * @param {JQuery} $item The element
       */
      function triggerAnimation($item) {
        if ($item.attr('data-anim-triggered') !== 'yes') {
          $item.attr('data-anim-triggered', 'yes');
          $item.trigger('anim-trigger');
        }
      }

      function triggerVisibleAnimations() {
        $items.each(function () {
          var $item = $(this);
          if ($item.visible(true)) {
            triggerAnimation($item);
          }
        });
      }

      $staggeredContainers.each(function () {
        var $this = $(this);
        $this.one('anim-trigger', function () {
          $('.u-anim-staggered-start__item', $this).each(function (i) {
            var delay = staggeredDelay * i;

            setTimeout(function () {
              triggerAnimation($(this));
            }.bind(this), delay);
          });
        });
      });

      // placing function call at bottom of call stack so other function can finish up first (like `Drupal.behaviors.stats`)
      setTimeout(triggerVisibleAnimations, 0);
      $(window).scroll(_.throttle(triggerVisibleAnimations, scrollDebounceRate));
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Link script.
 */

(function linkScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.links = {
    attach: function targetBlankAccessible(context) {
      $('a[target="_blank"]').each(function () {
        $(this).append('<span class="visually-hidden">(opens in a new window)</span>');
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Forms script.
 */

(function formsScript($, Drupal) {
  'use strict';

  /*
   * Add class to 'touched' required form items.
   */
  Drupal.behaviors.touchReqFormItems = {
    attach: function (context) {
      $('.required', context).one('blur keydown', function () {
        $(this).addClass('touched');
      });
    }
  };

  /*
   * User Experience Feedback Form Interactions.
   */
  Drupal.behaviors.pinFeedbackForm = {
    attach: function (context) {
      if ($('.user-experience-form', context).length) {
        var $form = $('.user-experience-form');
        var $first = $('.user-experience-form__first-step');
        var $second = $('.user-experience-form__collection-fields');

        $('label', $first).mouseup(function () {
          var $face = $(this);
          if ($face.attr('for').indexOf('edit-user-feedback-sad') !== -1) {
            $first.hide();
            $second.show();
          }
          else {
            // Response is Happy.
            $('.webform-button--submit', $form).trigger('click');
          }
        });

      }
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Table script.
 */

(function formsScript($, Drupal) {
  'use strict';

  /*
   * Initialize datatables.net to facilitate sorting, filtering and search.
   */
  Drupal.behaviors.filterTables = {
    attach: function (context) {
      if ($('.table--searchable', context).length) {
        var table = $('.table--searchable');
        var placeholder = Drupal.t('Filter terms or numbers');
        table.DataTable({
          dom: 'Bfrtip',
          buttons: [
            {
              text: '<i class="icon--close"></i>',
              className: 'table__clear button--close u-bg--grey--light',
              action: function (e, dt, node, config) {
                dt.search('').draw();
                clearBtn.hide();
              }
            }
          ],
          paging: false,
          info: false,
          autoWidth: false,
          language: {
            search: '_INPUT_',
            searchPlaceholder: placeholder
          },
          mark: {
            element: 'strong'
          }
        });
        var clearBtn = $('.table__clear');
        var dataTable = table.DataTable();
        clearBtn
          .appendTo('.dataTables_filter')
          .hide();
        dataTable.on('search.dt', function () {
          clearBtn.show();
        });
      }
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Tab script.
 */

(function tabScript($, Drupal) {
  'use strict';

  Drupal.behaviors.tab = {
    attach: function tabAttach(context) {
      var $tabItems = $('.tab__item', context);
      // Handle setting the currently active link
      $tabItems
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          $tabItems.attr('aria-selected', 'false');
          $(this).attr('aria-selected', 'true');
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Accordion script.
 */

(function accordionScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.accordion = {
    attach: function accordionAttach(context) {
      var hash = window.location.hash;
      if (hash) {
        var entity_id = hash.substr(9);
        var element = document.querySelectorAll("[data-entity-id='" + entity_id + "']");
        if (element) {
          $(element).parents('.accordion-tab').addClass('is-open');
        }
      }

      $('.accordion.accordion--open').children().first('.accordion-tab').addClass('is-open');

      $('.accordion-tab > .accordion-tab__title ').click(function () {
        $(this).parent().siblings().removeClass('is-open');
        $(this).parent().toggleClass('is-open');
        return false;
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Carousel script.
 */

(function carouselScript($, Drupal, _) {
  'use strict';

  function setItemWidth($carousel) {
    var $carouselList = $carousel.find('.js-carousel-list');
    var $carouselItem = $carousel.find('.js-carousel-item');
    var curWidth = 0;

    $carouselList.removeAttr('style');
    $carouselItem.each(function () {
      curWidth += $(this).outerWidth(true);
    });
    return curWidth;
  }

  function slide($carousel, target) {
    var $carouselContainer = $carousel.find('#carouselContainer');
    var $carouselList = $carousel.find('#carouselList');
    var dir =
      $(target)
        .parent()
        .data('dir') || target;
    var curPos = parseInt($carouselList.css('left')) || 0;
    var moveTo = 0;
    var containerWidth = $carouselContainer.outerWidth();
    var listWidth = $carouselList.outerWidth();
    var before = curPos + containerWidth;
    var after = listWidth + (curPos - containerWidth);

    if (dir === 'next') {
      moveTo =
        after < containerWidth ? curPos - after : curPos - containerWidth;
    }
    else {
      moveTo = before >= 0 ? 0 : curPos + containerWidth;
    }
    return moveTo;
  }

  function magicLine($carousel, context) {
    var $carouselItem = $carousel.find('.js-carousel-item');
    var $magicLine = $('.magic-line', context);

    $magicLine
      .width($('[aria-selected="true"]', context).width())
      .css('left', $('[aria-selected="true"]', context).position().left)
      .data('origLeft', $magicLine.position().left)
      .data('origWidth', $magicLine.width());

    $carouselItem.click(function () {
      var $el = $(this).find(':first-child');
      var leftPos = $el.position().left;
      var newWidth = $el.width();
      $magicLine.stop().animate({
        left: leftPos,
        width: newWidth
      });
    });
  }

  function determineOverflow(content, container) {
    var containerMetrics = container.getBoundingClientRect();
    var containerMetricsRight = Math.floor(containerMetrics.right);
    var containerMetricsLeft = Math.floor(containerMetrics.left);
    var contentMetrics = content.getBoundingClientRect();
    var contentMetricsRight = Math.floor(contentMetrics.right);
    var contentMetricsLeft = Math.floor(contentMetrics.left);

    if (
      containerMetricsLeft > contentMetricsLeft &&
      containerMetricsRight < contentMetricsRight
    ) {
      return 'both';
    }
    else if (contentMetricsLeft < containerMetricsLeft) {
      return 'left';
    }
    else if (contentMetricsRight > containerMetricsRight) {
      return 'right';
    }
    else {
      return 'none';
    }
  }

  function toggleArrowClasses($carousel, state) {
    $carousel
      .removeClass(
        'js-carousel__overflow--both js-carousel__overflow--left js-carousel__overflow--right js-carousel__overflow--none'
      )
      .addClass('js-carousel__overflow--' + state);
  }

  Drupal.behaviors.carousel = {
    attach: function carouselAttach(context) {
      var $carouselRoot = $('.js-carousel', context);
      var $nav = $('.site__header > .navigation', context);
      var isWalkthrough = $('.walkthrough-content', context).length;

      // Bounce if no carousel on page
      if (!$carouselRoot.length) {
        return;
      }

      $carouselRoot.each(function () {
        var $carousel = $(this);
        var $carouselList = $carousel.find('#carouselList');
        var $carouselButton = $carousel.find('.js-carousel-button');
        // For calculations.
        var carouselList = document.getElementById('carouselList');
        var carouselContainer = document.getElementById('carouselContainer');

        var tabString = '';
        $('[id^="chapter-"]', context).each(function (i) {
          var $self = $(this);
          var headingText = $self.text();
          var headingId = $self.attr('id');
          var splitArr = headingId.split('-');
          var isSelected = i === 0;
          if (isWalkthrough) {
            tabString +=
              '<div class="carousel__item js-carousel-item"><a href="#' +
              headingId +
              '" class="tab__item" id="tab-' +
              splitArr[1] +
              '" aria-selected="' +
              isSelected +
              '"><div class="chapter-tab-index">' +
              (i + 1) +
              '</div><div class="chapter-tab-title">' +
              $.trim(headingText) +
              '</div></a></div>';
          }
          else {
            tabString +=
              '<div class="carousel__item js-carousel-item"><a href="#' +
              headingId +
              '" class="tab__item" id="tab-' +
              splitArr[1] +
              '" aria-selected="' +
              isSelected +
              '">' +
              headingText +
              '</a></div>';
          }
        });

        var $tabString = $(tabString);
        var $tabs = $('[id^="tab-"]', $tabString);
        $tabs.hammer().on('click tap press', function (e) {
          e.preventDefault();

          $tabs.attr('aria-selected', 'false').removeClass('tab__item--active');
          $(this).attr('aria-selected', 'true');

          var anchorId = $(this).attr('href');
          var $anchor = $(anchorId, context);
          if ($nav.length > 0) {
            var navHeight = $nav.outerHeight() || 0;
            if (navHeight) {
              var anchorOffset = $anchor.offset().top - $anchor.outerHeight();
              var scrollTopOffset = anchorOffset || 0;
              // Adjust for sticky nav.
              scrollTopOffset -= 3 * navHeight;
              // Buffer of 10px.
              scrollTopOffset -= 10;
              // Animate the scroll.
              if (scrollTopOffset > 0 && !isWalkthrough) {
                $('html, body', context).animate(
                  {
                    scrollTop: scrollTopOffset
                  },
                  {
                    duration: 600
                  }
                );
              }
            }
          }
        });

        $carouselList.append($tabString);

        var overflowState = 'right';
        toggleArrowClasses($carousel, overflowState);
        $carouselList.css('width', setItemWidth($carousel));
        magicLine($carousel, context);

        // Resize.
        $(window).on(
          'resize',
          _.throttle(function windowResize() {
            var overflowState = determineOverflow(
              carouselList,
              carouselContainer
            );
            toggleArrowClasses($carousel, overflowState);
            $carouselList.css('width', setItemWidth($carousel));
            magicLine($carousel, context);
          }, 400)
        );

        // Button click/tap/press.
        $carouselButton.hammer().on('click tap press', function (e) {
          var moveTo = slide($carousel, e.target);
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                var overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });
        // Swipe events.
        $carouselList.hammer().on('swipeleft', function () {
          var moveTo = slide($carousel, 'next');
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                var overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });
        $carouselList.hammer().on('swiperight', function () {
          var moveTo = slide($carousel, 'prev');
          $carouselList.stop().animate(
            {
              left: moveTo
            },
            {
              complete: function () {
                var overflowState = determineOverflow(
                  carouselList,
                  carouselContainer
                );
                toggleArrowClasses($carousel, overflowState);
              }
            }
          );
        });
      });

      var windowPosition = 0;
      var carouselCSS = {};
      var carouselTop = $carouselRoot.position().top;
      var carouselHeight = $carouselRoot.outerHeight();
      var carouselTogglePosition = carouselTop - carouselHeight;
      // Variables used for scrollspy.
      var lastId = '';
      // All list items
      var menuItems = $('#carouselList', context).find('a');
      // Anchors corresponding to menu items
      var scrollItems = menuItems.map(function () {
        var item = $($(this).attr('href'));
        if (item.length) {
          return item;
        }
      });

      $(window).on(
        'scroll',
        _.debounce(function debounceCarouselPositionSet() {
          windowPosition = $(this).scrollTop();

          if ($(this).width() < 768) {
            // More top margin to account for the topic navigator.
            if (windowPosition >= carouselTogglePosition) {
              carouselCSS = {
                position: 'fixed',
                top: '106px'
              };
            }
            else if (windowPosition < carouselTogglePosition) {
              carouselCSS = {
                position: 'relative',
                top: 'initial'
              };
            }
          }
          else {
            if (windowPosition >= carouselTogglePosition) {
              carouselCSS = {
                position: 'fixed',
                top: '53px'
              };
            }
            else if (windowPosition < carouselTogglePosition) {
              carouselCSS = {
                position: 'relative',
                top: 'initial'
              };
            }
          }

          $carouselRoot.css(carouselCSS);
          // Scrollspy.
          // Get container scroll position
          var fromTop =
            $(this).scrollTop() + carouselHeight + 3 * $nav.outerHeight();
          // Get id of current scroll item
          var current = scrollItems.map(function () {
            if ($(this).offset().top < fromTop) {
              return this;
            }
          });

          if (current.length) {
            // Get the id of the current element
            current = current[current.length - 1];
            var id = $(current).attr('id');
            if (lastId !== id && !isWalkthrough) {
              lastId = id;
              // Set/remove active class
              $(menuItems).attr('aria-selected', 'false');
              $('[href="#' + id + '"]', context).attr('aria-selected', 'true');
              magicLine($carouselRoot, context);
            }
          }
        }, 0)
      );
    }
  };
})(jQuery, Drupal, _);

/**
 * CTA script
 */

(function carouselScript($, Drupal) {
  'use strict';

  Drupal.behaviors.cta = {
    attach: function ctaAttach($context) {
      // Track click on button within CTA
      $('.cta', $context).on('click', '.button', function ctaClick(e) {
        if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.cta && window.ga && window.ga.loaded) {
          // Do not navigate immediately
          e.preventDefault();
          // Instead fire event to GA
          window.ga('send', {
            hitType: 'event',
            eventCategory: 'CTA',
            eventAction: 'click',
            // Title within CTA block
            eventLabel: ($('.cta__title').data('source-title')) ? $('.cta__title').data('source-title').trim() : $(e.delegateTarget).text().trim(),
            // Navigate after successful GA track
            hitCallback: function ctaClickGACallback() {
              window.location.assign(e.target.href);
            }
          });
        }
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Device switcher script.
 */

(function deviceSwitcherScript($, Drupal) {
  'use strict';

  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'android';
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'apple';
    }
    return 'web';
  }

  Drupal.behaviors.deviceSwitcher = {
    attach: function deviceSwitcherAttach(context) {
      var deviceType = getMobileOperatingSystem();

      $('[data-device="' + deviceType + '"]', context).addClass('device-switcher__toggle--active');
      $('.device-filter__content', context).hide();
      $('[data-content="' + deviceType + '"]', context).fadeIn();

      $('.device-switcher__toggle', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);

          if (!$this.hasClass('device-switcher__toggle--active')) {
            var thisDevice = $this.data('device');
            // Update active toggle.
            $('.device-switcher', context).find('.device-switcher__toggle')
              .removeClass('device-switcher__toggle--active');
            $this.addClass('device-switcher__toggle--active');
            // Show the related content.
            $('.device-filter', context).find('.device-filter__content')
              .hide();
            $('.device-filter', context).find('[data-content="' + thisDevice + '"]')
              .fadeIn();
          }
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * filters script.
 */

(function filtersScript($, Drupal) {
  'use strict';
  Drupal.behaviors.filters = {

    autosubmit: function () {
      // Autosubmit on each select option change.
      if ($('form.js-autosubmit').length > 0) {
        $('input.form-submit').trigger('click');
      }
    },
    attach: function (context) {
      var that = this;

      $('.filters select[multiple]').each(function () {
        var $select = $(this);
        var placeholder = $(this).attr('placeholder');

        if (typeof placeholder === 'undefined' || placeholder === null) {
          placeholder = Drupal.t('Select');
        }

        var $selected_item = $select.parent().find('li.selected');
        if ($selected_item.length > 0) {
          $select.parent().find('.form-select').addClass('has-selected-options');
        }

        $select.multipleSelect({
          selectAllText: $select.attr('data-select-all-text'),
          allSelected: $select.attr('data-all-selected-text'),
          countSelected: Drupal.t('@x of @y selected', {'@x': '#', '@y': '%'}),
          selectAllDelimiter: [],
          placeholder: placeholder,
          onOpen: function () {
            $select.parent().addClass('select-toggle--open');
          },
          onClose: function () {
            $select.parent().removeClass('select-toggle--open');
          },
          onUncheckAll: function () {
            that.autosubmit();
          },
          onCheckAll: function () {
            // Ensure we don't duble click on that, while you still can select
            // all options manually which will auto-trigger the select all.
            var $select_all = $select.parent().find('.ms-select-all.selected');
            if ($select_all.length > 0) {
              that.autosubmit();
            }
          },
          onClick: function (view) {
            that.autosubmit();
          }
        });
      });
    }
  };

  Drupal.behaviors.CSHSFilterLabel = {
    attach: function (context) {
      $('select.simpler-select [data-parent-value="All"]').text('Filter By');
    }
  };

}(jQuery, Drupal));

/**
 * @file
 * Image Tile script.
 */

(function imageTileScript($, Drupal) {
  'use strict';
  Drupal.behaviors.imageTileTarget = {
    attach: function (context) {
      var $clickZone = $('.js-image-tile--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        var $links = $('a', $(this));
        // If using clickZone prevent default links.
        $links.on('click', function (e) {
          e.preventDefault();
        });
        $target.bigTarget({
          clickZone: '.js-image-tile--click-zone',
          clickZoneClass: 'js-image-tile',
          anchorClass: 'js-image-tile__target'
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Media block script.
 */

/**
 * For Media block - video variants.
 *
 * Pinterest Youtube Video with custom poster image JS.
 */
(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.pinYouTubePlayer = {
    attach: function (context, settings) {
      var $video = $('.video--youtube', context);

      // trigger the video player, hide the poster
      $video.each(function () {
        var $playTrigger = $(this).find('.js-play-trigger');
        if ($playTrigger.length > 0) {
          var $videoPlayer = $playTrigger.next('.video-player');
          if ($videoPlayer.length > 0) {
            var $videoIframe = $videoPlayer.find('iframe');
            if ($videoIframe.length > 0 && $videoIframe.attr('src')) {
              $playTrigger.addClass('js-play-trigger--with-video');

              $playTrigger.on('click', function (e) {
                var $trigger = $(this);
                e.preventDefault();
                var $player = $playTrigger.next('.video-player');
                var $iframe = $player.find('iframe');
                var src = $iframe.attr('src');
                if (src) {
                  src = src.replace('autoplay=0', 'autoplay=1');
                  $iframe.attr('src', src);
                  $trigger.hide();
                  $player.show();
                }
              });
            }
          }
        }
      });

    }
  };

})(jQuery, Drupal);

/**
 * @file
 * Pin script.
 */

(function pinScript($, Drupal) {
  'use strict';

  Drupal.behaviors.pinImageFlipToggle = {
    attach: function (context) {
      // This is the placeholder & front element on page load.
      var $pinImageFlipper = $('.js-pin-image-flipper', context);

      // Flip the placeholder to reveal the image on click.
      $pinImageFlipper.each(function () {
        $(this).click(function () {
          var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
          if (isIE11) {
            // We have to use 3 .parent() functions instead of .closest() because of IE11.
            $(this)
              .parent()
              .parent()
              .parent()
              .toggleClass('pin__image-wrap--flip');
          }
          else {
            $(this).closest('.js-pin-image-wrap')
              .toggleClass('pin__image-wrap--flip');
          }
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Squircle script.
 */

(function squircleScript($, Drupal, drupalSettings) {
  'use strict';

  var randomProperty = function (object) {
    // Grab random element from the JSON list.
    var keys = Object.keys(object);
    var randomKey = Math.floor(keys.length * Math.random());
    return {key: randomKey, object: object[keys[randomKey]]};
  };

  Drupal.behaviors.squircle = {
    attach: function squircleAttach(context) {
      var $ballPit = $('.tip-grid__layout', context);
      if (!$ballPit.length) {
        return;
      }

      $('.squircle', context).on('mouseleave', function () {
        $(this).animateCss('pulse');
      });

      if (typeof (drupalSettings.tipsJson) === 'undefined') {
        return;
      }
      var jsonList = drupalSettings.tipsJson;
      if (!jsonList.length || typeof (jsonList) !== 'object') {
        return;
      }

      // On page load, randomize which tips are shown.
      $('.squircle--tip', context).each(function () {
        var $this = $(this);
        var randomItem = randomProperty(jsonList);
        // Remove selected tip from JSON list, so we don't get repeats.
        jsonList.splice(randomItem.key, 1);
        $this.find('.squircle__label').text(Drupal.t('Tip') + ' ' + randomItem.object.nid);
        $this.find('.squircle__headline').text(randomItem.object.field_tip_text);
      });

      // When user clicks to close a Tip, it will zoom out, update text and ID,
      // then bounces back in. The Masonry layout will adjust accordingly.
      $('.squircle__close-button', context).hammer().on('tap press', function () {
        var $tip = $(this).parent();
        var randomItem = randomProperty(jsonList);

        if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.squircle && window.ga && window.ga.loaded) {
          // GA tracking of close button
          window.ga('send', {
            hitType: 'event',
            eventCategory: 'tip',
            eventAction: 'click',
            eventLabel: 'homepage'
          });
        }

        // Remove selected tip from JSON list, so we don't get repeats.
        jsonList.splice(randomItem.key, 1);

        if (jsonList.length) {
          $tip.animateCss('zoomOut', function () {
            $tip.find('.squircle__label').text(Drupal.t('Tip') + ' ' + randomItem.object.nid);
            $tip.find('.squircle__headline').text(randomItem.object.field_tip_text);
            if ($ballPit.length) {
              // Update Masonry layout.
              $ballPit.masonry('layout');
            }
            $tip.animateCss('bounceIn');
          });
        }
      });
    }
  };
}(jQuery, Drupal, drupalSettings));

/**
 * @file
 * Expandable text tiles.
 */

(function textTileExpandable($, Drupal, _, window) {
  'use strict';

  // CSS Animation settings
  // Durations in ms.
  // These should match the css animations.
  // Expanding has 1 phase1.
  var EXPAND_01_DURATION = 400;
  // Collapsing has 2 phases.
  var COLLAPSE_01_DURATION = 400;
  var COLLAPSE_02_DURATION = 400;

  // JS animation settings.
  var EXPAND_SCROLL_TOP_BUFFER = 10;
  var EXPAND_SCROLL_ANIMATION_DURATION_DIRECT_LINK = 600;

  // Get the left tile of the given tile assuming a 2 column grid.
  var getLeftTile = function ($container) {
    var $prevContainers = $container.prevAll('.text-tile--expandable').filter(':not(.text-tile--expanded)');
    if ($prevContainers.length > 0 && ($prevContainers.length % 2) !== 0) {
      return $prevContainers.first();
    }

    return [];
  };

  /**
   * Process the expandable element.
   *
   * @param {Object} $container
   *   The text tile container jQuery object.
   * @param {string} operation
   *   The operation to perform: 'expand', 'collapse'.
   * @param {int} scrollDuration
   *   The duration for the scroll animation.
   *
   * @return {Object}
   *   The passed in container jQuery object.
   */
  var processExpandable = function ($container, operation, scrollDuration) {
    if ($container.length === 0) {
      return $container;
    }

    var $leftContainer = getLeftTile($container);
    if ($leftContainer !== null && $leftContainer.length > 0) {
      // Scroll processing.
      if (operation === 'collapse') {
        // Collapse.
        scrollCollapse($container, scrollDuration);
      }
      else {
        // Expand.
        $container.addClass('right-container');
        scrollExpand($container, scrollDuration);
      }
    }
    else if (operation === 'collapse') {
      // Collapse.
      collapse($container);
    }
    else {
      // Default: Expand.
      expand($container);
    }

    return $container;
  };

  // Collapse the expandable.
  var collapse = function ($container, scrollDuration) {
    $container.addClass('text-tile--collapsing');
    window.setTimeout(function () {
      $container.removeClass('text-tile--expanded text-tile--collapsing right-container');
      $container.animate({
        marginTop: 0
      }, COLLAPSE_02_DURATION);
    }, COLLAPSE_01_DURATION + COLLAPSE_02_DURATION);
  };

  // Expand the expandable.
  var expand = function ($container) {
    $container.addClass('text-tile--expanded');
  };

  // Collapse and scroll back up.
  var scrollCollapse = function ($container, scrollDuration) {
    // Scroll back up.
    var scrollTopOffset = $container.offset().top;
    if (scrollTopOffset > 0) {
      // Previous container adjust.
      var $leftContainer = getLeftTile($container);
      if ($leftContainer.length > 0) {
        scrollTopOffset -= $leftContainer.outerHeight();
      }

      // Adjust for sticky nav.
      var navHeight = $('.site__header > .navigation').outerHeight() || 0;
      scrollTopOffset -= 3 * navHeight;

      // Buffer.
      scrollTopOffset -= EXPAND_SCROLL_TOP_BUFFER;

      // Animate the scroll.
      if (scrollTopOffset > 0) {
        collapse($container, scrollDuration);
      }
      else {
        // Fallback.
        collapse($container, scrollDuration);
      }
    }
    else {
      // No scroll.
      collapse($container, scrollDuration);
    }
  };

  // Scroll and expand the expandable.
  var scrollExpand = function ($container, scrollDuration) {
    var scrollTopOffset = $container.offset().top;
    if (scrollTopOffset > 0) {
      // Previous container adjust.
      var $leftContainer = getLeftTile($container);
      if ($leftContainer.length > 0) {
        scrollTopOffset += $leftContainer.outerHeight();
      }

      // Adjust for sticky nav.
      var navHeight = $('.site__header > .navigation').outerHeight() || 0;
      scrollTopOffset -= 3 * navHeight;

      // Buffer.
      scrollTopOffset -= EXPAND_SCROLL_TOP_BUFFER;
      // Animate the scroll.
      if (scrollTopOffset > 0) {
        $($container).animate({
          marginTop: $container.outerHeight()
        }, {
          duration: EXPAND_01_DURATION,
          complete: function () {
            expand($container);
          }
        });
        $('html, body').animate({
          scrollTop: $container.offset().top - $container.outerHeight()
        }, {
          duration: EXPAND_01_DURATION
        });
      }
      else {
        // Fallback.
        expand($container);
      }
    }
    else {
      // No scroll.
      expand($container);
    }
  };

  /**
   * Expandable text tiles.
   */
  Drupal.behaviors.textTileExpandable = {
    attach: function (context) {
      $('.text-tile--expandable:not(.pin-expandable-processed)', context).each(function () {
        var $container = $(this);
        $container.addClass('pin-expandable-processed');
        var $expandable = $('> .text-tile__expandable-element', $container);

        // Skip if nothing to expand.
        if ($expandable.length === 0) {
          $('> .text-tile__cta', $container).hide(0);
          return true;
        }

        // Expand click listener.
        $('> .text-tile__cta .js-button--link', $container).click(function (event) {
          event.preventDefault();
          var $parentContainer = $(this).closest('.text-tile--expandable');
          if ($parentContainer.length > 0) {
            processExpandable($parentContainer, 'expand');
          }
        });

        // Collapse click listener.
        $('.expandable-element__header .js-button--link', $expandable).click(function (event) {
          event.preventDefault();
          var $parentContainer = $(this).closest('.text-tile--expandable');
          if ($parentContainer.length > 0) {
            processExpandable($parentContainer, 'collapse');
          }
        });
      });

      // Process incoming links.
      if (window.location.hash && window.location.hash.indexOf('=') === -1) {
        var $bodyInit = $('body:not(.pin-expandable-init-processed)', context);
        if ($bodyInit.length > 0) {
          $bodyInit.addClass('pin-expandable-init-processed');
          var $incomingTrigger = $(window.location.hash, $bodyInit)
            .filter('.text-tile__expandable-anchor-link')
            .siblings('.text-tile__cta')
            .find('> .js-button--link');
          if ($incomingTrigger.length > 0) {
            var $incomingContainer = $incomingTrigger.closest('.text-tile--expandable');
            if ($incomingContainer.length > 0) {
              scrollExpand($incomingContainer, EXPAND_SCROLL_ANIMATION_DURATION_DIRECT_LINK);
            }
          }
        }
      }
    }
  };

}(jQuery, Drupal, _, window));

/**
 * @file
 * Text Tile script.
 */

(function textTileScript($, Drupal) {
  'use strict';
  Drupal.behaviors.textTileTarget = {
    attach: function (context) {
      var $clickZone = $('.js-text-tile--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        $target.bigTarget({
          clickZone: '.js-text-tile--click-zone',
          clickZoneClass: 'js-text-tile',
          anchorClass: 'js-text-tile__target'
        });
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Tooltip script.
 */

(function tooltipScript($, Drupal) {
  'use strict';

  Drupal.behaviors.tooltip = {
    attach: function tooltipAttach(context) {
      var $tooltipLink = $('.tooltip__link', context);

      $tooltipLink.tooltipster({
        trigger: 'click'
      });

      $(document).hammer().on('tap press', function () {
        $tooltipLink.tooltipster('close');
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Navigation script.
 */

(function navigationScript($, Drupal, _) {
  'use strict';

  var isMobileMenuOpen = false;

  // Utility function to resolve on/off classes.
  var navbarActionClasses = function ($element) {
    return {
      on: 'navigation--white-bg',
      off: $element.data('navOffClass') || 'navigation--trans-bg'
    };
  };

  /*
   * Navbar
   */
  Drupal.behaviors.navigationNavbar = {
    attach: function (context) {
      var $navbar = $('.navigation', context);
      var $header = $('.header', context);
      var topicNavCheck = $('.topic-navigator', context).length;
      var $siteHeader = $('.site__header', context);
      var $hasMessagesTabs = $('.site__utility', context).find('#block-tabs, .message').length !== 0;

      if (!$navbar.length) {
        return;
      }

      $('.u-no--click-through', context).on('click', function (e) {
        e.preventDefault();
      });

      if (topicNavCheck && $(window).width() < 768) {
        $navbar
          .attr('data-nav-overlay', 'false')
          .addClass('navigation--white-bg ')
          .removeClass('navigation--trans-bg');
        $siteHeader
          .removeClass('site__header--fixed-nav')
          .addClass('site__header--secondary-fixed-nav');
      }
      else {
        // Set navbar to overlay if header has background.
        // Do not do this if there are tabs or a message in between the header and the navigation.
        if ($header.attr('data-has-bg') === 'true' && !$hasMessagesTabs) {
          $navbar
            .attr('data-nav-overlay', 'true')
            .addClass('navigation--trans-bg')
            .removeClass('navigation--white-bg');
        }

        // Save class to restore when not active.
        $navbar.attr('data-nav-off-class', $navbar.hasClass('navigation--white-bg') ? 'navigation--white-bg' : 'navigation--trans-bg');
      }

      // Apply the proper background to navbar using scrolling data attributes.
      $(window).on('scroll', _.debounce(function () {

        // If main menu is not expanded on mobile.
        if (!$('body').hasClass('u-noscroll')) {

          var actionClasses = navbarActionClasses($navbar);

          // If menu is not in position 0 (top).
          if ($(this).scrollTop() > 0) {

            if ($navbar.attr('data-nav-overlay') === 'true') {
              // Set navigation bar white overlay.
              $navbar
                .attr('data-nav-scrolling', 'true')
                .addClass(actionClasses.on)
                .removeClass(actionClasses.off);
            }
            else {
              $navbar
                .attr('data-nav-scrolling', 'true');
            }
          }
          else {
            if ($navbar.attr('data-nav-overlay') === 'true' && $(this).scrollTop() > 0) {
              // If menu is in position 0, remove uneeded attributes and add relevant classes.
              $navbar.removeAttr('data-nav-scrolling').removeClass(actionClasses.on).addClass(actionClasses.off);
            }
            else {
              $navbar.removeAttr('data-nav-scrolling');
            }
          }
        }
      }, 15));

      // Only apply background changes on hover if not scrolling.
      $navbar.hover(function () {
        var $t = $(this);
        if ($t.attr('data-nav-scrolling') === 'true') {
          return;
        }
        else if ($t.attr('data-nav-overlay') === 'false') {
          return;
        }
        else if (topicNavCheck && $(window).width() < 768) {
          return;
        }
        else {
          var actionClasses = navbarActionClasses($t);
          $t
            .addClass(actionClasses.on)
            .removeClass(actionClasses.off);
        }
      }, function () {
        var $t = $(this);
        if ($t.attr('data-nav-scrolling') === 'true') {
          return;
        }
        else if ($t.attr('data-nav-overlay') === 'false') {
          return;
        }
        else if (topicNavCheck && $(window).width() < 768) {
          return;
        }
        else {
          var actionClasses = navbarActionClasses($t);
          if (!isMobileMenuOpen) {
            $t
              .addClass(actionClasses.off)
              .removeClass(actionClasses.on);
          }
        }
      });

      if ($('.navigation').hasClass('navigation--white-bg') && !$siteHeader.hasClass('site__header--secondary-fixed-nav')) {
        $siteHeader.addClass('site__header--fixed-nav');
      }

      // Resize
      $(window).on('resize', _.throttle(function windowResize() {
        if ($(this).width() >= 768) {
          $siteHeader.removeClass('site__header--secondary-fixed-nav');
        }
        else if (topicNavCheck) {
          $navbar
            .attr('data-nav-overlay', 'false')
            .addClass('navigation--white-bg ')
            .removeClass('navigation--trans-bg');
          $siteHeader
            .removeClass('site__header--fixed-nav')
            .addClass('site__header--secondary-fixed-nav');
        }

        if ($('.menu__toggle').css('display') === 'none') {
          $('.navigation .desktop').css('display', 'block');

          // Set primary and dependent offsets.
          var navHeight = $('.navigation').height();
          var navTop = $('.navigation').position().top;
          $('header.site__header--fixed-nav').css('padding-top', navHeight);
          $('.submenu').css({top: navTop + navHeight + 1});
        }
        else {
          $('.navigation .desktop').css('display', 'none');

          // Reset primary offset.
          $('header.site__header--fixed-nav').css('padding-top', '52px');
        }

        // Match the tools menu height with the main menu height.
        // Note: this assumes the tools menu will always be initially shorter than the main menu.
        var mainMenuHeight = $('.header__nav-main .menu--main').outerHeight();
        $('.header__nav-actions .menu--tools').height(mainMenuHeight);
        $('.header__nav-actions .menu--search').height(mainMenuHeight);
        $('.header__nav-anon .menu--user').height(mainMenuHeight);
        $('aside.branding').height(mainMenuHeight);

      }, 400));
    }
  };

  /*
   * Submenu
   */
  Drupal.behaviors.navigationSubmenu = {
    attach: function (context) {
      var fadeDuration = 125;
      // Main menu item links act as triggers for submenu targets.
      $('.menu--main .menu__item a, .menu--main .menu__item span', context).hoverIntent(function () {
        var $main_menu_items = $('.menu--main .menu__item');
        var $main_item = $(this).parent('.menu__item');
        var $navbar = $main_item.closest('.navigation');
        var $navheader = $navbar.parent('.site__header');
        var $target = $main_item.attr('data-submenu-target');
        var $submenu = $('[data-submenu="' + $target + '"]', $navheader);
        // Reset the old hover classes, prior assigning new one.
        $main_menu_items.removeClass('menu__item--is-open');
        // Assigning active class.
        $main_item.addClass('menu__item--is-open');
        if ($submenu.length > 0) {
          // -- clear any existing timer
          clearTimeout($submenu.data('hoverTimer'));

          // -- fade in the submenu
          $submenu.stop(true, true).fadeIn(fadeDuration).attr('data-submenu-open', 'true');
        }
      }, function () {
        var $main_item = $(this).parent('.menu__item');
        var $navbar = $main_item.closest('.navigation');
        var $navheader = $navbar.parent('.site__header');
        var $target = $main_item.attr('data-submenu-target');
        var $submenu = $('[data-submenu="' + $target + '"]', $navheader);
        if ($submenu.length > 0) {
          // -- set a timer
          var timer = setTimeout(function () {
            $submenu.stop(true, true).fadeOut(fadeDuration).removeAttr('data-submenu-open');
            $main_item.removeClass('menu__item--is-open');
          }, 400);
          $submenu.data('hoverTimer', timer);
        }
        else {
          $('.menu--main .menu__item').removeClass('menu__item--is-open');
        }
      });

      // Hover the submenu, clear the hoverTimer.
      $('.submenu__item[data-submenu]', context).hover(function () {
        var $t = $(this);
        // -- clear timer
        clearTimeout($t.data('hoverTimer'));

        // -- swap navbar classes conditionally
        var $navbar = $t.closest('.submenu').siblings('.navigation');
        if ($navbar.attr('data-nav-overlay') === 'true' && !$navbar.attr('data-nav-scrolling')) {
          var actionClasses = navbarActionClasses($navbar);
          $navbar
            .addClass(actionClasses.on)
            .removeClass(actionClasses.off);
        }
      }, function () {
        var $t = $(this);
        // -- fade out when no longer hovering
        $t.stop(true, true).fadeOut(fadeDuration).removeAttr('data-submenu-open');

        // -- swap navbar classes conditionally
        var $navbar = $t.closest('.submenu').siblings('.navigation');
        if ($navbar.attr('data-nav-overlay') === 'true' && !$navbar.attr('data-nav-scrolling')) {
          var actionClasses = navbarActionClasses($navbar);
          $navbar
            .removeClass(actionClasses.on)
            .addClass(actionClasses.off);
        }
        $('.menu--main .menu__item').removeClass('menu__item--is-open');
      });
    }
  };

  /*
   * Mobile
   */
  Drupal.behaviors.navigationMobile = {
    attach: function (context) {
      var $toggle = $('.menu__toggle', context);
      var target = $toggle.attr('data-menu-target');
      var targetEl = '.' + target;
      var $navigation_inner = $('.navigation__inner');
      var $content = $('.site__content, .site__footer');
      var wSTop = 0;
      var $navbar = $('.navigation');
      var $menuSearch = $('.menu--search', context);

      $toggle.click(function () {
        var $this = $(this);
        var $toggleText = $this.find('.menu__toggle-text');
        // Display the content and footer when the hamburger nav gets closed.
        if (isMobileMenuOpen) {
          $content.show();
          window.scrollTo(0, wSTop);
        }
        $this
          .toggleClass('menu__toggle--collapsed')
          .toggleClass('menu__toggle--open');

        if (!$menuSearch.length) {
          // prevent body behind mobile menu from scrolling
          $this.closest('body').toggleClass('u-noscroll');
        }

        isMobileMenuOpen = !isMobileMenuOpen;
        $(targetEl).slideToggle('fast', function () {

          // Save the window position and hide the content with footer to avoid
          // the double scroll glitch.
          if (isMobileMenuOpen) {
            wSTop = window.scrollY;
            $content.hide();
            $navbar.removeClass('navigation--trans-bg').addClass('navigation--white-bg');
          }
        });

        // Change the text of the menu toggle for screen readers.
        if (isMobileMenuOpen) {
          $toggleText.text(Drupal.t('Close menu'));
        }
        else {
          $toggleText.text(Drupal.t('Open menu'));
        }

        if (!$menuSearch.length) {
          // toggle navigation inner.
          $navigation_inner.toggleClass('collapsed');
        }
      });

      // Autoclose mobile naviagation when screen width exceeds 1024px.
      $(window).resize(function () {
        if ($(window).width() > 1024) {
          if ($navigation_inner.hasClass('collapsed')) {
            $('.menu__toggle').trigger('click');
          }
        }
      });
    }
  };

  /*
   * Manage user menu
   */
  Drupal.behaviors.userMenuNav = {
    attach: function (context, settings) {

      // Check for user sessionStorage.
      var $user_session_data = JSON.parse(sessionStorage.getItem('pin_pinterest_authusers.user'));

      if ($user_session_data === null || settings.pin_user_nav_blocks.pinUserScripts.menuOutput === null) {
        return;
      }

      // Get the user menu from drupal settings.
      var $user_menu = $.parseHTML(settings.pin_user_nav_blocks.pinUserScripts.menuOutput);

      // Format the user menu.
      $($user_menu).find('li').addClass('menu__item');

      // Default avatar.

      var $user_avatar = 'https://s.pinimg.com/images/user/default_75.png';
      if ($user_session_data.img && $user_session_data.img.length > 0) {
        // If images exist, use the first one listed.
        $user_avatar = $user_session_data.img;
      }

      // Set the user object.
      var $user = {
        username: Drupal.checkPlain($user_session_data.un),
        name: Drupal.checkPlain($user_session_data.fn),
        avatar: Drupal.checkPlain($user_avatar),
        alt: Drupal.checkPlain($user_session_data.fn) + ' ' + Drupal.checkPlain($user_session_data.ln)
      };
      // Truncate long names to not break layout.
      $user.shortname = ($user.name).length > 29 ? jQuery.trim($user.name).substring(0, 29) + '...' : $user.name;

      // Create markup for header user menu items.
      var $markup = '<div class="user__profile">'
          + '<a href="https://pinterest.com/' + $user.username + '">'
          + '<span class="user__profile__avatar"><img alt="' + $user.alt + '" src="' + $user.avatar + '"></span>'
          + '<span class="user__profile__name">' + $user.shortname + '</span>'
          + '</a></div>'
          + '<button class="menu__user__toggle menu__user__toggle--collapsed" data-menu-target="menu-user-authenticated">'
          + '<span class="menu__user__toggle-text">User Menu</span>'
          + '</button>';

      // Replace the anonymous user menu with authenticated one.
      $('#block-headernavigationanon', context).after($user_menu).replaceWith($markup);

      // Toggle behavior for show/hide of user menu on desktop.
      var isUserMenuOpen = false;
      var $toggle = $('.menu__user__toggle', context);
      var target = $toggle.attr('data-menu-target');
      var targetEl = '.' + target;
      // Toggle user menu function.
      $toggle.click(function () {

        $(this)
          .toggleClass('menu__user__toggle--collapsed')
          .toggleClass('menu__user__toggle--open');

        isUserMenuOpen = !isUserMenuOpen;
        $(targetEl).slideToggle('fast', function () {

        });
      });
      // Auto-close user menu when screen width is less than 1024px.
      $(window).resize(function () {
        if ($(window).width() < 1024) {
          if ($toggle.hasClass('menu__user__toggle--open')) {
            $toggle.trigger('click');
          }
        }
      });
    }
  };

  /*
   * Mobile help-center-mobile-nav
   */
  Drupal.behaviors.userMobile = {
    attach: function (context) {
      var $mobileMenu = $('.menu--mobile', context);
      var $userMenu = $('.menu--user', context);
      var $userProfile = $('.user__profile');
      // Check for mobile and user menus.
      if ($mobileMenu.length && $userMenu.length) {
        // Clone the user menu and update classes.
        var $userMenuMobile =
          $userMenu
            .clone()
            .removeClass()
            .addClass('mobile-user-menu');
        // If logged in, add the user profile menu.
        if ($userProfile.length) {
          $userProfile
            .clone()
            .addClass('mobile')
            .wrap("<li class='menu__item'></li>")
            .parent()
            .prependTo($userMenuMobile);
        }
        // Add the mobile version of the user menu to the mobile menu.
        $userMenuMobile
          .wrap("<li class='menu__item'></li>")
          .parent()
          .appendTo($mobileMenu);
      }
    }
  };

}(jQuery, Drupal, _));

/**
 * @file
 * Nav Circles script.
 */

(function navCirclesScript($, Drupal, _) {
  'use strict';

  /*
   * Set click targets.
   */
  Drupal.behaviors.navCirclesTarget = {
    attach: function (context) {
      var $clickZone = $('.js-nav-circle--click-zone', context);

      $clickZone.each(function () {
        var $target = $('a', $(this)).first();
        $target.bigTarget({
          clickZone: '.js-nav-circle--click-zone',
          clickZoneClass: 'js-nav-circle',
          anchorClass: 'js-nav-circle__target'
        });
      });
    }
  };

  /*
   * Set text sizes.
   */
  Drupal.behaviors.navCirclesTextSize = {
    attach: function (context) {
      var $navCircles = $('.nav-circle', context);
      // Map a utility class to set font-size/line-height
      // based on a current line-height.
      var sizeMap = {
        24: 'u-text--18-22',
        20: 'u-text--14-16',
        16: 'u-text--12-14'
      };

      $navCircles.each(function () {
        var $t = $(this);
        var $text = $('a', $t);
        var textHeight = $text.height();
        var lineHeight = parseInt($text.css('line-height'));
        // The height of the text divided by the current line-height
        // will tell us how many lines of text we have.
        var lineNums = textHeight / lineHeight;

        function setSize(navCircle) {
          // If text is four or more lines, bump down the
          // font-size/line-height by setting utility class.
          if (lineNums >= 4) {
            navCircle.addClass(sizeMap[lineHeight]);
          }
          // Else, remove any traces of the classes.
          else {
            for (var size in sizeMap) {
              if (size) {
                navCircle.removeClass(sizeMap[size]);
              }
            }
          }
        }

        setSize($t);

        $(window).resize(_.debounce(function () {
          // Re-evaluate some variables.
          textHeight = $text.height();
          lineHeight = parseInt($text.css('line-height'));
          lineNums = textHeight / lineHeight;

          setSize($t);
        }, 50));
      });
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Footer scripts.
 */

(function footerScript($, Drupal, _) {
  'use strict';

  /*
  * Full viewport height content/sticky footer
  */
  Drupal.behaviors.footerSticky = {
    attach: function (context) {
      function setHeight() {
        var $siteContent = $('.site__content', context);
        var siteContentHeight = parseInt($siteContent.height());
        var siteHeight = parseInt($('.site', context).height());
        var viewportHeight = window.innerHeight;

        if (siteHeight < viewportHeight) {
          $siteContent
            .css('min-height', siteContentHeight + (viewportHeight - siteHeight))
            .addClass('site__content--full-height');
        }
      }

      // Need setHeight() to run after React is injected onLoad.
      setTimeout(function () {
        setHeight();
      }, 0);

      $(window).resize(_.debounce(function () {
        setHeight();
      }, 50));

      if ($('.footer-flush', context).length) {
        $('.footer', context).addClass('footer--no-margin');
      }
    }
  };

}(jQuery, Drupal, _));

(function languageSwitchScript($, Drupal, _) {
  'use strict';

  /*
   * Language select
   */
  Drupal.behaviors.languageSelectSwitcher = {
    attach: function (context) {
      var $languageSelect = $('.js-language-block', context);

      // Bind change event to select.
      $languageSelect.on('change', function () {
        var url = $(this).val(); // get selected value
        if (url) { // require a URL
          window.location = url; // redirect
        }
        return false;
      });
    }
  };

}(jQuery, Drupal, _));


(function footerCountryCodedLinks($, Drupal, _) {
  'use strict';

  /**
   * Extract the geoip country code cookie.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var getGeoIpCountryCodeCookie = function () {
    var cookie = {
      name: '_ss_country_code',
      value: null
    };

    if ('cookie' in $) {
      var cookieValue = $.cookie(cookie.name);
      if (typeof cookieValue !== 'undefined') {
        cookie.value = cookieValue;
      }
    }

    return cookie;
  };


  /**
   * Footer country coded links.
   */
  Drupal.behaviors.footerCountryCodedLinks = {
    attach: function (context) {
      var country_cookie = getGeoIpCountryCodeCookie();
      if (country_cookie.value) {
        $('.footer__menu__item[data-country-code=' + country_cookie.value.toUpperCase() + ']', context).show();
      }
    }
  };

}(jQuery, Drupal, _));

/**
 * @file
 * Alerts script.
 */

(function alertsScript($, Drupal, _, drupalSettings) {
  'use strict';

  var $alerts = $('.alerts, .notification');

  /**
   * Extract the tracker cookie name and value for the container element.
   *
   * TODO: Assumes only 1 tracker withing the container.
   *
   * @param {Object} $container
   *   The container jQuery object.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var getAlertsTrackerCookie = function ($container) {
    var cookie = {
      name: '',
      value: null
    };

    if ('cookie' in $) {
      $('[data-alert-tracker-id]', $container).first().each(function () {
        var $t = $(this);
        cookie.name = 'pinAlert' + $t.data('alertTrackerId');

        var cookieValue = $.cookie(cookie.name);
        if (typeof cookieValue !== 'undefined') {
          cookie.value = cookieValue;
        }

        return false;
      });
    }

    return cookie;
  };

  /**
   * Set the tracker cookie name and value for the container element.
   *
   * TODO: Assumes only 1 tracker withing the container.
   *
   * @param {Object} $container
   *   The container jQuery object.
   *
   * @return {Object}
   *   An object with the following for the first tracker found:
   *   'name': The name of the cookie.
   *   'value': The current value of the cookie, null if not set.
   */
  var setAlertsTrackerCookie = function ($container) {
    var cookie = getAlertsTrackerCookie($container);
    if (cookie.name) {
      cookie.value = 1;
      $.cookie(cookie.name, cookie.value, {
        path: drupalSettings && drupalSettings.path ? (drupalSettings.path.baseUrl || '/') : '/',
        expires: 365,
        secure: true
      });
    }

    return cookie;
  };

  var calculateOffset = function ($container) {
    // Set offset based on the negative of the current
    // CSS bottom value plus the height of the alert.
    var currentBottom = parseInt($container.css('bottom'), 10);
    var alertHeight = $container.height();
    var alertOffset = (alertHeight - currentBottom) * -1;
    return alertOffset;
  };

  var prepareAlert = function ($container, alertOffset) {
    $container.css({
      bottom: alertOffset,
      display: 'block',
      visibility: 'visible'
    });
    // Check if a cookie is set against it.
    var cookie = getAlertsTrackerCookie($container);
    if (cookie.value) {
      disableAlert($container);
    }
  };

  var displayAlert = function ($container, alertOffset) {
    if ($container.hasClass('alerts--active')) {
      var $window = $(window);
      var $document = $(document);
      var displayHeight = $.type($container.data('alertDisplayHeight')) !== 'undefined' ? $container.data('alertDisplayHeight') : $window.height();
      var scrollPosition = $document.scrollTop();
      if (scrollPosition >= displayHeight) {
        // We add an amination class here to set transition in CSS
        // and avoid an animating alerts box on initial page load.
        $container.addClass('alerts--anim').css('bottom', 0);
      }
      else {
        $container.css('bottom', alertOffset);
      }
    }
  };

  var dismissAlert = function ($container, alertOffset) {
    $container
      .css('bottom', alertOffset)
      .delay(700).hide(0);
    setAlertsTrackerCookie($container);
    disableAlert($container);
    activateNextAlert($alerts);
  };

  var disableAlert = function ($container) {
    $container.addClass('alerts--disabled');
    $container.removeClass('alerts--active');
  };

  var activateAlert = function ($container) {
    $container.addClass('alerts--active');
  };

  var activateNextAlert = function ($alerts) {
    // Find the first alert not disabled and activate it.
    $alerts.not('.alerts--disabled').first().each(function () {
      var $container = $(this);
      activateAlert($container);
    });
  };


  /*
   * Alerts behaviors.
   */
  Drupal.behaviors.alertsSlide = {
    attach: function (context) {
      $alerts.each(function (index) {
        var $container = $(this);
        var alertOffset = calculateOffset($container);
        prepareAlert($container, alertOffset);
        // Slide up/down the alert based on scroll position in the viewport.
        $(window).on('scroll', _.debounce(function () {
          displayAlert($container, alertOffset);
        }, 15));
        // Set an event to dismiss the alert.
        $container.find('.js-alerts__close-button').click(function () {
          dismissAlert($container, alertOffset);
        });
      });
      activateNextAlert($alerts);
      // Trigger the scroll event.
      $(window).scroll();
    }
  };

  /*
   * Hide placeholder on input click.
   */
  Drupal.behaviors.placeholderHide = {
    attach: function (context) {
      var $alerts_input = $('.alerts input');
      if ($alerts_input.length > 0) {
        $alerts_input.on('click', function () {
          $(this).removeAttr('placeholder');
        });
      }
    }
  };

  /*
   * Newsletter validation mechanism.
   */
  Drupal.behaviors.NewsletterValidation = {
    isValidEmailAddress: function (emailAddress) {
      var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; // eslint-disable-line no-useless-escape
      return pattern.test(emailAddress);
    },
    setSubmitStatus: function ($input, $submit) {
      var input_val = $input.val();
      var valid_email = Drupal.behaviors.NewsletterValidation.isValidEmailAddress(input_val);

      // If input not empty or is not valid email, disable sumit.
      if (input_val.length === 0 || !valid_email) {
        $submit.addClass('disabled');
      }
      // otherwise enable by removing disabled class.
      else {
        // otherwise enable by removing disabled class.
        $submit.removeClass('disabled');
      }
    },
    attach: function (context) {
      var $newsletter_form = $('aside.alerts--newsletter');

      // Check if newsletter form is on the page.
      if ($newsletter_form.length > 0) {
        var $input = $newsletter_form.find('input#edit-email');
        var $submit = $newsletter_form.find('.button--go');

        // Set default status based if input is autocompleted in future case.
        Drupal.behaviors.NewsletterValidation.setSubmitStatus($input, $submit);

        // On keyup event, while typing the e-mail decide whenever to enable
        // the submit.
        $input.keyup(function () {
          Drupal.behaviors.NewsletterValidation.setSubmitStatus($(this), $submit);
        });

      }
    }
  };


}(jQuery, Drupal, _, drupalSettings));

/**
 * @file
 * Header script.
 */

(function headerScript($, Drupal) {
  'use strict';

  Drupal.behaviors.header = {
    attach: function (context) {
      var $header = $('.header--full-height', context);
      var $more = $('.header__more', $header);

      $more.on('click', function () {
        // Get the header's current offset.
        var topOffset = $header.height() + parseInt($header.css('paddingTop')) + parseInt($header.css('paddingBottom'));

        // Give a bit of spacing from the nav.
        var destinationOffset = topOffset - 52;

        // Scroll the body there.
        $('html, body', context).animate({
          scrollTop: destinationOffset + 'px'
        });
      });

      // Forcing focus on header search input if not hidden. Timeout is used to
      // trigger focus state after the page is rendered.
      setTimeout(function headerSearchTimeout() {
        if (!$('.header__inner .search-form__input', context).is(':hidden')) {
          $('.header__inner .search-form__input', context).focus();
        }
      }, 0);
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Headline script.
 */

(function headlineScript($, Drupal, _) {
  'use strict';

  function updateLayout(id) {
    if (!id) {
      return;
    }

    var $headlineHeader = $('#' + id).find('.headline__header');
    var $headlineContent = $('#' + id).find('.headline__content');
    var $headlineSecondaryContent = $('#' + id).find('.headline__secondary-content');
    var $headlinePrimaryMedia = $('#' + id).find('.headline__primary-media');

    if ($(window).width() <= 767) {
      $headlineHeader.prepend($headlinePrimaryMedia);
      $headlineContent.append($headlineSecondaryContent);
      $('#' + id).attr('data-mobile-layout', 'true');
    }
    else {
      $headlineHeader.append($headlineSecondaryContent);
      $headlineContent.prepend($headlinePrimaryMedia);
      $('#' + id).attr('data-mobile-layout', 'false');
    }
  }

  Drupal.behaviors.headline = {
    attach: function (context) {
      if (!$('.headline--flexible-content', context).length) { return; }

      $('.headline--flexible-content', context).each(function () {
        if (($(window).width() > 767 && $(this).data('mobile-layout')) || ($(window).width() <= 767 && !$(this).data('mobile-layout'))) {
          updateLayout($(this).attr('id'));
        }
      });

      $(window).on('resize', _.throttle(function windowResize() {
        $('.headline--flexible-content', context).each(function () {
          var layoutBoolean = $(this).attr('data-mobile-layout');
          if (($(window).width() > 767 && layoutBoolean) || ($(window).width() <= 767 && layoutBoolean === 'false')) {
            updateLayout($(this).attr('id'));
          }
        });
      }, 400));
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Stats script.
 */

(function statsScript($, Drupal, CountUp) {
  'use strict';

  /*
   * Stat Graphics.
   */
  Drupal.behaviors.statGraphics = {
    attach: function (context) {
      // Utility to get a number to a place (10th, 100th, etc).
      function numberPlace(number, increment) {
        return number % increment;
      }

      // Draw a radial graphic.
      function drawRadialGraphic(canvas, value) {
        if (canvas[0].getContext) {
          var ctx = canvas[0].getContext('2d');
          var percent;
          var degree;
          var radian;

          // Punch out the center to make the radial shape.
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(500, 500, 250, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();

          // We can only show the amount over 100% since that's the scale
          // we have to work with in a radial representation.
          // For example 368% will be represented as 68%.
          if (value > 100) {
            // Get below the 100th place value.
            value = numberPlace(value, 100);
            // Turn to percentage.
            percent = value / 100;
            // Then to degrees.
            degree = percent * 360.0;
            // Then to radians.
            radian = degree * (Math.PI / 180);

            // Draw the stroke overlay.
            ctx.strokeStyle = 'rgba(255, 255, 255, .65)';
            ctx.beginPath();
            ctx.lineWidth = 500;
            ctx.arc(500, 500, 500, -0.5 * Math.PI, radian + (-0.5 * Math.PI), true);
            ctx.stroke();
          }
          else {
            // Turn to percentage.
            percent = value / 100;
            // Then to degrees.
            degree = percent * 360.0;
            // Then to radians.
            radian = degree * (Math.PI / 180);

            // Draw the stroke overlay.
            ctx.strokeStyle = 'rgba(255, 255, 255, .65)';
            ctx.beginPath();
            ctx.lineWidth = 500;
            ctx.arc(500, 500, 500, -0.5 * Math.PI, radian + (-0.5 * Math.PI), true);
            ctx.stroke();
          }
        }
      }

      // Draw a circle-on-circle graphic.
      function drawCircleOnCircleGraphic(canvas, value) {
        if (canvas[0].getContext) {
          var ctx = canvas[0].getContext('2d');
          var increase;
          var radius;
          var y;

          // We are greatly simplifying here to give a graphical represention
          // of the increase but keep it visible and have it mean something.
          //
          // If a large enough number, over 250, bring it down by 10x.
          // If after rounding it is still over 25, bring it down again.
          if (value >= 250) {
            value = value / 100;
            increase = Math.round(value);
            if (increase > 25) {
              increase = increase / 10;
            }
          }
          // If a small number, show as it is.
          else if (value <= 25) {
            increase = value;
          }
          // Everything else, round it and bring it down by 10x.
          else {
            increase = Math.round(value);
            if (increase > 25) {
              increase = increase / 10;
            }
          }

          // The radius is using a 1000px canvas, so divide
          //  by the increase, rounding, and divide again by 2.
          radius = Math.round(1000 / increase) / 2;
          // Position centered on the y-axis.
          y = 1000 - radius;

          // Draw the circle, positioning it at the bottom center of the canvas.
          ctx.fillStyle = 'rgba(255, 255, 255, .65)';
          ctx.beginPath();
          ctx.arc(500, y, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
        }
      }

      $('.stats--infographic .stat', context).each(function (index) {
        var $stat = $(this);
        var $canvas = $('.stat__graphic', $stat);
        var type = $canvas.attr('data-stat-graphic');
        var value = $canvas.attr('data-stat-value');

        switch (type) {
          case 'radial':
            drawRadialGraphic($canvas, value);
            break;

          case 'circle-on-circle':
            drawCircleOnCircleGraphic($canvas, value);
            break;
        }
      });
    }
  };

  /*
   * Stat Numbers.
   */
  Drupal.behaviors.statNumbers = {
    attach: function (context) {
      // Count up the stats.
      // Docs: https://inorganik.github.io/countUp.js
      $('.stats--numbers .stat.u-count-up', context).each(function (index) {
        var $stat = $(this);
        var statStart = $stat.attr('data-countup-start');
        var statEnd = $stat.attr('data-countup-end');
        var statPrefix = $('.stat__prefix', $stat).text();
        var statPrefixHtml = '<span class="stat__prefix">' + statPrefix + '</span>';
        var statSuffix = $('.stat__suffix', $stat).text();
        var statSuffixHtml = '<span class="stat__suffix">' + statSuffix + '</span>';
        var statValue = $('.stat__value', $stat)[0];
        // This was hardcoded to '0'. Replaced with variable that will be
        // modified based on following conditions.
        var statDecimalCount = 0;
        // We do the following to ensure that there is a non <div> child
        // that is a pure integer, since that is what our current countUp
        // implementation requires.
        var validStatValue = false;
        $(statValue).contents().each(function () {
          var $statValueText = $(this).text().trim();
          // Check that we're on a text node and that it only has digits.
          if (this.nodeType === 3 && !!$statValueText.match(/^\d+[.,]?\d+$/)) {
            // Check that a decimal does exist.
            if ($statValueText.indexOf('.') !== -1) {
              // Get number of decimal places in number.
              statDecimalCount = $statValueText.split('.')[1].length;
            }
            validStatValue = true;
            return false; // breaks out of .each()
          }
        });

        // Seconds from start to finish of animation
        var duration = 1;
        var countUpOptions = {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: statPrefix ? statPrefixHtml : '',
          suffix: statSuffix ? statSuffixHtml : ''
        };
        if (validStatValue) {
          // This is a valid stat value. Create a CountUp instance and bind it.
          var statCountUp = new CountUp(statValue, statStart, statEnd, statDecimalCount, duration, countUpOptions);
          // Execute `$('.stats-numbers .stat').trigger('anim-trigger')` to start.
          // Done in `animations.js` as part of a staggered start.
          $stat.on('anim-trigger', function () {
            statCountUp.start();
          });
        }
      });
    }
  };
}(jQuery, Drupal, CountUp));

/**
 * @file
 * Blog Block script.
 */

(function blogBlockScript($, Drupal) {
  'use strict';
  Drupal.behaviors.blogBlockTout = {
    attach: function (context) {
      var $blogBlock = $('.blog-block--with-tout', context);
      var $blogBlockItems = $('.blog-block__item', $blogBlock);
      var $itemTout = $('.blog-block__item--tout', $blogBlock);
      // zero-based indexing
      var orderSmall = $itemTout.attr('data-order-small') - 1;
      var orderLarge = $itemTout.attr('data-order-large') - 1;

      // Clone & insert the text tout in the desired "order"
      // for mobile 2-up and for tablet/desktop 4-up grids.
      $blogBlockItems.each(function (index, element) {
        switch (index) {
          // -- mobile position
          case orderSmall:
            $itemTout
              .clone()
              .removeAttr('data-order-large')
              .insertAfter(element);
            break;
          // -- tablet/desktop position
          case orderLarge:
            $itemTout
              .clone()
              .removeAttr('data-order-small')
              .insertAfter(element);
            break;
        }
        // Detach the original tout.
        $itemTout.detach();
      });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Help Center Contact Form script.
 */

(function hcContactFormScript($, Drupal, window, _) {
  'use strict';

  Drupal.behaviors.hcContactForm = {
    attach: function hcContactFormAttach(context, settings) {
      if (typeof settings !== 'undefined' &&
        typeof settings.pin_help_center_contact_form !== 'undefined') {
        if (typeof settings.pin_help_center_contact_form.navIndicator !== 'undefined') {
          var navClass = settings.pin_help_center_contact_form.navIndicator;
          $('.hc-contact-form__navigation li.active').removeClass('active');
          $('.hc-contact-form__navigation li.' + navClass).addClass('active');
        }
      }
      $(window).resize(function () {
        var availableWidth = $(window).width();
        if ($('.hc-contact-form__navigation-wrapper').length && availableWidth <= 580) {
          var navWrapper = $('.hc-contact-form__navigation-wrapper');
          var navList = $('.hc-contact-form__navigation');
          var activeItem = $('.active', navList);
          var activeOffset = activeItem.offset().left;
          var activeWidth = activeItem.width();
          var activeRight = activeOffset + activeWidth;
          var minLeft = Math.abs(availableWidth * 0.15);
          var minRight = Math.abs(availableWidth * -0.85);
          var skipGradient = false;
          if (navList.children().first().hasClass('active')) {
            skipGradient = true;
          }
          if (skipGradient === true) {
            navWrapper.addClass('no-left-gradient');
          }
          else {
            navWrapper.removeClass('no-left-gradient');
          }
          if (skipGradient === false && activeOffset < minLeft) {
            navList.offset({left: minLeft});
          }
          else if (activeRight > minRight) {
            navList.offset({left: -Math.abs(activeRight - minRight)});
          }
        }
        else {
          $('.hc-contact-form__navigation').css({left: 0});
        }
      }).resize();
      $('input[data-drupal-selector="edit-user-issue-subject"]', context).on('focus change', function () {
        window.pinSearch.renderSearch({el: 'search-reduced', variant: 'reduced', context: 'contact_form'});
      }).on('input', function () {
        window.pinSearch.doSearch($(this).val());
      });
      $('input[data-drupal-selector="edit-user-other-emails-add-submit"]').attr({
        value: Drupal.t('Add another email')
      });
      // Accordions.
      // Using setTimeout to work around WebForm's JS that opens accordion
      // options.
      setTimeout(function () {
        $('details', context).each(function () {
          if ($(this).attr('data-webform-key') !== 'account_access_options' &&
          $(this).is('[open]')) {
            $(this).attr('open', '').removeAttr('open');
          }
        });
      }, 0);
      // When the user clicks an issue category, close the currently open
      // category, open the one clicked on, and deselect any chosen option.
      $('details > summary').on('click', function () {
        var $parentSection = $(this).parent().parent();
        $(this).parent().removeAttr('closed');
        $('summary', $parentSection).not(this).each(function () {
          $(this).attr({
            'aria-expanded': 'false',
            'aria-pressed': 'false'
          }).parent().removeAttr('open').attr('closed', '');
        });
        $('input', $parentSection).not(this).each(function () {
          $(this).prop('checked', false);
        });
        // Make sure we re-set the submit to disabled when we do this.
        $parentSection.children()
          .filter('[data-drupal-selector="edit-actions-overview-1"]')
          .addClass('form-disabled')
          .find('input')
          .prop({
            disabled: true
          })
          .addClass('is-disabled');
      });
      // When the user makes a radio button selection on the first page,
      // ensure that the submit button becomes enabled.
      $('[data-drupal-selector="edit-overview-section-1-right"] input[type="radio"]').on('click', function () {
        $(this)
          .closest('[data-drupal-selector="edit-overview-section-1-right"]')
          .children()
          .filter('[data-drupal-selector="edit-actions-overview-1"]')
          .removeClass('form-disabled')
          .find('input')
          .prop({
            disabled: false
          })
          .removeClass('is-disabled');
      });
      // Sticky nav.
      var $nav = $('.hc-contact-form__navigation-wrapper', context);
      var $navHeight = $nav.outerHeight();
      var $distance = $($nav).offset();
      var $window = $(window);
      $window.scroll(function () {
        if ($nav.length > 0 && $window.scrollTop() >= ($distance.top - $navHeight)) {
          $($nav).addClass('sticky');
        }
        else {
          $($nav).removeClass('sticky');
        }
      });
      // Scroll to last completed section.
      var $activeSection = $('.section-active', context);
      if ($activeSection.length) {
        var $lastCompleted = $('.hc-contact-form__completed-sections').children().last();
        if ($lastCompleted.length) {
          var sectionScrollDistance = $lastCompleted.offset().top;
          var winHeight = $(window).height();
          var docHeight = $(document).height() - $lastCompleted.offset().top;
          if (!$lastCompleted.hasClass('scroll-complete') &&
              sectionScrollDistance > 240 &&
              docHeight > winHeight) {
            // 240px is the number needed to align the last completed with the form nav.
            $('html, body').animate({
              scrollTop: (sectionScrollDistance - 240)
            }, 1000);
            $lastCompleted.addClass('scroll-complete');
          }
        }
      }
      $('.pin-media-upload .image-upload-button ~ input[type="submit"]', context).attr('disabled', 'disabled');
      $('.pin-media-upload input[type="checkbox"]', context).on('change', function () {
        if (this.checked) {
          $('.pin-media-upload .image-upload-button ~ input[type="submit"]').removeAttr('disabled');
        }
      });
      var $userDeviceOptions = $('#user-device-options', context);
      if ($userDeviceOptions.length) {
        // Check if all options are blank and select on if so.
        var deviceExists = false;
        var device = device_detect().toString().toLowerCase();
        $('input', $userDeviceOptions).each(function () {
          if ($(this).prop('checked')) {
            deviceExists = true;
          }
        });
        if (deviceExists === false) {
          $('input', $userDeviceOptions).each(function () {
            if ($(this).val() === device) {
              $(this).prop('checked', true);
            }
          });
        }
      }
      var $userBrowserOptions = $('#user-browser-options', context);
      if ($userBrowserOptions.length) {
        // Check if all options are blank and select on if so.
        var browser = browser_detect().toString().toLowerCase();
        var broswerExists = false;
        $('input', $userBrowserOptions).each(function () {
          if ($(this).prop('checked')) {
            broswerExists = true;
          }
        });
        if (broswerExists === false) {
          $('input', $userBrowserOptions).each(function () {
            if ($(this).val() === browser) {
              $(this).prop('checked', true);
            }
          });
        }
      }
    }
  };

  function check_browser(browser) {
    var re = new RegExp(browser, 'i');
    return navigator.userAgent.match(re);
  }

  function device_detect() {

    var device = 'computer';
    var result = null;
    var devices = ['Android', 'IEMobile', 'iPhone', 'iPad', 'Kindle'];

    if (/Kindle|Android|iPhone|iPad|IEMobile/i.test(navigator.userAgent)) {
      $.each(devices, function (index, value) {
        device = check_browser(value);
        if (device !== null) {
          if (device === 'IEMobile') {
            result = 'windowsphone';
            return false;
          }
          result = device;
          return false;
        }
      });
    }

    return result || device;
  }

  function browser_detect() {

    var browsers = ['Edge', 'Firefox', 'OPR', 'Chrome', 'Safari', '.NET'];
    var result = null;

    $.each(browsers, function (index, value) {
      var browser_detected = check_browser(value);
      if (browser_detected !== null) {

        if (browser_detected === 'OPR') {
          result = 'other';
          return false;
        }

        if (browser_detected === '.NET' || browser_detected === 'Edge') {
          result = 'ie';
          return false;
        }
        result = browser_detected;
        return false;
      }
    });

    return result || 'other';
  }

}(jQuery, Drupal, window, _));

/**
 * @file
 * Search Modal script.
 */

(function searchModalScript($, Drupal, drupalSettings, _) {
  'use strict';

  function searchInputTypeSize() {
    $('.dynamic-search__input').on('input', function () {
      var $this = $(this);
      var inputFontSize = parseInt($this.css('font-size'), 10);
      var inputCharCount = $this.val().length;
      var inputWidth = parseInt($this.outerWidth(), 10) + 90;

      // If input font size are set to default, check to see if the text
      // overflows the input. If they do, shrink the font size.
      if ([96, 48].indexOf(inputFontSize) > -1 && (inputCharCount * inputFontSize) > inputWidth) {
        var shrinkFontSize = 0;
        if (inputFontSize === 96) {
          shrinkFontSize = 36;
        }
        else {
          shrinkFontSize = 24;
        }
        $this.css('font-size', shrinkFontSize + 'px');
      }
      // If input font size are set to shrunk font sizes, check to see if the
      // text won't overflow the input. If they do, grow the font size.
      if ([36, 24].indexOf(inputFontSize) > -1) {
        var growFontSize = 0;
        if (inputFontSize === 36) {
          growFontSize = 96;
        }
        else {
          growFontSize = 48;
        }

        if ((inputCharCount * growFontSize) < inputWidth) {
          $this.css('font-size', growFontSize + 'px');
        }
      }
    });
  }

  Drupal.behaviors.searchModal = {
    attach: function searchModalAttach(context) {
      var $modalContainer = $('.search-modal', context);
      var $searchHeaderInput = $('.header-search-trigger__input', context);
      var $menuSearchLink = $('.menu--search > li > a', context);
      // Initialize the search component.
      window.dispatchEvent(new CustomEvent('search-render: full'));

      if ($searchHeaderInput.length) {
        var $triggerIcon = $('.header-search-trigger__trigger .icon--search-alt', context);

        $searchHeaderInput.focus();
        // Render search component in modal but the modal hidden until the user takes a
        // pause in their typing.
        $searchHeaderInput.on('input', function () {
          $triggerIcon.animateCss('fadeOutLeft', function () {
            $triggerIcon.hide();
          });

          window.pinSearch.doSearch($(this).val());
        });
        // Make the modal visible, with pre-rendered search component.
        $searchHeaderInput.on('input', _.debounce(function () {
          var siteHeight = $('.site', context).height() - 53;
          $modalContainer.css({height: siteHeight + 'px'}).show().animateCss('fadeIn');
          $('.dynamic-search__input', context).focus();
          $menuSearchLink.addClass('active');
          searchInputTypeSize();
        }, 400));
      }

      // Reset font size when search reset is clicked.
      $modalContainer
        .on('click', '.dynamic-search__reset', function () {
          $('.dynamic-search__input').removeAttr('style');
        })
        .on('keypress', function (e) {
          if (e.which === 13) {
            // We prepend currentLanguage so the user is always sent to
            // the correct full page results.
            var currentLanguage = drupalSettings.path.currentLanguage;
            var link = ($('.dynamic-search__result-more').length) ? $('.dynamic-search__result-more').attr('href') : '/' + currentLanguage + '/search' + window.location.hash;
            window.location.href = link;
          }
        });

      // Workaround Drupal's limits for required fields.
      $menuSearchLink.text('').attr('href', '/#');
      // Navigation search icon trigger.
      $menuSearchLink
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          window.dispatchEvent(new CustomEvent('search-render: full'));
          $(this).addClass('active');
          var siteHeight = $('.site', context).height() - 53;
          $modalContainer.css({height: siteHeight + 'px'}).show().animateCss('fadeIn');
          $('.dynamic-search__input', context).focus();

          // If mobile menu is active when the search icon is clicked, we want
          // to close the mobile menu and show the site content.
          if ($(window).width() < 1024) {
            var $menuToggle = $('.menu__toggle', context);
            if ($menuToggle.hasClass('menu__toggle--open')) {
              $menuToggle
                .toggleClass('menu__toggle--collapsed')
                .toggleClass('menu__toggle--open');
              $('.menu--mobile', context).slideToggle('fast');
              $('.site__content, .site__footer', context).show();
              window.scrollTo(0, 0);
            }
          }

          searchInputTypeSize();
        });

      // Closing search modal.
      $('.search-modal__close-button', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          closeSearchModal();
        });
      // Close search from escape key.
      $(document).on('keyup', function (evt) {
        if (evt.keyCode === 27
            && $modalContainer.length
            && $modalContainer.is(':visible')) {
          closeSearchModal();
        }
      });
      // Shared function for closing modal.
      function closeSearchModal() {
        if ($searchHeaderInput.length) {
          $searchHeaderInput.val('').focus();
          $triggerIcon.show().animateCss('fadeInLeft'); // eslint-disable-line block-scoped-var
        }

        $modalContainer.animateCss('fadeOut', function () {
          $modalContainer.hide();
        });
        $menuSearchLink.removeClass('active');
      }
    }
  };
}(jQuery, Drupal, drupalSettings, _));

/**
 * @file
 * Tip Grid script.
 */

(function tipGridScript($, Drupal, _) {
  'use strict';

  Drupal.behaviors.tipGrid = {
    attach: function tipGridAttach(context) {
      var $grid = $('.tip-grid__layout', context);

      if (!$grid.length) {
        return;
      }

      // Resize.
      $(window).on('resize', _.debounce(function windowResize() {
        $grid.masonry({
          itemSelector: '.squircle',
          percentPosition: true,
          columnWidth: '.squircle',
          gutter: '.gutter-sizer',
          horizontalOrder: true
        });
        $grid.masonry('layout');
      }, 100)).resize();
    }
  };
}(jQuery, Drupal, _));

/**
 * @file
 * Topic list grid script.
 */

(function topicListGridScript($, Drupal) {
  'use strict';

  Drupal.behaviors.topicListGrid = {
    attach: function topicListGridAttach(context) {

      var is_partner = false;

      // Check for user sessionStorage.
      var $user_session_data = JSON.parse(sessionStorage.getItem('pin_pinterest_authusers.user'));
      if ($user_session_data) {
        is_partner = $user_session_data['is_partner'];
      }
      else if (window.drupalSettings.currentFacet === 'business') {
        is_partner = true;
      }

      var user_data = {
        isBusiness: is_partner
      };

      var $tabs = $('.tab__item', context);
      var activeId = '';

      // Remove default active state.
      $tabs
        .attr('aria-selected', 'false')
        .removeClass('tab__item--active');
      // Change active state of tabs.
      if (user_data.isBusiness) {
        activeId = 'business';
        $('#' + activeId, context)
          .addClass('tab__item--active')
          .attr('aria-selected', 'true');
      }
      else {
        activeId = 'general';
        $('#' + activeId, context)
          .addClass('tab__item--active')
          .attr('aria-selected', 'true');
      }
      // Show the content for the selected tab.
      $('#panel-' + activeId, context).fadeIn();

      $('.tab__item', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);
          var thisId = $this.attr('id');

          if (drupalSettings.pin_analytics && drupalSettings.pin_analytics.topicListGrid && window.ga && window.ga.loaded) {
            // GA tracking of tab clicks
            window.ga('send', {
              hitType: 'event',
              eventCategory: 'topic type',
              eventAction: 'switch',
              eventLabel: 'homepage'
            });
          }

          if (!$this.hasClass('tab__item--active')) {
            $('.tab__item--active', context).removeClass('tab__item--active');
            $this.addClass('tab__item--active');
            $('.topic-list-grid__panel', context).hide();
            $('#panel-' + thisId, context).fadeIn();
          }
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Topic navigator script.
 */

(function topicNavigatorScript($, Drupal) {
  'use strict';

  Drupal.behaviors.topicNavigator = {
    attach: function topicNavigatorAttach(context) {
      var isMobile = false;
      var $navigator = $('.topic-navigator', context);

      $navigator.find('.topic-navigator__inner--show')
        .slideToggle();

      if ($(window).width() < 768) {
        var mobileToggleText = $('.topic-navigator__toggle--active', context).text();
        $navigator.find('.topic-navigator__mobile-toggle')
          .text(mobileToggleText);
        $navigator.addClass('topic-navigator--mobile');
        // Hide Show more/less and show all articles.
        $navigator.find('.topic-navigator__more-toggle').parent()
          .hide();
        $navigator.find('.topic-navigator__item--hidden')
          .removeClass('topic-navigator__item--hidden')
          .addClass('topic-navigator__item--shown');
        isMobile = true;
      }

      // Resize
      $(window).on('resize', _.throttle(function windowResize() {
        if ($(window).width() < 768) {
          var mobileToggleText = $('.topic-navigator__toggle--active', context).text();
          $navigator.find('.topic-navigator__mobile-toggle')
            .text(mobileToggleText);
          $navigator.addClass('topic-navigator--mobile');
          // Hide Show more/less and show all articles.
          $navigator.find('.topic-navigator__more-toggle').parent()
            .hide();
          $navigator.find('.topic-navigator__item--hidden')
            .removeClass('topic-navigator__item--hidden')
            .addClass('topic-navigator__item--shown');
          isMobile = true;
        }
        else {
          $navigator.removeClass('topic-navigator--mobile');
          // Show Show more/less and hide excess articles.
          $navigator.find('.topic-navigator__more-toggle').parent()
            .show();
          $navigator.find('.topic-navigator__item--shown')
            .removeClass('topic-navigator__item--shown')
            .addClass('topic-navigator__item--hidden');
          isMobile = false;
        }
      }, 400));

      // Top level toggle behavior.
      $('.topic-navigator__toggle', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);

          if (!$this.hasClass('topic-navigator__toggle--active')) {
            $('.topic-navigator__toggle', context).removeClass('topic-navigator__toggle--active');
            $this.addClass('topic-navigator__toggle--active');
          }
          else {
            $this.removeClass('topic-navigator__toggle--active');
          }

          if ($this.next().hasClass('topic-navigator__inner--show')) {
            $this.next().removeClass('topic-navigator__inner--show');
            $this.next().slideUp();
          }
          else {
            var $navigatorInner = $this.parent().parent().find('li .topic-navigator__inner');
            $navigatorInner.removeClass('topic-navigator__inner--show')
              .slideUp();

            $this.next().toggleClass('topic-navigator__inner--show');
            $this.next().slideToggle();

            if (!isMobile) {
              $navigatorInner.find('.topic-navigator__item--shown')
                .removeClass('topic-navigator__item--shown')
                .addClass('topic-navigator__item--hidden');

              $this.next().find('.topic-navigator__more-toggle')
                .removeClass('topic-navigator__more-toggle--active')
                .text(Drupal.t('Show more'));
            }
          }
        });

      // See more/less toggle behavior.
      $('.topic-navigator__more-toggle', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);

          if (!$this.hasClass('topic-navigator__more-toggle--active')) {
            $this.addClass('topic-navigator__more-toggle--active');
            $this.parent().parent().find('.topic-navigator__item--hidden')
              .removeClass('topic-navigator__item--hidden')
              .addClass('topic-navigator__item--shown');
            $this.text(Drupal.t('Show less'));
          }
          else {
            $this.removeClass('topic-navigator__more-toggle--active');
            $this.parent().parent().find('.topic-navigator__item--shown')
              .removeClass('topic-navigator__item--shown')
              .addClass('topic-navigator__item--hidden');
            $this.text(Drupal.t('Show more'));
          }
        });

      // Mobile toggle behavior.
      $('.topic-navigator__mobile-toggle', context)
        .on('click', function (e) {
          e.preventDefault();
        })
        .hammer()
        .on('tap press', function () {
          var $this = $(this);

          if ($this.hasClass('topic-navigator__mobile-toggle--active')) {
            $this.removeClass('topic-navigator__mobile-toggle--active');
            $('.topic-navigator--mobile', context).css({height: 'auto'});
            $('body', context).removeClass('u-noscroll');
          }
          else {
            $this.addClass('topic-navigator__mobile-toggle--active');
            $('.topic-navigator--mobile', context).css({height: 'calc(100vh - 53px)'});
            $('body', context).addClass('u-noscroll');
          }

          $navigator.find('.topic-navigator__accordion')
            .slideToggle();
        });
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * loader script.
 */

(function loaderScript($, Drupal) {
  'use strict';

  Drupal.behaviors.loader = {
    attach: function (context) {

      // Implicit throbber color.
      var color = 'green';

      // In case blog search overlay is active, set the throbber color to white.
      if ($('body.blog-search-active').length > 0) {
        color = 'white';
      }

      // Define the pitnerest throbber.
      var $pin_loader = '<div class="src-Box-Box---box---bpMa_ src-Box-Box---xs-flex---1TEXs justify-around overflow-hidden"><div class="src-Spinner-Spinner---icon---3HUbA block"><svg class="src-Icon-Icon---icon---3Goc6 ' + color + ' block" height="40" width="40" viewBox="0 0 16 16" aria-label="Example spinner" role="img"><title>Example spinner</title><path d="M10 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M6 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2m0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0"></path></svg></div></div>';

      // Execute the default throbber replace with pin styled one.
      var $drupal_loader = $('.ajax-progress.ajax-progress-fullscreen');
      $drupal_loader.html($pin_loader);

      var $hccf_loader = $('.webform-submission-help-center-contact-form-form .ajax-progress.ajax-progress-throbber', context);
      $hccf_loader.html($pin_loader);
    }
  };
}(jQuery, Drupal));

/**
 * @file
 * Code highlight script.
 */

(function codeHighlightScript($, Drupal) {
  'use strict';

  /*
   * Code Highlight.
   */
  Drupal.behaviors.codeHighlightInit = {
    attach: function () {
      hljs.initHighlightingOnLoad(); // eslint-disable-line no-undef
    }
  };
}(jQuery, Drupal));


;
/*
--------------------------------------------------------------------------
(c) 2007 Lawrence Akka
 - jquery version of the spamspan code (c) 2006 SpamSpan (www.spamspan.com)

This program is distributed under the terms of the GNU General Public
Licence version 2, available at http://www.gnu.org/licenses/gpl.txt
--------------------------------------------------------------------------
*/

(function ($) {
  'use strict';
  // load SpamSpan
  Drupal.behaviors.spamspan = {
    attach: function (context) {
      // get each span with class spamspan
      $("span.spamspan", context).each(function (index) {
        // Replace each <span class="o"></span> with .
        if ($('span.o', this).length) {
          $('span.o', this).replaceWith('.');
        }

        // For each selected span, set mail to the relevant value, removing spaces
        var _mail = ($("span.u", this).text() +
        "@" +
        $("span.d", this).text())
        .replace(/\s+/g, '');

        // Build the mailto URI
        var _mailto = "mailto:" + _mail;
        if ($('span.h', this).length) {
          // Find the header text, and remove the round brackets from the start and end
          var _headerText = $("span.h", this).text().replace(/^ ?\((.*)\) ?$/, "$1");
          // split into individual headers, and return as an array of header=value pairs
          var _headers = $.map(_headerText.split(/, /), function (n, i) {
            return (n.replace(/: /, "="));
          });

          var _headerstring = _headers.join('&');
          _mailto += _headerstring ? ("?" + _headerstring) : '';
        }

        // Find the anchor content, and remove the round brackets from the start and end
        var _anchorContent = $("span.t", this).html();
        if (_anchorContent) {
          _anchorContent = _anchorContent.replace(/^ ?\((.*)\) ?$/, "$1");
        }

        // create the <a> element, and replace the original span contents

        // check for extra <a> attributes
        var _attributes = $("span.e", this).html();
        var _tag = "<a></a>";
        if (_attributes) {
          _tag = "<a " + _attributes.replace("<!--", "").replace("-->", "") + "></a>";
        }

        $(this).after(
          $(_tag)
          .attr("href", _mailto)
          .html(_anchorContent ? _anchorContent : _mail)
          .addClass("spamspan")
        ).remove();
      });
    }
  };
}) (jQuery);;
// %LEAVE_UNMINIFIED% %REMOVE_LINE%
var hljs=new function(){function k(v){return v.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function t(v){return v.nodeName.toLowerCase()}function i(w,x){var v=w&&w.exec(x);return v&&v.index==0}function d(v){return Array.prototype.map.call(v.childNodes,function(w){if(w.nodeType==3){return b.useBR?w.nodeValue.replace(/\n/g,""):w.nodeValue}if(t(w)=="br"){return"\n"}return d(w)}).join("")}function r(w){var v=(w.className+" "+(w.parentNode?w.parentNode.className:"")).split(/\s+/);v=v.map(function(x){return x.replace(/^language-/,"")});return v.filter(function(x){return j(x)||x=="no-highlight"})[0]}function o(x,y){var v={};for(var w in x){v[w]=x[w]}if(y){for(var w in y){v[w]=y[w]}}return v}function u(x){var v=[];(function w(y,z){for(var A=y.firstChild;A;A=A.nextSibling){if(A.nodeType==3){z+=A.nodeValue.length}else{if(t(A)=="br"){z+=1}else{if(A.nodeType==1){v.push({event:"start",offset:z,node:A});z=w(A,z);v.push({event:"stop",offset:z,node:A})}}}}return z})(x,0);return v}function q(w,y,C){var x=0;var F="";var z=[];function B(){if(!w.length||!y.length){return w.length?w:y}if(w[0].offset!=y[0].offset){return(w[0].offset<y[0].offset)?w:y}return y[0].event=="start"?w:y}function A(H){function G(I){return" "+I.nodeName+'="'+k(I.value)+'"'}F+="<"+t(H)+Array.prototype.map.call(H.attributes,G).join("")+">"}function E(G){F+="</"+t(G)+">"}function v(G){(G.event=="start"?A:E)(G.node)}while(w.length||y.length){var D=B();F+=k(C.substr(x,D[0].offset-x));x=D[0].offset;if(D==w){z.reverse().forEach(E);do{v(D.splice(0,1)[0]);D=B()}while(D==w&&D.length&&D[0].offset==x);z.reverse().forEach(A)}else{if(D[0].event=="start"){z.push(D[0].node)}else{z.pop()}v(D.splice(0,1)[0])}}return F+k(C.substr(x))}function m(y){function v(z){return(z&&z.source)||z}function w(A,z){return RegExp(v(A),"m"+(y.cI?"i":"")+(z?"g":""))}function x(D,C){if(D.compiled){return}D.compiled=true;D.k=D.k||D.bK;if(D.k){var z={};function E(G,F){if(y.cI){F=F.toLowerCase()}F.split(" ").forEach(function(H){var I=H.split("|");z[I[0]]=[G,I[1]?Number(I[1]):1]})}if(typeof D.k=="string"){E("keyword",D.k)}else{Object.keys(D.k).forEach(function(F){E(F,D.k[F])})}D.k=z}D.lR=w(D.l||/\b[A-Za-z0-9_]+\b/,true);if(C){if(D.bK){D.b=D.bK.split(" ").join("|")}if(!D.b){D.b=/\B|\b/}D.bR=w(D.b);if(!D.e&&!D.eW){D.e=/\B|\b/}if(D.e){D.eR=w(D.e)}D.tE=v(D.e)||"";if(D.eW&&C.tE){D.tE+=(D.e?"|":"")+C.tE}}if(D.i){D.iR=w(D.i)}if(D.r===undefined){D.r=1}if(!D.c){D.c=[]}var B=[];D.c.forEach(function(F){if(F.v){F.v.forEach(function(G){B.push(o(F,G))})}else{B.push(F=="self"?D:F)}});D.c=B;D.c.forEach(function(F){x(F,D)});if(D.starts){x(D.starts,C)}var A=D.c.map(function(F){return F.bK?"\\.?\\b("+F.b+")\\b\\.?":F.b}).concat([D.tE]).concat([D.i]).map(v).filter(Boolean);D.t=A.length?w(A.join("|"),true):{exec:function(F){return null}};D.continuation={}}x(y)}function c(S,L,J,R){function v(U,V){for(var T=0;T<V.c.length;T++){if(i(V.c[T].bR,U)){return V.c[T]}}}function z(U,T){if(i(U.eR,T)){return U}if(U.eW){return z(U.parent,T)}}function A(T,U){return !J&&i(U.iR,T)}function E(V,T){var U=M.cI?T[0].toLowerCase():T[0];return V.k.hasOwnProperty(U)&&V.k[U]}function w(Z,X,W,V){var T=V?"":b.classPrefix,U='<span class="'+T,Y=W?"":"</span>";U+=Z+'">';return U+X+Y}function N(){var U=k(C);if(!I.k){return U}var T="";var X=0;I.lR.lastIndex=0;var V=I.lR.exec(U);while(V){T+=U.substr(X,V.index-X);var W=E(I,V);if(W){H+=W[1];T+=w(W[0],V[0])}else{T+=V[0]}X=I.lR.lastIndex;V=I.lR.exec(U)}return T+U.substr(X)}function F(){if(I.sL&&!f[I.sL]){return k(C)}var T=I.sL?c(I.sL,C,true,I.continuation.top):g(C);if(I.r>0){H+=T.r}if(I.subLanguageMode=="continuous"){I.continuation.top=T.top}return w(T.language,T.value,false,true)}function Q(){return I.sL!==undefined?F():N()}function P(V,U){var T=V.cN?w(V.cN,"",true):"";if(V.rB){D+=T;C=""}else{if(V.eB){D+=k(U)+T;C=""}else{D+=T;C=U}}I=Object.create(V,{parent:{value:I}})}function G(T,X){C+=T;if(X===undefined){D+=Q();return 0}var V=v(X,I);if(V){D+=Q();P(V,X);return V.rB?0:X.length}var W=z(I,X);if(W){var U=I;if(!(U.rE||U.eE)){C+=X}D+=Q();do{if(I.cN){D+="</span>"}H+=I.r;I=I.parent}while(I!=W.parent);if(U.eE){D+=k(X)}C="";if(W.starts){P(W.starts,"")}return U.rE?0:X.length}if(A(X,I)){throw new Error('Illegal lexeme "'+X+'" for mode "'+(I.cN||"<unnamed>")+'"')}C+=X;return X.length||1}var M=j(S);if(!M){throw new Error('Unknown language: "'+S+'"')}m(M);var I=R||M;var D="";for(var K=I;K!=M;K=K.parent){if(K.cN){D=w(K.cN,D,true)}}var C="";var H=0;try{var B,y,x=0;while(true){I.t.lastIndex=x;B=I.t.exec(L);if(!B){break}y=G(L.substr(x,B.index-x),B[0]);x=B.index+y}G(L.substr(x));for(var K=I;K.parent;K=K.parent){if(K.cN){D+="</span>"}}return{r:H,value:D,language:S,top:I}}catch(O){if(O.message.indexOf("Illegal")!=-1){return{r:0,value:k(L)}}else{throw O}}}function g(y,x){x=x||b.languages||Object.keys(f);var v={r:0,value:k(y)};var w=v;x.forEach(function(z){if(!j(z)){return}var A=c(z,y,false);A.language=z;if(A.r>w.r){w=A}if(A.r>v.r){w=v;v=A}});if(w.language){v.second_best=w}return v}function h(v){if(b.tabReplace){v=v.replace(/^((<[^>]+>|\t)+)/gm,function(w,z,y,x){return z.replace(/\t/g,b.tabReplace)})}if(b.useBR){v=v.replace(/\n/g,"<br>")}return v}function p(z){var y=d(z);var A=r(z);if(A=="no-highlight"){return}var v=A?c(A,y,true):g(y);var w=u(z);if(w.length){var x=document.createElementNS("http://www.w3.org/1999/xhtml","pre");x.innerHTML=v.value;v.value=q(w,u(x),y)}v.value=h(v.value);z.innerHTML=v.value;z.className+=" hljs "+(!A&&v.language||"");z.result={language:v.language,re:v.r};if(v.second_best){z.second_best={language:v.second_best.language,re:v.second_best.r}}}var b={classPrefix:"hljs-",tabReplace:null,useBR:false,languages:undefined};function s(v){b=o(b,v)}function l(){if(l.called){return}l.called=true;var v=document.querySelectorAll("pre code");Array.prototype.forEach.call(v,p)}function a(){addEventListener("DOMContentLoaded",l,false);addEventListener("load",l,false)}var f={};var n={};function e(v,x){var w=f[v]=x(this);if(w.aliases){w.aliases.forEach(function(y){n[y]=v})}}function j(v){return f[v]||f[n[v]]}this.highlight=c;this.highlightAuto=g;this.fixMarkup=h;this.highlightBlock=p;this.configure=s;this.initHighlighting=l;this.initHighlightingOnLoad=a;this.registerLanguage=e;this.getLanguage=j;this.inherit=o;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";this.BNR="\\b(0b[01]+)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.BE={b:"\\\\[\\s\\S]",r:0};this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[this.BE]};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[this.BE]};this.CLCM={cN:"comment",b:"//",e:"$"};this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"};this.HCM={cN:"comment",b:"#",e:"$"};this.NM={cN:"number",b:this.NR,r:0};this.CNM={cN:"number",b:this.CNR,r:0};this.BNM={cN:"number",b:this.BNR,r:0};this.REGEXP_MODE={cN:"regexp",b:/\//,e:/\/[gim]*/,i:/\n/,c:[this.BE,{b:/\[/,e:/\]/,r:0,c:[this.BE]}]};this.TM={cN:"title",b:this.IR,r:0};this.UTM={cN:"title",b:this.UIR,r:0}}();hljs.registerLanguage("bash",function(b){var a={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)\}/}]};var d={cN:"string",b:/"/,e:/"/,c:[b.BE,a,{cN:"variable",b:/\$\(/,e:/\)/,c:[b.BE]}]};var c={cN:"string",b:/'/,e:/'/};return{l:/-?[a-z\.]+/,k:{keyword:"if then else elif fi for break continue while in do done exit return set declare case esac export exec",literal:"true false",built_in:"printf echo read cd pwd pushd popd dirs let eval unset typeset readonly getopts source shopt caller type hash bind help sudo",operator:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"shebang",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:true,c:[b.inherit(b.TM,{b:/\w[\w\d_]*/})],r:0},b.HCM,b.NM,d,c,a]}});hljs.registerLanguage("cs",function(b){var a="abstract as base bool break byte case catch char checked const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual volatile void while async await ascending descending from get group into join let orderby partial select set value var where yield";return{k:a,c:[{cN:"comment",b:"///",e:"$",rB:true,c:[{cN:"xmlDocTag",b:"///|<!--|-->"},{cN:"xmlDocTag",b:"</?",e:">"}]},b.CLCM,b.CBLCLM,{cN:"preprocessor",b:"#",e:"$",k:"if else elif endif define undef warning error line region endregion pragma checksum"},{cN:"string",b:'@"',e:'"',c:[{b:'""'}]},b.ASM,b.QSM,b.CNM,{bK:"protected public private internal",e:/[{;=]/,k:a,c:[{bK:"class namespace interface",starts:{c:[b.TM]}},{b:b.IR+"\\s*\\(",rB:true,c:[b.TM]}]}]}});hljs.registerLanguage("ruby",function(e){var h="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?";var g="and false then defined module in return redo if BEGIN retry end for true self when next until do begin unless END rescue nil else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor";var a={cN:"yardoctag",b:"@[A-Za-z]+"};var i={cN:"comment",v:[{b:"#",e:"$",c:[a]},{b:"^\\=begin",e:"^\\=end",c:[a],r:10},{b:"^__END__",e:"\\n$"}]};var c={cN:"subst",b:"#\\{",e:"}",k:g};var d={cN:"string",c:[e.BE,c],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:"%[qw]?\\(",e:"\\)"},{b:"%[qw]?\\[",e:"\\]"},{b:"%[qw]?{",e:"}"},{b:"%[qw]?<",e:">",r:10},{b:"%[qw]?/",e:"/",r:10},{b:"%[qw]?%",e:"%",r:10},{b:"%[qw]?-",e:"-",r:10},{b:"%[qw]?\\|",e:"\\|",r:10},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/}]};var b={cN:"params",b:"\\(",e:"\\)",k:g};var f=[d,i,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[e.inherit(e.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{cN:"inheritance",b:"<\\s*",c:[{cN:"parent",b:"("+e.IR+"::)?"+e.IR}]},i]},{cN:"function",bK:"def",e:" |$|;",r:0,c:[e.inherit(e.TM,{b:h}),b,i]},{cN:"constant",b:"(::)?(\\b[A-Z]\\w*(::)?)+",r:0},{cN:"symbol",b:":",c:[d,{b:h}],r:0},{cN:"symbol",b:e.UIR+"(\\!|\\?)?:",r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{cN:"variable",b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{b:"("+e.RSR+")\\s*",c:[i,{cN:"regexp",c:[e.BE,c],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}],r:0}];c.c=f;b.c=f;return{k:g,c:f}});hljs.registerLanguage("diff",function(a){return{c:[{cN:"chunk",r:10,v:[{b:/^\@\@ +\-\d+,\d+ +\+\d+,\d+ +\@\@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"header",v:[{b:/Index: /,e:/$/},{b:/=====/,e:/=====$/},{b:/^\-\-\-/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+\+\+/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"change",b:"^\\!",e:"$"}]}});hljs.registerLanguage("javascript",function(a){return{aliases:["js"],k:{keyword:"in if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const class",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require"},c:[{cN:"pi",b:/^\s*('|")use strict('|")/,r:10},a.ASM,a.QSM,a.CLCM,a.CBLCLM,a.CNM,{b:"("+a.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[a.CLCM,a.CBLCLM,a.REGEXP_MODE,{b:/</,e:/>;/,r:0,sL:"xml"}],r:0},{cN:"function",bK:"function",e:/\{/,c:[a.inherit(a.TM,{b:/[A-Za-z$_][0-9A-Za-z$_]*/}),{cN:"params",b:/\(/,e:/\)/,c:[a.CLCM,a.CBLCLM],i:/["'\(]/}],i:/\[|%/},{b:/\$[(.]/},{b:"\\."+a.IR,r:0}]}});hljs.registerLanguage("xml",function(a){var c="[A-Za-z0-9\\._:-]+";var d={b:/<\?(php)?(?!\w)/,e:/\?>/,sL:"php",subLanguageMode:"continuous"};var b={eW:true,i:/</,r:0,c:[d,{cN:"attribute",b:c,r:0},{b:"=",r:0,c:[{cN:"value",v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s\/>]+/}]}]}]};return{aliases:["html"],cI:true,c:[{cN:"doctype",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},{cN:"comment",b:"<!--",e:"-->",r:10},{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{title:"style"},c:[b],starts:{e:"</style>",rE:true,sL:"css"}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{title:"script"},c:[b],starts:{e:"<\/script>",rE:true,sL:"javascript"}},{b:"<%",e:"%>",sL:"vbscript"},d,{cN:"pi",b:/<\?\w+/,e:/\?>/,r:10},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"title",b:"[^ /><]+",r:0},b]}]}});hljs.registerLanguage("markdown",function(a){return{c:[{cN:"header",v:[{b:"^#{1,6}",e:"$"},{b:"^.+?\\n[=-]{2,}$"}]},{b:"<",e:">",sL:"xml",r:0},{cN:"bullet",b:"^([*+-]|(\\d+\\.))\\s+"},{cN:"strong",b:"[*_]{2}.+?[*_]{2}"},{cN:"emphasis",v:[{b:"\\*.+?\\*"},{b:"_.+?_",r:0}]},{cN:"blockquote",b:"^>\\s+",e:"$"},{cN:"code",v:[{b:"`.+?`"},{b:"^( {4}|\t)",e:"$",r:0}]},{cN:"horizontal_rule",b:"^[-\\*]{3,}",e:"$"},{b:"\\[.+?\\][\\(\\[].+?[\\)\\]]",rB:true,c:[{cN:"link_label",b:"\\[",e:"\\]",eB:true,rE:true,r:0},{cN:"link_url",b:"\\]\\(",e:"\\)",eB:true,eE:true},{cN:"link_reference",b:"\\]\\[",e:"\\]",eB:true,eE:true,}],r:10},{b:"^\\[.+\\]:",e:"$",rB:true,c:[{cN:"link_reference",b:"\\[",e:"\\]",eB:true,eE:true},{cN:"link_url",b:"\\s",e:"$"}]}]}});hljs.registerLanguage("css",function(a){var b="[a-zA-Z-][a-zA-Z0-9_-]*";var c={cN:"function",b:b+"\\(",e:"\\)",c:["self",a.NM,a.ASM,a.QSM]};return{cI:true,i:"[=/|']",c:[a.CBLCLM,{cN:"id",b:"\\#[A-Za-z0-9_-]+"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"pseudo",b:":(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\\"\\']+"},{cN:"at_rule",b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{cN:"at_rule",b:"@",e:"[{;]",c:[{cN:"keyword",b:/\S+/},{b:/\s/,eW:true,eE:true,r:0,c:[c,a.ASM,a.QSM,a.NM]}]},{cN:"tag",b:b,r:0},{cN:"rules",b:"{",e:"}",i:"[^\\s]",r:0,c:[a.CBLCLM,{cN:"rule",b:"[^\\s]",rB:true,e:";",eW:true,c:[{cN:"attribute",b:"[A-Z\\_\\.\\-]+",e:":",eE:true,i:"[^\\s]",starts:{cN:"value",eW:true,eE:true,c:[c,a.NM,a.QSM,a.ASM,a.CBLCLM,{cN:"hexcolor",b:"#[0-9A-Fa-f]+"},{cN:"important",b:"!important"}]}}]}]}]}});hljs.registerLanguage("http",function(a){return{i:"\\S",c:[{cN:"status",b:"^HTTP/[0-9\\.]+",e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{cN:"request",b:"^[A-Z]+ (.*?) HTTP/[0-9\\.]+$",rB:true,e:"$",c:[{cN:"string",b:" ",e:" ",eB:true,eE:true}]},{cN:"attribute",b:"^\\w",e:": ",eE:true,i:"\\n|\\s|=",starts:{cN:"string",e:"$"}},{b:"\\n\\n",starts:{sL:"",eW:true}}]}});hljs.registerLanguage("java",function(b){var a="false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws";return{k:a,i:/<\//,c:[{cN:"javadoc",b:"/\\*\\*",e:"\\*/",c:[{cN:"javadoctag",b:"(^|\\s)@[A-Za-z]+"}],r:10},b.CLCM,b.CBLCLM,b.ASM,b.QSM,{bK:"protected public private",e:/[{;=]/,k:a,c:[{cN:"class",bK:"class interface",eW:true,i:/[:"<>]/,c:[{bK:"extends implements",r:10},b.UTM]},{b:b.UIR+"\\s*\\(",rB:true,c:[b.UTM]}]},b.CNM,{cN:"annotation",b:"@[A-Za-z]+"}]}});hljs.registerLanguage("php",function(b){var e={cN:"variable",b:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*"};var a={cN:"preprocessor",b:/<\?(php)?|\?>/};var c={cN:"string",c:[b.BE,a],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},b.inherit(b.ASM,{i:null}),b.inherit(b.QSM,{i:null})]};var d={v:[b.BNM,b.CNM]};return{cI:true,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[b.CLCM,b.HCM,{cN:"comment",b:"/\\*",e:"\\*/",c:[{cN:"phpdoc",b:"\\s@[A-Za-z]+"},a]},{cN:"comment",b:"__halt_compiler.+?;",eW:true,k:"__halt_compiler",l:b.UIR},{cN:"string",b:"<<<['\"]?\\w+['\"]?$",e:"^\\w+;",c:[b.BE]},a,e,{cN:"function",bK:"function",e:/[;{]/,i:"\\$|\\[|%",c:[b.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",e,b.CBLCLM,c,d]}]},{cN:"class",bK:"class interface",e:"{",i:/[:\(\$"]/,c:[{bK:"extends implements",r:10},b.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[b.UTM]},{bK:"use",e:";",c:[b.UTM]},{b:"=>"},c,d]}});hljs.registerLanguage("python",function(a){var f={cN:"prompt",b:/^(>>>|\.\.\.) /};var b={cN:"string",c:[a.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[f],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[f],r:10},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/,},{b:/(b|br)"/,e:/"/,},a.ASM,a.QSM]};var d={cN:"number",r:0,v:[{b:a.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:a.CNR+"[lLjJ]?"}]};var e={cN:"params",b:/\(/,e:/\)/,c:["self",f,d,b]};var c={e:/:/,i:/[${=;\n]/,c:[a.UTM,e]};return{k:{keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},i:/(<\/|->|\?)/,c:[f,d,b,a.HCM,a.inherit(c,{cN:"function",bK:"def",r:10}),a.inherit(c,{cN:"class",bK:"class"}),{cN:"decorator",b:/@/,e:/$/},{b:/\b(print|exec)\(/}]}});hljs.registerLanguage("sql",function(a){return{cI:true,i:/[<>]/,c:[{cN:"operator",b:"\\b(begin|end|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant|merge)\\b(?!:)",e:";",eW:true,k:{keyword:"all partial global month current_timestamp using go revoke smallint indicator end-exec disconnect zone with character assertion to add current_user usage input local alter match collate real then rollback get read timestamp session_user not integer bit unique day minute desc insert execute like ilike|2 level decimal drop continue isolation found where constraints domain right national some module transaction relative second connect escape close system_user for deferred section cast current sqlstate allocate intersect deallocate numeric public preserve full goto initially asc no key output collation group by union session both last language constraint column of space foreign deferrable prior connection unknown action commit view or first into float year primary cascaded except restrict set references names table outer open select size are rows from prepare distinct leading create only next inner authorization schema corresponding option declare precision immediate else timezone_minute external varying translation true case exception join hour default double scroll value cursor descriptor values dec fetch procedure delete and false int is describe char as at in varchar null trailing any absolute current_time end grant privileges when cross check write current_date pad begin temporary exec time update catalog user sql date on identity timezone_hour natural whenever interval work order cascade diagnostics nchar having left call do handler load replace truncate start lock show pragma exists number trigger if before after each row merge matched database",aggregate:"count sum min max avg"},c:[{cN:"string",b:"'",e:"'",c:[a.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[a.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[a.BE]},a.CNM]},a.CBLCLM,{cN:"comment",b:"--",e:"$"}]}});hljs.registerLanguage("ini",function(a){return{cI:true,i:/\S/,c:[{cN:"comment",b:";",e:"$"},{cN:"title",b:"^\\[",e:"\\]"},{cN:"setting",b:"^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*",e:"$",c:[{cN:"value",eW:true,k:"on off true false yes no",c:[a.QSM,a.NM],r:0}]}]}});hljs.registerLanguage("perl",function(c){var d="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when";var f={cN:"subst",b:"[$@]\\{",e:"\\}",k:d};var g={b:"->{",e:"}"};var a={cN:"variable",v:[{b:/\$\d/},{b:/[\$\%\@\*](\^\w\b|#\w+(\:\:\w+)*|{\w+}|\w+(\:\:\w*)*)/},{b:/[\$\%\@\*][^\s\w{]/,r:0}]};var e={cN:"comment",b:"^(__END__|__DATA__)",e:"\\n$",r:5};var h=[c.BE,f,a];var b=[a,c.HCM,e,{cN:"comment",b:"^\\=\\w",e:"\\=cut",eW:true},g,{cN:"string",c:h,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[c.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[c.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+c.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[c.HCM,e,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[c.BE],r:0}]},{cN:"sub",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",r:5},{cN:"operator",b:"-\\w\\b",r:0}];f.c=b;g.c=b;return{k:d,c:b}});hljs.registerLanguage("objectivec",function(a){var d={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign self synchronized id nonatomic super unichar IBOutlet IBAction strong weak @private @protected @public @try @property @end @throw @catch @finally @synthesize @dynamic @selector @optional @required",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController UINavigationBar UINavigationController UITabBarController UIPopoverController UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor UIFont UIApplication NSNotFound NSNotificationCenter NSNotification UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection UIInterfaceOrientation MPMoviePlayerController dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"};var c=/[a-zA-Z@][a-zA-Z0-9_]*/;var b="@interface @class @protocol @implementation";return{k:d,l:c,i:"</",c:[a.CLCM,a.CBLCLM,a.CNM,a.QSM,{cN:"string",b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"},{cN:"preprocessor",b:"#import",e:"$",c:[{cN:"title",b:'"',e:'"'},{cN:"title",b:"<",e:">"}]},{cN:"preprocessor",b:"#",e:"$"},{cN:"class",b:"("+b.split(" ").join("|")+")\\b",e:"({|$)",k:b,l:c,c:[a.UTM]},{cN:"variable",b:"\\."+a.UIR,r:0}]}});hljs.registerLanguage("coffeescript",function(c){var b={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",reserved:"case default function var void with const let enum export import native __hasProp __extends __slice __bind __indexOf",built_in:"npm require console print module exports global window document"};var a="[A-Za-z$_][0-9A-Za-z$_]*";var f=c.inherit(c.TM,{b:a});var e={cN:"subst",b:/#\{/,e:/}/,k:b};var d=[c.BNM,c.inherit(c.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[c.BE]},{b:/'/,e:/'/,c:[c.BE]},{b:/"""/,e:/"""/,c:[c.BE,e]},{b:/"/,e:/"/,c:[c.BE,e]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[e,c.HCM]},{b:"//[gim]*",r:0},{b:"/\\S(\\\\.|[^\\n])*?/[gim]*(?=\\s|\\W|$)"}]},{cN:"property",b:"@"+a},{b:"`",e:"`",eB:true,eE:true,sL:"javascript"}];e.c=d;return{k:b,c:d.concat([{cN:"comment",b:"###",e:"###"},c.HCM,{cN:"function",b:"("+a+"\\s*=\\s*)?(\\(.*\\))?\\s*\\B[-=]>",e:"[-=]>",rB:true,c:[f,{cN:"params",b:"\\(",rB:true,c:[{b:/\(/,e:/\)/,k:b,c:["self"].concat(d)}]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:true,i:/[:="\[\]]/,c:[f]},f]},{cN:"attribute",b:a+":",e:":",rB:true,eE:true,r:0}])}});hljs.registerLanguage("nginx",function(c){var b={cN:"variable",v:[{b:/\$\d+/},{b:/\$\{/,e:/}/},{b:"[\\$\\@]"+c.UIR}]};var a={eW:true,l:"[a-z/_]+",k:{built_in:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"},r:0,i:"=>",c:[c.HCM,{cN:"string",c:[c.BE,b],v:[{b:/"/,e:/"/},{b:/'/,e:/'/}]},{cN:"url",b:"([a-z]+):/",e:"\\s",eW:true,eE:true},{cN:"regexp",c:[c.BE,b],v:[{b:"\\s\\^",e:"\\s|{|;",rE:true},{b:"~\\*?\\s+",e:"\\s|{|;",rE:true},{b:"\\*(\\.[a-z\\-]+)+"},{b:"([a-z\\-]+\\.)+\\*"}]},{cN:"number",b:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{cN:"number",b:"\\b\\d+[kKmMgGdshdwy]*\\b",r:0},b]};return{c:[c.HCM,{b:c.UIR+"\\s",e:";|{",rB:true,c:[c.inherit(c.UTM,{starts:a})],r:0}],i:"[^\\s\\}]"}});hljs.registerLanguage("json",function(a){var e={literal:"true false null"};var d=[a.QSM,a.CNM];var c={cN:"value",e:",",eW:true,eE:true,c:d,k:e};var b={b:"{",e:"}",c:[{cN:"attribute",b:'\\s*"',e:'"\\s*:\\s*',eB:true,eE:true,c:[a.BE],i:"\\n",starts:c}],i:"\\S"};var f={b:"\\[",e:"\\]",c:[a.inherit(c,{cN:null})],i:"\\S"};d.splice(d.length,0,b,f);return{c:d,k:e,i:"\\S"}});hljs.registerLanguage("apache",function(a){var b={cN:"number",b:"[\\$%]\\d+"};return{cI:true,c:[a.HCM,{cN:"tag",b:"</?",e:">"},{cN:"keyword",b:/\w+/,r:0,k:{common:"order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"},starts:{e:/$/,r:0,k:{literal:"on off all"},c:[{cN:"sqbracket",b:"\\s\\[",e:"\\]$"},{cN:"cbracket",b:"[\\$%]\\{",e:"\\}",c:["self",b]},b,a.QSM]}}],i:/\S/}});hljs.registerLanguage("cpp",function(a){var b={keyword:"false int float while private char catch export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace unsigned long throw volatile static protected bool template mutable if public friend do return goto auto void enum else break new extern using true class asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary",built_in:"std string cin cout cerr clog stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf"};return{aliases:["c"],k:b,i:"</",c:[a.CLCM,a.CBLCLM,a.QSM,{cN:"string",b:"'\\\\?.",e:"'",i:"."},{cN:"number",b:"\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)"},a.CNM,{cN:"preprocessor",b:"#",e:"$",c:[{b:"include\\s*<",e:">",i:"\\n"},a.CLCM]},{cN:"stl_container",b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:b,r:10,c:["self"]}]}});hljs.registerLanguage("makefile",function(a){var b={cN:"variable",b:/\$\(/,e:/\)/,c:[a.BE]};return{c:[a.HCM,{b:/^\w+\s*\W*=/,rB:true,r:0,starts:{cN:"constant",e:/\s*\W*=/,eE:true,starts:{e:/$/,r:0,c:[b],}}},{cN:"title",b:/^[\w]+:\s*$/},{cN:"phony",b:/^\.PHONY:/,e:/$/,k:".PHONY",l:/[\.\w]+/},{b:/^\t+/,e:/$/,c:[a.QSM,b]}]}});;
/**
 * @file
 * Enables syntax highlighting via HighlightJS on the HTML code tag.
 */

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.codesnippet = {
    attach: function (context, settings) {
      hljs.initHighlightingOnLoad();
    }
  };

})(jQuery, Drupal);
;
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(Y){function C(c,a,b){var e=0,h=[],n=0,g,l,d,f,m,q,u,r,I=!1,v=[],w=[],t,y=!1,z=!1,x=-1;b=b||{};g=b.encoding||"UTF8";t=b.numRounds||1;if(t!==parseInt(t,10)||1>t)throw Error("numRounds must a integer >= 1");if("SHA-1"===c)m=512,q=K,u=Z,f=160,r=function(a){return a.slice()};else if(0===c.lastIndexOf("SHA-",0))if(q=function(a,b){return L(a,b,c)},u=function(a,b,h,e){var k,f;if("SHA-224"===c||"SHA-256"===c)k=(b+65>>>9<<4)+15,f=16;else if("SHA-384"===c||"SHA-512"===c)k=(b+129>>>10<<
5)+31,f=32;else throw Error("Unexpected error in SHA-2 implementation");for(;a.length<=k;)a.push(0);a[b>>>5]|=128<<24-b%32;b=b+h;a[k]=b&4294967295;a[k-1]=b/4294967296|0;h=a.length;for(b=0;b<h;b+=f)e=L(a.slice(b,b+f),e,c);if("SHA-224"===c)a=[e[0],e[1],e[2],e[3],e[4],e[5],e[6]];else if("SHA-256"===c)a=e;else if("SHA-384"===c)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,e[4].b,e[5].a,e[5].b];else if("SHA-512"===c)a=[e[0].a,e[0].b,e[1].a,e[1].b,e[2].a,e[2].b,e[3].a,e[3].b,e[4].a,
e[4].b,e[5].a,e[5].b,e[6].a,e[6].b,e[7].a,e[7].b];else throw Error("Unexpected error in SHA-2 implementation");return a},r=function(a){return a.slice()},"SHA-224"===c)m=512,f=224;else if("SHA-256"===c)m=512,f=256;else if("SHA-384"===c)m=1024,f=384;else if("SHA-512"===c)m=1024,f=512;else throw Error("Chosen SHA variant is not supported");else if(0===c.lastIndexOf("SHA3-",0)||0===c.lastIndexOf("SHAKE",0)){var F=6;q=D;r=function(a){var c=[],e;for(e=0;5>e;e+=1)c[e]=a[e].slice();return c};x=1;if("SHA3-224"===
c)m=1152,f=224;else if("SHA3-256"===c)m=1088,f=256;else if("SHA3-384"===c)m=832,f=384;else if("SHA3-512"===c)m=576,f=512;else if("SHAKE128"===c)m=1344,f=-1,F=31,z=!0;else if("SHAKE256"===c)m=1088,f=-1,F=31,z=!0;else throw Error("Chosen SHA variant is not supported");u=function(a,c,e,b,h){e=m;var k=F,f,g=[],n=e>>>5,l=0,d=c>>>5;for(f=0;f<d&&c>=e;f+=n)b=D(a.slice(f,f+n),b),c-=e;a=a.slice(f);for(c%=e;a.length<n;)a.push(0);f=c>>>3;a[f>>2]^=k<<f%4*8;a[n-1]^=2147483648;for(b=D(a,b);32*g.length<h;){a=b[l%
5][l/5|0];g.push(a.b);if(32*g.length>=h)break;g.push(a.a);l+=1;0===64*l%e&&D(null,b)}return g}}else throw Error("Chosen SHA variant is not supported");d=M(a,g,x);l=A(c);this.setHMACKey=function(a,b,h){var k;if(!0===I)throw Error("HMAC key already set");if(!0===y)throw Error("Cannot set HMAC key after calling update");if(!0===z)throw Error("SHAKE is not supported for HMAC");g=(h||{}).encoding||"UTF8";b=M(b,g,x)(a);a=b.binLen;b=b.value;k=m>>>3;h=k/4-1;if(k<a/8){for(b=u(b,a,0,A(c),f);b.length<=h;)b.push(0);
b[h]&=4294967040}else if(k>a/8){for(;b.length<=h;)b.push(0);b[h]&=4294967040}for(a=0;a<=h;a+=1)v[a]=b[a]^909522486,w[a]=b[a]^1549556828;l=q(v,l);e=m;I=!0};this.update=function(a){var c,b,k,f=0,g=m>>>5;c=d(a,h,n);a=c.binLen;b=c.value;c=a>>>5;for(k=0;k<c;k+=g)f+m<=a&&(l=q(b.slice(k,k+g),l),f+=m);e+=f;h=b.slice(f>>>5);n=a%m;y=!0};this.getHash=function(a,b){var k,g,d,m;if(!0===I)throw Error("Cannot call getHash after setting HMAC key");d=N(b);if(!0===z){if(-1===d.shakeLen)throw Error("shakeLen must be specified in options");
f=d.shakeLen}switch(a){case "HEX":k=function(a){return O(a,f,x,d)};break;case "B64":k=function(a){return P(a,f,x,d)};break;case "BYTES":k=function(a){return Q(a,f,x)};break;case "ARRAYBUFFER":try{g=new ArrayBuffer(0)}catch(p){throw Error("ARRAYBUFFER not supported by this environment");}k=function(a){return R(a,f,x)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}m=u(h.slice(),n,e,r(l),f);for(g=1;g<t;g+=1)!0===z&&0!==f%32&&(m[m.length-1]&=16777215>>>24-f%32),m=u(m,f,
0,A(c),f);return k(m)};this.getHMAC=function(a,b){var k,g,d,p;if(!1===I)throw Error("Cannot call getHMAC without first setting HMAC key");d=N(b);switch(a){case "HEX":k=function(a){return O(a,f,x,d)};break;case "B64":k=function(a){return P(a,f,x,d)};break;case "BYTES":k=function(a){return Q(a,f,x)};break;case "ARRAYBUFFER":try{k=new ArrayBuffer(0)}catch(v){throw Error("ARRAYBUFFER not supported by this environment");}k=function(a){return R(a,f,x)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
}g=u(h.slice(),n,e,r(l),f);p=q(w,A(c));p=u(g,f,m,p,f);return k(p)}}function b(c,a){this.a=c;this.b=a}function O(c,a,b,e){var h="";a/=8;var n,g,d;d=-1===b?3:0;for(n=0;n<a;n+=1)g=c[n>>>2]>>>8*(d+n%4*b),h+="0123456789abcdef".charAt(g>>>4&15)+"0123456789abcdef".charAt(g&15);return e.outputUpper?h.toUpperCase():h}function P(c,a,b,e){var h="",n=a/8,g,d,p,f;f=-1===b?3:0;for(g=0;g<n;g+=3)for(d=g+1<n?c[g+1>>>2]:0,p=g+2<n?c[g+2>>>2]:0,p=(c[g>>>2]>>>8*(f+g%4*b)&255)<<16|(d>>>8*(f+(g+1)%4*b)&255)<<8|p>>>8*(f+
(g+2)%4*b)&255,d=0;4>d;d+=1)8*g+6*d<=a?h+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(p>>>6*(3-d)&63):h+=e.b64Pad;return h}function Q(c,a,b){var e="";a/=8;var h,d,g;g=-1===b?3:0;for(h=0;h<a;h+=1)d=c[h>>>2]>>>8*(g+h%4*b)&255,e+=String.fromCharCode(d);return e}function R(c,a,b){a/=8;var e,h=new ArrayBuffer(a),d,g;g=new Uint8Array(h);d=-1===b?3:0;for(e=0;e<a;e+=1)g[e]=c[e>>>2]>>>8*(d+e%4*b)&255;return h}function N(c){var a={outputUpper:!1,b64Pad:"=",shakeLen:-1};c=c||{};
a.outputUpper=c.outputUpper||!1;!0===c.hasOwnProperty("b64Pad")&&(a.b64Pad=c.b64Pad);if(!0===c.hasOwnProperty("shakeLen")){if(0!==c.shakeLen%8)throw Error("shakeLen must be a multiple of 8");a.shakeLen=c.shakeLen}if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function M(c,a,b){switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
}switch(c){case "HEX":c=function(a,c,d){var g=a.length,l,p,f,m,q,u;if(0!==g%2)throw Error("String of HEX type must be in byte increments");c=c||[0];d=d||0;q=d>>>3;u=-1===b?3:0;for(l=0;l<g;l+=2){p=parseInt(a.substr(l,2),16);if(isNaN(p))throw Error("String of HEX type contains invalid characters");m=(l>>>1)+q;for(f=m>>>2;c.length<=f;)c.push(0);c[f]|=p<<8*(u+m%4*b)}return{value:c,binLen:4*g+d}};break;case "TEXT":c=function(c,h,d){var g,l,p=0,f,m,q,u,r,t;h=h||[0];d=d||0;q=d>>>3;if("UTF8"===a)for(t=-1===
b?3:0,f=0;f<c.length;f+=1)for(g=c.charCodeAt(f),l=[],128>g?l.push(g):2048>g?(l.push(192|g>>>6),l.push(128|g&63)):55296>g||57344<=g?l.push(224|g>>>12,128|g>>>6&63,128|g&63):(f+=1,g=65536+((g&1023)<<10|c.charCodeAt(f)&1023),l.push(240|g>>>18,128|g>>>12&63,128|g>>>6&63,128|g&63)),m=0;m<l.length;m+=1){r=p+q;for(u=r>>>2;h.length<=u;)h.push(0);h[u]|=l[m]<<8*(t+r%4*b);p+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(t=-1===b?2:0,l="UTF16LE"===a&&1!==b||"UTF16LE"!==a&&1===b,f=0;f<c.length;f+=1){g=c.charCodeAt(f);
!0===l&&(m=g&255,g=m<<8|g>>>8);r=p+q;for(u=r>>>2;h.length<=u;)h.push(0);h[u]|=g<<8*(t+r%4*b);p+=2}return{value:h,binLen:8*p+d}};break;case "B64":c=function(a,c,d){var g=0,l,p,f,m,q,u,r,t;if(-1===a.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");p=a.indexOf("=");a=a.replace(/\=/g,"");if(-1!==p&&p<a.length)throw Error("Invalid '=' found in base-64 string");c=c||[0];d=d||0;u=d>>>3;t=-1===b?3:0;for(p=0;p<a.length;p+=4){q=a.substr(p,4);for(f=m=0;f<q.length;f+=1)l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[f]),
m|=l<<18-6*f;for(f=0;f<q.length-1;f+=1){r=g+u;for(l=r>>>2;c.length<=l;)c.push(0);c[l]|=(m>>>16-8*f&255)<<8*(t+r%4*b);g+=1}}return{value:c,binLen:8*g+d}};break;case "BYTES":c=function(a,c,d){var g,l,p,f,m,q;c=c||[0];d=d||0;p=d>>>3;q=-1===b?3:0;for(l=0;l<a.length;l+=1)g=a.charCodeAt(l),m=l+p,f=m>>>2,c.length<=f&&c.push(0),c[f]|=g<<8*(q+m%4*b);return{value:c,binLen:8*a.length+d}};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(e){throw Error("ARRAYBUFFER not supported by this environment");}c=
function(a,c,d){var g,l,p,f,m,q;c=c||[0];d=d||0;l=d>>>3;m=-1===b?3:0;q=new Uint8Array(a);for(g=0;g<a.byteLength;g+=1)f=g+l,p=f>>>2,c.length<=p&&c.push(0),c[p]|=q[g]<<8*(m+f%4*b);return{value:c,binLen:8*a.byteLength+d}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");}return c}function y(c,a){return c<<a|c>>>32-a}function S(c,a){return 32<a?(a-=32,new b(c.b<<a|c.a>>>32-a,c.a<<a|c.b>>>32-a)):0!==a?new b(c.a<<a|c.b>>>32-a,c.b<<a|c.a>>>32-a):c}function w(c,a){return c>>>
a|c<<32-a}function t(c,a){var k=null,k=new b(c.a,c.b);return k=32>=a?new b(k.a>>>a|k.b<<32-a&4294967295,k.b>>>a|k.a<<32-a&4294967295):new b(k.b>>>a-32|k.a<<64-a&4294967295,k.a>>>a-32|k.b<<64-a&4294967295)}function T(c,a){var k=null;return k=32>=a?new b(c.a>>>a,c.b>>>a|c.a<<32-a&4294967295):new b(0,c.a>>>a-32)}function aa(c,a,b){return c&a^~c&b}function ba(c,a,k){return new b(c.a&a.a^~c.a&k.a,c.b&a.b^~c.b&k.b)}function U(c,a,b){return c&a^c&b^a&b}function ca(c,a,k){return new b(c.a&a.a^c.a&k.a^a.a&
k.a,c.b&a.b^c.b&k.b^a.b&k.b)}function da(c){return w(c,2)^w(c,13)^w(c,22)}function ea(c){var a=t(c,28),k=t(c,34);c=t(c,39);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function fa(c){return w(c,6)^w(c,11)^w(c,25)}function ga(c){var a=t(c,14),k=t(c,18);c=t(c,41);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function ha(c){return w(c,7)^w(c,18)^c>>>3}function ia(c){var a=t(c,1),k=t(c,8);c=T(c,7);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function ja(c){return w(c,17)^w(c,19)^c>>>10}function ka(c){var a=t(c,19),k=t(c,61);
c=T(c,6);return new b(a.a^k.a^c.a,a.b^k.b^c.b)}function G(c,a){var b=(c&65535)+(a&65535);return((c>>>16)+(a>>>16)+(b>>>16)&65535)<<16|b&65535}function la(c,a,b,e){var h=(c&65535)+(a&65535)+(b&65535)+(e&65535);return((c>>>16)+(a>>>16)+(b>>>16)+(e>>>16)+(h>>>16)&65535)<<16|h&65535}function H(c,a,b,e,h){var d=(c&65535)+(a&65535)+(b&65535)+(e&65535)+(h&65535);return((c>>>16)+(a>>>16)+(b>>>16)+(e>>>16)+(h>>>16)+(d>>>16)&65535)<<16|d&65535}function ma(c,a){var d,e,h;d=(c.b&65535)+(a.b&65535);e=(c.b>>>16)+
(a.b>>>16)+(d>>>16);h=(e&65535)<<16|d&65535;d=(c.a&65535)+(a.a&65535)+(e>>>16);e=(c.a>>>16)+(a.a>>>16)+(d>>>16);return new b((e&65535)<<16|d&65535,h)}function na(c,a,d,e){var h,n,g;h=(c.b&65535)+(a.b&65535)+(d.b&65535)+(e.b&65535);n=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(h>>>16);g=(n&65535)<<16|h&65535;h=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(n>>>16);n=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(h>>>16);return new b((n&65535)<<16|h&65535,g)}function oa(c,a,d,e,h){var n,g,l;n=(c.b&
65535)+(a.b&65535)+(d.b&65535)+(e.b&65535)+(h.b&65535);g=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(h.b>>>16)+(n>>>16);l=(g&65535)<<16|n&65535;n=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(h.a&65535)+(g>>>16);g=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(h.a>>>16)+(n>>>16);return new b((g&65535)<<16|n&65535,l)}function B(c,a){return new b(c.a^a.a,c.b^a.b)}function A(c){var a=[],d;if("SHA-1"===c)a=[1732584193,4023233417,2562383102,271733878,3285377520];else if(0===c.lastIndexOf("SHA-",0))switch(a=
[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c){case "SHA-224":break;case "SHA-256":a=d;break;case "SHA-384":a=[new b(3418070365,a[0]),new b(1654270250,a[1]),new b(2438529370,a[2]),new b(355462360,a[3]),new b(1731405415,a[4]),new b(41048885895,a[5]),new b(3675008525,a[6]),new b(1203062813,a[7])];break;case "SHA-512":a=[new b(d[0],4089235720),new b(d[1],2227873595),
new b(d[2],4271175723),new b(d[3],1595750129),new b(d[4],2917565137),new b(d[5],725511199),new b(d[6],4215389547),new b(d[7],327033209)];break;default:throw Error("Unknown SHA variant");}else if(0===c.lastIndexOf("SHA3-",0)||0===c.lastIndexOf("SHAKE",0))for(c=0;5>c;c+=1)a[c]=[new b(0,0),new b(0,0),new b(0,0),new b(0,0),new b(0,0)];else throw Error("No SHA variants supported");return a}function K(c,a){var b=[],e,d,n,g,l,p,f;e=a[0];d=a[1];n=a[2];g=a[3];l=a[4];for(f=0;80>f;f+=1)b[f]=16>f?c[f]:y(b[f-
3]^b[f-8]^b[f-14]^b[f-16],1),p=20>f?H(y(e,5),d&n^~d&g,l,1518500249,b[f]):40>f?H(y(e,5),d^n^g,l,1859775393,b[f]):60>f?H(y(e,5),U(d,n,g),l,2400959708,b[f]):H(y(e,5),d^n^g,l,3395469782,b[f]),l=g,g=n,n=y(d,30),d=e,e=p;a[0]=G(e,a[0]);a[1]=G(d,a[1]);a[2]=G(n,a[2]);a[3]=G(g,a[3]);a[4]=G(l,a[4]);return a}function Z(c,a,b,e){var d;for(d=(a+65>>>9<<4)+15;c.length<=d;)c.push(0);c[a>>>5]|=128<<24-a%32;a+=b;c[d]=a&4294967295;c[d-1]=a/4294967296|0;a=c.length;for(d=0;d<a;d+=16)e=K(c.slice(d,d+16),e);return e}function L(c,
a,k){var e,h,n,g,l,p,f,m,q,u,r,t,v,w,y,A,z,x,F,B,C,D,E=[],J;if("SHA-224"===k||"SHA-256"===k)u=64,t=1,D=Number,v=G,w=la,y=H,A=ha,z=ja,x=da,F=fa,C=U,B=aa,J=d;else if("SHA-384"===k||"SHA-512"===k)u=80,t=2,D=b,v=ma,w=na,y=oa,A=ia,z=ka,x=ea,F=ga,C=ca,B=ba,J=V;else throw Error("Unexpected error in SHA-2 implementation");k=a[0];e=a[1];h=a[2];n=a[3];g=a[4];l=a[5];p=a[6];f=a[7];for(r=0;r<u;r+=1)16>r?(q=r*t,m=c.length<=q?0:c[q],q=c.length<=q+1?0:c[q+1],E[r]=new D(m,q)):E[r]=w(z(E[r-2]),E[r-7],A(E[r-15]),E[r-
16]),m=y(f,F(g),B(g,l,p),J[r],E[r]),q=v(x(k),C(k,e,h)),f=p,p=l,l=g,g=v(n,m),n=h,h=e,e=k,k=v(m,q);a[0]=v(k,a[0]);a[1]=v(e,a[1]);a[2]=v(h,a[2]);a[3]=v(n,a[3]);a[4]=v(g,a[4]);a[5]=v(l,a[5]);a[6]=v(p,a[6]);a[7]=v(f,a[7]);return a}function D(c,a){var d,e,h,n,g=[],l=[];if(null!==c)for(e=0;e<c.length;e+=2)a[(e>>>1)%5][(e>>>1)/5|0]=B(a[(e>>>1)%5][(e>>>1)/5|0],new b(c[e+1],c[e]));for(d=0;24>d;d+=1){n=A("SHA3-");for(e=0;5>e;e+=1){h=a[e][0];var p=a[e][1],f=a[e][2],m=a[e][3],q=a[e][4];g[e]=new b(h.a^p.a^f.a^
m.a^q.a,h.b^p.b^f.b^m.b^q.b)}for(e=0;5>e;e+=1)l[e]=B(g[(e+4)%5],S(g[(e+1)%5],1));for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)a[e][h]=B(a[e][h],l[e]);for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)n[h][(2*e+3*h)%5]=S(a[e][h],W[e][h]);for(e=0;5>e;e+=1)for(h=0;5>h;h+=1)a[e][h]=B(n[e][h],new b(~n[(e+1)%5][h].a&n[(e+2)%5][h].a,~n[(e+1)%5][h].b&n[(e+2)%5][h].b));a[0][0]=B(a[0][0],X[d])}return a}var d,V,W,X;d=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,
1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,
2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];V=[new b(d[0],3609767458),new b(d[1],602891725),new b(d[2],3964484399),new b(d[3],2173295548),new b(d[4],4081628472),new b(d[5],3053834265),new b(d[6],2937671579),new b(d[7],3664609560),new b(d[8],2734883394),new b(d[9],1164996542),new b(d[10],1323610764),new b(d[11],3590304994),new b(d[12],4068182383),new b(d[13],991336113),new b(d[14],633803317),new b(d[15],3479774868),new b(d[16],2666613458),new b(d[17],944711139),new b(d[18],2341262773),
new b(d[19],2007800933),new b(d[20],1495990901),new b(d[21],1856431235),new b(d[22],3175218132),new b(d[23],2198950837),new b(d[24],3999719339),new b(d[25],766784016),new b(d[26],2566594879),new b(d[27],3203337956),new b(d[28],1034457026),new b(d[29],2466948901),new b(d[30],3758326383),new b(d[31],168717936),new b(d[32],1188179964),new b(d[33],1546045734),new b(d[34],1522805485),new b(d[35],2643833823),new b(d[36],2343527390),new b(d[37],1014477480),new b(d[38],1206759142),new b(d[39],344077627),
new b(d[40],1290863460),new b(d[41],3158454273),new b(d[42],3505952657),new b(d[43],106217008),new b(d[44],3606008344),new b(d[45],1432725776),new b(d[46],1467031594),new b(d[47],851169720),new b(d[48],3100823752),new b(d[49],1363258195),new b(d[50],3750685593),new b(d[51],3785050280),new b(d[52],3318307427),new b(d[53],3812723403),new b(d[54],2003034995),new b(d[55],3602036899),new b(d[56],1575990012),new b(d[57],1125592928),new b(d[58],2716904306),new b(d[59],442776044),new b(d[60],593698344),new b(d[61],
3733110249),new b(d[62],2999351573),new b(d[63],3815920427),new b(3391569614,3928383900),new b(3515267271,566280711),new b(3940187606,3454069534),new b(4118630271,4000239992),new b(116418474,1914138554),new b(174292421,2731055270),new b(289380356,3203993006),new b(460393269,320620315),new b(685471733,587496836),new b(852142971,1086792851),new b(1017036298,365543100),new b(1126000580,2618297676),new b(1288033470,3409855158),new b(1501505948,4234509866),new b(1607167915,987167468),new b(1816402316,
1246189591)];X=[new b(0,1),new b(0,32898),new b(2147483648,32906),new b(2147483648,2147516416),new b(0,32907),new b(0,2147483649),new b(2147483648,2147516545),new b(2147483648,32777),new b(0,138),new b(0,136),new b(0,2147516425),new b(0,2147483658),new b(0,2147516555),new b(2147483648,139),new b(2147483648,32905),new b(2147483648,32771),new b(2147483648,32770),new b(2147483648,128),new b(0,32778),new b(2147483648,2147483658),new b(2147483648,2147516545),new b(2147483648,32896),new b(0,2147483649),
new b(2147483648,2147516424)];W=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];"function"===typeof define&&define.amd?define(function(){return C}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=C),exports=C):Y.jsSHA=C})(this);
;
/*!
 * jQuery Form Plugin
 * version: 4.2.2
 * Requires jQuery v1.7.2 or later
 * Project repository: https://github.com/jquery-form/form

 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup

 * Dual licensed under the LGPL-2.1+ or MIT licenses
 * https://github.com/jquery-form/form#license

 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,r){return void 0===r&&(r="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(r),r}:e(jQuery)}(function(e){"use strict";function t(t){var r=t.data;t.isDefaultPrevented()||(t.preventDefault(),e(t.target).closest("form").ajaxSubmit(r))}function r(t){var r=t.target,a=e(r);if(!a.is("[type=submit],[type=image]")){var n=a.closest("[type=submit]");if(0===n.length)return;r=n[0]}var i=r.form;if(i.clk=r,"image"===r.type)if(void 0!==t.offsetX)i.clk_x=t.offsetX,i.clk_y=t.offsetY;else if("function"==typeof e.fn.offset){var o=a.offset();i.clk_x=t.pageX-o.left,i.clk_y=t.pageY-o.top}else i.clk_x=t.pageX-r.offsetLeft,i.clk_y=t.pageY-r.offsetTop;setTimeout(function(){i.clk=i.clk_x=i.clk_y=null},100)}function a(){if(e.fn.ajaxSubmit.debug){var t="[jquery.form] "+Array.prototype.join.call(arguments,"");window.console&&window.console.log?window.console.log(t):window.opera&&window.opera.postError&&window.opera.postError(t)}}var n=/\r?\n/g,i={};i.fileapi=void 0!==e('<input type="file">').get(0).files,i.formdata=void 0!==window.FormData;var o=!!e.fn.prop;e.fn.attr2=function(){if(!o)return this.attr.apply(this,arguments);var e=this.prop.apply(this,arguments);return e&&e.jquery||"string"==typeof e?e:this.attr.apply(this,arguments)},e.fn.ajaxSubmit=function(t,r,n,s){function u(r){var a,n,i=e.param(r,t.traditional).split("&"),o=i.length,s=[];for(a=0;a<o;a++)i[a]=i[a].replace(/\+/g," "),n=i[a].split("="),s.push([decodeURIComponent(n[0]),decodeURIComponent(n[1])]);return s}function c(r){function n(e){var t=null;try{e.contentWindow&&(t=e.contentWindow.document)}catch(e){a("cannot get iframe.contentWindow document: "+e)}if(t)return t;try{t=e.contentDocument?e.contentDocument:e.document}catch(r){a("cannot get iframe.contentDocument: "+r),t=e.document}return t}function i(){function t(){try{var e=n(v).readyState;a("state = "+e),e&&"uninitialized"===e.toLowerCase()&&setTimeout(t,50)}catch(e){a("Server abort: ",e," (",e.name,")"),s(L),j&&clearTimeout(j),j=void 0}}var r=p.attr2("target"),i=p.attr2("action"),o=p.attr("enctype")||p.attr("encoding")||"multipart/form-data";w.setAttribute("target",m),l&&!/post/i.test(l)||w.setAttribute("method","POST"),i!==f.url&&w.setAttribute("action",f.url),f.skipEncodingOverride||l&&!/post/i.test(l)||p.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"}),f.timeout&&(j=setTimeout(function(){T=!0,s(A)},f.timeout));var u=[];try{if(f.extraData)for(var c in f.extraData)f.extraData.hasOwnProperty(c)&&(e.isPlainObject(f.extraData[c])&&f.extraData[c].hasOwnProperty("name")&&f.extraData[c].hasOwnProperty("value")?u.push(e('<input type="hidden" name="'+f.extraData[c].name+'">',k).val(f.extraData[c].value).appendTo(w)[0]):u.push(e('<input type="hidden" name="'+c+'">',k).val(f.extraData[c]).appendTo(w)[0]));f.iframeTarget||h.appendTo(D),v.attachEvent?v.attachEvent("onload",s):v.addEventListener("load",s,!1),setTimeout(t,15);try{w.submit()}catch(e){document.createElement("form").submit.apply(w)}}finally{w.setAttribute("action",i),w.setAttribute("enctype",o),r?w.setAttribute("target",r):p.removeAttr("target"),e(u).remove()}}function s(t){if(!x.aborted&&!X){if((O=n(v))||(a("cannot access response document"),t=L),t===A&&x)return x.abort("timeout"),void S.reject(x,"timeout");if(t===L&&x)return x.abort("server abort"),void S.reject(x,"error","server abort");if(O&&O.location.href!==f.iframeSrc||T){v.detachEvent?v.detachEvent("onload",s):v.removeEventListener("load",s,!1);var r,i="success";try{if(T)throw"timeout";var o="xml"===f.dataType||O.XMLDocument||e.isXMLDoc(O);if(a("isXml="+o),!o&&window.opera&&(null===O.body||!O.body.innerHTML)&&--C)return a("requeing onLoad callback, DOM not available"),void setTimeout(s,250);var u=O.body?O.body:O.documentElement;x.responseText=u?u.innerHTML:null,x.responseXML=O.XMLDocument?O.XMLDocument:O,o&&(f.dataType="xml"),x.getResponseHeader=function(e){return{"content-type":f.dataType}[e.toLowerCase()]},u&&(x.status=Number(u.getAttribute("status"))||x.status,x.statusText=u.getAttribute("statusText")||x.statusText);var c=(f.dataType||"").toLowerCase(),l=/(json|script|text)/.test(c);if(l||f.textarea){var p=O.getElementsByTagName("textarea")[0];if(p)x.responseText=p.value,x.status=Number(p.getAttribute("status"))||x.status,x.statusText=p.getAttribute("statusText")||x.statusText;else if(l){var m=O.getElementsByTagName("pre")[0],g=O.getElementsByTagName("body")[0];m?x.responseText=m.textContent?m.textContent:m.innerText:g&&(x.responseText=g.textContent?g.textContent:g.innerText)}}else"xml"===c&&!x.responseXML&&x.responseText&&(x.responseXML=q(x.responseText));try{M=N(x,c,f)}catch(e){i="parsererror",x.error=r=e||i}}catch(e){a("error caught: ",e),i="error",x.error=r=e||i}x.aborted&&(a("upload aborted"),i=null),x.status&&(i=x.status>=200&&x.status<300||304===x.status?"success":"error"),"success"===i?(f.success&&f.success.call(f.context,M,"success",x),S.resolve(x.responseText,"success",x),d&&e.event.trigger("ajaxSuccess",[x,f])):i&&(void 0===r&&(r=x.statusText),f.error&&f.error.call(f.context,x,i,r),S.reject(x,"error",r),d&&e.event.trigger("ajaxError",[x,f,r])),d&&e.event.trigger("ajaxComplete",[x,f]),d&&!--e.active&&e.event.trigger("ajaxStop"),f.complete&&f.complete.call(f.context,x,i),X=!0,f.timeout&&clearTimeout(j),setTimeout(function(){f.iframeTarget?h.attr("src",f.iframeSrc):h.remove(),x.responseXML=null},100)}}}var u,c,f,d,m,h,v,x,y,b,T,j,w=p[0],S=e.Deferred();if(S.abort=function(e){x.abort(e)},r)for(c=0;c<g.length;c++)u=e(g[c]),o?u.prop("disabled",!1):u.removeAttr("disabled");(f=e.extend(!0,{},e.ajaxSettings,t)).context=f.context||f,m="jqFormIO"+(new Date).getTime();var k=w.ownerDocument,D=p.closest("body");if(f.iframeTarget?(b=(h=e(f.iframeTarget,k)).attr2("name"))?m=b:h.attr2("name",m):(h=e('<iframe name="'+m+'" src="'+f.iframeSrc+'" />',k)).css({position:"absolute",top:"-1000px",left:"-1000px"}),v=h[0],x={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(t){var r="timeout"===t?"timeout":"aborted";a("aborting upload... "+r),this.aborted=1;try{v.contentWindow.document.execCommand&&v.contentWindow.document.execCommand("Stop")}catch(e){}h.attr("src",f.iframeSrc),x.error=r,f.error&&f.error.call(f.context,x,r,t),d&&e.event.trigger("ajaxError",[x,f,r]),f.complete&&f.complete.call(f.context,x,r)}},(d=f.global)&&0==e.active++&&e.event.trigger("ajaxStart"),d&&e.event.trigger("ajaxSend",[x,f]),f.beforeSend&&!1===f.beforeSend.call(f.context,x,f))return f.global&&e.active--,S.reject(),S;if(x.aborted)return S.reject(),S;(y=w.clk)&&(b=y.name)&&!y.disabled&&(f.extraData=f.extraData||{},f.extraData[b]=y.value,"image"===y.type&&(f.extraData[b+".x"]=w.clk_x,f.extraData[b+".y"]=w.clk_y));var A=1,L=2,F=e("meta[name=csrf-token]").attr("content"),E=e("meta[name=csrf-param]").attr("content");E&&F&&(f.extraData=f.extraData||{},f.extraData[E]=F),f.forceSync?i():setTimeout(i,10);var M,O,X,C=50,q=e.parseXML||function(e,t){return window.ActiveXObject?((t=new ActiveXObject("Microsoft.XMLDOM")).async="false",t.loadXML(e)):t=(new DOMParser).parseFromString(e,"text/xml"),t&&t.documentElement&&"parsererror"!==t.documentElement.nodeName?t:null},_=e.parseJSON||function(e){return window.eval("("+e+")")},N=function(t,r,a){var n=t.getResponseHeader("content-type")||"",i=("xml"===r||!r)&&n.indexOf("xml")>=0,o=i?t.responseXML:t.responseText;return i&&"parsererror"===o.documentElement.nodeName&&e.error&&e.error("parsererror"),a&&a.dataFilter&&(o=a.dataFilter(o,r)),"string"==typeof o&&(("json"===r||!r)&&n.indexOf("json")>=0?o=_(o):("script"===r||!r)&&n.indexOf("javascript")>=0&&e.globalEval(o)),o};return S}if(!this.length)return a("ajaxSubmit: skipping submit process - no element selected"),this;var l,f,d,p=this;"function"==typeof t?t={success:t}:"string"==typeof t||!1===t&&arguments.length>0?(t={url:t,data:r,dataType:n},"function"==typeof s&&(t.success=s)):void 0===t&&(t={}),l=t.method||t.type||this.attr2("method"),(d=(d="string"==typeof(f=t.url||this.attr2("action"))?e.trim(f):"")||window.location.href||"")&&(d=(d.match(/^([^#]+)/)||[])[1]),t=e.extend(!0,{url:d,success:e.ajaxSettings.success,type:l||e.ajaxSettings.type,iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},t);var m={};if(this.trigger("form-pre-serialize",[this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"),this;if(t.beforeSerialize&&!1===t.beforeSerialize(this,t))return a("ajaxSubmit: submit aborted via beforeSerialize callback"),this;var h=t.traditional;void 0===h&&(h=e.ajaxSettings.traditional);var v,g=[],x=this.formToArray(t.semantic,g,t.filtering);if(t.data){var y=e.isFunction(t.data)?t.data(x):t.data;t.extraData=y,v=e.param(y,h)}if(t.beforeSubmit&&!1===t.beforeSubmit(x,this,t))return a("ajaxSubmit: submit aborted via beforeSubmit callback"),this;if(this.trigger("form-submit-validate",[x,this,t,m]),m.veto)return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"),this;var b=e.param(x,h);v&&(b=b?b+"&"+v:v),"GET"===t.type.toUpperCase()?(t.url+=(t.url.indexOf("?")>=0?"&":"?")+b,t.data=null):t.data=b;var T=[];if(t.resetForm&&T.push(function(){p.resetForm()}),t.clearForm&&T.push(function(){p.clearForm(t.includeHidden)}),!t.dataType&&t.target){var j=t.success||function(){};T.push(function(r,a,n){var i=arguments,o=t.replaceTarget?"replaceWith":"html";e(t.target)[o](r).each(function(){j.apply(this,i)})})}else t.success&&(e.isArray(t.success)?e.merge(T,t.success):T.push(t.success));if(t.success=function(e,r,a){for(var n=t.context||this,i=0,o=T.length;i<o;i++)T[i].apply(n,[e,r,a||p,p])},t.error){var w=t.error;t.error=function(e,r,a){var n=t.context||this;w.apply(n,[e,r,a,p])}}if(t.complete){var S=t.complete;t.complete=function(e,r){var a=t.context||this;S.apply(a,[e,r,p])}}var k=e("input[type=file]:enabled",this).filter(function(){return""!==e(this).val()}).length>0,D="multipart/form-data",A=p.attr("enctype")===D||p.attr("encoding")===D,L=i.fileapi&&i.formdata;a("fileAPI :"+L);var F,E=(k||A)&&!L;!1!==t.iframe&&(t.iframe||E)?t.closeKeepAlive?e.get(t.closeKeepAlive,function(){F=c(x)}):F=c(x):F=(k||A)&&L?function(r){for(var a=new FormData,n=0;n<r.length;n++)a.append(r[n].name,r[n].value);if(t.extraData){var i=u(t.extraData);for(n=0;n<i.length;n++)i[n]&&a.append(i[n][0],i[n][1])}t.data=null;var o=e.extend(!0,{},e.ajaxSettings,t,{contentType:!1,processData:!1,cache:!1,type:l||"POST"});t.uploadProgress&&(o.xhr=function(){var r=e.ajaxSettings.xhr();return r.upload&&r.upload.addEventListener("progress",function(e){var r=0,a=e.loaded||e.position,n=e.total;e.lengthComputable&&(r=Math.ceil(a/n*100)),t.uploadProgress(e,a,n,r)},!1),r}),o.data=null;var s=o.beforeSend;return o.beforeSend=function(e,r){t.formData?r.data=t.formData:r.data=a,s&&s.call(this,e,r)},e.ajax(o)}(x):e.ajax(t),p.removeData("jqxhr").data("jqxhr",F);for(var M=0;M<g.length;M++)g[M]=null;return this.trigger("form-submit-notify",[this,t]),this},e.fn.ajaxForm=function(n,i,o,s){if(("string"==typeof n||!1===n&&arguments.length>0)&&(n={url:n,data:i,dataType:o},"function"==typeof s&&(n.success=s)),n=n||{},n.delegation=n.delegation&&e.isFunction(e.fn.on),!n.delegation&&0===this.length){var u={s:this.selector,c:this.context};return!e.isReady&&u.s?(a("DOM not ready, queuing ajaxForm"),e(function(){e(u.s,u.c).ajaxForm(n)}),this):(a("terminating; zero elements found by selector"+(e.isReady?"":" (DOM not ready)")),this)}return n.delegation?(e(document).off("submit.form-plugin",this.selector,t).off("click.form-plugin",this.selector,r).on("submit.form-plugin",this.selector,n,t).on("click.form-plugin",this.selector,n,r),this):this.ajaxFormUnbind().on("submit.form-plugin",n,t).on("click.form-plugin",n,r)},e.fn.ajaxFormUnbind=function(){return this.off("submit.form-plugin click.form-plugin")},e.fn.formToArray=function(t,r,a){var n=[];if(0===this.length)return n;var o,s=this[0],u=this.attr("id"),c=t||void 0===s.elements?s.getElementsByTagName("*"):s.elements;if(c&&(c=e.makeArray(c)),u&&(t||/(Edge|Trident)\//.test(navigator.userAgent))&&(o=e(':input[form="'+u+'"]').get()).length&&(c=(c||[]).concat(o)),!c||!c.length)return n;e.isFunction(a)&&(c=e.map(c,a));var l,f,d,p,m,h,v;for(l=0,h=c.length;l<h;l++)if(m=c[l],(d=m.name)&&!m.disabled)if(t&&s.clk&&"image"===m.type)s.clk===m&&(n.push({name:d,value:e(m).val(),type:m.type}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}));else if((p=e.fieldValue(m,!0))&&p.constructor===Array)for(r&&r.push(m),f=0,v=p.length;f<v;f++)n.push({name:d,value:p[f]});else if(i.fileapi&&"file"===m.type){r&&r.push(m);var g=m.files;if(g.length)for(f=0;f<g.length;f++)n.push({name:d,value:g[f],type:m.type});else n.push({name:d,value:"",type:m.type})}else null!==p&&void 0!==p&&(r&&r.push(m),n.push({name:d,value:p,type:m.type,required:m.required}));if(!t&&s.clk){var x=e(s.clk),y=x[0];(d=y.name)&&!y.disabled&&"image"===y.type&&(n.push({name:d,value:x.val()}),n.push({name:d+".x",value:s.clk_x},{name:d+".y",value:s.clk_y}))}return n},e.fn.formSerialize=function(t){return e.param(this.formToArray(t))},e.fn.fieldSerialize=function(t){var r=[];return this.each(function(){var a=this.name;if(a){var n=e.fieldValue(this,t);if(n&&n.constructor===Array)for(var i=0,o=n.length;i<o;i++)r.push({name:a,value:n[i]});else null!==n&&void 0!==n&&r.push({name:this.name,value:n})}}),e.param(r)},e.fn.fieldValue=function(t){for(var r=[],a=0,n=this.length;a<n;a++){var i=this[a],o=e.fieldValue(i,t);null===o||void 0===o||o.constructor===Array&&!o.length||(o.constructor===Array?e.merge(r,o):r.push(o))}return r},e.fieldValue=function(t,r){var a=t.name,i=t.type,o=t.tagName.toLowerCase();if(void 0===r&&(r=!0),r&&(!a||t.disabled||"reset"===i||"button"===i||("checkbox"===i||"radio"===i)&&!t.checked||("submit"===i||"image"===i)&&t.form&&t.form.clk!==t||"select"===o&&-1===t.selectedIndex))return null;if("select"===o){var s=t.selectedIndex;if(s<0)return null;for(var u=[],c=t.options,l="select-one"===i,f=l?s+1:c.length,d=l?s:0;d<f;d++){var p=c[d];if(p.selected&&!p.disabled){var m=p.value;if(m||(m=p.attributes&&p.attributes.value&&!p.attributes.value.specified?p.text:p.value),l)return m;u.push(m)}}return u}return e(t).val().replace(n,"\r\n")},e.fn.clearForm=function(t){return this.each(function(){e("input,select,textarea",this).clearFields(t)})},e.fn.clearFields=e.fn.clearInputs=function(t){var r=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var a=this.type,n=this.tagName.toLowerCase();r.test(a)||"textarea"===n?this.value="":"checkbox"===a||"radio"===a?this.checked=!1:"select"===n?this.selectedIndex=-1:"file"===a?/MSIE/.test(navigator.userAgent)?e(this).replaceWith(e(this).clone(!0)):e(this).val(""):t&&(!0===t&&/hidden/.test(a)||"string"==typeof t&&e(this).is(t))&&(this.value="")})},e.fn.resetForm=function(){return this.each(function(){var t=e(this),r=this.tagName.toLowerCase();switch(r){case"input":this.checked=this.defaultChecked;case"textarea":return this.value=this.defaultValue,!0;case"option":case"optgroup":var a=t.parents("select");return a.length&&a[0].multiple?"option"===r?this.selected=this.defaultSelected:t.find("option").resetForm():a.resetForm(),!0;case"select":return t.find("option").each(function(e){if(this.selected=this.defaultSelected,this.defaultSelected&&!t[0].multiple)return t[0].selectedIndex=e,!1}),!0;case"label":var n=e(t.attr("for")),i=t.find("input,select,textarea");return n[0]&&i.unshift(n[0]),i.resetForm(),!0;case"form":return("function"==typeof this.reset||"object"==typeof this.reset&&!this.reset.nodeType)&&this.reset(),!0;default:return t.find("form,input,label,select,textarea").resetForm(),!0}})},e.fn.enable=function(e){return void 0===e&&(e=!0),this.each(function(){this.disabled=!e})},e.fn.selected=function(t){return void 0===t&&(t=!0),this.each(function(){var r=this.type;if("checkbox"===r||"radio"===r)this.checked=t;else if("option"===this.tagName.toLowerCase()){var a=e(this).parent("select");t&&a[0]&&"select-one"===a[0].type&&a.find("option").selected(!1),this.selected=t}})},e.fn.ajaxSubmit.debug=!1});

;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.Views = {};

  Drupal.Views.parseQueryString = function (query) {
    var args = {};
    var pos = query.indexOf('?');
    if (pos !== -1) {
      query = query.substring(pos + 1);
    }
    var pair = void 0;
    var pairs = query.split('&');
    for (var i = 0; i < pairs.length; i++) {
      pair = pairs[i].split('=');

      if (pair[0] !== 'q' && pair[1]) {
        args[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      }
    }
    return args;
  };

  Drupal.Views.parseViewArgs = function (href, viewPath) {
    var returnObj = {};
    var path = Drupal.Views.getPath(href);

    var viewHref = Drupal.url(viewPath).substring(drupalSettings.path.baseUrl.length);

    if (viewHref && path.substring(0, viewHref.length + 1) === viewHref + '/') {
      returnObj.view_args = decodeURIComponent(path.substring(viewHref.length + 1, path.length));
      returnObj.view_path = path;
    }
    return returnObj;
  };

  Drupal.Views.pathPortion = function (href) {
    var protocol = window.location.protocol;
    if (href.substring(0, protocol.length) === protocol) {
      href = href.substring(href.indexOf('/', protocol.length + 2));
    }
    return href;
  };

  Drupal.Views.getPath = function (href) {
    href = Drupal.Views.pathPortion(href);
    href = href.substring(drupalSettings.path.baseUrl.length, href.length);

    if (href.substring(0, 3) === '?q=') {
      href = href.substring(3, href.length);
    }
    var chars = ['#', '?', '&'];
    for (var i = 0; i < chars.length; i++) {
      if (href.indexOf(chars[i]) > -1) {
        href = href.substr(0, href.indexOf(chars[i]));
      }
    }
    return href;
  };
})(jQuery, Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.ViewsAjaxView = {};
  Drupal.behaviors.ViewsAjaxView.attach = function (context, settings) {
    if (settings && settings.views && settings.views.ajaxViews) {
      var ajaxViews = settings.views.ajaxViews;

      Object.keys(ajaxViews || {}).forEach(function (i) {
        Drupal.views.instances[i] = new Drupal.views.ajaxView(ajaxViews[i]);
      });
    }
  };
  Drupal.behaviors.ViewsAjaxView.detach = function (context, settings, trigger) {
    if (trigger === 'unload') {
      if (settings && settings.views && settings.views.ajaxViews) {
        var ajaxViews = settings.views.ajaxViews;

        Object.keys(ajaxViews || {}).forEach(function (i) {
          var selector = '.js-view-dom-id-' + ajaxViews[i].view_dom_id;
          if ($(selector, context).length) {
            delete Drupal.views.instances[i];
            delete settings.views.ajaxViews[i];
          }
        });
      }
    }
  };

  Drupal.views = {};

  Drupal.views.instances = {};

  Drupal.views.ajaxView = function (settings) {
    var selector = '.js-view-dom-id-' + settings.view_dom_id;
    this.$view = $(selector);

    var ajaxPath = drupalSettings.views.ajax_path;

    if (ajaxPath.constructor.toString().indexOf('Array') !== -1) {
      ajaxPath = ajaxPath[0];
    }

    var queryString = window.location.search || '';
    if (queryString !== '') {
      queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
      if (queryString !== '') {
        queryString = (/\?/.test(ajaxPath) ? '&' : '?') + queryString;
      }
    }

    this.element_settings = {
      url: ajaxPath + queryString,
      submit: settings,
      setClick: true,
      event: 'click',
      selector: selector,
      progress: { type: 'fullscreen' }
    };

    this.settings = settings;

    this.$exposed_form = $('form#views-exposed-form-' + settings.view_name.replace(/_/g, '-') + '-' + settings.view_display_id.replace(/_/g, '-'));
    this.$exposed_form.once('exposed-form').each($.proxy(this.attachExposedFormAjax, this));

    this.$view.filter($.proxy(this.filterNestedViews, this)).once('ajax-pager').each($.proxy(this.attachPagerAjax, this));

    var selfSettings = $.extend({}, this.element_settings, {
      event: 'RefreshView',
      base: this.selector,
      element: this.$view.get(0)
    });
    this.refreshViewAjax = Drupal.ajax(selfSettings);
  };

  Drupal.views.ajaxView.prototype.attachExposedFormAjax = function () {
    var that = this;
    this.exposedFormAjax = [];

    $('input[type=submit], input[type=image]', this.$exposed_form).not('[data-drupal-selector=edit-reset]').each(function (index) {
      var selfSettings = $.extend({}, that.element_settings, {
        base: $(this).attr('id'),
        element: this
      });
      that.exposedFormAjax[index] = Drupal.ajax(selfSettings);
    });
  };

  Drupal.views.ajaxView.prototype.filterNestedViews = function () {
    return !this.$view.parents('.view').length;
  };

  Drupal.views.ajaxView.prototype.attachPagerAjax = function () {
    this.$view.find('ul.js-pager__items > li > a, th.views-field a, .attachment .views-summary a').each($.proxy(this.attachPagerLinkAjax, this));
  };

  Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function (id, link) {
    var $link = $(link);
    var viewData = {};
    var href = $link.attr('href');

    $.extend(viewData, this.settings, Drupal.Views.parseQueryString(href), Drupal.Views.parseViewArgs(href, this.settings.view_base_path));

    var selfSettings = $.extend({}, this.element_settings, {
      submit: viewData,
      base: false,
      element: link
    });
    this.pagerAjax = Drupal.ajax(selfSettings);
  };

  Drupal.AjaxCommands.prototype.viewsScrollTop = function (ajax, response) {
    var offset = $(response.selector).offset();

    var scrollTarget = response.selector;
    while ($(scrollTarget).scrollTop() === 0 && $(scrollTarget).parent()) {
      scrollTarget = $(scrollTarget).parent();
    }

    if (offset.top - 10 < $(scrollTarget).scrollTop()) {
      $(scrollTarget).animate({ scrollTop: offset.top - 10 }, 500);
    }
  };
})(jQuery, Drupal, drupalSettings);;
