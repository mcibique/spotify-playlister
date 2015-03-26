(function (ng, $) {
  'use strict';

  ng.module('playlister', ['ui.router', 'playlister.auth', 'playlister.spotify-credentials'])
    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('login', {
          url: '/login/',
          templateUrl: 'views/login.html',
          controller: 'LoginController'
        })
        .state('playlists', {
          url: '/',
          templateUrl: 'views/playlists.html'
        });

      $urlRouterProvider.otherwise('/');
    })
    .run(function ($log, $window, $rootScope, $state, auth) {
      $log.debug('Playlister is running.');

      var search = $window.location.search;
      var matches = /code=([^&]*)/g.exec(search);
      if (matches) {
        var code = matches[1];
        if (code) {
          auth.setKey(code);
          $window.location.href = '/';
        }
      }
    })
    .controller('LoginController', function ($scope, spotifyCredentials) {
      var params = {
        client_id: spotifyCredentials.clientId,
        response_type: 'code',
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