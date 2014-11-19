'use strict';

/* designed for full re-usability at any path, any level, by using 
    data from attrs
    declare like this:
    
    <a active-tab="1" href="/somelink">Some link</a>
    
    or like this 

    <a active-tab href="/somelink">Some link</a>
*/

angular.module('foxwayApp')
  .directive('activeTab', function ($location) {
    return {
        link: function postLink(scope, element, attrs) {
            scope.$on("$routeChangeSuccess", function (event, current, previous) {

                // this var grabs the tab-level off the attribute, or defaults to 1
                var pathLevel = attrs.activeTab || 1,
                    // this var finds what the path is at the level specified
                    pathToCheck = $location.path().split('/')[pathLevel],
                    // this grabs the same level of the href attribute of the a tag in the tab
                    tabLink = attrs.href.split('/')[pathLevel];
                // now compare the two:
                if (pathToCheck === tabLink) {
                    element.addClass("active");
                } else {
                    element.removeClass("active");
                }
            });
        }
    };
});