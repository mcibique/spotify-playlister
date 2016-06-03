angular
  .module('playlister.containers.main', [])
  .directive('playlisterMain', function playlisterMain() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/containers/main/main.html'
    };
  });
