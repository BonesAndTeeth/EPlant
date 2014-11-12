//plant-canvas is a custom directive. The main purpose for it is to split the canvas
//in the index.html into partial files for collaborating. canvasCtrl is assigned to 
//this partial file.
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