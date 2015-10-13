'use strict';

angular
  .module('playlister.spotify.resources.user', ['ngResource'])
  .factory('SpotifyUser', ($resource, spotifyApiUrl) => {
    return $resource(`${spotifyApiUrl}/me`);
  });
