/* 
 * XRXMassStorage.js
 * Copyright (C) Xerox Corporation, 2010.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api webservices.
 *
 * @revision    03/20/2010
 *              10/15/2012  AHB Updated
 */

/****************************  CONSTANTS  *******************************/

/**
 * Lock Request soap message
 *
<masstrg:LockRequestArgs>
    <masstrg:deviceNumber>0</masstrg:deviceNumber>
   </masstrg:LockRequestArgs>
  <?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope
 xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"
 xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
 xmlns:xop="http://www.w3.org/2004/08/xop/include"
 xmlns:masstrg="http://xml.namespaces.xerox.com/enterprise/MassStorage/1">
 <SOAP-ENV:Body>
   <masstrg:LockRequestArgs>
    <masstrg:deviceNumber>0</masstrg:deviceNumber>
   </masstrg:LockRequestArgs>
 </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
*/

var XRX_MASSSTORAGE_SOAPSTART = '<?xml version="1.0" encoding="UTF-8"?>'+
        '<SOAP-ENV:Envelope'+
        ' xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"' +
        ' xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'  +
        ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
        ' xmlns:xop="http://www.w3.org/2004/08/xop/include"' +
        ' xmlns:masstrg="http://xml.namespaces.xerox.com/enterprise/MassStorage/1">' +
        ' <SOAP-ENV:Body>';

var XRX_MASSSTORAGE_SOAPEND = '</SOAP-ENV:Body></SOAP-ENV:Envelope>';

var XRX_MASSSTORAGE_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/MassStorage/1"';

var XRX_MASSSTORAGE_PATH = '/webservices/MassStorage/1';

/****************************  FUNCTIONS  *******************************/

//  Interface Version

/**
* This function gets the interface version and returns the parsed values.
*
* @param	url					destination address
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxMassStorageGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_MASSSTORAGE_PATH;
    var sendReq = xrxMassStorageGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the interface version request.
*
* @return	string	xml request
*/
function xrxMassStorageGetInterfaceVersionRequest()
{
	return	XRX_MASSSTORAGE_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_MASSSTORAGE_NAMESPACE, '' ) 
			+ XRX_MASSSTORAGE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		Major.Minor.Revision
*/
function xrxMassStorageParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

// Lock

/**
* This function locks the Mass Storage device
*
* @param	url					destination address
* @param    peripheralId        peripheral id
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxMassStorageLock( url, peripheralId, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_MASSSTORAGE_PATH;
	var sendReq = xrxMassStorageLockRequest( peripheralId );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Lock request.
*
* @return	string	xml request
*/
function xrxMassStorageLockRequest( peripheralId )
{
	return	XRX_MASSSTORAGE_SOAPSTART +
		    xrxCreateTag( 'LockRequestArgs', XRX_MASSSTORAGE_NAMESPACE, xrxCreateTag('DeviceNumber', '', peripheralId )) +
		    XRX_MASSSTORAGE_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	key
*/
function xrxMassStorageParseLock( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ['Key'] );
	return xrxGetValue( data );
}

/**
* This LEGACY function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	key
*/
function xrxMassStorageParseKey( response )
{
	return xrxMassStorageParseLock( response )
}

// UnLock

/**
* This function unlocks the Mass Storage device
*
* @param	url					destination address
* @param    peripheralId        peripheral id
* @param    key                 key returned by lock, it must be provided when calling unlock method
* @param	callback_success	function to callback upon successfull completion
* @param	callback_failure	function to callback upon failed completion
* @param	timeout				function to call an error routine after a set amount 
*								of seconds (0[default] = no timeout)(optional)
*/
function xrxMassStorageUnlock( url, peripheralId, key, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_MASSSTORAGE_PATH;
	var sendReq = xrxMassStorageUnlockRequest( peripheralId, key );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
 * Unlock Request soap message
 *
 *
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance " 
xmlns:xsd="htt p://www.w3.org/2001/XMLSchema" 
xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" 
xmlns:wsse="http://d ocs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" 
xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oas is-200401-wss-wssecurity-utility -1.0.xsd">
<env:Header xmlns:env="http://www.w3.o rg/2003/05/soap-envelope">
<wsa:Action>http://xml.namespaces.xerox.com/enterprise/MassStorage/1/U nlock</wsa:Action>
<wsa:MessageID >urn:uuid:b0c29f80-4292-4ddb-a4a6-7517fc5d70f5</wsa:MessageID>
<wsa:ReplyTo><wsa:Address>http://s chemas.xmlsoap.org/ws/2004/08/addressing/role/an onymous</wsa:Address></wsa:ReplyTo>
<wsa:To>http://13.121.21.122/webservices/MassStorage/1</wsa:To><wsse:Security >
<wsu:Timestamp  wsu:Id="Timestam p-40fa34a8-8f64-4a9e-8d34-ede2c4f2b5e1">
<wsu:Created>2010-05-26T 19:01:27Z</wsu:Created><wsu:Expires>2010-05-26T19:06:27Z</wsu:Expires></wsu:Timestamp></wsse:Security></env:Header>
<soap:Body><UnLockRequestArgs  xmlns="http://xml.namespaces.xerox.com/enterprise/MassStorage/1">
<DeviceNumber> 1</DeviceNumber><Key>ylH5Y5fDym3OD3Dx</Key></UnLockRequestArgs></soap:Body></soap:Envelope>
*/

/**
* This function builds the Unlock request.
*
* @return	string	xml request
*/
function xrxMassStorageUnlockRequest( peripheralId, key )
{
	return XRX_MASSSTORAGE_SOAPSTART +
	        xrxCreateTag( 'UnLockRequestArgs', XRX_MASSSTORAGE_NAMESPACE, 
	        xrxCreateTag( 'DeviceNumber', '', peripheralId) + xrxCreateTag( 'Key' , '', key )) +
	        XRX_MASSSTORAGE_SOAPEND;
}

/*************************  End of File  *****************************/
