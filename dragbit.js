/*jslint browser: true,
         indent: 2,
         maxlen: 100 */
/*global $ */
(function (moduleName, definition) {
  "use strict";
  // Whether to expose dragbit as an AMD module or to the global object.
  if (typeof window.define === 'function' && typeof window.define.amd === 'object') {
    window.define(definition);
  } else {
    window[moduleName] = definition();
  }
}('draggable', function definition() {
  "use strict";
  var $currentElement,
    fairlyHighZIndex = '10',
    draggable,
    startDragging,
    stopDragging,
    addListener,
    bringToFront,
    calculateNewPosition,
    cancelDocumentSelection,
    continueDragging,
    moveCurrentElement,
    addDocumentListeners,
    removeDocumentListeners;

  draggable = function ($element, $handle) {
    $handle = $handle || $element;
    $element.css("position", "absolute");
    $handle.mousedown(function (e) {
      startDragging(e, $element);
    });
  };

  addDocumentListeners = function () {
    document.addEventListener('selectstart', cancelDocumentSelection);
    document.addEventListener('mousemove', continueDragging);
    document.addEventListener('mouseup', stopDragging);
  };

  removeDocumentListeners = function () {
    document.removeEventListener('selectstart', cancelDocumentSelection);
    document.removeEventListener('mousemove', continueDragging);
    document.removeEventListener('mouseup', stopDragging);
  };

  startDragging = function (e, $element) {
    bringToFront($element);
    $currentElement = $element;
    moveCurrentElement(e, $currentElement.position());
    addDocumentListeners();
    $currentElement.trigger("dragStart", $currentElement.position());
  };

  continueDragging = function (e) {
    moveCurrentElement(e, calculateNewPosition(e));
    $currentElement.trigger("dragging", $currentElement.position());
  };

  stopDragging = function (e) {
    removeDocumentListeners();
    $currentElement.trigger("dragStop", $currentElement.position());
  };

  bringToFront = function ($element) {
    if ($currentElement) {
      $currentElement.css('z-index', fairlyHighZIndex - 1);
    }
    $element.css('z-index', fairlyHighZIndex);
  };

  moveCurrentElement = function (e, position) {
    $currentElement.css("left", position.left);
    $currentElement.css("top", position.top);
    $currentElement.data("lastXPosition", e.clientX);
    $currentElement.data("lastYPosition", e.clientY);
  };

  calculateNewPosition = function (e) {
    var elementXPosition = parseInt($currentElement.css("left"), 10),
      elementYPosition = parseInt($currentElement.css("top"), 10),
      elementNewXPosition = elementXPosition + (e.clientX - $currentElement.data("lastXPosition")),
      elementNewYPosition = elementYPosition + (e.clientY - $currentElement.data("lastYPosition"));

    return {left: elementNewXPosition, top: elementNewYPosition};
  };

  cancelDocumentSelection = function (e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.returnValue = false;
    return false;
  };

  return draggable;
}));
