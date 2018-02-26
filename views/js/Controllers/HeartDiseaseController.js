var app = angular.module('SmartHealthTracker',[]);


app.controller('HeartDiseaseController', function($scope, $http){


	$scope.getPrediction = function(){
		var age = $scope.age;
		var sex = $scope.sex;
		var cp = $scope.cp;
		var trestbps = $scope.trestbps;
		var chol = $scope.chol;
		var fbs = $scope.fbs;
		var restecg = $scope.restecg;
		var thalach = $scope.thalach;
		var exang = $scope.exang;
		var oldpeak = $scope.oldpeak;
		var slope = $scope.slope;
		var ca = $scope.ca;
		var thal  =$scope.thal;

		if(fbs > 120){
			fbs = 1;
		}else{
			fbs = 0;
		}

		console.log(Math.floor($scope.oldpeak));
		waitingDialog.show('Predicting....', {dialogSize: 'sm'});

		 $http({
      		url: 'http://54.183.198.248:5000/heart',
      		method: "POST",
      		headers: { 'Content-Type': 'application/json' },
      		data: JSON.stringify({"age":age,"sex":sex,"cp":cp,"trestbps":trestbps,"chol":chol,"fbs":fbs.toString(),"restecg":restecg,"thalach":thalach,"exang":exang,
      								"oldpeak":Math.floor(oldpeak).toString(),"slope":slope,"ca":ca,"thal":thal})
    		}).success(function(data) {
    			console.log(data);
    			waitingDialog.hide();
      			if(data.output === 0){
      				swal("Our Prediction", "No chance of getting Heart Disease", "success");

      			}else{
      				swal("Our Prediction", "There is chance of getting Heart Disease", "error");

      			}
    		}).error(function(){
    			waitingDialog.hide();
    			swal("Something went wrong, Please try again");
    		});

		
        
	}
});