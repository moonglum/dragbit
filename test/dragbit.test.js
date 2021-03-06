/*jslint browser: true,
         indent: 2,
         maxlen: 100 */
/*global $,
         draggable,
         describe,
         expect,
         happen,
         beforeEach,
         afterEach,
         it,
         assertTopLeftPosition,
         MouseEvent */
describe('dragbit', function () {
  "use strict";
  var draggableBox,
    initialPosition = {
      top: 100,
      left: 100
    },
    dragElementTo;

  beforeEach(function () {
    draggableBox = $('<div style="width:100px;height:100px;">');
    draggableBox.css(initialPosition);
    $('body').append(draggableBox);
  });

  afterEach(function () {
    $(draggableBox).remove();
  });

  it('when making an element draggable, should set its position as absolute', function () {
    draggableBox.draggable();
    expect($(draggableBox).css('position')).to.be('absolute');
  });

  describe('when dragging an element to a new position', function () {
    it('should update the element\'s position', function () {
      draggableBox.draggable();
      dragElementTo(draggableBox, [310, 220]);

      var actualPosition = $(draggableBox).position();
      expect(actualPosition.top).to.be(220);
      expect(actualPosition.left).to.be(310);
    });

    var fairlyHighZIndex = '10';
    it('should bring the element to front', function () {
      draggableBox.draggable();
      dragElementTo(draggableBox);

      expect($(draggableBox).css('z-index')).to.be(fairlyHighZIndex);
    });

    it('should send the previous element to back', function () {
      var previousElement, decreasedZIndex;
      previousElement = $('<div style="width:100px;height:100px;position:fixed;">');
      $('body').append(previousElement);
      previousElement.draggable();
      draggableBox.draggable();
      dragElementTo(previousElement);

      dragElementTo(draggableBox, 0, 0);
      decreasedZIndex = fairlyHighZIndex - 1 + String();
      expect($(previousElement).css('z-index')).to.be(decreasedZIndex);
    });

    describe('should trigger events', function () {
      it('when drag starts', function (done) {
        draggableBox.draggable();
        draggableBox.bind("dragStart", function (e, position) {
          assertTopLeftPosition([position.left, position.top],
                                [initialPosition.left, initialPosition.top],
                                done
                               );
          expect(e.type).to.be("dragStart");
        });
        dragElementTo(draggableBox);
      });

      it('when dragging', function (done) {
        draggableBox.draggable();
        draggableBox.bind("dragging", function (e, position) {
          assertTopLeftPosition([position.left, position.top], [222, 111], done);
          expect(e.type).to.be("dragging");
        });
        dragElementTo(draggableBox, [222, 111]);
      });

      it('when drag stops', function (done) {
        draggableBox.draggable();
        draggableBox.bind("dragStop", function (e, position) {
          assertTopLeftPosition([position.left, position.top], [555, 666], done);
          expect(e.type).to.be("dragStop");
        });
        dragElementTo(draggableBox, [111, 222], [333, 444], [555, 666]);
      });

      function assertTopLeftPosition(actual, expected, done) {
        var error;
        try {
          expect(actual[0]).to.be(expected[0]);
          expect(actual[1]).to.be(expected[1]);
        } catch (e) {
          error = e;
        }
        done(error);
      }
    });
  });

  describe('when dragging an element with a handle to a new position', function () {
    var handle;

    beforeEach(function () {
      handle = $('<div style="height:20px;">');
      $(draggableBox).append(handle);

      draggableBox.draggable({handle: handle});
    });

    describe('via handle', function () {
      it('should update the element\'s position', function () {
        var newTopPosition, newLeftPosition, actualPosition;

        dragElementTo(handle, [50, 100]);

        newTopPosition = initialPosition.top + 100;
        newLeftPosition = initialPosition.left + 50;

        actualPosition = $(draggableBox).position();
        expect(actualPosition.top).to.be(newTopPosition);
        expect(actualPosition.left).to.be(newLeftPosition);
      });

    });

    describe('via the element itselft', function () {
      it('should not do anything', function () {
        dragElementTo(draggableBox, [200, 100]);

        var actualPosition = $(draggableBox).position();
        expect(actualPosition.top).to.be(initialPosition.top);
        expect(actualPosition.left).to.be(initialPosition.left);
      });
    });
  });

  dragElementTo = function (raw_element) {
    var element, points, downPosition, lastPoint, i;

    element = raw_element.get(0);
    points = (2 <= arguments.length) ? Array.prototype.slice.call(arguments, 1) : [];

    downPosition = $(element).position();
    happen.mousedown(element, { clientX: downPosition.left, clientY: downPosition.top });
    lastPoint = [downPosition.left, downPosition.top];
    for (i = 0; i < points.length; i += 1) {
      happen.mousemove(element, { clientX: points[i][0], clientY: points[i][1] });
      lastPoint = points[i];
    }
    happen.mouseup(element, { clientX: lastPoint[0], clientY: lastPoint[1] });
  };
});
