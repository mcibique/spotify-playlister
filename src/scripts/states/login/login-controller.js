angular
  .module('playlister.states.login.controller', ['playlister.services.auth', 'playlister.spotify.credentials'])
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
  });
