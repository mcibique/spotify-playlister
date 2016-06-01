angular
  .module('playlister.states.playlists', ['ui.router', 'playlister.states.playlists.detail', 'playlister.states.playlists.controller', 'playlister.states.playlists.playlistList'])
  .config(function playlistStateConfig($stateProvider) {
    $stateProvider
      .state('playlists', {
        url: '/playlists/',
        templateUrl: '/scripts/states/playlists/playlists.html',
        controller: 'PlaylistsController',
        controllerAs: 'vm',
        resolve: {
          profile: userService => userService.get().then(response => response.data)
        }
      });
  });
