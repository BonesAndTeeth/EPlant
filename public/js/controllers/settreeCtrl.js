angular.module("plantApp")
.controller("settreeCtrl",function($scope, settreeservice){
	angular.element('.sidebar')
				.sidebar({overlay:true})
        .sidebar('attach events', 'plant-canvas');
  $scope.setbtex=function(tid){
  	settreeservice.sendbtexevent(tid);
  }
  $scope.setltex=function(tid){
  	settreeservice.sendltexevent(tid);
  }
});