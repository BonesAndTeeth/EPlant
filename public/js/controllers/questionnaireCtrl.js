angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA, QATwoEquations, doMath, QAWord){
	
	$scope.type = "Word";
	QAdata = {};
	getQA($scope.type);

	function getQA(typeOfQ){
		if (typeOfQ == "TwoEquations"){
			QATwoEquations.get().$promise.then(function(data){
				$scope.question = data.equation1;
				$scope.question2 = data.equation2;
				$scope.answer = data.answer;
				QAdata = data;
			});	
		}
		else if(typeOfQ == "FactoringTrinomial"){
			QA.get().$promise.then(function(data){
				$scope.question = data.question;
				$scope.answer = data.answer;
				QAdata = data;
			});	
		}
		else if(typeOfQ == "doMath"){
			doMath.get().$promise.then(function(data){
				$scope.question = data.question;
				$scope.answer = data.answer;
				QAdata = data;
			});	
		}
		else if(typeOfQ == "Word"){
			QAWord.get().$promise.then(function(data){
				$scope.question = data.question;
				$scope.answer = data.answer;
				QAdata = data;
			});	
		}
	}
	
});
