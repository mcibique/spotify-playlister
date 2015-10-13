'use strict';

angular
  .module('playlister.spotify.resources.search', ['ngResource'])
  .factory('SpotifySearch', ($resource, spotifyApiUrl) => {
    const playlistUrl = `${spotifyApiUrl}/search`;
    return $resource(playlistUrl, {
      q: '@q',
      type: '@type'
    }, {
      tracks: {
        method: 'GET',
        params: {
          type: 'track'
        }
      }
    });
  });
