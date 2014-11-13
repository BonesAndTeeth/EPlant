angular.module('questionServices', ['ngResource'])
.factory('QA', function  ($resource) {
	return $resource('/qaFactoringTrinomials');
})
.factory('QATwoEquations', function  ($resource) {
	return $resource('/qaTwoEquations');
})
.factory('doMath', function  ($resource) {
	return $resource('/doMath');
})
.factory('QAWord', function  ($resource) {
	return $resource('/qaWordQuestion');
});
