angular.module("plantApp")
.directive("plantCanvas", function() {
	return {
		restrict: "E",
		templateUrl: 'partials/canvas.html',
		controller: 'canvasCtrl',
        scope: {
        	data: '='
        }
    };
});