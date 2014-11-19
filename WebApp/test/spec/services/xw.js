'use strict';

describe('Service: Xw', function () {

  // load the service's module
  beforeEach(module('workflowScanApp'));

  // instantiate service
  var Xw;
  beforeEach(inject(function (_Xw_) {
    Xw = _Xw_;
  }));

  it('should do something', function () {
    expect(!!Xw).toBe(true);
  });

});
