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
 	$scope.selectedstyle="visibility: visible; position: relative; width: 21px; height: 21px; top: 80px; left: 113px; background-image: url(http://www.w3schools.com/tags/selectedcolor.gif);"
	$scope.clickcolor=function(hex,seltop,selleft){
		colorval = parseInt(hex,16);
		if(colorval!=0){
			settreeservice.sendcolorevent(colorval);
		}

		if (seltop>-1 && selleft>-1){
			selleft+=5;
  		$scope.selectedstyle="visibility: visible; position: relative; width: 21px; height: 21px; top:"+seltop + "px;";
  		$scope.selectedstyle+="left:"+selleft+ "px; background-image: url(images/selectedcolor.gif);";
 		}
		else{
  		$scope.selectedstyle="visibility: hidden";
  	}
}


});
