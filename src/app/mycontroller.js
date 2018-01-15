angular.module('myapp')
.controller('myctrl', ['$scope', '$interval', function($scope, $interval){
  $scope.currentTime = moment().format('DD MMM YYYY HH:mm:ss');
  $interval(function(){
    $scope.currentTime = moment().format('DD MMM YYYY HH:mm:ss');
  },1000);
}]);