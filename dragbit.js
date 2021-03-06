/*jslint browser: true,
         indent: 2,
         maxlen: 100 */
/*global jQuery */
(function ($) {
  "use strict";
  var $currentElement, $shadow, methods;

  methods = {
    fairlyHighZIndex: '10',

    setup: function ($element, settings) {
      $element.css("position", "absolute");
      $element.css("left", settings.originalPosition.left);
      $element.css("top", settings.originalPosition.top);

      $element.data("shadowMode", settings.shadowMode);
      $element.data("moveX", settings.moveX);
      $element.data("moveY", settings.moveY);
      $element.data("lockInContainer", settings.lockInContainer);
      $element.data("container", $element.parent());

      settings.handle.mousedown(function (e) {
        if (e.which === 1) { // only drag with left mouse button
          methods.startDragging(e, $element);
        }
      });

      $element.bind("dragStart", settings.dragStart);
      $element.bind("dragging", settings.dragging);
      $element.bind("dragStop", settings.dragStop);
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
      var originalPosition = $element.offset();
      if ($element.data("shadowMode")) {
        $shadow = $element.clone();
        $element.after($shadow);
        $shadow.css("opacity", 0.3);
      }
      $element.prependTo($("body"));
      $element.css("top", originalPosition.top);
      $element.css("left", originalPosition.left);

      methods.bringToFront($element);
      $currentElement = $element;
      methods.moveCurrentElement(e, $currentElement.offset());
      methods.addDocumentListeners();
      $currentElement.trigger("dragStart", $currentElement.offset());
    },

    continueDragging: function (e) {
      methods.moveCurrentElement(e, methods.calculateNewPosition(e));
      $currentElement.trigger("dragging", $currentElement.offset());
    },

    stopDragging: function (e) {
      if ($currentElement.data("shadowMode")) {
        $shadow.remove();
      }
      if ($currentElement.data("lockInContainer")) {
        var offset = $currentElement.offset();
        $currentElement.data("container").append($currentElement);
        $currentElement.css("left", offset.left - $currentElement.data("container").offset().left);
        $currentElement.css("top", offset.top - $currentElement.data("container").offset().top);
      }
      methods.removeDocumentListeners();
      $currentElement.trigger("dragStop", $currentElement.offset());
    },

    bringToFront: function ($element) {
      if ($currentElement) {
        $currentElement.css('z-index', methods.fairlyHighZIndex - 1);
      }
      $element.css('z-index', methods.fairlyHighZIndex);
    },

    moveCurrentElement: function (e, position) {
      window.getSelection().removeAllRanges(); // for Firefox
      if (!$currentElement.data("lockInContainer") || methods.checkBoundaries(position)) {
        if ($currentElement.data("moveX")) {
          $currentElement.css("left", position.left);
          $currentElement.data("lastXPosition", e.clientX);
        }

        if ($currentElement.data("moveY")) {
          $currentElement.css("top", position.top);
          $currentElement.data("lastYPosition", e.clientY);
        }
      }
    },

    checkBoundaries: function (position) {
      var allowed = true,
        $container = $currentElement.data("container"),
        container_top = $container.offset().top,
        container_left = $container.offset().left,
        container_width = parseInt($container.css("width"), 10),
        container_right = container_left + container_width,
        container_height = parseInt($container.css("height"), 10),
        container_bottom = $container.offset().top + container_height,
        element_top = position.top,
        element_left = position.left,
        element_width = parseInt($currentElement.css("width"), 10),
        element_right = element_left + element_width,
        element_height = parseInt($currentElement.css("height"), 10),
        element_bottom = element_top + element_height;

      if (container_top > element_top) {
        $currentElement.css("top", container_top + 1);
        allowed = false;
      }
      if (container_left > element_left) {
        $currentElement.css("left", container_left + 1);
        allowed = false;
      }
      if (container_right < element_right) {
        $currentElement.css("left", container_right - element_width - 1);
        allowed = false;
      }
      if (container_bottom < element_bottom) {
        $currentElement.css("top", container_bottom - element_height - 1);
        allowed = false;
      }

      return allowed;
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
    this.each(function () {
      var $element = $(this),
        settings = $.extend({
          handle: $element,
          dragStart: function () {},
          dragging: function () {},
          dragStop: function () {},
          shadowMode: false,
          moveX: true,
          moveY: true,
          lockInContainer: false,
          originalPosition: $element.position()
        }, options);

      // WEIRD: If you do not wait, the position will already be wrong
      setTimeout(function() {
        methods.setup($element, settings);
      }, 100);

    });

    return this;
  };
}(jQuery));
