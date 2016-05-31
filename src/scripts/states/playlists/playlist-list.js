'use strict';

angular
  .module('playlister.states.playlists.playlistList', [])
  .directive('playlistList', function playlistToolbar() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/scripts/states/playlists/playlist-list.html',
      scope: {
        playlists: '=',
        profile: '='
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: angular.noop
    };
  });
