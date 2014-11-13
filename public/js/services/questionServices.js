angular.module('questionServices', ['ngResource'])
.factory('QA', function  ($resource) {
	return $resource('/qaFactoringTrinomials');
})
.factory('QATwoEquations', function  ($resource) {
	return $resource('/qaTwoEquations');
});

