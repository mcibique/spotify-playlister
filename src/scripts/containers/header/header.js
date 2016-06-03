angular
  .module('playlister.containers.header', ['playlister.containers.header.controller'])
  .directive('playlisterHeader', function playlisterHeader() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/containers/header/header.html',
      bindToController: true,
      controllerAs: 'vm',
      controller: 'HeaderController'
    };
  });
