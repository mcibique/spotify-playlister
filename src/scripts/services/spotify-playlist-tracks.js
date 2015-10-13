'use strict';

angular
  .module('playlister.spotify.playlistTracks', ['playlister.spotify.resources'])
  .factory('playlistTracks', ($q, SpotifyPlaylist) => {
    const defaultLimit = 100;

    function getTracksResponse(response, playlist, offset, fields) {
      const defer = $q.defer();
      if (response.items.length && response.items.length === defaultLimit) {
        getTracks(playlist, offset + defaultLimit, fields).then((tracks) => {
          defer.resolve(response.items.concat(tracks));
        }, null, (items) => {
          defer.notify(items);
        });
      } else {
        defer.resolve(response.items);
      }

      return defer.promise;
    }

    function getTracks(playlist, offset, fields) {
      const defer = $q.defer();
      SpotifyPlaylist.tracks({
        userId: playlist.owner.id,
        playlistId: playlist.id,
        limit: defaultLimit,
        offset,
        fields
      }, (response) => {
        defer.notify(response.items);
        getTracksResponse(response, playlist, offset, fields).then((tracks) => {
          defer.resolve(tracks);
        }, null, (items) => {
          defer.notify(items);
        });
      });

      return defer.promise;
    }

    return {
      get: getTracks
    };
  });
