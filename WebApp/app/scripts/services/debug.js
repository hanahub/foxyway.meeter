'use strict';

angular.module('foxwayApp')
  .service('debug', function debug() {
    var messages = ['App started'];

    function log(message){
    	messages.unshift(message);
    }


    return {
    	messages: messages,
    	log: log
    };
  });