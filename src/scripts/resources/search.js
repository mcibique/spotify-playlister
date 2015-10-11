'use strict';

angular
  .module('playlister.spotify.resources.search', ['ngResource'])
  .factory('SpotifySearch', function ($resource, spotifyApiUrl) {
    var playlistUrl = spotifyApiUrl + '/search';
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
