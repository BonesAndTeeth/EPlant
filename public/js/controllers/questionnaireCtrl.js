angular.module("plantApp")
.controller("questionnaireCtrl",function($scope, QA){
	
	getQA();

	function getQA(){
		QA.get().$promise.then(function(data){
			$scope.question = data.question;
			$scope.answer = data.answer;
		});
		
	}
});
