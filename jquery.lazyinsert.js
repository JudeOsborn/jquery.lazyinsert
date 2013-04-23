/*
 * Lazy Insert - jQuery plugin to insert image elements when they appear on screen.
 * Removes them when they are not visible. Useful for pages with a LOT of images.
 *
 * Based loosely on Mika Tuupola's jQuery Lazy Load (http://www.appelsiini.net/projects/lazyload)
 *
 * Copyright (c) 2013 Jude Osborn
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  1.0.0
 *
 */
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyinsert = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            container: window,
            throttle: 300
        };

        function update() {
            elements.each(function() {
                var $this = $(this);

                if (!$this.is(":visible")) {
                    return;
                }

                if ($.inviewport(this, settings)) {
                    $this.trigger('insert');
                } else {
                    $this.trigger('extract');
                }
            });
        }

        if (options) {
            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
                      settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if ($.throttle) {
            $container.on('scroll', $.throttle(settings.throttle, function(event) {
                return update();
            }));
        } else {
            $container.on('scroll', function(event) {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);
            self.has_image = false;

            $self.on('extract', function() {
                if (self.has_image === true) {
                    $self.find('img').remove();
                    self.has_image = false;
                }
            });

            $self.on('insert', function() {
                if (self.has_image === false) {
                    console.log('inserting image');
                    $self.prepend('<img src="' + $self.data('image') + '" />');
                    self.has_image = true;
                }

                console.log(self.has_image);
            });
        });

        /* Check if something appears when window is resized. */
        $window.on('resize', function(event) {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
            $window.on("pageshow", function(event) {
                if (event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger('insert');
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(window).load(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.height() + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
         return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
     };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[':'], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);
