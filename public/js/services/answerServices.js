var service = angular.module("answerServices",[]);

service.factory('answerservice',function($rootScope) {
  var answerservice = {};

  /* broadcasts event for correct answer to other controllers */
  answerservice.sendrightanswerevent = function() {
    $rootScope.$broadcast('rightanswerevent');
  };

  answerservice.sendwronganswerevent = function() {
    $rootScope.$broadcast('wronganswerevent');
  };

  return answerservice;
});
