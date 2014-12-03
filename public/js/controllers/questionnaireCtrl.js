angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA, answerservice){
	var msg=angular.element("#reply");
	var msgicon=angular.element("#replyicon");
	var selecticon=angular.element("#selecticon");
	var type=5;
	var form = angular.element("#qaform");
	angular.element('.ui.dropdown').dropdown();

	$scope.getquestion = function(typeOfQ){
		type = typeOfQ;
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

			/* remove characters such as '$' that might be in the solution */
			solution.replace(/[^a-zA-Z0-9\(\)\.]/,"");

			/* complicated answer check for factorization, see below */
			if(type==0)
				result=checkanswer(solution,answer);

			/* linear equations: check for both x and y */
			/* use eval to deal with decimals (E.g. 1 vs 1.0) */
			else if(type==1){
				/* value of x variable */
				xvalsol = solution.split(/[\(\),]+/)[1];
				xvalans = answer.split(/[\(\),]+/)[1];

				/* value of y variable */
				yvalsol = solution.split(/[\(\),]+/)[2];
				yvalans = answer.split(/[\(\),]+/)[2];

				if((eval(xvalans)!=eval(xvalsol))||(eval(yvalans)!=eval(yvalsol)))
					result=false;
				else result=true;

			}

			/* check answer value for calculation and word problems */
			else
				result=(eval(solution) == eval(answer));
			if(result){
				$scope.reply="Correct";
				msg.attr("class","ui icon success message");
				msgicon.attr("class","smile icon");
				$scope.disablebtn = true;

				/* closes form and broadcasts event for correct answer */
				//setTimeout(function(){
					//form.modal('hide');
					answerservice.sendrightanswerevent();
				//},2000);
			}
			else{
				$scope.reply="Incorrect";
				msg.attr("class","ui icon error message");
				msgicon.attr("class","frown icon");

				//setTimeout(function(){
					//form.modal('hide');
					answerservice.sendwronganswerevent();
				//},2000);
			}
		}
	}

	function checkanswer(answer, solution){
		/* convert answer/solution string into valid js math expressions */
		solution =solution.replace(/\)\(/g,")*(");
		answer =answer.replace(/\)\(/g,")*(");
		solution = solution.replace(/(\d+|\))(x)/g,"$1*$2");
		answer =answer.replace(/(\d+|\))(x)/g,"$1*$2");

		/* plug in values 0,1,2 for x and check if expressions evaluate to same number */
		/* this can be proved... */
		for(x=0;x<3;x++){
			if(eval(solution)!=eval(answer))
				return false;
		}
		return true;
	}
	
});
