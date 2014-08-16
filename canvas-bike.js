(function(global) {
  var Bike = global.Bike;

  var CanvasBike = global.CanvasBike = function(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.resize();

    Bike.call(this);

    this.renderFunction = this.render.bind(this);
    this.animationId = requestAnimationFrame(this.renderFunction);
  };

  CanvasBike.prototype = Object.create(Bike.prototype);
  CanvasBike.prototype.constructor = CanvasBike;

  CanvasBike.prototype.resize = function() {
    this.width = parseInt(this.canvas.getAttribute('width') || 500, 10);
    this.height = parseInt(this.canvas.getAttribute('height') || 500, 10);

    // Assuming HiDPI screen for now
    /*this.scale = 1;
    this.context.scale(this.scale, this.scale);
    this.canvas.style.width = (this.width / this.scale) + 'px';
    this.canvas.style.height = (this.height / this.scale) + 'px';*/
  };

  CanvasBike.prototype.render = function() {
    this.context.clearRect(0, 0, this.width, this.height);

    /*if (imageLoaded == true) {
      this.context.drawImage(
        image,
        0, 0, image.width, image.height,
        0, 500 - imageHeight, imageWidth, imageHeight
      );
    }*/

    // Orange is computed
    // Yellow is debug

    this.drawCircle(this.rearWheel.center, this.rearWheel.radius, 'orange');
    this.drawCircle(this.frontWheel.center, this.frontWheel.radius, 'orange');
    this.drawCircle(this.frontWheel.center, this.rake, 'yellow');

    // Floor
    this.drawLine(
      { x: 0, y: this.rearWheel.floor.y },
      { x: this.width, y: this.rearWheel.floor.y },
      'yellow'
    );

    // Wheel center horizontal
    this.drawLine(
      { x: 0, y: this.rearWheel.center.y },
      { x: this.width, y: this.rearWheel.center.y },
      'yellow'
    );

    this.drawLine(this.rearWheel.center, this.bottomBracket, 'orange');
    this.drawLine(this.bottomBracket, this.seatTube.top, 'orange');
    this.drawLine(this.rearWheel.center, this.seatTube.top, 'orange');
    this.drawLine(this.seatTube.top, this.headTube.top, 'orange');
    this.drawLine(this.headTube.bottom, this.headTube.top, 'orange');
    this.drawLine(this.bottomBracket, this.headTube.bottom, 'orange');

    this.drawLine(this.headTube.bottom, this.frontWheel.center, 'yellow');
    this.drawLine(this.headTube.bottom, this.straightFork.bottom, 'yellow');

    this.drawQuadraticCurve(
      this.headTube.bottom,
      this.straightFork.bottom,
      this.frontWheel.center,
      'orange'
    );

    //this.drawLine(this.headTube.bottom, this.headSet.top, 'purple');
    this.drawLine(this.seatTube.top, this.seatPost.top, 'purple');
    this.drawLine(this.headSet.top, this.handlebar.left, 'purple');
    this.drawLine(this.handlebar.left, this.handlebar.right, 'purple');
    this.drawLine(this.seat.left, this.seat.right, 'purple');

    this.drawCircle(this.bottomBracket, this.pedal.radius / 2, 'pink');
    this.drawLine(this.bottomBracket, this.ankle, 'pink');

    this.drawLine(this.hip, this.cyclist.shoulder, 'green');
    this.drawLine(this.cyclist.shoulder, this.cyclist.elbow, 'green');
    this.drawLine(this.cyclist.elbow, this.handlebar.right, 'green');
    this.drawLine(this.hip, this.knee, 'green');
    this.drawLine(this.knee, this.ankle, 'green');

    requestAnimationFrame(this.renderFunction);
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
})(window);