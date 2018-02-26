
var app = angular.module('SmartHealthTracker',[]);

app.controller('heartController',function($scope,$http,$location,$window,$sce) {


    console.log('heart controller');

    $scope.test='muddu';

    $scope.hourLabel=[];
    $scope.hourBPM=[];

    $scope.hourCounter=1;
    $scope.counter=0;
    $scope.date='';

    $scope.hourlyData=['0 - 1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24'];


    $http.get('/heartData').then(function(results)
    {
        var total=0;


console.log(results);
        $scope.date=results.data.date;

        for(var i=0;i<results.data.dataset.length;i++) {

            total = total + results.data.dataset[i].value;
            ++$scope.counter;



            if ($scope.counter == 59) {

                $scope.hourBPM.push((total) / 60);
                $scope.hourLabel.push($scope.hourCounter);
                ++$scope.hourCounter;
                total = 0;
                $scope.counter = 0;


            }


        }
        $scope.hourBPM.push((total)/60);
       // $scope.hourBPM.push((total)/60+2.54);

        $scope.hourLabel.push($scope.hourCounter);
        //$scope.hourLabel.push($scope.hourCounter);


        options('heart',$scope.hourlyData, $scope.hourBPM,'area','Hourly Average BPM','for the date '+$scope.date,'Average BPM','Hour')

        gaugeFatOptions('fat',(results.data.zones[1].minutes));

        console.log(results.data.zones[2].minutes);
        gaugeCardioOptions('cardio',(results.data.zones[2].minutes));
        gaugePeakOptions('peak',(results.data.zones[3].minutes));
        console.log(((results.data.zones[0].minutes)/60).toFixed(2));
        gaugeOutOptions('out',(Number((Math.floor(results.data.zones[0].minutes)/60).toFixed(2))));




    },function(err){

        console.log(err);
    });





    function options(divValue, xAxisCategories, yAxisData, typeOfChart, chartTitle, subTitle, yAxisTitle, seriesName ){

        Highcharts.chart(divValue, {
            chart: {
                type: typeOfChart
            },
            title: {
                text: chartTitle
            },
            subtitle: {
                text: subTitle
            },
            xAxis: {
                categories: xAxisCategories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: seriesName,
                data: yAxisData

            }]
        });

    }


    function gaugeFatOptions(id,data)
    {

        Highcharts.chart(id, {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: 'Duration Spent in Fat Burnt zone'
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
// default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

// the value axis
            yAxis: {
                min: 0,
                max: 150,

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'In Minutes'
                },
                plotBands: [{
                    from: 0,
                    to: 50,
                    color: '#DF5353'   // red
                }, {
                    from: 50,
                    to: 100,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 100,
                    to: 150,
                    color: '#55BF3B' // green
                }]
            },

            series: [{
                name: 'Minutes',
                data: [data],
            tooltip: {
                valueSuffix: 'Minutes'
            }
        }]

    });
    }

    function gaugeCardioOptions(id,data)
    {


        Highcharts.chart(id, {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: 'Duration Spent in Cardio zone'
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
// default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

// the value axis
            yAxis: {
                min: 0,
                max: 100,

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'In Minutes'
                },
                plotBands: [{
                    from: 0,
                    to: 30,
                    color: '#DF5353'   // red
                }, {
                    from: 30,
                    to: 60,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 60,
                    to: 100,
                    color: '#55BF3B' // green
                }]
            },

            series: [{
                name: 'Minutes',
                data: [data],
                tooltip: {
                    valueSuffix: 'Minutes'
                }
            }]

        });

    }
    function gaugePeakOptions(id,data)
    {


        Highcharts.chart(id, {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: 'Duration Spent in Peak zone'
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
// default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

// the value axis
            yAxis: {
                min: 0,
                max: 100,

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'In Minutes'
                },
                plotBands: [{
                    from: 0,
                    to: 30,
                    color: '#DF5353'   // red
                }, {
                    from: 30,
                    to: 60,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 60,
                    to: 100,
                    color: '#55BF3B' // green
                }]
            },

            series: [{
                name: 'Minutes',
                data: [data],
                tooltip: {
                    valueSuffix: 'Minutes'
                }
            }]

        });

    }

    function gaugeOutOptions(id,data)
    {

        Highcharts.chart(id, {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: 'Duration Spent in Out of zone'
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
// default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

// the value axis
            yAxis: {
                min: 0,
                max: 24,

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'In Hours'
                },
                plotBands: [{
                    from: 0,
                    to: 8,
                    color: '#DF5353'   // red
                }, {
                    from: 8,
                    to: 16,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 16,
                    to: 24,
                    color: '#55BF3B' // green
                }]
            },

            series: [{
                name: 'Hours',
                data: [data],
                tooltip: {
                    valueSuffix: 'Hours'
                }
            }]

        });
    }


});