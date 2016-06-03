angular
  .module('playlister.components.perfectScrollbar', [])
  .directive('scrollbar', function scrollbarDirective($window) {
    return {
      restict: 'A',
      link: scrollbarLink
    };

    function scrollbarLink(scope, element, attrs) {
      const options = scope.$eval(attrs.scrollbar);
      $window.setTimeout(() => element.perfectScrollbar(options));

      scope.$on('updateScrollbar', function onUpdateScrollbar() {
        $window.setTimeout(() => element.perfectScrollbar('update'));
      });

      scope.$on('$destroy', function onScrollbarDestroy() {
        element.perfectScrollbar('destroy');
      });
    }
  });
