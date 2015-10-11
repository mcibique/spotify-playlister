'use strict';

angular
  .module('playlister.directives.perfectScrollbar', [])
  .directive('scrollbar', function () {
    return {
      restict: 'A',
      link: function (scope, element, attrs) {
        var options = scope.$eval(attrs.scrollbar);
        setTimeout(function () {
          element.perfectScrollbar(options);
        });

        scope.$on('updateScrollbar', function () {
          setTimeout(function () {
            element.perfectScrollbar('update');
          });
        });

        scope.$on('$destroy', function () {
          element.perfectScrollbar('destroy');
        });
      }
    };
  });
