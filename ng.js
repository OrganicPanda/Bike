angular.module('myApp', [])

  .directive('opBike', function() {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope) {
        var bike = new Bike();

        // TODO: un-hardcode this
        bike.setRearWheelFloorPosition({ x: 0, y: 0 });
        bike.update();

        $scope.bike = bike;
      }
    };
  })

  .directive('opCanvasBike', function($window) {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        var canvas = el[0]
          , parent = canvas.parentNode;

        var setSize = function() {
          var width = parent.offsetWidth
            , height = parent.offsetHeight;

          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
        };

        setSize();

        var canvasBike = new CanvasBike($scope.bike, canvas);

        canvasBike.render();

        $window.addEventListener('resize', function() {
          setSize();
          canvasBike.resize();
        });
      }
    };
  })

  .directive('opBikeControls', function() {
    return {
      restrict: 'A',
      link: function($scope) {
        // TODO: I don't love this
        var props = [
          'bottomBracket.drop', 'seatTube.angle', 'seatTube.length',
          'chainStay.length',
          'headTube.angle', 'headTube.length', 'headSet.length',
          'handlebar.drop', 'handlebar.reach',
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

  .directive('opCyclistControls', function() {
    return {
      restrict: 'A',
      link: function($scope) {
        // TODO: I don't love this
        var props = [
          'elbow.angle', 'torsoLength', 'upperArmLength', 'lowerArmLength',
          'upperLegLength', 'lowerLegLength'
        ].map(function(prop) {
          return 'bike.' + prop;
        }).join(',');

        $scope.$watchCollection('[' + props + ']', function() {
          $scope.bike.update();
        });
      }
    };
  })

  .directive('opAdjustmentControls', function() {
    return {
      restrict: 'A',
      link: function($scope) {
        // TODO: I don't love this
        var props = [
          'pedal.radius', 'pedal.angle',
          'seatPost.length', 'seat.length',
          'stem.length', 'stem.angle'
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