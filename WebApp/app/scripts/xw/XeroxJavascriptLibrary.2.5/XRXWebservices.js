/* 
 * XrxWebservices.js
 * Copyright (C) Xerox Corporation, 2007.  All rights reserved.
 *
 * This file encapsulates the functions to Xerox webservices.
 *
 * @revision    10/07/2007
 *              09/21/2012 
 *              10/15/2012  AHB Updated
 */
 
/****************************  CONSTANTS  *******************************/

// Overall Webservices Library Version
var XRX_WEBSERVICES_LIBRARY_VERSION = "2.81";

var XRX_XML_TYPE_BOOLEAN = 'xsi:type="xsd:boolean"';
var XRX_XML_TYPE_NONE    = '';
var XRX_XML_TYPE_SESSION_INFO = 'xsi:type="xrxses:SessionInformation"';

/****************************  GLOBALS  *******************************/

// Ajax Request Object
var xrxXmlhttp = new XMLHttpRequest();
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
function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers, username, password )
{
    xrxCallAjax( url, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout, username, password )           
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
* @param    username            optional username for ajax request
* @param    password            optional password for ajax request
*/
function xrxCallAjax( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password )
{
	// For Firefox
    try 
    {
        netscape.security.PrivilegeManager.enablePrivilege( "UniversalBrowserRead" );
    } catch (e) {};
	++xrxTimeoutCtr;
	xrxResponseSaved = null;
	xrxEnvelope = envelope;
	xrxStatusText = "";
	xrxAjaxSuccessCallback = callback_success;
	xrxAjaxFailureCallback = callback_failure;
	xrxXmlhttp.abort();
	if((username == undefined) || (password == undefined))
	    xrxXmlhttp.open( type, (xrxUrl = url), true );
	else
	    xrxXmlhttp.open( type, (xrxUrl = url), true, username, password );
	if(headers != null)
	{
		for(var i = 0;i < headers.length;++i)
		{
			xrxSavedRequestHeaders += headers[i][0] + ":" + headers[i][1] + "\n";
			xrxXmlhttp.setRequestHeader( headers[i][0], headers[i][1] );
		}
	} else
	{
	    xrxSavedRequestHeaders = "SOAPAction:\"\"\n";
	    xrxXmlhttp.setRequestHeader("SOAPAction", '""');
	    xrxSavedRequestHeaders += "Content-Type:text/xml\n";
	    xrxXmlhttp.setRequestHeader( "Content-Type", "text/xml" );
	}
	// response function
	xrxXmlhttp.onreadystatechange = function() 
	{
		if((xrxXmlhttp != null) && (xrxXmlhttp.readyState == 4))
		{
			try
			{
				var tflag = xrxTimeoutFlag;
				xrxTimeoutFlag = 0;
				if(tflag >= 0)
				{
					if(xrxSaveResponseFlag) xrxResponseSaved = xrxXmlhttp.responseText;
					var response = xrxXmlhttp.responseText;
					var status = xrxXmlhttp.status;
					xrxStatusText = ((xrxXmlhttp.statusText != undefined)?xrxXmlhttp.statusText:"");
					xrxSavedResponseHeaders = xrxXmlhttp.getAllResponseHeaders();
					//xrxXmlhttp = null;
					if(status != 200) 
					{
						if(xrxAjaxFailureCallback != null) 
							xrxAjaxFailureCallback( xrxEnvelope, response, status );
					} else 
					{
						if(xrxAjaxSuccessCallback != null) 
							xrxAjaxSuccessCallback( xrxEnvelope, response );
					}
				}
			}
			catch( e )
			{
				xrxAjaxFailureCallback( xrxEnvelope, "<comm_error>" + e.toString() + "</comm_error>", 0 );
			}
		}
	}
	xrxXmlhttp.send( xrxEnvelope );
	if((timeout != undefined) && (timeout != null) && (timeout > 0) && 
			(xrxAjaxFailureCallback != undefined) && (xrxAjaxFailureCallback != null)) 
		setTimeout( "xrxTimeout(" + xrxTimeoutCtr + ")", (xrxTimeoutFlag = (timeout * 1000)) );
}

/**
* This function handles the timeout and calls the error handler if a response has
* not been received.
*
* @param	ctr		timeout id
*/
function xrxTimeout( ctr )
{
	if((xrxTimeoutFlag > 0) && (ctr == xrxTimeoutCtr)) 
	{
		var tflag = (xrxTimeoutFlag / 1000);
		xrxTimeoutFlag = -1;
		xrxXmlhttp.abort();
		xrxAjaxFailureCallback( xrxEnvelope, "<comm_error>COMM TIMEOUT(" + tflag + " sec)</comm_error>", -99 );
	}
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

function xrxParsePayload( text, name )
{
    var result = "";
    var index;
    if((index = text.indexOf( ":" + name + ">" )) < 0)
        if((index = text.indexOf( "<" + name + ">" )) < 0)
            if((index = text.indexOf( ":" + name + " " )) < 0)
                index = text.indexOf( "<" + name + " " );
    if(index >= 0)
    {
        var fullname = xrxGetWholeName( text, name, index );
        index = text.indexOf( ">", index ) + 1;
        var index2 = text.indexOf( "/" + fullname, index );
        if(index2 > 0)
            result = text.substring( index, index2 - 1 );
    }
    return result;
}

function xrxGetWholeName( text, name, index )
{
    var result;
    var start = xrxBackSearch( text, '<', index );
    if((start >= 0) && (start < index))
        result = text.substring( start + 1, start + ((index - start) + name.length + 1) );
    else
        result = "";
    return result;
}

function xrxBackSearch( text, theChar, index )
{
    var result;
    for(result = index;(text.charAt( result ) != theChar) && (result >= 0);--result);
    return result;
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

/*************************  End of File  *****************************/
