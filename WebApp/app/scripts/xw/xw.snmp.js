/// <reference path="XeroxJavascriptLibrary/XRXWsSnmp.js" />
/// <reference path="xw.js" />

// parameters: url, communityString, oid, callback_success, callback_failure, timeout, async 

// arrays for device info
// ['label string', 'oid string', value]
var deviceName = ['System Name', '1.3.6.1.2.1.1.5.0', ''];
var deviceSysDescr = ['System Description', '1.3.6.1.2.1.1.1.0', ''];
var deviceModel = ['Device Model', '1.3.6.1.2.1.1.1.0', ''];
var deviceContact = ['Device Contact', '1.3.6.1.2.1.1.4.0', ''];
var deviceIPv4 = ['IP Address', '1.3.6.1.2.1.4.20.1.1', ''];
var deviceSerialNumber = ['Serial Number', '1.3.6.1.2.1.43.5.1.1.17.1', ''];
var deviceFirmWare = ['Firmware Level', '1.3.6.1.2.1.1.1.0', ''];
var deviceCustomerAssetTag = ['Customer Asset Tag', '1.3.6.1.4.1.253.8.53.3.2.1.15.1', ''];
var deviceXeroxAssetTag = ['Xerox Asset Tag', '1.3.6.1.4.1.253.8.53.3.2.1.14.1', ''];
var deviceState = ['General Status', '1.3.6.1.2.1.25.3.2.1.5.1', ''];
var deviceStatus = ['Error(s)', '1.3.6.1.2.1.25.3.5.1.2.1', ''];

// arrays for counters description
var totalDescr = ['Total Impressions Description', '1.3.6.1.4.1.253.8.53.13.2.1.8.1.20.1', ''];
var colorDescr = ['Color Impressions Description', '1.3.6.1.4.1.253.8.53.13.2.1.8.1.20.33', ''];
var blackDescr = ['Black Impresions Description', '1.3.6.1.4.1.253.8.53.13.2.1.8.1.20.34', ''];

// arrays for counters
// ['label string', 'oid string', value]
var pageCount = ['Page Count', '1.3.6.1.2.1.43.10.2.1.4.1.1', 0];
var totalImpressions = ['Total Impressions', '1.3.6.1.4.1.253.8.53.13.2.1.6.1.20.1', 0];
var colorImpressions = ['Color Impressions', '1.3.6.1.4.1.253.8.53.13.2.1.6.1.20.33', 0];
var blackImpressions = ['Black Impresions', '1.3.6.1.4.1.253.8.53.13.2.1.6.1.20.34', 0];

var tonerDescr = "1.3.6.1.2.1.43.11.1.1.6.1.";
var tonerLevel = "1.3.6.1.2.1.43.11.1.1.9.1.";
var tonerCap = "1.3.6.1.2.1.43.11.1.1.8.1.";

var blackIndex = "1";
var cyanIndex = "2";
var magentaIndex = "3";
var yellowIndex = "4";


// test

var xw = xw || {};

xw.snmp = (function () {

    function get(oid) {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function() {

            xrxWsSnmpGet(
                xw.serviceBase,
                xw.communityString,
                oid,
                function (request, response) {
                    var snmpGetObj = xrxWsSnmpParseGet(response);
                    var snmpAsObj = {
                        OID: snmpGetObj.OID,
                        Type: snmpGetObj.Type,
                        returnValue: snmpGetObj.returnValue
                    }
                    deferred.resolve(snmpAsObj);
                },
                function (request, response) {
                    deferred.reject(response);
                }, 
                xw.defaultTimeout,
                false
            );


        }, deferred.promise);
        

        return deferred.promise;
    }

    function getTotalPages() {
        var deferred = Q.defer();

        xw.ajaxEnqueue(function() {
            xrxWsSnmpParseGet(xrxWsSnmpGet(xw.serviceBase, xw.communityString, '1.3.6.1.2.1.43.10.2.1.4.1.1', null, null, 0, false)).returnValue;
        }, deferred.promise);
        
        return deferred.promise;

    }

    function fun() 
    {
        $.ajax({
            type: "POST",
            url: "localhost:11223/snmp/get-value",
            data: '{"oid": "1.3.6.1.2.1.1.1.0", "host": "10.0.0.65" }', 
            contentType: "application/json; charset=utf-8", 
            dataType: "json", 
            success: function (data) {
             alert(data);
             alert(data.d);
            }
        });
    }

    return {
        get: get,
        getTotalPages: getTotalPages,
    };
})();