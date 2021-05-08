 'use strict';

  var teoriagiochi = angular.module('teoriagiochi', ['ngRoute']);
  teoriagiochi.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    });

  teoriagiochi.controller('matrixcontroller', ['$scope', '$log', function($scope, $log) {
                $scope.strat_player1 = 0;
                $scope.strat_player2 = 0;

                $scope.saveFunction = "updateStrat";
                $scope.updateStrat = function() {
                    $log.log("Update delle strategie");
                    var strat1 = parseInt(document.getElementById("strat1").value);
                    var strat2 = parseInt(document.getElementById("strat2").value);
                    $scope.strat_player1 = strat1;
                    $scope.strat_player2 = strat2;

                    console.log($scope.strat_player1)
                    console.log($scope.strat_player2)
                };
            }

  ]);



