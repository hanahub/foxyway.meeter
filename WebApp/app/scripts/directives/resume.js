'use strict';

angular.module('foxwayApp')
.directive('resume', [function () {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            scope.$on('appResume', function(){
                scope.getSessionInfo();
                scope.$apply();
            });
        }
    };
}])