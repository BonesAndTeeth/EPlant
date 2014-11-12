angular.module('questionServices', ['ngResource'])
.factory('QA', function  ($resource) {
	return $resource('/qas');
})
//.factory('Answers', function  ($resource) {
//	return $resource('/lists');
//})
;

