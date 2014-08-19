(function(global) {
  var trig = {
    // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
    // Reference/Global_Objects/Math/hypot
    hypot: function() {
      var y = 0, i;
      for (i in arguments) {
        y += arguments[i] * arguments[i];
      }
      return Math.sqrt(y);
    },

    // From: http://stackoverflow.com/a/12221389
    intersection: function(x0, y0, r0, x1, y1, r1) {
      var a, dx, dy, d, h, rx, ry;
      var x2, y2;

      // dx and dy are the vertical and horizontal distances between
      // the circle centers.
      dx = x1 - x0;
      dy = y1 - y0;

      // Determine the straight-line distance between the centers.
      d = Math.sqrt((dy*dy) + (dx*dx));

      // Is it possible?
      if (d > (r0 + r1) || d < Math.abs(r0 - r1)) {
         return false;
      }

      // 'point 2' is the point where the line through the circle
      // intersection points crosses the line between the circle
      // centers.

      // Determine the distance from point 0 to point 2.
      a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

      // Determine the coordinates of point 2.
      x2 = x0 + (dx * a/d);
      y2 = y0 + (dy * a/d);

      // Determine the distance from point 2 to either of the
      // intersection points.
      h = Math.sqrt((r0*r0) - (a*a));

      // Now determine the offsets of the intersection points from
      // point 2.
      rx = -dy * (h/d);
      ry = dx * (h/d);

      // Determine the absolute intersection points.
      var xi = x2 + rx;
      var xi_prime = x2 - rx;
      var yi = y2 + ry;
      var yi_prime = y2 - ry;

      return [xi, xi_prime, yi, yi_prime];
    },

    // From: http://nayuki.eigenstate.org/res/triangle-solver-javascript/
    // triangle-solver.js
    degToRad: function(x) {
      return x / 180 * Math.PI;
    }
  };

  var Bike = global.Bike = function() {
    this.cyclist = {
      shoulder: { x: 250, y: 130 },
      elbow: { x: 275, y: 170 }
    };
    this.ankle = { x: 200, y: 400 };
    this.knee = { x: 200, y: 200 };
    this.pedal = { radius: 30, angle: 0 };
    this.hip = { x: 170, y: 200 };
    this.bottomBracket = { x: null, y: null, drop: 20 };
    this.seatTube = {
      top: { x: null, y: null },
      angle: 73,
      length: 150
    };
    this.chainStay = { length: 110 };
    this.seatPost = { top: { x: 165, y: 200 } };
    this.seat = {
      left: { x: 160, y: 200 },
      right: { x: 180, y: 200 }
    };
    this.headTube = {
      bottom: { x: null, y: null },
      top: { x: null, y: null },
      angle: 73,
      length: 10
    };
    this.headSet = { top: { x: 338, y: 200 } };
    this.handlebar = {
      left: { x: 358, y: 200 },
      right: { x: 348, y: 210 }
    };
    this.straightFork = { bottom: { x: null, y: null } };
    this.frontWheel = {
      floor: { x: null, y: null },
      center: { x: null, y: null },
      radius: 96
    };
    this.rearWheel = {
      floor: { x: null, y: null },
      center: { x: null, y: null },
      radius: 96
    };
    this.stack = 150;
    this.reach = 150;
    this.rake = 10;

    this.upperLegLength = 110;
    this.lowerLegLength = 110;

    this.pedalAngle = 90;

    this.kneeSide = 'right';
  };

  // Entry position from which everything else will be computed
  Bike.prototype.setRearWheelFloorPosition = function(pos) {
    this.rearWheel.floor = pos;
  };

  Bike.prototype.update = function() {
    this.rearWheel.center = {
      x: this.rearWheel.floor.x,
      y: (this.rearWheel.floor.y - this.rearWheel.radius)
    };

    // The bottom bracket position can be computed relative to the rear wheel
    // center using the chain stay length and the bottom bracket drop
    this.bottomBracket.x = this.rearWheel.center.x + trig.hypot(
      this.bottomBracket.drop,
      this.chainStay.length
    );
    this.bottomBracket.y = this.rearWheel.center.y + this.bottomBracket.drop;

    // The top of the seat tube is calculated relative to the bottom bracket
    // using the seat tube angle and length
    var seatTubeAngleRad = trig.degToRad(this.seatTube.angle)
      , seatTubeHeight = Math.sin(seatTubeAngleRad) * this.seatTube.length
      , seatTubeWidth = Math.cos(seatTubeAngleRad) * this.seatTube.length;

    this.seatTube.top.x = this.bottomBracket.x - seatTubeWidth;
    this.seatTube.top.y = this.bottomBracket.y - seatTubeHeight;

    // The top of the head tube is decided relative to the bottom bracket
    // using a rectangle of the stack (height) and reach (width)
    this.headTube.top.x = this.bottomBracket.x + this.reach;
    this.headTube.top.y = this.bottomBracket.y - this.stack;

    // The bottom of the head tube is calculated relative to the top of the
    // head tube using the head tube angle and length
    var headTubeAngleRad = trig.degToRad(this.headTube.angle)
      , headTubeHeight = Math.sin(headTubeAngleRad) * this.headTube.length
      , headTubeWidth = Math.cos(headTubeAngleRad) * this.headTube.length;

    this.headTube.bottom.x = this.headTube.top.x + headTubeWidth;
    this.headTube.bottom.y = this.headTube.top.y + headTubeHeight;

    // Rake is a bit more complicated. We need 2 steps

    // First let's find the point at which the fork would meet the
    // center of the wheel if it were straight and the same angle
    // as the headtube. We'll call this straightFork.bottom. This is a simple
    // triangle
    var straightForkHeight = this.rearWheel.center.y - this.headTube.bottom.y
      , straightForkWidth = Math.cos(headTubeAngleRad) * straightForkHeight;

    this.straightFork.bottom = {
      x: this.headTube.bottom.x + straightForkWidth,
      y: this.rearWheel.floor.y - this.frontWheel.radius
    };

    // Now using that point we can get the real center by constructing
    // another triangle that uses the rake length
    var rakeXDelta = (1 / Math.sin(headTubeAngleRad)) * this.rake;

    this.frontWheel.center = {
      x: this.straightFork.bottom.x + rakeXDelta,
      y: this.straightFork.bottom.y
    };

    this.frontWheel.floor = {
      x: this.frontWheel.center.x,
      y: this.frontWheel.center.y + this.frontWheel.radius
    };

    this.updateLegs();
  };

  Bike.prototype.updateLegs = function() {
    var angleRad = trig.degToRad(this.pedalAngle);

    this.ankle.x = (this.pedal.radius * Math.cos(angleRad))
                    + this.bottomBracket.x;
    this.ankle.y = (this.pedal.radius * Math.sin(angleRad))
                    + this.bottomBracket.y;

    // This is the clever bit
    // We know 2 points (hip and ankle) and the length of the
    // upper and lower leg so we can draw 2 circles and see where they overlap
    // There points will be our possible knee points
    var knees = trig.intersection(
      this.hip.x, this.hip.y,
      this.upperLegLength,
      this.ankle.x, this.ankle.y,
      this.lowerLegLength);

    // There will be 2 overlaps so decide which one is right
    if (this.kneeSide == 'right') {
      this.knee.x = knees[1];
      this.knee.y = knees[3];
    } else {
      this.knee.x = knees[0];
      this.knee.y = knees[2];
    }
  };
})(window);