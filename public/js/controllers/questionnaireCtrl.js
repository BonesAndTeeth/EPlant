angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA, QATwoEquations){
	
	$scope.type = "TwoEquations";
	getQA($scope.type);

	function getQA(typeOfQ){
		if (typeOfQ == "TwoEquations"){
			QATwoEquations.get().$promise.then(function(data){
				$scope.question = data.equation1;
				$scope.question2 = data.equation2;
				$scope.answer = data.answer;
			});	
		}
		else if(typeOfQ == "FactoringTrinomial"){
			QA.get().$promise.then(function(data){
				$scope.question = data.question;
				$scope.answer = data.answer;
			});	
		}
	}
	
});
