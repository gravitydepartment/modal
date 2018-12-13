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

- jQuery 1.10.2

## Usage

Include the script in your page:

```html
<script src="path/to/jquery-1.10.2.js"></script>
<script src="path/to/modal.js"></script>
```

Add modal markup to your HTML:

```html
<button type="button" data-modal="example-modal">
    Show Modal
</button>

<section class="modal" id="example-modal">
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
</section>
```

Initialize all modals within the page:

```javascript
if (jQuery().modal) {
    var $modalButtons = jQuery('[data-modal]');

    if ($modalButtons.length) {
        $modalButtons.modal();
    }
}
```

Or create a modal manually:

```javascript
var modalContent = [
    '<div class="modal_header">',
        '<h1>Modal Title</h1>',
    '</div>',
    '<div class="modal_body">',
        '<p>Nulla facilisi. Duis aliquet egestas purus in blandit.</p>',
    '</div>'
];

jQuery.fn.modal({
    contentInline: modalContent.join(''),
    maxWidth: 'medium',
    showImmediately: true,
    type: 'inline'
});
```

## Documentation

### Options

```javascript
var options = {
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
}
```

### Events

- open.modal
- opened.modal
- close.modal
- closed.modal
- backdropClose.modal
- contentUpdate.modal
