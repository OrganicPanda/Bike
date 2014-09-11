angular.module('myApp', [])

  .directive('opBike', function() {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope) {
        var bike = new Bike();

        // TODO: un-hardcode this
        bike.setRearWheelFloorPosition({ x: 400, y: 1500 });
        bike.update();

        $scope.bike = bike;
      }
    };
  })

  .directive('opCanvasBike', function() {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        var canvas = el[0]
          , parent = canvas.parentNode
          , width = parent.offsetWidth
          , height = parent.offsetHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        var canvasBike = new CanvasBike($scope.bike, canvas);

        canvasBike.render();
      }
    };
  })

  .directive('opBikeControls', function() {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        // TODO: I don't love this
        var props = [
          'elbow.angle', 'torsoLength', 'upperArmLength', 'lowerArmLength',
          'upperLegLength', 'lowerLegLength', 'pedal.radius', 'pedal.angle',
          'bottomBracket.drop', 'seatTube.angle', 'seatTube.length',
          'chainStay.length', 'seatPost.length', 'seat.length',
          'headTube.angle', 'headTube.length', 'headSet.length', 'stem.length',
          'stem.angle', 'handlebar.drop', 'handlebar.reach',
          'frontWheel.diameter', 'rearWheel.center.x', 'rearWheel.center.y',
          'rearWheel.diameter', 'stack', 'reach', 'rake'
        ].map(function(prop) {
          return 'bike.' + prop;
        }).join(',');

        $scope.$watchCollection('[' + props + ']', function() {
          $scope.bike.update();
        });
      }
    };
  })

  .directive('opBikeAnimate', function() {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        var i = 0
          , pedalPoints = 1
          , pedalAngleDelta = Math.PI * 2 / pedalPoints
          , pedalAngle = 0
          , intervalID = null;

        el.on('click', function() {
          if (intervalID) {
            clearInterval(intervalID);
            intervalID = null;
          } else {
            intervalID = setInterval(function() {
              if (i == pedalPoints) {
                i = 0;
              }

              $scope.bike.pedal.angle = pedalAngle;
              $scope.bike.update();

              pedalAngle += pedalAngleDelta;
              i += 1;
            }, 1000 / 60);
          }
        });
      }
    };
  });