# GravDept Modal

Simple modals with useful options.

[![Gravity Department](http://gravitydept.com/_themes/gravdept/img/logo-footer.png)](http://gravitydept.com/)

## Demo

[todo]

## Features

### Two ways to use

- Create a modal and open it immediately.
- Trigger preconfigured modals hidden in the document.

### UI and transitions

- The modal is positioned to best fit the viewport.
- The modal and backdrop are animated when opening and closing.
- Replace an open model with a pleasing transition.

### Behaviors

- Click the backdrop to close (can be disabled).
- Press <kbd>ESC</kbd> to close (can be disabled).
- Custom events are dispatched when opened and closed.
- On close, the modal HTML automatically removes itself.

### Accessible

- Uses `<section>` to isolate heading hierarchy.
- Uses `role="dialog"` attribute.
- Uses `aria-label` attribute for close buttons.

### Customization

- Pass a `config` object to override any default.
- Override SCSS vars for styling.

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

for (var i = 0; i < modalTriggers.length; i++) {
    modalTriggers[i].addEventListener('click', function (e) {
        e.preventDefault();

        var config = {};
        var modal  = this.getAttribute('data-modal-trigger');
        var width  = this.getAttribute('data-modal-width');

        config.content = document.querySelector('[data-modal="' + modal + '"]').innerHTML;

        if (width) {
            config.width = width;
        }

        new Modal(config);
    });
}
```

## Documentation

### Configuration options

```javascript
var config = {
    addCloseButton:     true,                  // {boolean} - Add a close link to the modal.
    allowBackdropClose: true,                  // {boolean} - Clicking the backdrop will close the modal.
    allowEscapeClose:   true,                  // {boolean} - Pressing "ESC" will close the modal.
    class:              '',                    // {string}  - Class on "modal" element.
    closeButtonLabel:   'Close',               // {string}  - Label for the "close" link.
    content:            null,                  // {string}  - String of HTML content to render in the modal.
    id:                 'modal-' + Date.now(), // {string}  - ID on "modal" element.
    transitionEndTime:  500,                   // {number}  - Milliseconds for the modal transition to complete (duration + delay) as set in CSS.
    width:              'base'                 // {string}  - "base|fluid|s|l" - Max width of the modal.
}
```

### Custom events

These events fire on the element assigned to `this.$modal` and bubble up:

- `modal-opened`
- `modal-closed`
