/// <reference path="XeroxJavascriptLibrary/XRXJobManagement.js" />
/// <reference path="xw.js" />

var xw = xw || {};

xw.jobs = (function () {

    function getStatusString(response){
        var payloadNode = xrxFindElement( xrxStringToDom( response ), ["JobInfoXmlDocument"] );
        var payload = xrxGetValue( payloadNode );
        var data = xrxFindElement( xrxStringToDom( xrxUnescape( payload ) ), ["JobInfo","JobState"] );
        return xrxGetValue( data );
    }

    function getStatus(jobId) {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function(){
                xrxGetJobDetails(
                    xw.serviceBase,
                    'WorkflowScanning',
                    'JobId',
                    jobId,
                    function(request, response) {

                        var returnObj = {};
                        returnObj.state = getStatusString(response);
                        returnObj.reason = xrxJobMgmtParseJobStateReasons(response);
                        deferred.resolve(returnObj);
                    },
                    function(request, response) {
                        deferred.reject(response);
                    }
                );
            },
            deferred.promise
        );
        return deferred.promise;
    }

    return {
        getStatus: getStatus
    };
})();


function postLog(message){
    $.ajax({
      type: "POST",
      url: "http://192.168.12.90:3000/api/log",
      data: { message: message}
    })
}