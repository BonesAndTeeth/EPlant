angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA){
	$scope.showquestion = false;
	var submitbtn = angular.element("#submitbtn");
	var msg=angular.element("#reply");
	var msgicon=angular.element("#replyicon");
	var selecticon=angular.element("#selecticon");
	angular.element('.ui.dropdown').dropdown();

	$scope.getquestion = function(typeOfQ){
		submitbtn.removeClass("disabled");
		selecticon.removeClass("dropdown icon");
		selecticon.addClass("loading icon");
		msg.attr("class","");
	  msgicon.attr("class","");
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
			selecticon.removeClass("loading icon");
			selecticon.addClass("dropdown icon");
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
			submitbtn.addClass("disabled");
		}
	}

	$scope.postsolution = function(){
		if($scope.problem!=null && $scope.solution!=null){
			var solution = $scope.solution;
			var answer = $scope.problem.answer;
			solution =solution.toString().replace(/ |\s+/g,"");
			answer =answer.toString().replace(/ |\s+/g,"");
			if(solution == answer){
				$scope.reply="Correct";
				msg.removeClass("ui icon error message");
				msg.addClass("ui icon success message");
				msgicon.removeClass("frown icon");
				msgicon.addClass("smile icon");
				submitbtn.addClass("disabled");
			}
			else{
				$scope.reply="Incorrect";
				msg.removeClass("ui icon success message");
				msg.addClass("ui icon error message");
				msgicon.removeClass("smile icon");
				msgicon.addClass("frown icon");
			}
		}
	}
	
});
