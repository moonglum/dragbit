# dragbit

*A jQuert Plugin to make your dom elements draggable.*

I've ran the tests in Chrome. If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

## Examples

DOM:

```html
<div id="elementToDrag">
  <div class="handle"></div>
</div>
```

To make the whole element draggable:

```js
$('#elementToDrag').draggable();
```

To make it draggable only when dragging the handle element:

```js
var $with_handle = $('#elementToDrag');
$with_handle.draggable({
  handle: $('span', with_handle)
});
```

## License

This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

## Credit

Thanks to Guilherme J. Tramontina for `draggable.js`, which is the base for this lib (it's using no framework)
