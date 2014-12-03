var service = angular.module("settreeServices",[]);

service.factory('settreeservice',function($rootScope) {
  var settreeservice = {};
  settreeservice.btex = 0;
  /* broadcasts event for correct settree to other controllers */
  settreeservice.sendbtexevent = function(tid) {
    $rootScope.$broadcast('btexevent',tid);
  };
  settreeservice.sendltexevent = function(tid) {
    $rootScope.$broadcast('ltexevent',tid);
  };

  return settreeservice;
});
