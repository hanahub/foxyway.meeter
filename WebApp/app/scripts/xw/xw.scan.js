  /// <reference path="XeroxJavascriptLibrary/XRXScanV2.js" />
/// <reference path="XeroxJavascriptLibrary/XRXScan.js" />
/// <reference path="xw.js" />

var xw = xw || {};

xw.scan = (function() {

    function initiate(templateName) {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function(){
            xrxScanV2InitiateScanJobWithTemplate(
                xw.serviceBase,
                templateName,
                false,
                '1234',
                function(request, response) {
                  console.log(response);
                  console.log(xrxScanV2ParseInitiateScanJobWithTemplate(response));
                    deferred.resolve(xrxScanV2ParseInitiateScanJobWithTemplate(response));
                },
                function(request, response) {
                    deferred.reject(response);
                }, xw.defaultTimeout
            )
        }, deferred.promise);
        
            
        // xw.ajaxEnqueue(function(){
        //     xrxScanInitiateScan(
        //        xw.serviceBase,
        //        templateName,
        //        false,
        //        function(request, response) {
        //           console.log(response);
        //           console.log(xrxJobMgmtParseGetJobDetails(response));
        //            deferred.resolve(response);
        //        },
        //        function(request, response) {
        //            deferred.reject(response);
        //        },
        //        xw.defaultTimeout
        //     )
        // }, deferred.promise);

        return deferred.promise;
    }

    return {
        initiate: initiate
    };
})();