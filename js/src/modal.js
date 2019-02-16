/**
* Gravity Department - Modal
* https://github.com/gravitydepartment/modal
*
* @author     Brendan Falkowski
* @copyright  2018 Gravity Department. All rights reserved.
*/


/**
 * @param {object} config - Configuration options
 */
function Modal (config) {
    this.config = {
        addCloseButton:     true,                  // {boolean} - Add a close link to the modal.
        allowBackdropClose: true,                  // {boolean} - Clicking the backdrop will close the modal.
        allowEscapeClose:   true,                  // {boolean} - Pressing "ESC" will close the modal.
        allowInnerScroll:   false,                 // {boolean} - The "modal_body" will be scrollable.
        class:              '',                    // {string}  - Class on "modal" element.
        closeButtonLabel:   '&times;',             // {string}  - "&times;|Close" - Label for the "close" link.
        content:            null,                  // {string}  - String of HTML content to render in the modal.
        id:                 'modal-' + Date.now(), // {string}  - ID on "modal" element.
        transitionEndTime:  500,                   // {number}  - Milliseconds for the modal transition to complete (duration + delay) as set in CSS.
        width:              'base'                 // {string}  - "base|fluid|s|l" - Max width of the modal.
    };

    // Extend default config
    this.config = Object.assign(this.config, config);

    // Selectors
    this.$backdrop     = null;
    this.$closeButtons = null;
    this.$dialog       = null;
    this.$modal        = null;

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
            this.$backdrop.addEventListener('click', function (e) {
                _this.closeModal();
            });
        }

        if (this.config.allowEscapeClose) {
            document.addEventListener('keydown', function (e) {
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
        for (var i = 0; i < this.$closeButtons.length; i++) {
          this.$closeButtons[i].addEventListener('click', function (e) {
              e.preventDefault();
              _this.closeModal();
          });
        }
    },

    closeModal: function () {
        var _this = this;

        // Start animating out
        this.setState('closing');

        window.setTimeout(function () {
            _this.setState('closed');

            var event = new CustomEvent('modal-closed', {'bubbles': true});
            _this.$modal.dispatchEvent(event);

            _this.destroyModal();
        }, this.config.transitionEndTime);
    },

    createModal: function () {
        var closeButton = [];
        var dialogHtml  = this.config.content;
        var widthClass  = 'modal_dialog--' + this.config.width;

        if (this.config.addCloseButton) {
            // Add close button to markup
            closeButton = [
                '<button type="button" class="modal_close" data-modal-close="true" aria-label="Close">',
                    this.config.closeButtonLabel,
                '</button>'
            ];
        }

        var template = [
            '<section class="modal ' + this.config.class + '" id="' + this.config.id + '" role="dialog" data-modal-state="closed">',
                '<div class="modal_dialog ' + widthClass + '">',
                    dialogHtml,
                    closeButton.join(''),
                '</div>',
                '<div class="modal_backdrop">',
                '</div>',
            '</section>'
        ];

        var fragment = document.createRange().createContextualFragment(template.join(''));
        document.body.appendChild(fragment);

        this.$modal        = document.getElementById(this.config.id);
        this.$backdrop     = this.$modal.querySelector('.modal_backdrop');
        this.$closeButtons = this.$modal.querySelectorAll('[data-modal-close="true"]');
        this.$dialog       = this.$modal.querySelector('.modal_dialog');
    },

    destroyModal: function () {
        this.$modal.parentNode.removeChild(this.$modal);
    },

    openModal: function () {
        var _this = this;

        // Open modal
        this.setState('opening');
        this.setPosition();
        this.setState('open');

        var event = new CustomEvent('modal-opened', {'bubbles': true});
        this.$modal.dispatchEvent(event);
    },

    setPosition: function () {
        var scrollOffset   = window.pageYOffset;
        var viewportHeight = window.innerHeight;

        // When the modal has "visibility: visible" its height can be calculated.
        var modalHeight = this.$dialog.offsetHeight;

        // ----------------------------------------------
        // Set the vertical position

        if (modalHeight >= viewportHeight) {
            // Modal is taller than the viewport.
            // Show 20px from top (will require page scrolling).
            this.$dialog.style.top = scrollOffset + 20 + 'px';
        } else {
            // Modal is shorter than the viewport.
            // Show centered vertically within the viewport.
            this.$dialog.style.top = scrollOffset + (viewportHeight / 2) - (modalHeight / 2) + 'px';
        }
    },

    /**
     * @param {string} state - "closed|closing|open|opening"
     */
    setState: function (state) {
        this.$modal.setAttribute('data-modal-state', state);
    }
};
