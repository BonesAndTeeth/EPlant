var service = angular.module("answerServices",[]);

service.factory('answerservice',function($rootScope) {
  var answerservice = {};

  answerservice.sendanswerevent = function() {
    $rootScope.$broadcast('answerevent');
  };

  return answerservice;
});
