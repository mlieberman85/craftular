'use strict';



var server = myApp.controller('MinecraftServerCtrl', ['$scope', '$routeParams', '$http', '$dialog', 'socket', function($scope, $routeParams, $http, $dialog, socket){

  $scope.status = "";
  $scope.console = [];
  $scope.running = false;

  socket.on('status', function(data){
    $scope.status = data;
    $scope.running = !$scope.running;
  });

  socket.on('console', function(data){
    $scope.console.push(data);
  });

  $scope.startMinecraftServer = function(){
    socket.emit('startServer');
  };

  $scope.stopMinecraftServer = function(){
    socket.emit('stopServer');
  };

  $scope.consoleCommand = function(command){
    socket.emit('command', {command: command});
  };

}]);
