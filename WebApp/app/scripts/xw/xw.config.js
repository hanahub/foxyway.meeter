/// <reference path="xw.js" />

var xw = xw || {};

xw.config = (function () {

    function getInfo() {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function(){
            xrxDeviceConfigGetDeviceInformation(
                xw.serviceBase,
                function (request, response) {

                    var resObj = {};

                    var resDoc = xrxDeviceConfigParseGetDeviceInfo(response);

                    console.log((new XMLSerializer()).serializeToString(resDoc));

                    var resels = resDoc.getElementsByTagName("serial");
                    if (resels == null || resels.length < 1) {
                        resObj.ip = resels[0].childNodes[0].nodeValue;
                    }

                    resels = resDoc.getElementsByTagName("mac");
                    if (resels == null || resels.length < 1) {
                        resObj.mac = resels[0].childNodes[0].nodeValue;
                    }

                    deferred.resolve(resObj);

                },function(request, response){
                    deferred.reject(response);
                }
            );
        }, deferred.promise);
        

        return deferred.promise;
    }

    return {
        getInfo: getInfo
    };
})();


