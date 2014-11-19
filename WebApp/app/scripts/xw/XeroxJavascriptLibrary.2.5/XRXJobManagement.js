/* 
 * XRXJobManagement.js
 * Copyright (C) Xerox Corporation, 2011.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Job Management Api 
 * webservices.
 *
 * @revision    06/26/2012
 *              10/15/2012  AHB Updated with missing methods
 *              11/01/2012  AHB Corrected comment in header for return value in xrxJobMgmtParseGetJobDetails
 */

/****************************  GLOBALS  *******************************/

var XRX_JOBMGMT_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

var XRX_JOBMGMT_SOAPEND = '</soap:Body></soap:Envelope>';

var XRX_JOBMGMT_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/JobManagement/1"';

var XRX_JOBMGMT_PATH = '/webservices/JobManagement/1';

/****************************  FUNCTIONS  *******************************/

//  Job Management Interface Version

/**
* This function gets the Job Management interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxJobMgmtGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtGetInterfaceVersionRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Job Management interface version request.
*
* @return	string	xml request
*/
function xrxJobMgmtGetInterfaceVersionRequest()
{
	return	XRX_JOBMGMT_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_JOBMGMT_NAMESPACE, '' ) 
			+ XRX_JOBMGMT_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxJobMgmtParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

//  GetJobDetails

/**
* This function gets job details for a specific job providing the job id
*
* @param	url					destination address
* @param    jobType             job type
* @param	jobId			    job id
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, headers ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtGetJobDetailsRequest( jobType, 'JobId', jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers);
}

/**
* This LEGACY function gets job details for a specific job providing the job id
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobIdType           job id type (for default use "" or null)
* @param	jobId			    job id
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxGetJobDetails( url, jobType, jobIdType, jobId, callback_success, callback_failure, timeout, headers ) 
{
    xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, headers );
}   

/**
* This function builds the request.
*
* @param    jobType     job type
* @param    jobIdType   job id type
* @param	jobId		job id     
* @return	string	    xml request
*/
function xrxJobMgmtGetJobDetailsRequest( jobType, jobIdType, jobId )
{
    var resq = XRX_JOBMGMT_SOAPSTART 
			+ xrxCreateTag( 'GetJobDetailsRequest', XRX_JOBMGMT_NAMESPACE,
			xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) + 
			xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
			+ XRX_JOBMGMT_SOAPEND;
    return resq;
}

/**
* This function returns the job state values.
*
* @param	response	webservice response in string form
* @return	array		xml payload in DOM form
*/
function xrxJobMgmtParseGetJobDetails( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobInfoXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( xrxUnescape( data ) );
	return data;
}

/**
* This LEGACY function returns the job state values.
*
* @param	response	webservice response in string form
* @return	string	    JobState
*/
function xrxParseGetJobDetails( response )
{
	return xrxJobMgmtParseGetJobDetails( response );
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    JobStateReason
*/
function xrxJobMgmtParseJobStateReasons( response )
{
	var payloadNode = xrxFindElement( xrxStringToDom( response ), ["JobInfoXmlDocument"] );
	var payload = xrxGetValue( payloadNode );
	var data = xrxFindElement( xrxStringToDom( xrxUnescape( payload ) ), ["JobInfo","JobStateReasons"] );
	return xrxGetValue( data );
}

//  Cancel Job

/**
* This function cancels the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobType             job type
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxJobMgmtCancelJob( url, jobType, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtCancelJobRequest( jobType, jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxJobMgmtCancelJobRequest( jobType, jobId )
{
	return XRX_JOBMGMT_SOAPSTART +
        xrxCreateTag( 'CancelJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_JOBMGMT_SOAPEND;
}

//  Pause Copy Job

/**
* This function pauses the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxJobMgmtPauseJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtPauseJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxJobMgmtPauseJobRequest( jobId )
{
	return XRX_JOBMGMT_SOAPSTART +
        xrxCreateTag( 'PauseJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_JOBMGMT_SOAPEND;
}

//  Resume Copy Job

/**
* This function resumes the job referenced by the given Id.
*
* @param	url					destination address
* @param    jobId               job Id for desired job
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxJobMgmtResumeCopyJob( url, jobId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtResumeJobRequest( jobId );
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the command request.
*
* @param    jobId               job Id for desired job
* @return	string	xml request
*/
function xrxJobMgmtResumeJobRequest( jobId )
{
	return XRX_JOBMGMT_SOAPSTART +
        xrxCreateTag( 'ResumeJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobId', '', 
                xrxCreateTag( 'JobIdentifierType', '', 'JobId' )
                +  xrxCreateTag( 'JobIdentifierString', '', jobId ) ) ) 
        + XRX_JOBMGMT_SOAPEND;
}


/*************************  End of File  *****************************/
