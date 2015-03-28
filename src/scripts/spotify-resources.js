(function (ng) {
  'use strict';

  ng.module('playlister.spotify-resources', ['ngResource'])
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('spotifyAuthHttpInterceptor');
    })
    .factory('spotifyAuthHttpInterceptor', function (auth) {
      return {
        request: function (config) {
          if (config.url.indexOf('https://api.spotify.com/') === 0) {
            var key = auth.getKey();
            if (key) {
              config.headers.Authorization = 'Bearer ' + key;
            }
          }

          return config;
        }
      };
    })
    .constant('spotifyApiUrl', 'https://api.spotify.com/v1')
    .factory('SpotifyUser', function ($resource, spotifyApiUrl) {
      return $resource(spotifyApiUrl + '/me');
    })
    .factory('SpotifyPlaylist', function ($resource, spotifyApiUrl) {
      var playlistUrl = spotifyApiUrl + '/users/:userId/playlists/:playlistId';
      return $resource(playlistUrl, {
        userId: '@userId'
      }, {
        tracks: {
          method: 'GET',
          url: playlistUrl + '/tracks'
        }
      });
    });

})(angular, jQuery);