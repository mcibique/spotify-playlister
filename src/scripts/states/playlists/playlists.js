'use strict';

angular
  .module('playlister.states.playlists', ['ui.router', 'playlister.states.playlists.controllers',
    'playlister.filters', 'playlister.spotify.resources', 'playlister.spotify.tracksCache'
  ])
  .config(($stateProvider) => {
    $stateProvider
      .state('playlists', {
        url: '/playlists/',
        templateUrl: '/views/playlists.html',
        controller: 'PlaylistsController',
        controllerAs: 'vm',
        resolve: {
          profile(SpotifyUser) {
            return SpotifyUser.get().$promise;
          }
        }
      })
      .state('playlists.detail', {
        url: ':userId/playlist/:id',
        templateUrl: '/views/playlist.html',
        controller: 'PlaylistController',
        controllerAs: 'vm',
        resolve: {
          playlist($stateParams, SpotifyPlaylist) {
            return SpotifyPlaylist.get({
              userId: $stateParams.userId,
              playlistId: $stateParams.id
            }).$promise;
          }
        }
      });
  });
