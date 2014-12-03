angular.module("plantApp")
.directive("settree", function() {
	return {
		restrict: "E",
		templateUrl: 'partials/treesetting.html',
		controller: 'settreeCtrl',
    scope: {}
    };
});