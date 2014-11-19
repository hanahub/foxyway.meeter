'use strict';

angular.module('foxwayApp')
  .service('xw', function xw($rootScope) {
    if (!window.xw) {
        throw "xw is not defined. Please include the xw library in your index.html";
    } else {

    	// Add listener to the hard start button
    	document.addEventListener("keypress", function(event){
    		if(event.keyCode == 4098 || event.keyCode == 13){
    			$rootScope.$emit("start-pressed");
    		}
    	});

        return window.xw;
    }
  });
