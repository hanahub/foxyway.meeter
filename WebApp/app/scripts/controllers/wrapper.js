'use strict';

angular.module('foxwayApp')
  .controller('WrapperCtrl', function ($scope, $rootScope, $translate, $timeout, status, debug, xw, Scantemplate, Storage) {
      $scope.visibleView = 'foxway-app';

      $scope.setVisibleView = function (newView) {
        $scope.visibleView = newView;
      };


    $rootScope.$on('start-pressed', function(){
        $scope.$apply(function(){

    		console.log('Start pressed');

            /*if(!validateTemplateData(Scantemplate.data)) {
                status.row1 = $translate.instant('templateDataError');
                debug.log('template is not valid')
                return;
            } 
            else {
                status.row1 = 'Initiating scanning';
                debug.log('template is valid')
            }

    		scan();*/
        });
    });

    //console.log('Scantemplate.data', Scantemplate.data);


    // Needed for deleting the temporary template when scanning is done
    var tempTemplateChecksum;

    function scan(){

        console.log('start of scan');

    	var templateName = Scantemplate.data['service xrx_svc_general']['string JobTemplateName'];

        var temporaryTemplate = pushAuditDestination(Scantemplate.data);

        console.log(Scantemplate.data);

    	putTemplate(templateName, temporaryTemplate).then(function(response){

            $scope.$apply(function(){
            	tempTemplateChecksum = response;

                console.log('template is on the device');

                console.log(templateName);
                
                console.log(response);

                console.log('before initScanning');

        		initScanning(templateName).then(function(jobId){
                    $scope.$apply(function(){
                        setTimeout(function(){
                            console.log('pollJobStatus');
                            pollJobStatus(jobId);
                        }, 5000);
                        console.log(jobId);
                        console.log('scanning initiated');
                    },function(err){
                        console.log('scanning error');
                        console.log(err);
                    });
        			
        		});
            });
    	});
    }


    // Put the temporary template on the machine
    function putTemplate(name, template){

    	var deferred = Q.defer();

    	// var template = Scantemplate.data;
    	
    	xw.templates.put(name, template).then(function(response){

    		$scope.$apply(function(){
    			// status.row1 = 'Template saved to printer';
    			console.log(response);
    			deferred.resolve(response);
    		});

    	},function(status){

    		$scope.$apply(function(){
    			status.row1 = 'Template could not be saved to printer';
    			console.log(status);
    		});

    	});

    	return deferred.promise;
    }

    function pushAuditDestination(baseTemplate){

        var copyOfTemplate = angular.copy(baseTemplate);

        var storageKey = 'auditCopyDestinationData';
        var auditDest = Storage.getItem(storageKey);

        if(!validateAuditDest(auditDest)){
            console.log('audit dest not valid');
            return copyOfTemplate;
        }

        console.log(auditDest);

        copyOfTemplate["service xrx_svc_file"] = [].concat(copyOfTemplate["service xrx_svc_file"]);

        copyOfTemplate["service xrx_svc_file"].push(
        {
            "* enum_filingpolicy DocumentFilingPolicy" : "NEW_AUTO_GENERATE",
            "* string RepositoryAlias" : auditDest.name,
            "* string DocumentPath" : auditDest.path,
            "* enum_loginsource LoginSource" : "TEMPLATE",
            "* string NDSNameContext" : "",
            "* string NDSTree" : "",
            "* string RepositoryName" : auditDest.host,
            "* string RepositoryVolume" : auditDest.share,
            "* enum_filingprotocol FilingProtocol" : "SMB",
            "* string UserNetworkFilingLoginName" : auditDest.username,
            "* string UserNetworkFilingLoginID" : auditDest.password,
            "* boolean ServerValidationReq" : "FALSE",
            "* string XrxHTTPScriptLocation" : "",
            "* boolean DocumentDirectoryXSM" : "FALSE"
        });

        return copyOfTemplate;
    }

    function validateAuditDest(dest){
        return (dest && dest.name && dest.host && dest.share && dest.path && dest.username && dest.password);
    }

    function initScanning(templateName){

    	var deferred = Q.defer();

    	xw.scan.initiate(templateName).then(function(response){
    		$scope.$apply(function(){
    			status.row1 = 'Scanning started';
    			console.log(response);
    			deferred.resolve(response);
    		});
    	}, function(response){
    		$scope.$apply(function(){
    			status.row1 = 'Scanning could not be started';
    			console.log(response);
    			deferred.reject(response);
    		});
    	});

    	return deferred.promise;
    }

    function pollJobStatus(jobId){
        console.log('polling status');
    	xw.jobs.getStatus(jobId).then(function (response) {

            console.log('got status');
            console.log(response);

    		$scope.$apply(function(){
    			status.row1 = 'Scanning in progress...';
    			console.log(response);

    			if(response.state === 'Completed'){
    				status.row1 = response.reason;
                    cleanUp();
    			}else{
    				setTimeout(function(){
    					pollJobStatus(jobId);
    				}, 3000);
    			}

    		});
    	}, function (response) {
    		$scope.$apply(function(){
    			status.row1 = 'Could not get job status';
    			console.log(response);
    		});
    	})
    }

    // Remove temporary template from the device
    function cleanUp(){
        var templateName = Scantemplate.data['service xrx_svc_general']['string JobTemplateName'];
        xw.templates.remove(templateName, tempTemplateChecksum).then(function(response){

            $scope.$apply(function(){
                status.row1 = 'Scanning completed';
                console.log(response);
                deferred.resolve(response);
            });



            $timeout(function(){
                $scope.$apply(function(){
                    status.row1 = $translate.instant('readyToScan');
                    console.log(response);
                    deferred.resolve(response);
                });
            }, 5000);

        },function(status){

            $scope.$apply(function(){
                status.row1 = 'Template could not be removed from printer';
                console.log(status);
            });

        });
    }

    // Checks that the template has all required fields 
    function validateTemplateData(templateData) {
        var isValid = true;
        var svcFile = templateData['service xrx_svc_file'];
        var requiredFields = ['enum_filingprotocol FilingProtocol'];
 
        if(!svcFile) {
            isValid = false;
        }

        if(isValid) {
            for (var i = 0; i < requiredFields.length; i++) {
                var field = svcFile[requiredFields[i]];

                if(field === '' || field === null || typeof field === 'undefined') {
                    //debug.log(requiredFields[i] + ' is not valid');
                    isValid = false;
                    break;
                }
                else {
                    //debug.log(requiredFields[i] + ' is valid');
                }
            }
        }

        return isValid;
    }
});
