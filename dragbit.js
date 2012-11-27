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
    setDraggableListeners,
    startDragging,
    stopDragging,
    addListener,
    triggerEvent,
    sendToBack,
    bringToFront,
    continueDragging,
    addDocumentListeners,
    removeDocumentListeners;

  draggable = function ($element, $handle) {
    $handle = $handle || $element;
    $element.css("position", "absolute");
    setDraggableListeners($element);
    $handle.mousedown(function (e) {
      startDragging(e, $element);
    });
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

  addListener = function ($element, type) {
    return function (listener) {
      $element.draggableListeners[type].push(listener);
    };
  };

  triggerEvent = function (type, args) {
    var result = true;

    $.each($currentElement.draggableListeners[type], function () {
      if (this(args) === false) {
        result = false;
      }
    });

    return result;
  };

  addDocumentListeners = function () {
    document.addEventListener('mousemove', continueDragging);
    document.addEventListener('mouseup', stopDragging);
  };

  removeDocumentListeners = function () {
    document.removeEventListener('mousemove', continueDragging);
    document.removeEventListener('mouseup', stopDragging);
  };

  startDragging = function (e, $element) {
    var initialPosition, okToGoOn;

    if ($currentElement) {
      sendToBack($currentElement);
    }
    $currentElement = $element;
    bringToFront($element);

    initialPosition = $currentElement.position();
    $currentElement.css("left", initialPosition.left);
    $currentElement.css("top", initialPosition.top);
    $currentElement.lastXPosition = e.clientX;
    $currentElement.lastYPosition = e.clientY;

    okToGoOn = triggerEvent('start', {
      x: initialPosition.left,
      y: initialPosition.top,
      mouseEvent: e
    });
    if (!okToGoOn) {
      return;
    }

    addDocumentListeners();
  };

  continueDragging = function (e) {
    var elementXPosition = parseInt($currentElement.css("left"), 10),
      elementYPosition = parseInt($currentElement.css("top"), 10),
      elementNewXPosition = elementXPosition + (e.clientX - $currentElement.lastXPosition),
      elementNewYPosition = elementYPosition + (e.clientY - $currentElement.lastYPosition);

    $currentElement.css("left", elementNewXPosition);
    $currentElement.css("top", elementNewYPosition);

    $currentElement.lastXPosition = e.clientX;
    $currentElement.lastYPosition = e.clientY;

    triggerEvent('drag', {
      x: elementNewXPosition,
      y: elementNewYPosition,
      mouseEvent: e
    });
  };

  stopDragging = function(e) {
    removeDocumentListeners();

    triggerEvent('stop', {
      x: parseInt($currentElement.css("left"), 10),
      y: parseInt($currentElement.css("top"), 10),
      mouseEvent: e
    });
  };

  sendToBack = function ($element) {
    $element.css('z-index', fairlyHighZIndex - 1);
  };

  bringToFront = function ($element) {
    $element.css('z-index', fairlyHighZIndex);
  };


  return draggable;
}));
