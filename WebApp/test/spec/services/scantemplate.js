'use strict';

describe('Service: Scantemplate', function () {

  // load the service's module
  beforeEach(module('workflowScanApp'));

  // instantiate service
  var Scantemplate;
  beforeEach(inject(function (_Scantemplate_) {
    Scantemplate = _Scantemplate_;
  }));

  it('should do something', function () {
    expect(!!Scantemplate).toBe(true);
  });

});
