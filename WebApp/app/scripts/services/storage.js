'use strict';

/**
 * @ngdoc service
 * @name foxwayApp.Storage
 * @description
 * # Storage
 * Service in the foxwayApp.
 */
angular.module('foxwayApp')
  .service('Storage', function Storage() {


  	var auditCopyDestination = {
  		name: '',
  		host: '',
  		share: '',
  		path: '',
  		usename: '',
  		password: ''
  	};


  	function setItem(key, obj){
  		localStorage.setItem(key, JSON.stringify(obj));
  	}

  	function getItem(key){
  		var itemString = localStorage.getItem(key);
  		return JSON.parse(itemString);
  	}


  	return {
  		setItem: setItem,
  		getItem: getItem
  	}

  });
