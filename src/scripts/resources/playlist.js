'use strict';

angular
  .module('playlister.spotify.resources.playlist', ['ngResource'])
  .factory('SpotifyPlaylist', function ($resource, spotifyApiUrl) {
    var playlistUrl = spotifyApiUrl + '/users/:userId/playlists/:playlistId';
    return $resource(playlistUrl, {
      userId: '@userId',
      playlistId: '@playlistId'
    }, {
      tracks: {
        method: 'GET',
        url: playlistUrl + '/tracks'
      },
      addTracks: {
        method: 'POST',
        url: playlistUrl + '/tracks'
      },
      removeTracks: {
        method: 'DELETE',
        url: playlistUrl + '/tracks'
      }
    });
  });
