'use strict';

angular
  .module('playlister.states.playlists.detail', ['ui.router', 'playlister.states.playlists.detail.controller', 'playlister.states.playlists.playlistToolbar', 'playlister.states.playlists.playlistTracks', 'playlister.states.playlists.playlistInfo'])
  .config(function playlistStateConfig($stateProvider) {
    $stateProvider
      .state('playlists.detail', {
        parent: 'playlists',
        url: ':userId/playlist/:id',
        templateUrl: '/scripts/states/playlists/detail/playlist-detail.html',
        controller: 'PlaylistDetailController',
        controllerAs: 'vm',
        resolve: {
          playlist: ($stateParams, playlistService) => playlistService.get($stateParams.userId, $stateParams.id).then(response => response.data)
        }
      });
  });
