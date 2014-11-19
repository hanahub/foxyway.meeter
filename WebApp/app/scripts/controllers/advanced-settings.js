
angular.module('foxwayApp')
  .controller('AdvancedSettingsCtrl', function ($scope, xw, Scantemplate, debug) {

    $scope.pageCount = {};

    // Test get snmp oid for page count:
    xw.snmp.get('1.3.6.1.2.1.43.10.2.1.4.1.1').then(function(snmpObject) {

        $scope.$apply(function () {
            console.log('Got snmp object: ' + snmpObject);
            $scope.pageCount = snmpObject;
        });

    },function(res) {

        $scope.$apply(function () {
            console.log('Did not get snmp object');
            console.log(res);
            $scope.pageCount = 'ERROR';

        });

    });

    $scope.testSnmp = {};

    xw.snmp.getTotalPages().then(function(obj) {
    	$scope.$apply(function() {
            console.log('Got snmp pageCountObject: ' + obj);
            $scope.testSnmp = obj;
    	});
    }, function(res) {
        $scope.$apply(function () {
            console.log('Did not get pageCountObject');
            console.log(res);
            $scope.pageCount = 'ERROR';

        });

    });

});
