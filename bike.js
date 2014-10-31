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
    intersection: function(x0, y0, r0, x1, y1, r1, decider) {
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

      if (decider(xi, xi_prime, yi, yi_prime)) {
        return { x: xi, y: yi };
      } else {
        return { x: xi_prime, y: yi_prime };
      }
    },

    // From: http://nayuki.eigenstate.org/res/triangle-solver-javascript/
    // triangle-solver.js
    degToRad: function(x) {
      return x / 180 * Math.PI;
    },

    // From: http://nayuki.eigenstate.org/res/triangle-solver-javascript/
    // triangle-solver.js
    solveSide: function(a, b, C) {
      return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
    },

    posOnCircle: function(center, radius, angle) {
      return {
        x: (radius * Math.cos(angle)) + center.x,
        y: (radius * Math.sin(angle)) + center.y
      };
    }
  };

  var Bike = global.Bike = function() {
    // Everything is millimeters or degrees
    //
    // Cyclist size is average
    // http://brownstudio12.files.wordpress.com/2012/03/human_standard_l.jpg
    // Head position is ... complicated
    //
    // Bike size is medium
    // http://www.boardmanbikes.com/road/air98_Di2.html
    // Drop bars are traditional
    // http://www.slowtwitch.com/images/glinks/articles/WhatWeNoticed/zippdropdiagram.jpg
    // Wheels are 700c
    // https://www.hybikes.com/wp-content/uploads/2014/06/Bicycle_tire_size_markings-en.png
    //
    // Unknowns:
    // Saddle height (adjustable but not sure what a 'normal' range is)
    // Headset length
    // Stem angle
    // Wheel / Tyre:
    // --> Tyre inch size tells us (total height x tyre height x tyre width):
    //                             (28           x 1 5/8       x 1 1/4)
    // --> That tells us total height (28in): 711.2mm
    // --> We know rim size (700c): 622mm
    // --> So tyre height is ((711.2mm - 622mm) / 2): 44.6
    // --> 44.6mm doesn't match 1 5/8 (41.27500mm) and I'm not sure why!?
    // --> My tyres are ~25mm (28-622) and my wife's are ~30mm (32-622)
    // --> Might as well just use that number?
    // --> Going for 700c-28c for now (622mm + 28mm + 28mm): 678mm
    this.ankle = {
      right: { x: null, y: null },
      left: { x: null, y: null }
    };
    this.knee = {
      right: { x: null, y: null },
      left: { x: null, y: null }
    };
    this.pedal = { radius: 172.5, angle: 0 }; // crank length 172.5
    this.hip = { x: null, y: null };
    this.wrist = { x: null, y: null };
    this.elbow = {
      right: { x: null, y: null },
      angle: 150
    };
    this.head = { center: { x: null, y: null }, offset: 190 }; // TODO: proportion
    this.shoulder = { x: null, y: null };
    this.torsoLength = 455;
    this.upperArmLength = 280;
    this.lowerArmLength = 255;
    this.upperLegLength = 425;
    this.lowerLegLength = 410;
    this.kneeSide = 'right';

    this.bottomBracket = { x: null, y: null, drop: 68 };
    this.seatTube = {
      top: { x: null, y: null },
      angle: 73,
      length: 520
    };
    this.chainStay = { length: 405 };
    this.seatPost = {
      top: { x: null, y: null },
      length: 125
    };
    this.seat = {
      back: { x: null, y: null },
      front: { x: null, y: null },
      length: 75
    };
    this.headTube = {
      bottom: { x: null, y: null },
      top: { x: null, y: null },
      angle: 73,
      length: 150
    };
    this.headSet = { top: { x: null, y: null }, length: 50 };
    this.stem = { front: { x: null, y: null }, length: 110, angle: 5 };
    this.handlebar = {
      curve: { x: null, y: null },
      bottom: { x: null, y: null },
      drop: 130,
      reach: 87.5
    };
    this.straightFork = { bottom: { x: null, y: null } };
    this.frontWheel = {
      floor: { x: null, y: null },
      center: { x: null, y: null },
      diameter: 622,
      tyre: 678
    };
    this.rearWheel = {
      floor: { x: 0, y: 0 },
      center: { x: null, y: null },
      diameter: 622,
      tyre: 678
    };
    this.stack = 553;
    this.reach = 392;
    this.rake = 43;
  };

  Bike.prototype.updateRearWheel = function() {
    this.rearWheel.center = {
      x: this.rearWheel.floor.x,
      y: (this.rearWheel.floor.y - (this.rearWheel.tyre / 2))
    };
  };

  Bike.prototype.updateBottomBracket = function() {
    // The bottom bracket position can be computed relative to the rear wheel
    // center using the chain stay length and the bottom bracket drop
    this.bottomBracket.x = this.rearWheel.center.x + trig.hypot(
      this.bottomBracket.drop,
      this.chainStay.length
    );
    this.bottomBracket.y = this.rearWheel.center.y + this.bottomBracket.drop;
  };

  Bike.prototype.updateSeatTube = function() {
    // The top of the seat tube is calculated relative to the bottom bracket
    // using the seat tube angle and length
    var seatTubeAngleRad = trig.degToRad(this.seatTube.angle)
      , seatTubeHeight = Math.sin(seatTubeAngleRad) * this.seatTube.length
      , seatTubeWidth = Math.cos(seatTubeAngleRad) * this.seatTube.length;

    this.seatTube.top.x = this.bottomBracket.x - seatTubeWidth;
    this.seatTube.top.y = this.bottomBracket.y - seatTubeHeight;
  };

  Bike.prototype.updateSeatPost = function() {
    // The top of the seat post is calculated relative to the top of the
    // seat tube using the seat tube angle and seat post length
    var seatPostAngleRad = trig.degToRad(this.seatTube.angle)
      , seatPostHeight = Math.sin(seatPostAngleRad) * this.seatPost.length
      , seatPostWidth = Math.cos(seatPostAngleRad) * this.seatPost.length;

    this.seatPost.top.x = this.seatTube.top.x - seatPostWidth;
    this.seatPost.top.y = this.seatTube.top.y - seatPostHeight;
  };

  Bike.prototype.updateSeat = function() {
    // The back of the seat meets the top of the seat post for now.
    // Assuming it's straight as well
    this.seat.back.x = this.seatPost.top.x;
    this.seat.back.y = this.seatPost.top.y;
    this.seat.front.x = this.seat.back.x + this.seat.length;
    this.seat.front.y = this.seat.back.y;
  };

  Bike.prototype.updateHeadTube = function() {
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
  };

  Bike.prototype.updateHeadSet = function() {
    // The top of the head set is calculated relative to the top of the
    // head tube using the head tube angle and head set length
    var headSetAngleRad = trig.degToRad(this.headTube.angle)
      , headSetHeight = Math.sin(headSetAngleRad) * this.headSet.length
      , headSetWidth = Math.cos(headSetAngleRad) * this.headSet.length;

    this.headSet.top.x = this.headTube.top.x - headSetWidth;
    this.headSet.top.y = this.headTube.top.y - headSetHeight;
  };

  Bike.prototype.updateStem = function() {
    // The top of the head set is calculated relative to the top of the
    // head tube using the head tube angle and head set length
    var stemAngleRad = trig.degToRad(this.stem.angle)
      , stemHeight = Math.sin(stemAngleRad) * this.stem.length
      , stemWidth = Math.cos(stemAngleRad) * this.stem.length;

    this.stem.front.x = this.headSet.top.x + stemWidth;
    this.stem.front.y = this.headSet.top.y - stemHeight;
  };

  Bike.prototype.updateHandlebar = function() {
    this.handlebar.bottom.x = this.stem.front.x;
    this.handlebar.bottom.y = this.stem.front.y + this.handlebar.drop;

    this.handlebar.curve.x = this.stem.front.x + this.handlebar.reach;
    this.handlebar.curve.y = this.stem.front.y + (this.handlebar.drop / 2);
  };

  Bike.prototype.updateRake = function() {
    // Rake is a bit more complicated. We need 2 steps

    // First let's find the point at which the fork would meet the
    // center of the wheel if it were straight and the same angle
    // as the headtube. We'll call this straightFork.bottom. This is a simple
    // triangle
    var headTubeAngleRad = trig.degToRad(this.headTube.angle) // TODO: DRY
      , straightForkHeight = this.rearWheel.center.y - this.headTube.bottom.y
      , straightForkWidth = Math.cos(headTubeAngleRad) * straightForkHeight;

    this.straightFork.bottom = {
      x: this.headTube.bottom.x + straightForkWidth,
      y: this.rearWheel.floor.y - (this.frontWheel.tyre / 2)
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
      y: this.frontWheel.center.y + (this.frontWheel.tyre / 2)
    };
  };

  Bike.prototype.updateLegs = function() {
    // The hip is fixed to the back of the seat for now
    this.hip.x = this.seat.back.x;
    this.hip.y = this.seat.back.y;

    this.ankle.right = trig.posOnCircle(
      this.bottomBracket, this.pedal.radius, trig.degToRad(this.pedal.angle)
    );

    this.ankle.left = trig.posOnCircle(
      this.bottomBracket, this.pedal.radius, trig.degToRad(this.pedal.angle - 180)
    );

    // This is the clever bit
    // We know 2 points (hip and ankle) and the length of the
    // upper and lower leg so we can draw 2 circles and see where they overlap
    // There points will be our possible knee points
    this.knee.right = trig.intersection(
      this.hip.x, this.hip.y,
      this.upperLegLength,
      this.ankle.right.x, this.ankle.right.y,
      this.lowerLegLength,
      function(x1, x2, y1, y2) { return x1 > x2; }
    );

    this.knee.left = trig.intersection(
      this.hip.x, this.hip.y,
      this.upperLegLength,
      this.ankle.left.x, this.ankle.left.y,
      this.lowerLegLength,
      function(x1, x2, y1, y2) { return x1 > x2; }
    );
  };

  Bike.prototype.updateArms = function() {
    // The wrist is fixed to the handlebar for now
    this.wrist.x = this.handlebar.curve.x;
    this.wrist.y = this.handlebar.curve.y;

    // We know:
    // - torso length
    // - upper/lower arm lengths
    // - elbow angle

    // Work out the straight-line distance from wrist to shoulder
    var elbowAngleRad = trig.degToRad(this.elbow.angle)
      , armLength = trig.solveSide(
          this.upperArmLength, this.lowerArmLength, elbowAngleRad
        );

    // Work out where that would meet the torso
    this.shoulder = trig.intersection(
      this.wrist.x, this.wrist.y,
      armLength,
      this.hip.x, this.hip.y,
      this.torsoLength,
      function(x1, x2, y1, y2) { return y1 < y2; }
    );

    // Now that we have the shoulder position we can do the
    // same for the elbow
    this.elbow.right = trig.intersection(
      this.shoulder.x, this.shoulder.y,
      this.upperArmLength,
      this.wrist.x, this.wrist.y,
      this.lowerArmLength,
      function(x1, x2, y1, y2) { return y1 > y2; }
    );

    // Now do the head
    // Work out the angle of the back in radians
    var backAngleRad = Math.atan2(
      this.shoulder.y - this.hip.y,
      this.shoulder.x - this.hip.x
    );

    // Use that angle to build a triangle from the shoulder
    var headHeight = Math.sin(backAngleRad) * this.head.offset
      , headWidth = Math.cos(backAngleRad) * this.head.offset;

    this.head.center.x = this.shoulder.x + headWidth;
    this.head.center.y = this.shoulder.y + headHeight;
  };

  Bike.prototype.update = function() {
    this.updateRearWheel();
    this.updateBottomBracket();
    this.updateSeatTube();
    this.updateSeatPost();
    this.updateSeat();
    this.updateHeadTube();
    this.updateHeadSet();
    this.updateStem();
    this.updateHandlebar();
    this.updateRake();
    this.updateLegs();
    this.updateArms();
  };
})(window);