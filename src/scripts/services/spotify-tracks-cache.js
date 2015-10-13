'use strict';

angular
  .module('playlister.spotify.tracksCache', ['playlister.settings', 'playlister.spotify.playlistTracks'])
  .factory('tracksCache', ($q, playlistTracks, tracksCacheSettings) => {
    let memory = {};

    function isEntryValid(entry) {
      let diff = Math.abs(new Date() - entry.added) / 1000 / 60;
      return diff <= tracksCacheSettings.expires;
    }

    function areSettingsMatch(entry, offset, fields) {
      return entry.offset === offset && entry.fields === fields;
    }

    function getTracks(playlist, offset, fields) {
      const defer = $q.defer();

      let entry = memory[playlist.id];
      if (entry && isEntryValid(entry) && areSettingsMatch(entry, offset, fields)) {
        defer.resolve(entry.result);
      } else {
        playlistTracks.get(playlist, offset, fields).then((result) => {
          memory[playlist.id] = {
            offset,
            fields,
            result,
            added: new Date()
          };
          defer.resolve(result);
        }, (reason) => {
          defer.reject(reason);
        }, (notify) => {
          defer.notify(notify);
        });
      }

      return defer.promise;
    }

    function refresh(playlist) {
      if (memory.hasOwnProperty(playlist.id)) {
        memory[playlist.id] = null;
      }
    }

    return {
      get: getTracks,
      refresh
    };
  });
