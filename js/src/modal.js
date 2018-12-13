/**
* Gravity Department - Modal
* https://github.com/gravitydepartment/modal
*
* @author     Brendan Falkowski
* @copyright  2018 Gravity Department. All rights reserved.
*/


;(function($, window, document, undefined) {

    var $window = $(window);
    var $document = $(document);
    var $body = $('body');

    var Modal = {
        // ----------------------------------------------
        // Custom events

        // open.modal
        // opened.modal
        // close.modal
        // closed.modal
        // backdropClose.modal
        // contentUpdate.modal

        // ----------------------------------------------
        // Defaults

        defaults: {
            addCloseLink:       true,      // {boolean} - Add a close link to the modal.
            classPrefix:        '',        // {string}  - "namespace-" - Prefix all classes with a namespace. You'll need to modify the CSS if you use this.
            closeLinkLabel:     '&times;', // {string}  - "&times;|Close" - Label for the "close" link.
            contentInline:      '',        // {string}  - Content to use instead of a selector.
            contentAjax:        '',        // {string}  - Content returned by an AJAX request.
            loadingPlaceholder: '<div class="modal_body">Loading...</div>', // {string}
            maxWidth:           '',        // {string}  - '' or "small|medium|large" - Max width of the modal.
            showImmediately:    false,     // {boolean} - Show the modal immediately.
            transitionEndTime:  500,       // {number}  - Milliseconds for the modal transition to complete (duration + delay) as set in CSS.
            /**
             * 'ajax'     - The modal markup is returned by an AJAX response.
             * 'event'    - The modal markup is returned by the "contentUpdate.modal" event.
             * 'id'       - The modal markup is already in the DOM with a unique ID.
             * 'inline'   - The modal markup is passed in as a string.
             */
            type: 'id' // {string} - Source for the modal's content.
        },

        init: function (element, options) {
            // Override the defaults with options
            this.config = $.extend({}, this.defaults, options);

            // ----------------------------------------------
            // Check if triggering element exists or creating modal on-the-fly

            if (element !== false) {
                this.$element = $(element);

                // Override the options with data attributes from markup

                if (this.$element.data('modalLoadingPlaceholder')) {
                    this.config.loadingPlaceholder = this.$element.data('modalLoadingPlaceholder');
                }

                if (this.$element.data('modalAjax')) {
                    this.config.type = 'ajax';
                }

                if (this.$element.data('modalEvent')) {
                    this.config.type = 'event';
                }

                if (this.$element.data('modalInline')) {
                    this.config.type = 'inline';
                    this.config.contentInline = this.$element.data('modalInline');
                }
            } else {
                this.$element = false;
            }

            // ----------------------------------------------
            // Initialize by type

            switch (this.config.type) {
                case 'ajax':
                case 'event':
                case 'inline':
                    this.$modal = this.generateModalMarkup();
                    break;
                case 'id':
                    this.$modal = $('#' + this.$element.data('modal'));
                    break;
                default:
                    console.error('Invalid modal type');
            }

            // [todo]
            //console.log(this.$modal);

            // ----------------------------------------------
            // Run setup methods

            this.appendBackdrop();
            this.setupModal();
            this.events();

            // ----------------------------------------------
            // Show modal immediately

            if (this.config.showImmediately) {
                this.openModal();
            }
        },

        events: function () {
            var self = this;

            // ----------------------------------------------
            // Listen for modal trigger clicks

            if (this.$element) {
                this.$element.on('click', function (e) {
                    e.preventDefault();

                    self.openModal();
                });
            }

            // ----------------------------------------------
            // Listen for backdrop clicks

            this.$modal.on('backdropClose.modal', function (e) {
                self.closeModal();
            });

            // ----------------------------------------------
            // Listen for close link clicks

            // [todo] - fires on every element

            /*$document.on('click', '[data-modal-close="true"]', function (e) {
                e.preventDefault();

                self.closeModal();
            });*/

            this.$closeButtons = this.$modal.find('[data-modal-close="true"]');

            this.$closeButtons.on('click', function (e) {
                e.preventDefault();

                self.closeModal();
            });
        },

        appendBackdrop: function () {
            var self = this;

            this.$backdrop = $('.' + this.config.classPrefix + 'modal-backdrop');

            // Check if backdrop exists
            if (this.$backdrop.length === 0) {
                // Append it
                $body.append('<div class="' + this.config.classPrefix + 'modal-backdrop"></div>');

                // Now cache a selector for the element
                this.$backdrop = $('.' + this.config.classPrefix + 'modal-backdrop');

                // Add event to close the active modal
                this.$backdrop.on('click', function (e) {
                    // Trigger on the currently active modal
                    $('.modal-active').trigger('backdropClose.modal');
                });
            }
        },

        closeModal: function () {
            var self = this;

            // ----------------------------------------------
            // Trigger: "close.modal"

            if (this.$element.length) {
                this.$element.trigger('close.modal');
            } else {
                this.$modal.trigger('close.modal');
            }

            // ----------------------------------------------
            // Remove active classes

            this.$backdrop.removeClass(this.config.classPrefix + 'modal-active');
            this.$modal.removeClass(this.config.classPrefix + 'modal-active');

            window.setTimeout(function() {
                // De-activate modal
                self.$modal.addClass(self.config.classPrefix + 'modal-inactive');

                // Trigger: "closed.modal"
                if (self.$element.length) {
                    self.$element.trigger('closed.modal');
                } else {
                    self.$modal.trigger('closed.modal');
                }
            }, this.config.transitionEndTime);

            // Remove inline "top" style so modal animates to starting position.
            this.$modal.css('top', '');
        },

        generateModalMarkup: function () {
            var $markup = $('<section></section>');
            var maxWidthClass = (this.config.maxWidth === '') ? '' : this.config.classPrefix + 'modal--' + this.config.maxWidth;

            // Date.now() doesn't exist in <=IE8
            // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
            if (!Date.now) {
                Date.now = function now() {
                    return new Date().getTime();
                };
            }

            $markup.attr({
                'id':    this.config.classPrefix + 'modal-' + Date.now(),
                'class': this.config.classPrefix + 'modal ' + maxWidthClass
            });

            switch (this.config.type) {
                case 'ajax':
                case 'event':
                    $markup.html(this.config.loadingPlaceholder);
                    break;
                case 'inline':
                    $markup.html(this.getInlineContent());
                    break;
                default:
                    console.error('Markup generation failed.');
            }

            return $markup;
        },

        getAjaxContent: function () {
            if (this.$element.data('modalAjax')) {
                // [todo] - Incomplete
                //return $().load(this.$element.data('modalAjax'));
            } else {
                return false;
            }
        },

        getInlineContent: function () {
            if (this.config.contentInline.length) {
                return this.config.contentInline;
            } else {
                return false;
            }
        },

        openModal: function () {
            var self = this;
            var scrollOffset = $document.scrollTop();
            var initialTopPosition = scrollOffset - 100;

            // ----------------------------------------------
            // Trigger: "open.modal"

            if (self.$element.length) {
                self.$element.trigger('open.modal');
            } else {
                self.$modal.trigger('open.modal');
            }

            // ----------------------------------------------
            // Close an active modal without closing the backdrop
            //
            // [todo]
            // Need to fire close events on modal being swapped out.
            // Ideally, split up "modal open/close" and "backdrop open/close" methods.

            var activeModal = $('.modal.modal-active');

            if (activeModal.length) {
                activeModal.each(function () {
                    var swapModal = $(this);

                    swapModal.removeClass(self.config.classPrefix + 'modal-active');

                    window.setTimeout(function() {
                        swapModal.addClass(self.config.classPrefix + 'modal-inactive');
                    }, self.config.transitionEndTime);

                    // Remove inline "top" style so modal animates to starting position.
                    swapModal.css('top', '');
                });
            }

            // ----------------------------------------------
            // Start showing modal

            // Set initial position
            this.$modal.css('top', initialTopPosition + 'px');

            // Activate the backdrop
            this.$backdrop.addClass(this.config.classPrefix + 'modal-active');

            // Activate the modal
            this.$modal
            .removeClass(this.config.classPrefix + 'modal-inactive')
            .addClass(this.config.classPrefix + 'modal-active');

            // ----------------------------------------------
            // Trigger: "opened.modal"

            // Delay firing until transition has finished
            window.setTimeout(function () {
                if (self.$element.length) {
                    self.$element.trigger('opened.modal');
                } else {
                    self.$modal.trigger('opened.modal');
                }
            }, this.config.transitionEndTime);

            // ----------------------------------------------
            // Finish showing modal

            // Position the modal
            this.positionModal();

            // Update content if necessary
            this.updateContent();
        },

        positionModal: function () {
            var scrollOffset = $document.scrollTop();
            var initialTopPosition = scrollOffset - 100;
            var viewportHeight = $window.height();

            // After "modal-active" class is added, the modal has "height:auto".
            // Get the natural height.
            var modalHeight = this.$modal.height();

            // ----------------------------------------------
            // Set the vertical position

            // Modal will overflow the viewport.
            // Show 20px from top (will require page scrolling).
            if (modalHeight >= viewportHeight) {
                this.$modal.css('top', scrollOffset + 20 + 'px');
            }
            // Modal is taller than half the viewport.
            // Show centered vertically within the viewport.
            else if (modalHeight > (viewportHeight / 2)) {
                this.$modal.css('top', scrollOffset + ((viewportHeight - modalHeight) / 2) + 'px');
            }
            // Modal is between half and the full viewport height.
            // modalHeight <= (viewportHeight / 2)
            // Show 20% from top.
            else {
                this.$modal.css('top', scrollOffset + (viewportHeight / 5) + 'px');
            }
        },

        setupModal: function () {
            // De-activate the modal
            this.$modal.addClass(this.config.classPrefix + 'modal-inactive');

            // Move modal before </body>
            // Forces <body> to be positioning context for modals
            $body.append(this.$modal);

            // Add close button to markup
            if (this.config.addCloseLink) {
                this.$modal.append('<a href="#" class="' + this.config.classPrefix + 'modal_close" data-modal-close="true">' + this.config.closeLinkLabel + '</a>');
            }
        },

        updateContent: function () {
            var self = this;
            var wasUpdated = false;

            // ----------------------------------------------
            // AJAX content

            if (this.config.type === 'ajax') {
                wasUpdated = true;

                this.$modal.html(this.getAjaxContent());
            }

            // ----------------------------------------------
            // Event content

            if (this.config.type === 'event') {
                wasUpdated = true;

                // Fire custom event, and capture response.
                //
                // Note: the event's response cannot be asynchronous.
                // It must be executed immediately or the result will be undefined.

                var contentUpdateEvent = $.Event('contentUpdate.modal');
                this.$element.trigger(contentUpdateEvent);
                var result = String(contentUpdateEvent.result);

                // Set content
                if (result.length > 0) {
                    this.$modal.html(result);

                    // Add close button to markup
                    if (this.config.addCloseLink) {
                        this.$modal.append('<a href="#" class="' + this.config.classPrefix + 'modal_close" data-modal-close="true">' + this.config.closeLinkLabel + '</a>');
                    }
                } else {
                    this.$modal.html('Trigger "contentUpdate" failed.');
                }

                // Re-attach close events

                self.$closeButtons = self.$modal.find('[data-modal-close="true"]');

                self.$closeButtons.on('click', function (e) {
                    e.preventDefault();

                    self.closeModal();
                });
            }

            // ----------------------------------------------
            // Re-position the modal

            if (wasUpdated) {
                this.positionModal();
            }
        }
    };


    // ==============================================
    // Function prototype
    // ==============================================

    // Pass in 'options' which is the object added by the user to configure the plugin

    $.fn.modal = function (options) {
        if (!this.selector) {
            // Condition:
            // Init the plugin without a selector
            // Accessed by $.fn.modal()

            // Create an empty object and extend it will the plugin object.
            var modal = $.extend({}, Modal);

            // Run init method.
            // Don't pass an element because the plugin was initialized without a selector.
            // Pass in 'options' which is taken from the function prototype.
            modal.init(false, options);
        } else {
            // Condition:
            // Init with a selector of elements.
            // Return for each element matching the selector.

            return this.each(function () {
                // Create an empty object and extend it will the plugin object.
                var modal = $.extend({}, Modal);

                // Run init method.
                // Pass in 'this' which is the nth element matched by the selector which called the plugin.
                // Pass in 'options' which is taken from the function prototype.
                modal.init(this, options);
            });
        }
    };

})(jQuery, window, document);
