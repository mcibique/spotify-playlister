'use strict';

angular
  .module('playlister.spotify.resources', ['ngResource', 'playlister.spotify.resources.user',
    'playlister.spotify.resources.playlist', 'playlister.spotify.resources.search'
  ])
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('spotifyAuthHttpInterceptor');

    $httpProvider.defaults.headers.delete = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  })
  .factory('spotifyAuthHttpInterceptor', function ($injector, auth, spotifyApiUrl) {
    return {
      request: function (config) {
        if (config.url.indexOf(spotifyApiUrl) === 0) {
          var key = auth.getKey();
          if (key) {
            config.headers.Authorization = 'Bearer ' + key;
          }
        }

        return config;
      },
      responseError: function (rejection) {
        if (rejection.config.url.indexOf(spotifyApiUrl) === 0) {
          if (rejection.status === 401) {
            auth.clearKey();
            $injector.get('$state').go('login');
          }
        }
      }
    };
  })
  .constant('spotifyApiUrl', 'https://api.spotify.com/v1');
