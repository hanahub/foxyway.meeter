/// <reference path="XeroxJavascriptLibrary/XRXWebservices.js" />
/// <reference path="../vendor/q.js" />
/// <reference path="XeroxJavascriptLibrary/XRXTemplate.js" />
/// <reference path="xw.js" />

var xw = xw || {};

xw.templates = (function () {

	function getTemplateList(){
		var deferred = Q.defer();

	    xw.ajaxEnqueue(function() {
	        
	        xrxTemplateGetTemplateList(
			    xw.serviceBase,
			    function (request, response) {
			        deferred.resolve(parseListResponse(response));
			    }, function (request, response) {
			        deferred.reject(response);
			    }, xw.defaultTimeout
            );

	    }, deferred.promise);

		return deferred.promise;
	}

	function parseListResponse(response) {
	   
	    var rawResponse = xrxTemplateParseGetTemplateList(response);

	    var responseAsArr = new Array();

	    for (var key in rawResponse) {
	        if (rawResponse.hasOwnProperty(key)) {
	            responseAsArr.push({
	                name: key,
	                checksum: rawResponse[key]
	            });
	        }
	    }

	    return responseAsArr;
	}

	function getTemplate(templateName) {
	    var deferred = Q.defer();

	    xw.ajaxEnqueue(function() {

	        xrxTemplateGetTemplate(
                xw.serviceBase,
                templateName,
	            function (request, response) {
	                deferred.resolve(parseTemplateResponse(response));
	            },
	            function (request, response) {
	                deferred.reject(response);
	            }, xw.defaultTimeout
            );

	    }, deferred.promise);

	    return deferred.promise;
	}

	function parseTemplateResponse(response) {
	    var templateData = xrxTemplateParseGetTemplate(response),
	        template = {},
	        index = 0;

	    while ((index = templateData.indexOf("[", index)) >= 0) {
	        var endOfTitle = templateData.indexOf("]", index),
	            title = templateData.substring(index + 1, endOfTitle);

	        template[title] = {};

	        var startOfBlock = templateData.indexOf('{', endOfTitle),
	            block = templateData.substring(startOfBlock + 1, templateData.indexOf("}", startOfBlock));

	        var blockAsArr = block.split(';');
	        for (var key in blockAsArr) {
	            var keyVal = blockAsArr[key].split('=');
	            keyVal[1] && (template[title][keyVal[0].trim()] = keyVal[1].trim());
	        }

	        index = templateData.indexOf("end", index);
	    }

	    return template;
	}

   
	function getDefaultTemplate() {
	    var deferred = Q.defer();
	    var sendUrl = xw.serviceBase + XRX_TEMPLATE_PATH;
	    var sendReq = getDefaultTemplateRequest();

	    xw.ajaxEnqueue(function() {

	        xrxCallWebservice(
	            sendUrl,
	            sendReq,
	            function(request, response) {
	                deferred.resolve(parseTemplateResponse(response));
	            },
	            function(request, response) {
	                deferred.reject(response);
	            }, xw.defaultTimeout
            );

	    }, deferred.promise);

	    return deferred.promise;
	}

	function getDefaultTemplateRequest() {
	    return XRX_TEMPLATE_SOAPSTART
                + xrxCreateTag('GetDefaultTemplateRequest', XRX_TEMPLATE_NAMESPACE,
                xrxCreateTag('serviceName', 'xsi:nil="true"', ''))
                + XRX_TEMPLATE_SOAPEND;
	}
    
	

	function putTemplate(templateName, template) {

	    var templateAsString = templateToString(template);

        var deferred = Q.defer();

	    xw.ajaxEnqueue(function() {

	        xrxTemplatePutTemplate(
	            xw.serviceBase,
	            templateName,
	            templateAsString,
	            function(request, response) {
	                deferred.resolve(xrxTemplateParsePutTemplate(response));
	            },
	            function(request, response) {
	                deferred.reject(response);
	            }, xw.defaultTimeout
            );

	    }, deferred.promise);

        return deferred.promise;
    }

    function deleteTemplate(name, checksum){

    	console.log('Will remove template');
    	console.log('name: ' + name);
    	console.log('checksum: ' + checksum);

    	var deferred = Q.defer();

	    xw.ajaxEnqueue(function() {

	        xrxTemplateDeleteTemplate(
	            xw.serviceBase,
	            name,
	            checksum,
	            function(request, response) {
	            	console.log(response);
	                deferred.resolve(xrxTemplateParseDeleteTemplate(response));
	            },
	            function(request, response) {
	            	console.log(response);
	                deferred.reject(response);
	            }, xw.defaultTimeout
            );

	    }, deferred.promise);

        return deferred.promise;
    }
    

    function templateToString(template) {
    	/// <summary>
        /// Convert a js object to string representation of a template
        /// that is parsable by the machine
    	/// </summary>
    	/// <param name="template"></param>
        /// <returns type="string"></returns>

        var asStr = '',
        	stringIdentifier = 'string';

        for (var key in template) {
            if (template.hasOwnProperty(key)) {
                asStr += "[" + key + "]";
                

                // Make sure we can handle multiple blocks for one key
                var blockList = [].concat(template[key]);

                console.log(blockList);

                for (var i = blockList.length - 1; i >= 0; i--) {
                	asStr += "\n{";
                	var block = blockList[i];
                	for (var blockKey in block) {
	                    if (block.hasOwnProperty(blockKey)) {

	                    	var valWrapper = (blockKey.indexOf(stringIdentifier) > -1 && block[blockKey].indexOf("\"") === -1) ? "\"" : "";

	                        asStr += "\n" + blockKey + " = " + valWrapper + block[blockKey] + valWrapper + ";";
	                    }
	                }
	                asStr += "\n}\n";
                };
                
                asStr += "end\n\n";
            }
        }
        console.log(asStr);
        return asStr;
    }

	return {
	    getList: getTemplateList,
	    get: getTemplate,
	    put: putTemplate,
	    getDefault: getDefaultTemplate,
	    remove: deleteTemplate
	}
	
})();