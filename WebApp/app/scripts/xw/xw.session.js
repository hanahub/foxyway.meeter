/// <reference path="XeroxJavascriptLibrary/XRXSession.js" />
/// <reference path="xw.js" />

var xw = xw || {};

xw.session = (function () {

    function getInfo() {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function() {

            xrxSessionGetSessionInfo(
                xw.serviceBase,
                function (request, response) {
                    var sessInfoObj = xrxSessionParseGetSessionInfo(response);
                    var sessionAsObj = {
                        username: xrxGetElementValue(sessInfoObj, 'username') || 'Guest'
                    }
                    deferred.resolve(sessionAsObj);
                },
                function (request, response) {
                    deferred.reject(response);
                }
            );


        }, deferred.promise);
        

        return deferred.promise;
    }

    function isAdmin() {
        var deferred = Q.defer();
        getInfo().then(function(sessionInfo) {
            deferred.resolve(sessionInfo.username == "admin");
        });
        return deferred.promise;
    }

    return {
        getInfo: getInfo,
        isAdmin: isAdmin
    };
})();