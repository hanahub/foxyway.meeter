
angular.module('foxwayApp')
    .controller('LicenseCtrl', function ($scope, $http) {
        $http.get('manifest.json')
            .then(function(res) {
                $scope.appInfo = res.data; 
                console.log($scope.appInfo);
            });

        
        console.log($scope.appInfo);
        
        // START - License key keyboard

        $scope.verifyLocalLicense = function() {
          /*if(License.isLicensed == false)
          {
            status.row2 = 'No License provided';
            console.log('      License.isLicensed: ' + License.isLicensed);
            return true;
          }         */
          console.log('App is licensed. Returning false.');
          return false;
        };

        $scope.showLicenseKeyKeyBoard = $scope.verifyLocalLicense();

        $scope.toggleLicenseKeyKeyBoard = function () {
          console.log('toggleLicenseKeyKeyBoard');
          $scope.showLicenseKeyKeyBoard = !$scope.showLicenseKeyKeyBoard;
        };


        $scope.verifyLicense = function () {
          License.licenseApp();
          $scope.toggleLicenseKeyKeyBoard();
          status.row2 = 'Now Licensed...';
          return true;
        }; 
        // END   - License key keyboard
        
        $scope.trialPeriod = 20;
        $scope.licenseDialog = false;
        $scope.showLicenseDialog = function() {            
            $scope.licenseDialog = true;
        };
        $scope.hideLicenseDialog = function() {            
            $scope.licenseDialog = false;
        };
        $scope.applyLicenseKey = function() {
            $scope.hideLicenseDialog();
            $scope.toggleLicenseKeyKeyBoard();
        };
        
        
               
    });
  