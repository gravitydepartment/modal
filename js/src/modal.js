/**
* Gravity Department - Modal
* https://github.com/gravitydepartment/modal
*
* @author     Brendan Falkowski
* @copyright  2018 Gravity Department. All rights reserved.
*/


/**
 * @param {object} settings - Object to override default config
 */
function Modal (settings) {
    this.config = {
        addCloseButton:     true,      // {boolean} - Add a close link to the modal.
        allowBackdropClose: true,      // {boolean} - Clicking the backdrop will close the modal.
        allowEscapeClose:   true,      // {boolean} - Pressing "ESC" will close the modal.
        allowInnerScroll:   false,     // {boolean} - The "modal_body" will be scrollable.
        closeButtonLabel:   '&times;', // {string}  - "&times;|Close" - Label for the "close" link.
        content:            null,      // {string}  - String of HTML content to render in the modal.
        transitionEndTime:  500,       // {number}  - Milliseconds for the modal transition to complete (duration + delay) as set in CSS.
        width:              'base'     // {string}  - "base|fluid|s|l" - Max width of the modal.
    };

    // Extend defaults
    jQuery.extend(this.config, settings);

    // ----------------------------------------------
    // Custom Events

    /*
    close.modal
    closeBackdrop.modal
    open.modal
    */

    // ----------------------------------------------
    // Selectors

    this.$backdrop     = null;
    this.$closeButtons = null;
    this.$dialog       = null;
    this.$modal        = null;

    // ----------------------------------------------
    // Init

    this.init();
}

Modal.prototype = {
    init: function (element) {
        this.createModal();
        this.addEvents();
        this.openModal();
    },

    addEvents: function () {
        var _this = this;

        // Click on backdrop to close
        if (this.config.allowBackdropClose) {
            this.$backdrop.on('click', function (e) {
                _this.closeModal();
                _this.$modal.trigger('closeBackdrop.modal');
            });
        }

        if (this.config.allowEscapeClose) {
            jQuery(document).on('keydown', function (e) {
                // Press "TAB" trap
                if (e.keyCode === 9) {
                    // [todo]
                }

                // Press "ESC" to close
                if (e.keyCode === 27) {
                    _this.closeModal();
                }
            });
        }

        // Click on "close buttons" to close
        this.$closeButtons.on('click', function (e) {
            e.preventDefault();
            _this.closeModal();
        });
    },

    closeModal: function () {
        var _this = this;

        // Start animating out
        this.$modal.attr('data-modal-state', 'closing');

        window.setTimeout(function () {
            // Close modal
            _this.$modal.attr('data-modal-state', 'closed');

            // Trigger custom event
            _this.$modal.trigger('close.modal');
            _this.destroyModal();
        }, this.config.transitionEndTime);
    },

    createModal: function () {
        var closeButton = [];
        var dialogHtml  = this.config.content;
        var id          = 'modal-' + Date.now();
        var widthClass  = 'modal_dialog--' + this.config.width;

        // Add close button to markup
        if (this.config.addCloseButton) {
            closeButton = [
                '<button type="button" class="modal_close" data-modal-close="true" aria-label="Close">',
                    this.config.closeButtonLabel,
                '</button>'
            ];
        }

        var template = [
            '<section class="modal" id="' + id + '" role="dialog" data-modal-state="closed">',
                '<div class="modal_dialog ' + widthClass + '">',
                    dialogHtml,
                    closeButton.join(''),
                '</div>',
                '<div class="modal_backdrop">',
                '</div>',
            '</section>'
        ];

        this.$modal = jQuery(template.join(''));

        this.$backdrop     = this.$modal.find('.modal_backdrop');
        this.$closeButtons = this.$modal.find('[data-modal-close="true"]');
        this.$dialog       = this.$modal.find('.modal_dialog');

        // Insert modal before </body>, which forces <body> to be positioning context for modals.
        jQuery('body').append(this.$modal);
        //document.body.appendChild(elemDiv);
    },

    destroyModal: function () {
        this.$modal.remove();
    },

    openModal: function () {
        var _this = this;

        // Open modal
        this.$modal.attr('data-modal-state', 'opening');
        this.setPosition();
        this.$modal.attr('data-modal-state', 'open');

        // Trigger custom event
        _this.$modal.trigger('open.modal');
    },

    setPosition: function () {
        var scrollOffset   = jQuery(document).scrollTop();
        var viewportHeight = jQuery(window).height();

        // When the modal has "visibility: visible" its height can be calculated.
        var modalHeight = this.$dialog.height();

        // ----------------------------------------------
        // Set the vertical position

        // Modal is taller than the viewport.
        if (modalHeight >= viewportHeight) {
            // Show 20px from top (will require page scrolling).
            this.$dialog.css('top', scrollOffset + 20 + 'px');
        }
        // Modal is shorter than the viewport.
        else {
            // Show centered vertically within the viewport.
            this.$dialog.css('top', scrollOffset + (viewportHeight / 2) - (modalHeight / 2) + 'px');
        }
    }
};
