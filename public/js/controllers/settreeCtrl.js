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
  $scope.setcloud=function(action){
  	settreeservice.sendcloudevent(action);
  }

 	$scope.colorhex='0x33ccff';
	$scope.clickcolor=function(hex,seltop,selleft){
		colorval = parseInt(hex,16);
		if(colorval!=0){
			settreeservice.sendcolorevent(colorval);
		}
}


});
