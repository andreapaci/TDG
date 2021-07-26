 'use strict';

  var teoriagiochi = angular.module('teoriagiochi', ['ngRoute']);
  teoriagiochi.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    });


  var chartColors = ["#696ffb", "#7db8f9", "#05478f", "#00cccc", "#6CA5E0", "#1A76CA"];

  const decimation = {
            enabled: true,
            algorithm: 'min-max',
            samples: 20
        };

  var originalData = [{x:0, y:0}]
  var originalExpectedValue = [{x:0, y:0}]

  var chart;

  var options = {
            type: 'line',
            data: {

                datasets: [{
                        label: 'Costo Giocatore 1',
                        data: [
                            { x: 0, y: 0},

                        ],
                        borderWidth: 1,
                        fill: false,
                        radius: 1,
                        tension: 0,
                        backgroundColor: chartColors[1],
                        borderColor: chartColors[1],

                    },
                {
                        label: 'Val. atteso',
                        data: [
                            { x: 0, y: 0},

                        ],
                        borderWidth: 1,
                        fill: false,
                        radius: 0,
                        tension: 0,   //CAMBIA A 0
                        backgroundColor: chartColors[2],
                        borderColor: chartColors[2],

                    }]
            },
            options: {
                responsive: true,
                 downsample: {
                    enabled: true,
                    threshold: 20 // max number of points to display per dataset
                },

                fill: false,

                scales: {
                    xAxes: [{
                        type: 'linear',
                        display: true,
                        scaleLabel: {
                                display: true,
                                labelString: '# Iterazioni'
                        },
                        ticks: {
                            source: 'auto',
                            precision: 0,
                            // Disabled rotation for performance
                            maxRotation: 0,
                            autoSkip: true,
                        }
                    }],

                    yAxes: [{
                        display: true,
                        scaleLabel: {
                             display: true,
                             labelString: 'Costo totale'
                        }
                    }],
                },
            }
        }



    window.onload = function() {

        var ctx = document.getElementById('chartjs-chart').getContext('2d');

        chart = new Chart(ctx, options);
    }




  teoriagiochi.controller('matrixcontroller', ['$scope', '$log', '$http', '$timeout',  function($scope, $log, $http, $timeout) {
                $scope.strat_player1 = 0;
                $scope.strat_player2 = 0;
                $scope.iteration = 0;
                $scope.last_iteration_value = 0;
                $scope.loaded = false;
                 if (chart !== undefined) {
                     chart.data.datasets[0].data = [{x: 0, y: 0}]
                     chart.data.datasets[1].data = [{x: 0, y: 0}]
                     originalData = [{x:0, y:0}]
                        originalExpectedValue = [{x:0, y:0}]
                     chart.update()
                 }



                $scope.saveFunction = "updateStrat";
                $scope.updateStrat = function() {
                    $log.log("Update delle strategie");

                    $scope.loaded = false;

                    document.getElementById("generated_code").value = " Nessuno"
                    document.getElementById("eCe").innerHTML = ""
                    document.getElementById("simulation_value").innerHTML = ""

                    for(let i = 0; i < $scope.strat_player1; i++){
                        document.getElementById("strat_choose1-" + (i + 1).toString()).innerHTML = ""
                    }
                    for(let i = 0; i < $scope.strat_player2; i++){
                        document.getElementById("strat_choose2-" + (i + 1).toString()).innerHTML = ""
                    }

                    if (chart !== undefined) {
                        chart.data.datasets[0].data = [{x: 0, y: 0}]
                        chart.data.datasets[1].data = [{x: 0, y: 0}]
                        originalData = [{x:0, y:0}]
                        originalExpectedValue = [{x:0, y:0}]
                        chart.update()
                    }

                    $scope.iteration = 0
                    $scope.last_iteration_value = 0

                    var strat1 = parseInt(document.getElementById("strat1").value);
                    var strat2 = parseInt(document.getElementById("strat2").value);
                    $scope.strat_player1 = strat1;
                    $scope.strat_player2 = strat2;

                    if(strat1 == 0 || strat2 == 0){ alert("Inserire numero di strategie valido") }

                    //console.log($scope.strat_player1);
                    //console.log($scope.strat_player2);



                };

                $scope.passDataToBackend = "passData";
                $scope.passData = function() {
                    $log.log("Passaggio dei parametri al backend");
                    $scope.loaded = false;
                    document.getElementById("generated_code").value = " Nessuno"
                    document.getElementById("eCe").innerHTML = ""
                    document.getElementById("simulation_value").innerHTML = ""

                    for(let i = 0; i < $scope.strat_player1; i++){
                        document.getElementById("strat_choose1-" + (i + 1).toString()).innerHTML = ""
                    }
                    for(let i = 0; i < $scope.strat_player2; i++){
                        document.getElementById("strat_choose2-" + (i + 1).toString()).innerHTML = ""
                    }

                    if (chart !== undefined) {
                        chart.data.datasets[0].data = [{x: 0, y: 0}]
                        chart.data.datasets[1].data = [{x: 0, y: 0}]
                        originalData = [{x:0, y:0}]
                        originalExpectedValue = [{x:0, y:0}]
                        chart.update()
                    }

                    $scope.iteration = 0
                    $scope.last_iteration_value = 0

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


                    //console.log(data)

                    var dataJSON = JSON.stringify(data);

                    //console.log(dataJSON)

                    if($scope.strat_player1 > 0 && $scope.strat_player2 > 0) {
                        $http.post('/results', data).success(function (results) {

                            var code = btoa(dataJSON)
                            document.getElementById("generated_code").value = code

                            //$log.log(results)

                            $scope.loaded = true;

                            $scope.payoffmatrix = C

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

                            for(let i = 0; i < strat1.length; i++){
                                document.getElementById("strat_choose_name1-" + (i + 1).toString()).innerHTML = strat1[i]
                                document.getElementById("strat_cons_mist_name1-" + (i + 1).toString()).innerHTML = strat1[i]
                                document.getElementById("strat_cons_mist1-" + (i + 1).toString()).innerHTML = results["misto"]["player1"]["strat"][i]


                            }
                            for(let i = 0; i < strat2.length; i++){
                                document.getElementById("strat_choose_name2-" + (i + 1).toString()).innerHTML = strat2[i]
                                document.getElementById("strat_cons_mist_name2-" + (i + 1).toString()).innerHTML = strat2[i]
                                document.getElementById("strat_cons_mist2-" + (i + 1).toString()).innerHTML = results["misto"]["player2"]["strat"][i]

                            }

                            document.getElementById("c_segn_misto1").innerHTML = results["misto"]["player1"]["objective"]




                        }).error(function (error) {
                            $scope.loaded = false;
                             if (chart !== undefined) {
                                chart.data.datasets[0].data = [{x: 0, y: 0}]
                                chart.data.datasets[1].data = [{x: 0, y: 0}]
                                 originalData = [{x:0, y:0}]
                                originalExpectedValue = [{x:0, y:0}]
                                chart.update()
                            }
                            $log.log(error)
                            alert("Inserire valori validi nella matrice")

                            document.getElementById("generated_code").value = "Nessuno"

                        });
                    }
                };


                $scope.iterate = "simulation";
                $scope.simulation = function() {
                    //$log.log("Iterazione: " + $scope.iteration);
                    //$log.log("Ultimo valore dell'iterazione: " + $scope.last_iteration_value);

                    var strat_misto_1 = []
                    var strat_misto_2 = []

                    for(let i = 0; i < $scope.strat_player1; i++){
                        strat_misto_1.push(document.getElementById("strat_choose1-" + (i + 1).toString()).innerHTML)

                    }
                    for(let i = 0; i < $scope.strat_player2; i++){
                        strat_misto_2.push(document.getElementById("strat_choose2-" + (i + 1).toString()).innerHTML)
                    }

                    var n_iterazioni = document.getElementById("iteration").value

                    var data = {"strat1": strat_misto_1, "strat2": strat_misto_2,
                        "n_iterazioni": n_iterazioni, "ultimo_val": $scope.last_iteration_value,
                        "matrix": $scope.payoffmatrix}

                    //$log.log(data)
                    $http.post('/simulate', data).success(function (results) {

                            //$log.log(results)


                        //let new_labels = []
                        /*for(let i = $scope.iteration; i < $scope.iteration + parseInt(n_iterazioni); i++){
                            //chart.data.labels.push(i + 1)
                        }*/

                        for(let i = 0; i < results["costo"].length; i++) {
                            let value = $scope.iteration + i + 1
                            //$log.log(value)
                            originalData.push({x: $scope.iteration + i + 1, y: Number((results["costo"][i]).toFixed(3))})
                        }


                        for(let i = 0; i < results["costo"].length; i++) {
                            let value = $scope.iteration + i + 1
                            //$log.log(value)
                            originalExpectedValue.push({x: $scope.iteration + i + 1, y: Number((parseFloat(results["val_strat"]) * ($scope.iteration + i + 1)).toFixed(3)) })
                        }

                        $scope.iteration = $scope.iteration + parseInt(n_iterazioni)


                        $scope.last_iteration_value = Number((results["costo"][results["costo"].length - 1]).toFixed(3));

                        var simulationValue = (($scope.last_iteration_value/$scope.iteration)).toFixed(3);


                        document.getElementById("eCe").innerHTML = (results["val_strat"]).toString()
                        document.getElementById("simulation_value").innerHTML = simulationValue


                        chart.data.datasets[0].data = downsample(originalData, 500);
                        chart.data.datasets[1].data = downsample(originalExpectedValue, 500);
                        chart.update();

                        }).error(function (error) {

                            $log.log(error)
                            alert("Inserire numero di iterazioni valido e/o strategie valide")
                        });

                }


                $scope.loadDataB64 = "loadData";
                $scope.loadData = function() {

                try {
                    $log.log("Load dei dati");
                     $scope.loaded = false;

                    document.getElementById("generated_code").value = " Nessuno"
                    document.getElementById("eCe").innerHTML = ""
                    document.getElementById("simulation_value").innerHTML = ""

                    for(let i = 0; i < $scope.strat_player1; i++){
                        document.getElementById("strat_choose1-" + (i + 1).toString()).innerHTML = ""
                    }
                    for(let i = 0; i < $scope.strat_player2; i++){
                        document.getElementById("strat_choose2-" + (i + 1).toString()).innerHTML = ""
                    }


                    if (chart !== undefined) {
                        chart.data.datasets[0].data = [{x: 0, y: 0}]
                        chart.data.datasets[1].data = [{x: 0, y: 0}]
                        originalData = [{x:0, y:0}]
                        originalExpectedValue = [{x:0, y:0}]
                        chart.update()
                    }

                    $scope.iteration = 0
                    $scope.last_iteration_value = 0

                    var code64 = document.getElementById("code").value
                    var data = JSON.parse(atob(code64));

                    //$log.log("Dati:");
                    //$log.log(data);

                    $scope.strat_player1 = data["strat1"];
                    $scope.strat_player2 = data["strat2"];

                    document.getElementById("strat1").value = $scope.strat_player1
                    document.getElementById("strat2").value = $scope.strat_player2


                    var strat_name1 = data["strat1_name"]
                    var strat_name2 = data["strat2_name"]
                    var matrix = data["matrix"]


                    $timeout(function () {
                            $scope.updateMatrix(matrix, strat_name1, strat_name2)
                        }
                        , 1)


                }
                catch (e) {
                    alert("Codice non corretto.")
                    $scope.loaded = false
                    $scope.strat_player1 = 0
                    $scope.strat_player2 = 0

                    document.getElementById("strat1").value = $scope.strat_player1
                    document.getElementById("strat2").value = $scope.strat_player2

                    document.getElementById("generated_code").value = " Nessuno"
                }

          }

                $scope.updateMatrix = function (matrix, strat_name1, strat_name2){


                    for(let i = 0; i < strat_name1.length; i++){
                         while(document.getElementById("strat1-" + (i + 1).toString()) == null) { }
                         document.getElementById("strat1-" + (i + 1).toString()).innerHTML = strat_name1[i]
                    }

                    for(let i = 0; i < strat_name2.length; i++){
                         while(document.getElementById("strat2-" + (i + 1).toString()) == null) { }
                         document.getElementById("strat2-" + (i + 1).toString()).innerHTML = strat_name2[i]
                    }



                    for(let i = 0; i < matrix.length; i++){
                        for(let j = 0; j < matrix[i].length; j++){

                            while(document.getElementById("C" + (i+1).toString() + (j+1).toString()) == null) {}
                            document.getElementById("C" + (i+1).toString() + (j+1).toString()).
                                innerHTML = matrix[i][j]

                        }
                    }
                }



            }

  ]);








