var app = angular.module('SmartHealthTracker',[]);


app.controller('ActivityController', function($scope, $http){
    $http.get('/getStepsByWeek').success(function(results){

        if(results  == 'Not Found session')
            window.location.assign('/fitbit');

        var len = results['activities-steps'].length;
        var steps = results['activities-steps'];

        xAxisCategories = [];
        yAxisData = []
        var totalSteps = 0;
        for(var i=0; i< len; i++ ){

            date = steps[i].dateTime;
            val = steps[i].value;
            totalSteps += Number(val);
            xAxisCategories.push(date);
            yAxisData.push(Number(val));
        }
        var averageSteps = totalSteps/len;
        console.log("Total STEPS "+ totalSteps);
        console.log("Avg  STEPS "+ averageSteps);
        $scope.totalSteps = Math.ceil(totalSteps);
        $scope.averageSteps = Math.ceil(averageSteps);

        options('stepsDiv', xAxisCategories, yAxisData, 'line', 'Total Steps for a week', '2000 steps == 1 mile', 'Number of steps', 'Steps' );
    });

    $http.get('/getDistanceByWeek').success(function(results){

        console.log(results);
        if(results  == 'Not Found session')
            window.location.assign('/fitbit');
        else
            console.log(results['activities-distance']);

        var len = results['activities-distance'].length;
        var distances = results['activities-distance'];

        xAxisCategories = [];
        yAxisData = [];
        var totalDistance=0, averageDistance = 0;
        for(var i=0; i< len; i++ ){
            date = distances[i].dateTime;
            val = distances[i].value;
            totalDistance += Number(val);
            xAxisCategories.push(date);
            yAxisData.push(Number(val));
        }
        averageDistance = totalDistance/len;
        $scope.totalDistances = Math.ceil(totalDistance);
        $scope.averageDistances = Math.ceil(averageDistance);

        options('distancesDiv', xAxisCategories, yAxisData, 'column', 'Total Distance for a Week', 'Measured in miles', 'distance travelled', 'distance' );
    });

    $http.get('/getFloorsByWeek').success(function(results){

        console.log(results);
        if(results  == 'Not Found session')
            window.location.assign('/fitbit');
        else
            console.log(results['activities-floors']);

        var len = results['activities-floors'].length;
        var floors = results['activities-floors'];

        xAxisCategories = [];
        yAxisData = []
        var totalFloors = 0;
        for(var i=0; i< len; i++ ){
            date = floors[i].dateTime;
            val = floors[i].value;
            totalFloors += Number(val);
            xAxisCategories.push(date);
            yAxisData.push(Number(val));
        }

        var averageFloors = totalFloors/len;
        $scope.totFloors = Math.ceil(totalFloors);
        $scope.avgFloors = Math.ceil(averageFloors);
        console.log(averageFloors);
        console.log(totalFloors);
        options('floorsDiv', xAxisCategories, yAxisData, 'column', 'Total Floors for a Week', '', 'Number of floors', 'floors' );
        console.log(yAxisData);
    });



    // xAxisCategories = [
    //     'Jan',
    //     'Feb',
    //     'Mar',
    //     'Jun',
    //     'May',
    //     'Jun',
    //     'Jul',
    //     'Aug',
    //     'Sep',
    //     'Oct',
    //     'Nov',
    //     'Dec'
    // ]
    //
    // yAxisData = [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
    //
    // options('stepsDiv', xAxisCategories, yAxisData, 'column');

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
                pointFormat: '<tr><td style="color:red;padding:0">{series.name}: </td>' +
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



});