var xw = xw || {};

xw.serviceBase = "https://localhost";
xw.communityString = "public";
xw.defaultTimeout = 30;

// Simple logic to prevent concurrent ajax requests beccause the browser
// can't handle it!
xw.ajaxQueue = [];
xw.ajaxParallel = 1;
xw.ajaxOutstanding = 0;
 
xw.ajaxEnqueue = function(method, promise) {
    
    xw.ajaxQueue.push(function() {

    	method();

    	promise.then(function() {
            xw.ajaxOutstanding--;
            xw.ajaxDequeue();
        }, function(val) {
            xw.ajaxOutstanding--;
            xw.ajaxDequeue();
        });
    });

    xw.ajaxDequeue();
};

xw.ajaxDequeue = function() {
    if (xw.ajaxOutstanding < xw.ajaxParallel && xw.ajaxQueue.length > 0) {
        xw.ajaxOutstanding++;
        xw.ajaxQueue.shift()();
    }
};