var defaultOptions = {
    enabled: false,

    // max number of points to display per dataset
    threshold: 1000,

    // if true, downsamples data automatically every update
    auto: true,
    // if true, downsamples data when the chart is initialized
    onInit: true,

    // if true, replaces the downsampled data with the original data after each update
    restoreOriginalData: true,
    // if true, downsamples original data instead of data
    preferOriginalData: false,

    //if not undefined and not empty, indicates the ids of the datasets to downsample
    targetDatasets: [],

};

var floor = Math.floor,
    abs = Math.abs;

function downsample(data, threshold) {
    // this function is from flot-downsample (MIT), with modifications

    var dataLength = data.length;
    if (threshold >= dataLength || threshold <= 0) {
        return data; // nothing to do
    }

    var sampled = [],
        sampledIndex = 0;

    // bucket size, leave room for start and end data points
    var every = (dataLength - 2) / (threshold - 2);

    var a = 0,  // initially a is the first point in the triangle
        maxAreaPoint,
        maxArea,
        area,
        nextA;

    // always add the first point
    sampled[sampledIndex++] = data[a];

    for (var i = 0; i < threshold - 2; i++) {
        // Calculate point average for next bucket (containing c)
        var avgX = 0,
            avgY = 0,
            avgRangeStart = floor(( i + 1 ) * every) + 1,
            avgRangeEnd = floor(( i + 2 ) * every) + 1;
        avgRangeEnd = avgRangeEnd < dataLength ? avgRangeEnd : dataLength;

        var avgRangeLength = avgRangeEnd - avgRangeStart;

        for (; avgRangeStart < avgRangeEnd; avgRangeStart++) {
            avgX += data[avgRangeStart].x * 1; // * 1 enforces Number (value may be Date)
            avgY += data[avgRangeStart].y * 1;
        }
        avgX /= avgRangeLength;
        avgY /= avgRangeLength;

        // Get the range for this bucket
        var rangeOffs = floor((i + 0) * every) + 1,
            rangeTo = floor((i + 1) * every) + 1;

        // Point a
        var pointAX = data[a].x * 1, // enforce Number (value may be Date)
            pointAY = data[a].y * 1;

        maxArea = area = -1;

        for (; rangeOffs < rangeTo; rangeOffs++) {
            // Calculate triangle area over three buckets
            area = abs(( pointAX - avgX ) * ( data[rangeOffs].y - pointAY ) -
                    ( pointAX - data[rangeOffs].x ) * ( avgY - pointAY )
                ) * 0.5;
            if (area > maxArea) {
                maxArea = area;
                maxAreaPoint = data[rangeOffs];
                nextA = rangeOffs; // Next a is this b
            }
        }

        sampled[sampledIndex++] = maxAreaPoint; // Pick this point from the bucket
        a = nextA; // This a is the next a (chosen b)
    }

    sampled[sampledIndex] = data[dataLength - 1]; // Always add last

    return sampled;
}

