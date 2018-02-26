var app = angular.module('SmartHealthTracker',[]);


app.controller('DiabetesController', function($scope, $http){


	$scope.getPrediction = function(){
		waitingDialog.show('Predicting....', {dialogSize: 'sm'});

		 $http({
      		url: 'http://54.183.198.248:5000/diabetes',
      		method: "POST",
      		headers: { 'Content-Type': 'application/json' },
      		data: JSON.stringify({"age":$scope.age,"preg":$scope.preg,"plas":$scope.plas,"diast":$scope.diast,"serum":$scope.serum,"body":$scope.body,"pede":$scope.pede,"tricep":$scope.tricep})
    		}).success(function(data) {
    			waitingDialog.hide();
      			if(data.output === 0){
      				swal("Our Prediction", "No chance of getting Diabetes", "success");

      			}else{
      				swal("Our Prediction", "There is chance of getting Diabetes", "error");

      			}
    		}).error(function(){
          waitingDialog.hide();
          swal("Something went wrong, Please try again");
        });;
	}
});