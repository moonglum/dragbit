# dragbit

*A jQuert Plugin to make your dom elements draggable.*

I've ran the tests in Chrome. If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

## Examples

DOM:

```html
<div id="elementToDrag">
  <div class="handle"></div>
  <p>I'll be dragged</p>
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

You can add the events `dragStart`, `dragging` and `dragStop` to the element via the normal `bind` of jQuery. You can also bind them when calling `draggable`:

```js
var $events = $('#elementToDrag');
var $info = $('p', events);
$events.draggable({
  dragStart: function(e, position) {
    $info.html('dragStart: ' + position.left + ', ' + position.top);
  },
  dragging: function(e, position) {
    $info.html('dragging: ' + position.left + ', ' + position.top);
  },
  dragStop: function(e, position) {
    $info.html('dragStop: ' + position.left + ', ' + position.top);
  }
});
```

## License

This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

## Credit

Thanks to Guilherme J. Tramontina for `draggable.js`, which is the base for this lib (it's using no framework)
