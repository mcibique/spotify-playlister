(function (ng, $) {
  'use strict';

  ng.module('playlister', ['ui.router', 'playlister.auth', 'playlister.playlists', 'playlister.spotify-credentials',
      'playlister.spotify-resources'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
      $stateProvider
        .state('login', {
          url: '/login/',
          templateUrl: 'views/login.html',
          controller: 'LoginController'
        });

      $urlRouterProvider.otherwise('/playlists/');

      $httpProvider.defaults.useXDomain = true;
    })
    .run(function ($log, $window, $location, $rootScope, $state, auth) {
      $log.debug('Playlister is running.');

      var search = $window.location.hash;
      var matches = /access_token=([^&]*)/g.exec(search);
      if (matches) {
        var code = matches[1];
        if (code) {
          auth.setKey(code);
          $state.go('playlists');
        }
      }
    })
    .controller('LoginController', function ($scope, spotifyCredentials) {
      var params = {
        client_id: spotifyCredentials.clientId,
        response_type: 'token',
        redirect_uri: spotifyCredentials.redirectUri,
        scope: spotifyCredentials.scopes.join(' '),
        show_dialog: false
      };

      $scope.spotifyAuthorizeUrl = spotifyCredentials.authorizeUrl + '/?' + $.param(params);
    })
    .controller('LogoutController', function ($scope, $state, auth) {
      $scope.logout = function () {
        auth.clearKey();
        $state.go('login');
      };

      $scope.isLoggedIn = function () {
        return !!auth.getKey();
      };
    });

})(angular, jQuery);