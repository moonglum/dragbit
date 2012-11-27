# dragbit

*Make your dom elements draggable.*

## Examples

DOM:

```html
<div id="elementToDrag">
  <div class="handle"></div>
</div>
```

To make the whole element draggable:

```js
var $with_handle = $('#with_handle');
draggable($with_handle, $('span', with_handle));
```

To make it draggable only when dragging the handle element:

```js
var $events = $('#events');
var $info = $('p', events);
draggable($events);

$events.bind("dragStart", function(e, position) {
  $info.html('dragStart: ' + position.left + ', ' + position.top);
});
$events.bind("dragging", function(e, position) {
  $info.html('dragging: ' + position.left + ', ' + position.top);
});
$events.bind("dragStop", function(e, position) {
  $info.html('dragStop: ' + position.left + ', ' + position.top);
});
```

## AMD

If you are using AMD (e.g. require.js) this lib becomes a module. Otherwise it'll create a global `draggable`.

## Browser Compatibility

I've ran the tests in Chrome. If you find any incompatibility or want to support other browsers, please do a pull request with the fix! :-)

## License
This is licensed under the feel-free-to-do-whatever-you-want-to-do license.

## Credit

Thanks to Guilherme J. Tramontina for `draggable.js`, which is the base for this lib (it's using no framework)
