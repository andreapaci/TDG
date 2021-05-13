 'use strict';

  var teoriagiochi = angular.module('teoriagiochi', ['ngRoute']);
  teoriagiochi.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    });

  teoriagiochi.controller('matrixcontroller', ['$scope', '$log', '$http', function($scope, $log, $http) {
                $scope.strat_player1 = 0;
                $scope.strat_player2 = 0;
                $scope.loaded = false;

                $scope.saveFunction = "updateStrat";
                $scope.updateStrat = function() {
                    $log.log("Update delle strategie");
                    var strat1 = parseInt(document.getElementById("strat1").value);
                    var strat2 = parseInt(document.getElementById("strat2").value);
                    $scope.strat_player1 = strat1;
                    $scope.strat_player2 = strat2;
                    $scope.loaded = false;

                    console.log($scope.strat_player1);
                    console.log($scope.strat_player2);
                };

                $scope.passDataToBackend = "passData";
                $scope.passData = function() {
                    $log.log("Passaggio dei parametri al backend");
                    $scope.loaded = false;

                    var strat1 = [];
                    var strat2 = [];

                    for(let i = 0; i < $scope.strat_player1; i++){
                        strat1.push(document.getElementById("strat1-" + (i + 1).toString()).innerHTML);
                    }
                    for(let j = 0; j < $scope.strat_player2; j++){
                        strat2.push(document.getElementById("strat2-" + (j + 1).toString()).innerHTML);
                    }

                    var C = [];

                    for(let i = 0; i < $scope.strat_player1; i++){
                        C.push([]);
                         for(let j = 0; j < $scope.strat_player2; j++){
                             C[i].push(document.getElementById("C" + (i + 1).toString() + (j + 1).toString()).innerHTML);

                         }
                    }

                    var data = { "strat1" : $scope.strat_player1, "strat2" : $scope.strat_player2,
                    "strat1_name" : strat1, "strat2_name" : strat2, "matrix" : C};


                    console.log(data)

                    var dataJSON = JSON.stringify(data);

                    console.log(dataJSON)

                    if($scope.strat_player1 > 0 && $scope.strat_player2 > 0) {
                        $http.post('/simulate', data).success(function (results) {

                            $log.log(results)

                            $scope.loaded = true;

                            document.getElementById("strat_dom1").innerHTML = "<i>Nessuna</i>"
                            document.getElementById("strat_dom2").innerHTML = "<i>Nessuna</i>"

                            document.getElementById("strat_cons_pur1").innerHTML = "<i>Nessuna</i>"
                            document.getElementById("strat_cons_pur2").innerHTML = "<i>Nessuna</i>"

                            document.getElementById("c_segn_pura1").innerHTML = "<i>NaN</i>"
                            document.getElementById("c_segn_pura2").innerHTML = "<i>NaN</i>"


                            if(results["puro"]["strat_dom1"].length != 0) {
                                document.getElementById("strat_dom1").innerHTML = results["puro"]["strat_dom1"].join("<br>")
                            }
                            if(results["puro"]["strat_dom2"].length != 0) {
                                document.getElementById("strat_dom2").innerHTML = results["puro"]["strat_dom2"].join("<br>")
                            }


                            if(results["puro"]["strat_cons1"].length != 0) {
                                document.getElementById("strat_cons_pur1").innerHTML = results["puro"]["strat_cons1"].join("<br>")
                            }
                            if(results["puro"]["strat_cons2"].length != 0) {
                                document.getElementById("strat_cons_pur2").innerHTML = results["puro"]["strat_cons2"].join("<br>")
                            }

                            document.getElementById("c_segn_pura1").innerHTML = results["puro"]["C1"]
                            document.getElementById("c_segn_pura2").innerHTML = results["puro"]["C2"]
                            document.getElementById("value_interval").innerHTML = "[" + (-results["puro"]["C2"]).toString() + "; " + (results["puro"]["C1"]).toString() + "]"


                        }).error(function (error) {
                            $scope.loaded = false;
                            $log.log(error)
                        });
                    }
                };


            }

  ]);



