angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA){
	$scope.question_answer = QA.get();
    console.log($scope.question_answer);
});
