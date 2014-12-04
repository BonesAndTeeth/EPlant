angular.module("plantApp")
.directive("colorpicker", function() {
	return {
		restrict: "E",
		templateUrl: 'partials/colorpicker.html',
		controller: 'settreeCtrl',
    scope: {}
    };
});