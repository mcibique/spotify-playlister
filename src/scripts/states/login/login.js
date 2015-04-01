(function (ng, $) {
  'use strict';

  ng.module('playlister.states.login', ['ui.router', 'playlister.services.auth', 'playlister.spotify.credentials'])
    .config(function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login/',
          templateUrl: 'views/login.html',
          controller: 'LoginController'
        });
    })
    .run(function ($window, $state, auth) {
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