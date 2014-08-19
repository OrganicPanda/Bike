angular.module('myApp', [])

  .directive('opBike', function() {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope) {
        var bike = new Bike();

        // TODO: un-hardcode this
        bike.setRearWheelFloorPosition({ x: 101, y: 427 });
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
          'frontWheel.radius', 'rearWheel.radius', 'bottomBracket.drop',
          'seatTube.length', 'seatTube.angle', 'chainStay.length',
          'headTube.length', 'headTube.angle', 'stack',
          'reach', 'rake', 'upperLegLength', 'lowerLegLength', 'pedalAngle'
        ].map(function(prop) {
          return 'bike.' + prop;
        }).join(',');

        $scope.$watchCollection('[' + props + ']', function() {
          $scope.bike.update();
        });
      }
    };
  });