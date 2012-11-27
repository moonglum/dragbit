/*jslint browser: true,
         indent: 2,
         maxlen: 100 */
/*global jQuery */
(function ($) {
  "use strict";
  var $currentElement, methods;

  methods = {
    fairlyHighZIndex: '10',

    draggable: function ($element, $handle) {
      $element.css("position", "absolute");
      $handle.mousedown(function (e) {
        methods.startDragging(e, $element);
      });
    },

    addDocumentListeners: function () {
      document.addEventListener('selectstart', methods.cancelDocumentSelection);
      document.addEventListener('mousemove', methods.continueDragging);
      document.addEventListener('mouseup', methods.stopDragging);
    },

    removeDocumentListeners: function () {
      document.removeEventListener('selectstart', methods.cancelDocumentSelection);
      document.removeEventListener('mousemove', methods.continueDragging);
      document.removeEventListener('mouseup', methods.stopDragging);
    },

    startDragging: function (e, $element) {
      methods.bringToFront($element);
      $currentElement = $element;
      methods.moveCurrentElement(e, $currentElement.position());
      methods.addDocumentListeners();
      $currentElement.trigger("dragStart", $currentElement.position());
    },

    continueDragging: function (e) {
      methods.moveCurrentElement(e, methods.calculateNewPosition(e));
      $currentElement.trigger("dragging", $currentElement.position());
    },

    stopDragging: function (e) {
      methods.removeDocumentListeners();
      $currentElement.trigger("dragStop", $currentElement.position());
    },

    bringToFront: function ($element) {
      if ($currentElement) {
        $currentElement.css('z-index', methods.fairlyHighZIndex - 1);
      }
      $element.css('z-index', methods.fairlyHighZIndex);
    },

    moveCurrentElement: function (e, position) {
      $currentElement.css("left", position.left);
      $currentElement.css("top", position.top);
      $currentElement.data("lastXPosition", e.clientX);
      $currentElement.data("lastYPosition", e.clientY);
    },

    calculateNewPosition: function (e) {
      var elementXPosition = parseInt($currentElement.css("left"), 10),
        elementYPosition = parseInt($currentElement.css("top"), 10);

      return {
        left: elementXPosition + (e.clientX - $currentElement.data("lastXPosition")),
        top: elementYPosition + (e.clientY - $currentElement.data("lastYPosition"))
      };
    },

    cancelDocumentSelection: function (e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.returnValue = false;
      return false;
    }
  };

  $.fn.draggable = function (options) {
    var settings = $.extend({
      handle: this
    }, options);

    methods.draggable(this, settings.handle);
    return this;
  };
}(jQuery));
