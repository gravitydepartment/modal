# GravDept Modal

Simple modals with useful options.

[![Gravity Department](http://gravitydept.com/_themes/gravdept/img/logo-footer.png)](http://gravitydept.com/)

## Demo

[todo]

## Features

- Create a modal from in-page HTML
- Create a modal manually on-the-fly
- Click the backdrop to close

## Dependencies

- None

## Usage

Include the script in your page (and polyfills for IE11):

```html
<script defer src="path/to/polyfill-custom-event.js"></script>
<script defer src="path/to/polyfill-object-assign.js"></script>
<script defer src="path/to/modal.js"></script>
```

### Create and open a modal immediately

```javascript
var content = [
    '<div class="modal_header">',
        '<h1>Modal Title</h1>',
    '</div>',
    '<div class="modal_body">',
        '<p>Nulla facilisi. Duis aliquet egestas purus in blandit.</p>',
    '</div>'
];

var modal = new Modal({
    content: content.join(''),
    width: 's'
});
```

### Set up modals to open via an event listener

Add modal triggers and content to your HTML:

```html
<button type="button" data-modal-trigger="example-modal">
    Show Modal
</button>

<script type="text/template" data-modal="example-modal">
    <div class="modal_header">
        <h1>Modal Title</h1>
    </div>

    <div class="modal_body">
        <p>
            Nulla facilisi. Duis aliquet egestas purus in blandit.
            Curabitur vulputate, ligula lacinia scelerisque tempor,
            lacus lacus ornare ante, ac egestas est urna sit amet arcu.
        </p>
    </div>

    <div class="modal_footer">
        <button type="button">
            Save
        </button>

        <button type="button" data-modal-close="true">
            Close
        </button>
    </div>
</script>
```

Add event listeners to trigger each modal:

```javascript
var modalTriggers = document.querySelectorAll('[data-modal-trigger]');

modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
        e.preventDefault();

        var settings = {};
        var modal    = trigger.getAttribute('data-modal-trigger');
        var width    = trigger.getAttribute('data-modal-width');

        settings.content = document.querySelector('[data-modal="' + modal + '"]').innerHTML;

        if (width) {
            settings.width = width;
        }

        new Modal(settings);
    });
});
```

## Documentation

### Configuration settings

```javascript
var settings = {
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
}
```

### Custom events

These events fire on the element assigned to `this.$modal`:

- `open.modal`
- `close.modal`
- `backdropClose.modal`
