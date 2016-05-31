'use strict';

angular
  .module('playlister.spotify.api', ['playlister.spotify.api.playlist', 'playlister.spotify.api.search', 'playlister.spotify.api.user'])
  .config(function apiConfig($httpProvider) {
    $httpProvider.interceptors.push('spotifyAuthHttpInterceptor');

    $httpProvider.defaults.headers.delete = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  })
  .factory('spotifyAuthHttpInterceptor', function spotifyAuthHttpInterceptor($injector, auth, spotifyApiUrl) {
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
