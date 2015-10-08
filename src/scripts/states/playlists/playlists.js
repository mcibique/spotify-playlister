(function (ng) {
  'use strict';

  ng.module('playlister.states.playlists', ['ui.router', 'playlister.states.playlists.controllers',
      'playlister.filters', 'playlister.spotify.resources', 'playlister.spotify.tracksCache'
    ])
    .config(function ($stateProvider) {
      $stateProvider
        .state('playlists', {
          url: '/playlists/',
          templateUrl: '/views/playlists.html',
          controller: 'PlaylistsController',
          resolve: {
            profile: function (SpotifyUser) {
              return SpotifyUser.get().$promise;
            }
          }
        })
        .state('playlists.detail', {
          url: ':userId/playlist/:id',
          templateUrl: '/views/playlist.html',
          controller: 'PlaylistController',
          resolve: {
            playlist: function ($stateParams, SpotifyPlaylist) {
              return SpotifyPlaylist.get({
                userId: $stateParams.userId,
                playlistId: $stateParams.id
              }).$promise;
            }
          }
        });
    });

})(angular);
