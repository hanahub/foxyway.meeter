
angular.module('foxwayApp')
  .controller('MainCtrl', function ($scope, xw, Scantemplate, debug) {
  
    $scope.templateList = [];
    $scope.template = Scantemplate;

    $scope.debugLog = debug.messages;

    
    // Fill the template list with disabled items
    // 4 is the list max before overflowing
    var templateListOverflowLimit = 4;
    $scope.disabledItems = templateListOverflowLimit - 2; // We are always showing default and scan to USB

    //Helper for repeating n times in the view
    $scope.range = function(n) {
        return new Array(n);
    };

    xw.templates.getDefault().then(function(a) {
      console.log('default');
      console.log(JSON.strigify(a));
    });

    // Fetch template data from the machine
    xw.templates.getList().then(function(templateList) {
        $scope.$apply(function() {
            //debug.log('Got template list');
            $scope.templateList = templateList;
            var diff = templateListOverflowLimit - templateList.length;
            $scope.disabledItems = diff > 0 ? diff : 0;
        });
    },function (res) {
      $scope.$apply(function() {
            //debug.log('Did not get template list');
        });
    });

    // Fetch default template
    xw.templates.getDefault().then(function (defaultTemplate) {
        $scope.$apply(function () {
          console.log('Did get defaultTemplate');
            // if (!Scantemplate.data) {
                updateTemplate(defaultTemplate, "Default");
            // }
        });
    },function (res) {
      $scope.$apply(function() {
            //debug.log('Did not get defaultTemplate');
        });
    });


    $scope.showFileNameKeyBoard = false;

    $scope.toggleFileNameKeyBoard = function () {
        $scope.showFileNameKeyBoard = !$scope.showFileNameKeyBoard;
    };


    $scope.fileName = Scantemplate.data['doc_object xrx_document']['string DocumentObjectName'];
    $scope.setFileName = function(){
     Scantemplate.data['doc_object xrx_document']['string DocumentObjectName'] = $scope.fileName;
      $scope.toggleFileNameKeyBoard();
    };

    $scope.setTemplate = function(template) {

        xw.templates.get(template.name).then(function(fullTemplate) {
            $scope.$apply(function() {
                updateTemplate(fullTemplate, template.name);
            });
        });
    };


    $scope.setDefaultTemplate = function () {

        xw.templates.getDefault().then(function (fullTemplate) {
            $scope.$apply(function () {
                updateTemplate(fullTemplate, "Default");
            });
        });
    };

    $scope.isActiveTemplate = function(templateName) {

      return $scope.template.name === templateName;
      
    };


      function updateTemplate(template, templateName) {
        var normalizedTemplate = normalizeTemplate(template);
        
        //debug.log(normalizedTemplate);

          Scantemplate.data = deepExtend(Scantemplate.data, normalizedTemplate);
          // Scantemplate.data = template;
          Scantemplate.name = templateName;
      }


      function normalizeTemplate(template){

        var templateCopy = angular.copy(template);

        for (var propLev1 in templateCopy) {

          for (var prop in templateCopy[propLev1]) {
            if(prop.slice(0,2) === '* '){
              console.log(prop);
              var normalizedKey = prop.slice(2,prop.length);
              console.log(normalizedKey);
              template[propLev1][normalizedKey] = template[propLev1][prop];
              delete template[propLev1][prop];
            }
          };
        }

        console.log(template);

        return template;
      }


      function deepExtend(destination, source) {
      	/// <summary>
      	/// Helper for deep extending a object jQuery style
      	/// </summary>
      	/// <param name="destination"></param>
      	/// <param name="source"></param>
      	/// <returns type=""></returns>
          for (var property in source) {
            if(property !== "string JobTemplateName"){
              if (source[property] && source[property].constructor &&
               source[property].constructor === Object) {
                  destination[property] = destination[property] || {};
                  arguments.callee(destination[property], source[property]);
              } else {
                  destination[property] = source[property];
              }
            }
          }

          console.log(destination);
          return destination;
      }

});
