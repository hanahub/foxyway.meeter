
/* 
 * XrxWebservices.sim
 * Copyright (C) Xerox Corporation, 2007.  All rights reserved.
 *
 * This file encapsulates the functions to simulate Xerox webservices.
 *
 * @revision 10/07/2007
 */
 
/****************************  CONSTANTS  *******************************/

// Overall Webservices Sim Library Version
var XRX_WEBSERVICES_LIBRARY_VERSION = "Sim 1.0";

var XRX_XML_TYPE_BOOLEAN = 'xsi:type="xsd:boolean"';
var XRX_XML_TYPE_NONE    = '';
var XRX_XML_TYPE_SESSION_INFO = 'xsi:type="xrxses:SessionInformation"';

/****************************  GLOBALS  *******************************/

// Ajax Request Object
var xrxXmlhttp;
// Ajax Request Xml
var xrxEnvelope = null;
// Ajax Destination Url
var xrxUrl = null;
// Ajax Return Status Message
var xrxStatusText = "";
// Storage for Last Ajax Response
var xrxResponseSaved = null;
// Flag to Indicate to Save Ajax Response
var xrxSaveResponseFlag = false;
// Storage for Last Ajax Request Headers
var xrxSavedRequestHeaders = null;
// Storage for Last Ajax Response Headers
var xrxSavedResponseHeaders = null;
// Storage for Success Callback Function Address
var xrxAjaxSuccessCallback = null;
// Storage for Failure Callback Function Address
var xrxAjaxFailureCallback = null;
// Ajax Timeout Flag
var xrxTimeoutFlag = null;
// Ajax Timeout Counter
var xrxTimeoutCtr = 0;

/****************************  FUNCTIONS  *****************************/

/**
* This function calls the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
* @param	headers				array of optional headers in format {name:value} or null (optional)
*/
function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers )
{
    xrxCallAjax( url, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout )           
}

