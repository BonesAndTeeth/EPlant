var service = angular.module("answerServices",[]);

service.factory('answerservice',function($rootScope) {
  var answerservice = {};

  /* broadcasts event for correct answer to other controllers */
  answerservice.sendanswerevent = function() {
    $rootScope.$broadcast('answerevent');
  };

  return answerservice;
});
