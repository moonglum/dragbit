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
    setPositionType,
    setDraggableListeners,
    startDragging,
    addListener,
    triggerEvent,
    sendToBack,
    bringToFront,
    addDocumentListeners,
    getInitialPosition,
    inPixels,
    cancelDocumentSelection,
    repositionElement,
    removeDocumentListeners;

  draggable = function ($element, $handle) {
    $handle = $handle || $element;
    setPositionType($element);
    setDraggableListeners($element);
    $handle.mousedown(function (event) {
      startDragging(event, $element);
    });
  };

  setPositionType = function ($element) {
    $element.css("position", "absolute");
  };

  setDraggableListeners = function ($element) {
    $element.draggableListeners = {
      start: [],
      drag: [],
      stop: []
    };
    $element.whenDragStarts = addListener($element, 'start');
    $element.whenDragging = addListener($element, 'drag');
    $element.whenDragStops = addListener($element, 'stop');
  };

  startDragging = function (event, $element) {
    var initialPosition, okToGoOn;

    if ($currentElement) {
      sendToBack($currentElement);
    }
    $currentElement = bringToFront($element);

    initialPosition = getInitialPosition($currentElement);
    $currentElement.css("left", inPixels(initialPosition.left));
    $currentElement.css("top", inPixels(initialPosition.top));
    $currentElement.lastXPosition = event.clientX;
    $currentElement.lastYPosition = event.clientY;

    okToGoOn = triggerEvent('start', {
      x: initialPosition.left,
      y: initialPosition.top,
      mouseEvent: event
    });
    if (!okToGoOn) {
      return;
    }

    addDocumentListeners();
  };

  addListener = function ($element, type) {
    return function (listener) {
      $element.draggableListeners[type].push(listener);
    };
  };

  triggerEvent = function (type, args) {
    var result = true,
      listeners = $currentElement.draggableListeners[type],
      i;

    for (i = listeners.length - 1; i >= 0; i -= 1) {
      if (listeners[i](args) === false) {
        result = false;
      }
    }
    return result;
  };

  sendToBack = function ($element) {
    var decreasedZIndex = fairlyHighZIndex - 1;
    $element.css('z-index', decreasedZIndex);
  };

  bringToFront = function ($element) {
    $element.css('z-index', fairlyHighZIndex);
    return $element;
  };

  addDocumentListeners = function () {
    document.addEventListener('selectstart', cancelDocumentSelection);
    document.addEventListener('mousemove', repositionElement);
    document.addEventListener('mouseup', removeDocumentListeners);
  };

  getInitialPosition = function ($element) {
    return $element.position();
  };

  inPixels = function (value) {
    return value + 'px';
  };

  cancelDocumentSelection = function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    event.returnValue = false;
    return false;
  };

  repositionElement = function (event) {
    var elementXPosition, elementYPosition, elementNewXPosition, elementNewYPosition;

    elementXPosition = parseInt($currentElement.css("left"), 10);
    elementYPosition = parseInt($currentElement.css("top"), 10);

    elementNewXPosition = elementXPosition + (event.clientX - $currentElement.lastXPosition);
    elementNewYPosition = elementYPosition + (event.clientY - $currentElement.lastYPosition);

    $currentElement.css("left", inPixels(elementNewXPosition));
    $currentElement.css("top", inPixels(elementNewYPosition));

    $currentElement.lastXPosition = event.clientX;
    $currentElement.lastYPosition = event.clientY;

    triggerEvent('drag', {
      x: elementNewXPosition,
      y: elementNewYPosition,
      mouseEvent: event
    });
  };

  removeDocumentListeners = function (event) {
    var left, top;

    document.removeEventListener('selectstart', cancelDocumentSelection);
    document.removeEventListener('mousemove', repositionElement);
    document.removeEventListener('mouseup', removeDocumentListeners);

    left = parseInt($currentElement.css("left"), 10);
    top = parseInt($currentElement.css("top"), 10);
    triggerEvent('stop', {
      x: left,
      y: top,
      mouseEvent: event
    });
  };

  return draggable;
}));
