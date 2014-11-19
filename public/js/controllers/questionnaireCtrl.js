angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA){
	var msg=angular.element("#reply");
	var msgicon=angular.element("#replyicon");
	var selecticon=angular.element("#selecticon");
	angular.element('.ui.dropdown').dropdown();

	$scope.getquestion = function(typeOfQ){
		selecticon.attr("class","loading icon");
		msg.attr("class","");
	  msgicon.attr("class","");
	  $scope.disablebtn = false;
		$scope.showanswer = false;
		$scope.problem = null;
		$scope.solution = null;
		$scope.reply = null;
		QA.get({id : typeOfQ}).$promise.then(function(data){
			$scope.problem = data;
			$scope.qtitle = data.qtitle;
			$scope.question = data.question;
			$scope.question2 = data.equation2;
			$scope.answer = data.answer;
			selecticon.attr("class","dropdown icon");
			$scope.placeholder="Please enter your answer here"
			if(typeOfQ==1)
				$scope.placeholder="Please enter your answer in the format of (x,y)";
			var form = angular.element("#qaform");
			form.modal('show');
		});		
	}
	$scope.getanswer = function(){
		if($scope.problem!=null){
			$scope.answer = $scope.problem.answer;
			$scope.showanswer = true;
			$scope.disablebtn=true;
		}
	}

	$scope.postsolution = function(){
		if($scope.problem!=null && $scope.solution!=null && !$scope.disablebtn){
			var solution = $scope.solution;
			var answer = $scope.problem.answer;
			solution =solution.toString().replace(/ |\s+/g,"");
			answer =answer.toString().replace(/ |\s+/g,"");
			if(solution == answer){
				$scope.reply="Correct";
				msg.attr("class","ui icon success message");
				msgicon.attr("class","smile icon");
				$scope.disablebtn = true;
			}
			else{
				$scope.reply="Incorrect";
				msg.attr("class","ui icon error message");
				msgicon.attr("class","frown icon");
			}
		}
	}
	
});
