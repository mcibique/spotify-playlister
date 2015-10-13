'use strict';

angular
  .module('playlister.spotify.resources', ['ngResource', 'playlister.spotify.resources.user',
    'playlister.spotify.resources.playlist', 'playlister.spotify.resources.search'
  ])
  .config(($httpProvider) => {
    $httpProvider.interceptors.push('spotifyAuthHttpInterceptor');

    $httpProvider.defaults.headers.delete = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  })
  .factory('spotifyAuthHttpInterceptor', ($injector, auth, spotifyApiUrl) => {
    return {
      request(config) {
        if (config.url.indexOf(spotifyApiUrl) === 0) {
          const key = auth.getKey();
          if (key) {
            config.headers.Authorization = `Bearer ${key}`;
          }
        }

        return config;
      },
      responseError(rejection) {
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
