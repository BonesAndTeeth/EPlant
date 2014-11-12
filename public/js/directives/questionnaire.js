//plant-canvas is a custom directive. The main purpose for it is to split the canvas
//in the index.html into partial files for collaborating. canvasCtrl is assigned to 
//this partial file.
angular.module("plantApp")
.directive("questionnaire", function() {
	return {
		restrict: "E",
		templateUrl: 'partials/questionnaire.html',
		controller: 'questionnaireCtrl',
        scope: {
        	data: '='
        }
    };
});