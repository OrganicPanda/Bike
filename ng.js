angular.module('myApp', [])

  .controller('MyController', function($scope) {})

  .service('bikeData', function() {
    this.bike = {
      frontWheelRadius: 0,
      rearWheelRadius: 0,
      bottomBracketDrop: 0,
      seatTubeLength: 0,
      seatTubeAngle: 0,
      chainStayLength: 100,
      headTubeLength: 0,
      headTubeAngle: 0,
      stack: 0,
      reach: 0,
      rake: 0,
      upperLegLength: 0,
      lowerLegLength: 0
    };
  })

  .directive('opCanvasBike', function(bikeData) {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        var canvas = el[0]
          , parent = canvas.parentNode
          , width = parent.offsetWidth
          , height = parent.offsetHeight;

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        var bike = new CanvasBike(canvas)
          , controls = document.querySelector('#controls');

        bike.setRearWheelFloorPosition({ x: 101, y: 427 });
        bike.update();
        bike.render();

        $scope.$watchCollection(function() {
          return bikeData.bike;
        }, function() {
          console.log('bike changed');
        });
      }
    };
  })

  .directive('opBikeControls', function(bikeData) {
    return {
      restrict: 'A',
      link: function($scope, el, attrs) {
        $scope.bike = bikeData.bike;
      }
    };
  });