/**
* This function is the low level Ajax function to send the request.
*
* @param	url					destination address
* @param	envelope			xml string for body of message
* @param	type				request type (GET or POST)
* @param	headers				array of arrays containing optional headers to set on the request or null
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxCallAjax( url, envelope, type, headers, callback_success, callback_failure, timeout )
{
	xrxResponseSaved = null;
	xrxEnvelope = envelope;
	xrxStatusText = "";
	xrxAjaxSuccessCallback = callback_success;
	xrxAjaxFailureCallback = callback_failure;
	xrxUrl = url;
	if(headers != null)
	{
		for(var i = 0;i < headers.length;++i)
		{
			xrxSavedRequestHeaders += headers[i][0] + ":" + headers[i][1] + "\n";
		}
	} else
	{
	    xrxSavedRequestHeaders = "SOAPAction:\"\"\n";
	    xrxSavedRequestHeaders += "Content-Type:text/xml\n";
	}
	var response = getResponse( url, envelope );
	if(xrxSaveResponseFlag) xrxResponseSaved = response;
	xrxStatusText = "";
	xrxSavedResponseHeaders = "Connection=close\nPragma=no-cache\nTransfer-Encoding=chunked\n"
	    + "Cache-Control=no-cache\nContent-Type=text/xml; charset=\"utf-8\"\n"
	    + "Date=Thu, 21 Feb 2008 17:16:50 GMT;\n";
	if(xrxAjaxSuccessCallback != null) 
		xrxAjaxSuccessCallback( xrxEnvelope, response );
}

function getResponse( url, envelope )
{
    switch( url )
    {
        case 'https://127.0.0.1/webservices/office/wsdxrxscan/1':
        case 'https://localhost/webservices/office/wsdxrxscan/1':
            if(envelope.indexOf( "GetInterfaceVersionRequest" ) > 0)
                return getData( "SCAN_INTERFACE_VERSION" );
            if(envelope.indexOf( "InitiateScanRequest" ) > 0)
                return getData( "SCAN_INITIATE_SCAN" );
            if(envelope.indexOf( "GetXrxResourceSimpleRequest" ) > 0)
                return "";
            break;
        case 'https://127.0.0.1/webservices/office/cuisession/1':
        case 'https://localhost/webservices/office/cuisession/1':
            if(envelope.indexOf( "GetInterfaceVersionRequest" ) > 0)
                return getData( "SESSION_INTERFACE_VERSION" );
            if(envelope.indexOf( "GetSessionInformationRequest" ) > 0)
                return getData( "SESSION_GET_SESSION" );
            break;
        case 'https://127.0.0.1/webservices/office/template_management/1':
        case 'https://127.0.0.1/webservices/office/template_management/1':
            if(envelope.indexOf( "ListTemplatesRequest" ) > 0)
                return getData( "TEMPLATE_LIST_TEMPLATES" );
            break;
    }
    return null;
}

// Helper functions

/**
* This function parses the interface version.
*
* @param	response	webservice response in string form
* @return	array	[MajorVersion],[MinorVersion],[Revision]
*/
function xrxParseInterfaceVersion( response )
{
	var result = new Array();
	var dom = xrxStringToDom( response );
	var data = xrxGetTheElement( dom, "InterfaceVersion" );
	var node = xrxFindElement( data, ["MajorVersion"] );
	if(node != null) result['MajorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["MinorVersion"] );
	if(node != null) result['MinorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["Revision"] );
	if(node != null) result['Revision'] = xrxGetValue( node );
	return result;
}

/**
* This function parses the error response.
*
* @param	response	webservice response in string form
* @return	fault portion of response in DOM form or null
*/
function xrxParseErrorResponse( response )
{
	var data = null;
	if((response != null) && (response != ""))
		data = xrxFindElement( xrxStringToDom( response ), ["Fault"] );
	return data;
}

/**
* This function retrieves the last url used in an Ajax call.
*
* @return	envelope in string form
*/
function xrxGetUrl()
{
	return xrxUrl;
}

/**
* This function retrieves the last envelope used in an Ajax call.
*
* @return	envelope in string form
*/
function xrxGetEnvelope()
{
	return xrxEnvelope;
}

/**
* This function retrieves the last Ajax request status text.
*
* @return	string	status text or ""
*/
function xrxGetStatusText()
{
	return xrxStatusText;
}

/**
* This function sets the flag to save the last response received 
* in an Ajax call.
*
* @param	value	true=save response
*/
function xrxSetSavedResponse( value )
{
	xrxSaveResponseFlag = value;
}

/**
* This function retrieves the last Ajax response received in an Ajax call.
*
* @return	response in string form
*/
function xrxGetSavedResponse()
{
	return xrxResponseSaved;
}

/**
* This function retrieves the last Ajax response headers received in an Ajax call.
*
* @return	headers in string form
*/
function xrxGetSavedResponseHeaders()
{
	return xrxSavedResponseHeaders;
}

/**
* This function retrieves the last Ajax request headers received in an Ajax call.
*
* @return	headers in string form
*/
function xrxGetSavedRequestHeaders()
{
	return xrxSavedRequestHeaders;
}

/*************************  Support Files  *****************************/

/**
* This function returns the Library version.
*
* @return	string	version string
*/
function xrxGetWebservicesLibraryVersion()
{
    return XRX_WEBSERVICES_LIBRARY_VERSION;
}

/**
* This function creates an xml tag in a string.
*
* @param	label		tag
* @param	type		attribute
* @param	value		text value
*/
function xrxCreateTag( label, type, value )
{
    if(type == "")
    {
        return( "<" + label + ">" + value + "</" + label + ">" );
    }
    else
    {
        return( "<" + label + " " + type + ">" + value + "</" + label + ">" );
    }
}

/*************************  ASync Framework  *****************************/

// Singleton object
var xrxASyncFramework = new XrxASyncFramework();

/**
* This constructor creates an object that handles some of the complexities
* of async programming. It works on the idea of a 'framework'. This framework
* is an array that hols a series of steps each with its function to call if
* the previous level was successful and one to call if not. Storage of 
* intermediate values is accomplished by the store and recall functions.
*
* A typical setup would be:
*	framework = new Array();
*	framework[0] = ["loadTemplates"];
*	framework[1] = ["finishLoadTemplates","commFailure"];
*	framework[2] = ["finishInitiateScan","commFailure"];
*	xrxASyncFramework.load( framework );
*	xrxASyncFramework.start();
*
* The function loadTemplates would be called first. Somewhere in that function a 
* Ajax call will be made. When it returns the AsyncFramework will execute the 
* first function call of the next layer if the Ajax call was successful and the 
* second if a failure. This will continue until the framework is no longer called 
* or all layers are executed.
*/
function XrxASyncFramework()
{
	this.framework = null;
	this.queue = new Array();
	this.step = 0;
	this.cancel = false;
	this.parameters = null;
	
	this.load = xrxASyncLoadFramework;
	this.start = xrxASyncStartFramework;
	this.stop = xrxASyncStopFramework;
	this.restart = xrxASyncStartFramework;
	this.store = xrxASyncStoreParameter;
	this.recall = xrxASyncGetParameter;
	this.clear = xrxASyncClear;
	this.success = xrxASyncSuccessCallback;
	this.failure = xrxASyncFailureCallback;
}

/**
* This function loads a new framework and returns internal values
* to default.
*
* @param	framework	framework to load
*/
function xrxASyncLoadFramework( framework )
{
	this.framework = framework;
	this.step = 0;
	this.cancel = false;
	this.parameters = new Array();
}

/**
* This function clears the data from the framework.
*/
function xrxASyncClear()
{
	this.cancel = true;
	this.parameters = null;
	this.framework = new Array();
	this.step = 0;
}

/**
* This function starts the framework executing.
*/
function xrxASyncStartFramework()
{
	eval( this.framework[this.step++][0] + "()" );
}

/**
* This function stops the framework.
*/
function xrxASyncStopFramework()
{
	this.cancel = true;
}

/**
* This function stores a given value.
*
* @param	name	name of stored value
* @param	value	value to store
*/
function xrxASyncStoreParameter( name, value )
{
	this.parameters[name] = value;
}

/**
* This function retreives a previously stored value.
*
* @param	name	name of stored value
*/
function xrxASyncGetParameter( name )
{
	return this.parameters[name];
}

/*************************  External Functions  *****************************/

/**
* This function is called upon successful conclusion of a webservice call.
*/
function xrxASyncSuccessCallback()
{
	xrxASyncCallback( arguments, 0 );
}

/**
* This function is called upon a failed conclusion of a webservice call.
*/
function xrxASyncFailureCallback()
{
	xrxASyncCallback( arguments, 1 );
}

/**
* This function is handles the callback. The arguments are stored 
* under p1 ... pn.
*
* @param	params	arguments sent from Ajax handler
* @param	code	0=successful, 1=failure
*/
function xrxASyncCallback( params, code )
{
	if(xrxASyncFramework.parameters != null)
		for(var i = 0;i < params.length;++i)
			xrxASyncFramework.store( ("p" + i), params[i] );
	if(!xrxASyncFramework.cancel)
		if(xrxASyncFramework.framework[xrxASyncFramework.step] != undefined)
			if(xrxASyncFramework.framework[xrxASyncFramework.step] != null)
				eval( xrxASyncFramework.framework[xrxASyncFramework.step++][code] + "()" );
}

/***********************************  Data  *****************************************/

function getData( name )
{
	switch( name )
	{
		case "SCAN_INTERFACE_VERSION":
			return '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/'
				+ 'soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.'
				+ 'org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsu="http://docs.oas'
				+ 'is-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wsut="http://docs.oasis-o'
				+ 'pen.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0" xmlns:dpws="http://schemas.xmlsoap.'
				+ 'org/ws/2006/02/devprof" xmlns:asdl="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="ht'
				+ 'tp://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xrxtms="http:'
				+ '//www.xerox.com/webservices/office/template_management/1/" xmlns:xrxsas="http://www.xerox.com/webser'
				+ 'vices/office/smart_auth/1" xmlns:xrxreg="http://www.xerox.com/webservices/office/cuiregistration/1" '
				+ 'xmlns:xrxses="http://www.xerox.com/webservices/office/cuisession/1" xmlns:xrxscn="http://schemas.xer'
				+ 'ox.com/office/wsd" xmlns:xrxdevcfg="http://www.xerox.com/webservices/office/device_configuration/1" '
				+ 'xmlns:xrxacc="http://www.xerox.com/webservices/office/accessconfig/1"><SOAP-ENV:Header></SOAP-ENV:He'
				+ 'ader><SOAP-ENV:Body id="_0"><InterfaceVersion xmlns="http://schemas.xerox.com/office/wsd"><MajorVers'
				+ 'ion>1</MajorVersion><MinorVersion>1</MinorVersion><Revision>0</Revision></InterfaceVersion></SOAP-EN'
				+ 'V:Body></SOAP-ENV:Envelope>';
		case "SCAN_INITIATE_SCAN":
			return '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/'
				+ 'soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.'
				+ 'org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsu="http://docs.oas'
				+ 'is-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wsut="http://docs.oasis-o'
				+ 'pen.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0" xmlns:dpws="http://schemas.xmlsoap.'
				+ 'org/ws/2006/02/devprof" xmlns:asdl="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="ht'
				+ 'tp://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xrxtms="http:'
				+ '//www.xerox.com/webservices/office/template_management/1/" xmlns:xrxsas="http://www.xerox.com/webser'
				+ 'vices/office/smart_auth/1" xmlns:xrxreg="http://www.xerox.com/webservices/office/cuiregistration/1" '
				+ 'xmlns:xrxses="http://www.xerox.com/webservices/office/cuisession/1" xmlns:xrxscn="http://schemas.xer'
				+ 'ox.com/office/wsd" xmlns:xrxdevcfg="http://www.xerox.com/webservices/office/device_configuration/1" '
				+ 'xmlns:xrxacc="http://www.xerox.com/webservices/office/accessconfig/1"><SOAP-ENV:Header></SOAP-ENV:He'
				+ 'ader><SOAP-ENV:Body id="_0"><InitiateScanResponse xmlns="http://schemas.xerox.com/office/wsd"><JobID'
				+ '>dsp-lexington:27</JobID></InitiateScanResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>';
		case "SESSION_INTERFACE_VERSION":
			return '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/'
				+ 'soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.'
				+ 'org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xrxses="http://www.x'
				+ 'erox.com/webservices/office/cuisession/1"><SOAP-ENV:Body id="_0"><InterfaceVersion xmlns="http://www'
				+ '.xerox.com/webservices/office/cuisession/1"><MajorVersion>1</MajorVersion><MinorVersion>0</MinorVers'
				+ 'ion><Revision>1</Revision></InterfaceVersion></SOAP-ENV:Body></SOAP-ENV:Envelope>';
		case "SESSION_GET_SESSION":
			return '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/'
				+ 'soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.'
				+ 'org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xrxses="http://www.x'
				+ 'erox.com/webservices/office/cuisession/1"><SOAP-ENV:Body id="_0"><SessionInformationResponse xmlns="'
				+ 'http://www.xerox.com/webservices/office/cuisession/1"><Information xsi:type="xrxses:SessionInformati'
				+ 'on">&lt;?xml version="1.0" encoding="UTF-8"?&gt;&lt;SessionInformation xmlns="http://schemas.xerox.c'
				+ 'om/office/cui/sessioninformation/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"&gt;&lt;sch'
				+ 'emaVersion&gt;&lt;MajorVersion&gt;1&lt;/MajorVersion&gt;&lt;MinorVersion&gt;1&lt;/MinorVersion&gt;&l'
				+ 't;Revision&gt;0&lt;/Revision&gt;&lt;/schemaVersion&gt;&lt;email&gt;&lt;from&gt;&lt;/from&gt;&lt;/ema'
				+ 'il&gt;&lt;/SessionInformation&gt;</Information></SessionInformationResponse></SOAP-ENV:Body></SOAP-E'
				+ 'NV:Envelope>';
		case "TEMPLATE_LIST_TEMPLATES":
		    return '<?xml version="1.0" ?><env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP'
		        + 'ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
		        + ' xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xrxpath="http://www.xerox.com/webservices/office/'
		        + 'template_management/1/"><env:Body id="_0"><TemplateEntries xmlns="http://www.xerox.com/webservices/of'
		        + 'fice/template_management/1/"><TemplateEntry xsi:type="xrxpath:TemplateEntry"><TemplateName xsi:type="'
		        + 'xrxpath:TemplateName">DemoTemplate.xst</TemplateName><TemplateChecksum xsi:type="xrxpath:TemplateChec'
		        + 'ksum">1412976417</TemplateChecksum></TemplateEntry><TemplateEntry xsi:type="xrxpath:TemplateEntry"><T'
		        + 'emplateName xsi:type="xrxpath:TemplateName">TestTemplate.xst</TemplateName><TemplateChecksum xsi:type'
		        + '="xrxpath:TemplateChecksum">449603279</TemplateChecksum></TemplateEntry></TemplateEntries></env:Body>'
		        + '</env:Envelope>';
	}
}

/*******************************  End of File  **************************************/
