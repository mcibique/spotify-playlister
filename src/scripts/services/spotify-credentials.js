angular
  .module('playlister.spotify.credentials', [])
  .constant('spotifyCredentials', {
    authorizeUrl: 'https://accounts.spotify.com/authorize',
    clientId: '<< insert valid client ID >>',
    redirectUri: '<< insert valid redirect URI >>',
    scopes: ['playlist-read-private', 'playlist-modify-public', 'playlist-modify-private', 'user-read-private',
      'user-read-email'
    ]
  });
