'use strict';

angular.module('foxwayApp')
  .directive('keyboard', function () {
      return {
      scope: {
          closeCallback: '&',
          okCallback: '&',
          iconClass: '@',
          panelTitle: '@',
          placeHolder: '@',
          model: '='
      },
      templateUrl: 'templates/keyboard.html',
      replace: true,
      link: function postLink(scope, element, attrs) {
          if (!window.Keyboard) {
              throw "Keyboard object is not present. This directive is dependent on the keyboard.js file. Please include it.";
          } else {
              Keyboard.init();
          }
      }
    };
  });
