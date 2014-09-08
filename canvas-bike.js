(function(global) {
  var CanvasBike = global.CanvasBike = function(bike, canvas) {
    this.bike = bike;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.context.lineWidth = 10;
    this.context.lineCap = 'round'; // butt (default), round, square
    this.context.lineJoin = 'round'; // round, bevel, miter (default)

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

  CanvasBike.prototype.render = function() {
    this.context.clearRect(0, 0, this.width, this.height);

    this.drawLine(
      this.bike.hip, this.bike.knee.left, 'green');
    this.drawLine(
      this.bike.knee.left, this.bike.ankle.left, 'green');

    this.drawCircle(
      this.bike.rearWheel.center, this.bike.rearWheel.radius, 'orange');
    this.drawCircle(
      this.bike.frontWheel.center, this.bike.frontWheel.radius, 'orange');

    this.drawFrame('orange');

    this.drawQuadraticCurve(
      this.bike.headTube.bottom,
      this.bike.straightFork.bottom,
      this.bike.frontWheel.center,
      'orange'
    );

    this.drawLine(
      this.bike.seatTube.top, this.bike.seatPost.top, 'orange');
    this.drawLine(
      this.bike.seat.back, this.bike.seat.front, 'orange');
    this.drawLine(
      this.bike.headTube.top, this.bike.headSet.top, 'orange');
    this.drawLine(
      this.bike.headSet.top, this.bike.stem.front, 'orange');
    this.drawQuadraticCurve(
      this.bike.stem.front,
      { x: this.bike.stem.front.x + this.bike.handlebar.reach,
        y: this.bike.stem.front.y },
      this.bike.handlebar.curve,
      'orange'
    );
    this.drawQuadraticCurve(
      this.bike.handlebar.curve,
      { x: this.bike.stem.front.x + this.bike.handlebar.reach,
        y: this.bike.stem.front.y + this.bike.handlebar.drop },
      this.bike.handlebar.bottom,
      'orange'
    );

    this.drawCircle(
      this.bike.bottomBracket, this.bike.pedal.radius / 2, 'pink');
    this.drawLine(
      this.bike.ankle.right, this.bike.ankle.left, 'pink');

    this.drawCyclist('green');

    requestAnimationFrame(this.renderFunction);
  };

  CanvasBike.prototype.moveTo = function(point) {
    this.context.moveTo(point.x, point.y);
  };

  CanvasBike.prototype.lineTo = function(point) {
    this.context.lineTo(point.x, point.y);
  };

  CanvasBike.prototype.drawFrame = function(color) {
    this.context.beginPath();
    this.context.strokeStyle = color || 'black';

    this.moveTo(this.bike.seatTube.top);
    this.lineTo(this.bike.bottomBracket);
    this.lineTo(this.bike.rearWheel.center);
    this.lineTo(this.bike.seatTube.top);
    this.lineTo(this.bike.headTube.top);
    this.lineTo(this.bike.headTube.bottom);
    this.lineTo(this.bike.bottomBracket);

    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.drawCyclist = function(color) {
    this.context.beginPath();
    this.context.strokeStyle = color || 'black';

    this.lineTo(this.bike.ankle.right);
    this.lineTo(this.bike.knee.right);
    this.lineTo(this.bike.hip);
    this.lineTo(this.bike.shoulder);
    this.lineTo(this.bike.elbow.right);
    this.lineTo(this.bike.wrist);

    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.drawLine = function(from, to, color) {
    this.context.beginPath();
    this.context.strokeStyle = color || 'black';
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.drawCircle = function(center, radius, color) {
    this.context.beginPath();
    this.context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    this.context.strokeStyle = color || 'black';
    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.drawQuadraticCurve = function(from, control, to, color) {
    this.context.beginPath();
    this.context.strokeStyle = color || 'black';
    this.context.moveTo(from.x, from.y);
    this.context.quadraticCurveTo(
      control.x, control.y,
      to.x, to.y
    );
    this.context.stroke();
    this.context.closePath();
  };

  CanvasBike.prototype.drawBezierCurve = function(from, control1, control2, to, color) {
    this.context.beginPath();
    this.context.strokeStyle = color || 'black';
    this.context.moveTo(from.x, from.y);
    this.context.bezierCurveTo(
      control1.x, control1.y,
      control2.x, control2.y,
      to.x, to.y
    );
    this.context.stroke();
    this.context.closePath();
  };
})(window);