angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, $firebase, $rootScope, QA, answerservice){
	var msg=angular.element("#reply");
	var msgicon=angular.element("#replyicon");
	var selecticon=angular.element("#selecticon");
	var prevType = 5;
	$scope.type = 5;
	var form = angular.element("#qaform");
	angular.element('.ui.dropdown').dropdown();
	usr = null;
	FirebaseRef = new Firebase("https://eplant.firebaseio.com");
	$scope.$on('userLoggedIn', function(event, mass) { usr = mass; });
	$scope.answerCorrect = false;
	$scope.loading = false;
	$scope.givenUp = false;

	/* The function requests a question (with answer from service) and returns the result to the requester */
	$scope.getquestion = function(typeOfQ){
		$scope.type =  typeOfQ;
		selecticon.attr("class","loading icon");
		msg.attr("class","");
		msgicon.attr("class","");
		$scope.disablebtn = false;
		$scope.showanswer = false;
		$scope.problem = null;
		$scope.solution = null;
		$scope.reply = null;
		$scope.answerCorrect = false;
		$scope.loading = false;
		$scope.givenUp = false;
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

	/* Recurns the answer of the current question */
	$scope.getanswer = function(){
		if($scope.problem!=null){
			$scope.answer = $scope.problem.answer;
			$scope.showanswer = true;
			$scope.disablebtn=true;
			$scope.givenUp = true;
		}
	}

	/* The functions first check if the user should level up.
	* if yes, level up
	*/
	function levelUP(){
		var tree = $firebase(FirebaseRef.child("trees").child(usr.treeid));
		var usrTree = tree.$asObject();
		usrTree.$loaded().then(function() {
			threshold = 2 * usrTree.level;
			if (usrTree.water > threshold && usrTree.sunshine > threshold && usrTree.fertilizer > threshold && usrTree.pesticide > threshold){
				tree.$update({level: usrTree.level + 1});
				tree.$update({water: usrTree.water - threshold});
				tree.$update({sunshine: usrTree.sunshine - threshold});
				tree.$update({fertilizer: usrTree.fertilizer - threshold});
				tree.$update({pesticide: usrTree.pesticide - threshold});
			}
		});
	}

	/* The functions updates the user's tree's score if the answer is correct. */
	function updateScore(){
		if (usr!=null){
			var tree = $firebase(FirebaseRef.child("trees").child(usr.treeid));
			var usrTree = tree.$asObject();
			usrTree.$loaded().then(function() {
				switch($scope.type) {
					case 0:  //water
					tree.$update({water: usrTree.water + 1});
					break;
					case 1:  //sunshine
					tree.$update({sunshine: usrTree.sunshine + 1});
					break;
					case 2:  //fertilizer
					tree.$update({fertilizer: usrTree.fertilizer + 1});
					break;
					case 3:  //pesticide
					tree.$update({pesticide: usrTree.pesticide + 1});
					break;
					default:
					break;
				}
			});
			levelUP();
		}
	}

	/* The function changes the question for the user to answer */
	$scope.updateQuestion = function(){
		$scope.givenUp = false;
		$scope.type = (prevType + 1)%4;
		console.log("The new question type is " + $scope.type);
		msg.attr("class","");
		msgicon.attr("class","");
		$scope.loading = true;
		$scope.disablebtn = false;
		$scope.showanswer = false;
		$scope.problem = null;
		$scope.solution = null;
		$scope.reply = null;
		QA.get({id : $scope.type}).$promise.then(function(data){
			$scope.problem = data;
			$scope.qtitle = data.qtitle;
			$scope.question = data.question;
			$scope.question2 = data.equation2;
			$scope.answer = data.answer;
			$scope.placeholder="Please enter your answer here"
			if($scope.type==1)
				$scope.placeholder="Please enter your answer in the format of (x,y)";
			$scope.loading = false;
		});	
	};

	/* The function post the correct answer on question modal */
	$scope.postsolution = function(){
		if($scope.problem!=null && $scope.solution!=null && !$scope.disablebtn){
			var solution = $scope.solution;
			var answer = $scope.problem.answer;
			solution =solution.toString().replace(/ |\s+/g,"");
			answer =answer.toString().replace(/ |\s+/g,"");

			/* remove characters such as '$' that might be in the solution */
			solution.replace(/[^a-zA-Z0-9\(\)\.]/,"");

			/* complicated answer check for factorization, see below */
			if($scope.type==0)
				result=checkanswer(solution,answer);

			/* linear equations: check for both x and y */
			/* use eval to deal with decimals (E.g. 1 vs 1.0) */
			else if($scope.type==1){
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
			else if ($scope.type==2)
				try{
					result=(eval(solution) == eval(answer));
				}catch(e){
					result=false;
				}
			else
				result=solution==answer;

			if(result){
				$scope.reply="Correct";
				msg.attr("class","ui icon success message");
				msgicon.attr("class","smile icon");
				$scope.disablebtn = true;
				$scope.answerCorrect = true;

				/* Dimmer disappears */
				$(".ui.dimmer").css("background-color", "transparent");

				/* closes form and broadcasts event for correct answer */
				answerservice.sendrightanswerevent();
				answerservice.sendactionevent($scope.type);

				/* Update the user info if the answer is correct*/
				updateScore();

				/* Change back the dimmer and update info */
				setTimeout(function(){
					$(".ui.dimmer").css("background-color", "rgba(25,25,25,0.9)");
					$scope.answerCorrect = false;
					prevType = $scope.type;
					$scope.type = 5;
				},5000);


			}
			else{
				$(".ui.dimmer").css("background-color", "transparent");
				$scope.reply="Incorrect";
				msg.attr("class","ui icon error message");
				msgicon.attr("class","frown icon");
				answerservice.sendwronganswerevent();
				setTimeout(function(){
					$(".ui.dimmer").css("background-color", "rgba(25,25,25,0.9)");
				},5000);
			}
		}
	}

	/* The function checks if the user's answer matches the expected answer */
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
