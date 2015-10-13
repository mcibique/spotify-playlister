'use strict';

angular
  .module('playlister.states.login', ['ui.router', 'playlister.services.auth', 'playlister.spotify.credentials'])
  .config(($stateProvider) => {
    $stateProvider
      .state('login', {
        url: '/login/',
        templateUrl: '/views/login.html',
        controller: 'LoginController'
      });
  })
  .run(($window, $state, auth) => {
    let search = $window.location.hash;
    let matches = (/access_token=([^&]*)/g).exec(search);
    if (matches) {
      let code = matches[1];
      if (code) {
        auth.setKey(code);
        $state.go('playlists');
      }
    }
  })
  .controller('LoginController', ($scope, spotifyCredentials) => {
    let params = {
      client_id: spotifyCredentials.clientId,
      response_type: 'token',
      redirect_uri: spotifyCredentials.redirectUri,
      scope: spotifyCredentials.scopes.join(' '),
      show_dialog: false
    };

    $scope.spotifyAuthorizeUrl = `${spotifyCredentials.authorizeUrl}/?${$.param(params)}`;
  })
  .controller('LogoutController', ($scope, $state, auth) => {
    $scope.logout = function () {
      auth.clearKey();
      $state.go('login');
    };

    $scope.isLoggedIn = function () {
      return !!auth.getKey();
    };
  });
