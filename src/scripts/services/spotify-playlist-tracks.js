'use strict';

angular
  .module('playlister.spotify.playlistTracks', ['playlister.spotify.api'])
  .factory('playlistTracks', function playlistTracks($q, playlistService) {
    const defaultLimit = 100;

    function getTracksResponse(receivedItems, playlist, offset, fields) {
      const defer = $q.defer();
      if (receivedItems.length && receivedItems.length === defaultLimit) {
        getTracks(playlist, offset + defaultLimit, fields).then(
          tracks => defer.resolve(receivedItems.concat(tracks)),
          null,
          items => defer.notify(items)
        );
      } else {
        defer.resolve(receivedItems);
      }

      return defer.promise;
    }

    function getTracks(playlist, offset, fields) {
      const defer = $q.defer();
      playlistService
        .getTracks(playlist.owner.id, playlist.id, {
          limit: defaultLimit,
          offset,
          fields
        })
        .then(response => {
          let { data } = response;
          defer.notify(data.items);
          getTracksResponse(data.items, playlist, offset, fields).then(
            tracks => defer.resolve(tracks),
            null,
            items => defer.notify(items)
          );
        });

      return defer.promise;
    }

    return {
      get: getTracks
    };
  });
