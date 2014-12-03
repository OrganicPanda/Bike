(function(global) {
  var CanvasBike = global.CanvasBike = function(bike, canvas) {
    this.bike = bike;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.resize();

    this.renderFunction = this.render.bind(this);
    this.animationId = requestAnimationFrame(this.renderFunction);
  };

  CanvasBike.prototype.resize = function() {
    this.width = parseInt(this.canvas.getAttribute('width') || 500, 10);
    this.height = parseInt(this.canvas.getAttribute('height') || 500, 10);

    // Assuming HiDPI screen for now
    /*this.scale = 2;
    this.context.scale(this.scale, this.scale);
    this.canvas.style.width = (this.width / this.scale) + 'px';
    this.canvas.style.height = (this.height / this.scale) + 'px';*/
  };

  CanvasBike.prototype.resetCanvas = function() {
    // This clears all canvas state which is convenient
    // for transforms and the like that are relative.
    this.canvas.width = this.canvas.width;
  };

  CanvasBike.prototype.render = function() {
    this.resetCanvas();

    this.updateViewport();

    this.context.lineCap = 'round'; // butt (default), round, square
    this.context.lineJoin = 'round'; // round, bevel, miter (default)

    this.drawLeg('left', 'darkgreen');
    this.drawCrankarm('left');

    this.drawWheel('rearWheel');
    this.drawWheel('frontWheel');

    this.drawSeat();
    this.drawHandlebars();
    this.drawFrame();

    this.drawChainring();
    this.drawCrankarm('right');

    this.drawBody();
    this.drawHead();
    this.drawLeg('right');

    this.drawFloor();

    requestAnimationFrame(this.renderFunction);
  };

  CanvasBike.prototype.updateViewport = function() {
    // TODO: take height in to account and get rid of magic numbers
    var zoom = 0.8
      , leftMostMm = (this.bike.rearWheel.center.x -
                     (this.bike.rearWheel.tyre / 2))
      , rightMostMm = (this.bike.frontWheel.center.x +
                      (this.bike.frontWheel.tyre / 2))
      , topMostMm = (this.bike.head.center.y - this.bike.head.diameter)
      , bottomMostMm = this.bike.rearWheel.floor.y
      , bikeWidthMm = rightMostMm - leftMostMm
      , bikeHeightMm = bottomMostMm - topMostMm;

    // Which axis is most limited?
    var heightLimited = (bikeWidthMm / this.width) <
                        (bikeHeightMm / this.height);

    // We will want to base our scaling on the most limited axis
    var mmToPx, pxToMm;

    if (heightLimited) {
      mmToPx = (this.height / bikeHeightMm) * zoom;
      pxToMm = (bikeHeightMm / this.height) / zoom;
    } else {
      mmToPx = (this.width / bikeWidthMm) * zoom;
      pxToMm = (bikeWidthMm / this.width) / zoom;
    }

    var bikeWidthPx = bikeWidthMm * mmToPx
      , bikeHeightPx = bikeHeightMm * mmToPx
      , centerXPx = (this.width - bikeWidthPx) / 2
      , centerYPx = (this.height - bikeHeightPx) / 2
      , translateXMm = Math.abs(leftMostMm) + (centerXPx * pxToMm)
      , translateYMm = Math.abs(topMostMm) + (centerYPx * pxToMm);

    // After this we can draw on the canvas in mm
    this.context.scale(mmToPx, mmToPx);
    this.context.translate(translateXMm, translateYMm);
  };

  CanvasBike.prototype.beginPath = function(color, width) {
    this.context.strokeStyle = color || 'red';
    this.context.lineWidth = width || 26;
    this.context.beginPath();
  };

  CanvasBike.prototype.closePath = function() {
    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.moveTo = function(point) {
    this.context.moveTo(point.x, point.y);
  };

  CanvasBike.prototype.lineTo = function(point) {
    this.context.lineTo(point.x, point.y);
  };

  CanvasBike.prototype.circle = function(center, radius) {
    this.context.arc(
      center.x, center.y,
      radius, 0, 2 * Math.PI, false
    );
  };

  CanvasBike.prototype.quadraticCurveTo = function(control, to) {
    this.context.quadraticCurveTo(
      control.x, control.y,
      to.x, to.y
    );
  };

  CanvasBike.prototype.drawFloor = function() {
    this.beginPath('blue', 1);

    this.context.moveTo(-200, 0);
    this.context.lineTo(this.bike.frontWheel.floor.x + 200, 0);

    this.closePath();
  };

  CanvasBike.prototype.drawFrame = function() {
    this.beginPath('red');

    this.moveTo(this.bike.seatTube.top);
    this.lineTo(this.bike.bottomBracket);
    this.lineTo(this.bike.rearWheel.center);
    this.lineTo(this.bike.seatTube.top);
    this.lineTo(this.bike.headTube.top);
    this.lineTo(this.bike.headTube.bottom);
    this.lineTo(this.bike.bottomBracket);

    this.moveTo(this.bike.headTube.bottom);
    this.quadraticCurveTo(
      this.bike.straightFork.bottom,
      this.bike.frontWheel.center
    );

    this.closePath();
  };

  CanvasBike.prototype.drawWheel = function(wheel) {
    var tyreWidth =
      (this.bike[wheel].tyre - this.bike[wheel].diameter) / 2;

    this.beginPath('black', tyreWidth);

    this.circle(
      this.bike[wheel].center,
      ((this.bike[wheel].tyre - tyreWidth) / 2)
    );

    this.closePath();
  };

  CanvasBike.prototype.drawCrankarm = function(side) {
    this.beginPath('black');

    this.moveTo(this.bike.bottomBracket);
    this.lineTo(this.bike.ankle[side]);

    this.closePath();
  };

  CanvasBike.prototype.drawChainring = function() {
    this.beginPath('black');

    // TODO: What size should this really be?
    this.circle(this.bike.bottomBracket, this.bike.pedal.radius * 0.33);

    this.closePath();
  };

  CanvasBike.prototype.drawHandlebars = function() {
    this.beginPath('purple');

    this.moveTo(this.bike.headTube.top);
    this.lineTo(this.bike.headSet.top);
    this.lineTo(this.bike.stem.front);

    this.quadraticCurveTo(
      { x: this.bike.stem.front.x + this.bike.handlebar.reach,
        y: this.bike.stem.front.y },
      this.bike.handlebar.curve
    );
    this.quadraticCurveTo(
      { x: this.bike.stem.front.x + this.bike.handlebar.reach,
        y: this.bike.stem.front.y + this.bike.handlebar.drop },
      this.bike.handlebar.bottom
    );

    this.closePath();
  };

  CanvasBike.prototype.drawSeat = function() {
    this.beginPath('purple');

    this.moveTo(this.bike.seatTube.top);
    this.lineTo(this.bike.seatPost.top);
    this.lineTo(this.bike.seat.front);

    this.closePath();
  };

  CanvasBike.prototype.drawBody = function() {
    this.beginPath('green', 100);

    this.moveTo(this.bike.hip);
    this.lineTo(this.bike.shoulder);
    this.lineTo(this.bike.elbow.right);
    this.lineTo(this.bike.wrist);

    this.closePath();
  };

  CanvasBike.prototype.drawHead = function() {
    this.context.fillStyle = 'green';
    this.context.beginPath();

    this.circle(this.bike.head.center, this.bike.head.diameter);

    this.context.closePath();
    this.context.fill();
  };

  CanvasBike.prototype.drawLeg = function(leg, color) {
    this.beginPath(color || 'green', 100);

    this.moveTo(this.bike.ankle[leg]);
    this.lineTo(this.bike.knee[leg]);
    this.lineTo(this.bike.hip);

    this.closePath();
  };
})(window);