function getOptions(chartInstance) {
    return chartInstance.options.downsample;
}

function getFilteredDatasets(chartInstance){
    var targetDatasets = getOptions(chartInstance).targetDatasets;
    var datasets = chartInstance.data.datasets;

    if (targetDatasets.length === 0) {
        return datasets;
    }

    var targetDatasetsMap = {};
    for (var i = 0; i < targetDatasets.length; i++) {
        var targetDataset = targetDatasets[i];
        targetDatasetsMap[targetDataset] = true;
    }

    var filteredDatasets = [];
    for (var i = 0; i < datasets.length; i++) {
        var dataset = datasets[i];

        if (targetDatasetsMap[dataset.id]) {
            filteredDatasets.push(dataset);
        }
    }

    return filteredDatasets;
}

 function downsampleChart(chartInstance) {
    var options = getOptions(chartInstance),
        threshold = options.threshold;
    if(!options.enabled) return;

    var datasets = getFilteredDatasets(chartInstance);
    for(var i = 0; i < datasets.length; i++) {
        var dataset = datasets[i];

        var dataToDownsample = null;
        if(options.preferOriginalData) {
            dataToDownsample = dataset.originalData;
        }
        dataToDownsample = dataToDownsample || dataset.data;

        dataset.originalData = dataToDownsample;
        dataset.data = downsample(dataToDownsample, threshold);
    }
}









