'use strict';

angular
  .module('playlister.directives.perfectScrollbar', [])
  .directive('scrollbar', () => {
    return {
      restict: 'A',
      link(scope, element, attrs) {
        const options = scope.$eval(attrs.scrollbar);
        setTimeout(() => {
          element.perfectScrollbar(options);
        });

        scope.$on('updateScrollbar', () => {
          setTimeout(() => {
            element.perfectScrollbar('update');
          });
        });

        scope.$on('$destroy', () => {
          element.perfectScrollbar('destroy');
        });
      }
    };
  });
