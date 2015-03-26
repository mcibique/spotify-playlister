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
    .factory('spotifyResource', function ($resource) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args[0] = 'https://api.spotify.com/v1' + args[0];

        return $resource.apply(null, args);
      };
    })
    .factory('SpotifyUser', function (spotifyResource) {
      return spotifyResource('/me');
    });

})(angular, jQuery);