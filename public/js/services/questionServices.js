angular.module('questionServices', ['ngResource'])
.factory('QA', function  ($resource) {
	return $resource('/problems/:id');
});