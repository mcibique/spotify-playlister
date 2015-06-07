(function (ng, $) {
  'use strict';

  ng.module('playlister.directives.perfectScrollbar', [])
    .directive('scrollbar', function () {
      return {
        restict: 'A',
        link: function (scope, element, attrs) {
          var options = scope.$eval(attrs.scrollbar);
          scope.$evalAsync(function () {
            angular.element(element).perfectScrollbar(options);
          });

          scope.$on('updateScrollbar', function () {
            angular.element(element).perfectScrollbar('update');
          });

          scope.$on('$destroy', function () {
            angular.element(element).perfectScrollbar('destroy');
          });
        }
      };
    });

})(angular, jQuery);
