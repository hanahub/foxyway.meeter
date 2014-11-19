angular.module('foxwayApp')
  .controller('TopPanelCtrl', function ($scope, status, xw, debug, $timeout) {

    $scope.session = {};


    // Fetch session data from the machine
    xw.session.getInfo().then(function(sessionInfo) {

        $scope.$apply(function () {
        	console.log('Got session info');
        	$scope.session = sessionInfo;
        });

    },function(res){
    	
        $scope.$apply(function () {
        	console.log('Did not get session info');
        	console.log(res);
            $scope.session = "ERROR";
        });

    });


    $scope.statusRows = status;
});