'use strict';

angular
  .module('playlister.states.login.controllers', ['playlister.services.auth', 'playlister.spotify.credentials'])
  .controller('LoginController', function LoginController($scope, spotifyCredentials) {
    const vm = this;
    const params = {
      client_id: spotifyCredentials.clientId,
      response_type: 'token',
      redirect_uri: spotifyCredentials.redirectUri,
      scope: spotifyCredentials.scopes.join(' '),
      show_dialog: false
    };

    vm.spotifyAuthorizeUrl = `${spotifyCredentials.authorizeUrl}/?${$.param(params)}`;
  })
  .controller('LogoutController', function LogoutController($scope, $state, auth) {
    const vm = this;
    vm.logout = logout;
    vm.isLoggedIn = isLoggedIn;

    function logout() {
      auth.clearKey();
      $state.go('login');
    }

    function isLoggedIn() {
      return !!auth.getKey();
    }
  });
