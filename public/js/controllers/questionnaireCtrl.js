angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA){
	$scope.showquestion = false;
	$scope.type = 0;
	$scope.getquestion = function(){
		typeOfQ = $scope.type
		$scope.showanswer = false;
		$scope.showquestion = false;
		$scope.showbutton = false;
		$scope.showbar = true;
		$scope.problem = null;
		$scope.solution = null;
		$scope.reply = null;
		QA.get({id : typeOfQ}).$promise.then(function(data){
			$scope.problem = data
			$scope.question = data.question;
			$scope.question2 = data.equation2;
			$scope.answer = data.answer;
			$scope.showbutton = true;
			$scope.showquestion = true;
			$scope.showbar = false;
		});		
	}
	$scope.getanswer = function(){
		if($scope.problem!=null){
			$scope.answer = $scope.problem.answer;
			$scope.showanswer = true;
			$scope.showbutton = false;
		}
	}

	$scope.postsolution = function(){
		if($scope.problem!=null && $scope.solution!=null){
			var solution = $scope.solution;
			var answer = $scope.problem.answer;
			solution =solution.toString().replace(/ |\s+/g,"");
			answer =answer.toString().replace(/ |\s+/g,"");
			if(solution == answer)
				$scope.reply="correct";
			else
				$scope.reply="wrong";
		}
	}
	
});
