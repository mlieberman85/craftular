'use strict';



var server = myApp.controller('MinecraftServerCtrl', ['$scope', '$routeParams', '$http', '$dialog', 'socket', function($scope, $routeParams, $http, $dialog, socket){

  $scope.status = "";
  $scope.console = [];

  socket.on('status', function(data){
    $scope.status = data;
  });

  socket.on('console', function(data){
    $scope.console.push(data);
  });

  $scope.startMinecraftServer = function(){
    socket.emit('startServer');
  };


}]);
