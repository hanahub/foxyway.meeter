'use strict';

angular.module('foxwayApp')
  .service('status', function status($translate) {
        var statusRows = {
            row1: $translate.instant('ready'),
            row2: "", //$translate.instant('remoteSessionIsActive'),
            row3: "" //$translate.instant('newSettingsMayNotBeOptimised')
        };


        return statusRows;
  });