(function (ng) {
  'use strict';

  ng.module('playlister.spotify.tracksCache', ['playlister.settings', 'playlister.spotify.playlistTracks'])
    .factory('tracksCache', function ($q, playlistTracks, tracksCacheSettings) {
      var memory = {};

      var isEntryValid = function (entry) {
        var diff = Math.abs(new Date() - entry.added) / 1000 / 60;
        return diff <= tracksCacheSettings.expires;
      };

      var areSettingsMatch = function (entry, offset, fields) {
        return entry.offset === offset && entry.fields === fields;
      };

      var getTracks = function (playlist, offset, fields) {
        var defer = $q.defer();

        var entry = memory[playlist.id];
        if (entry && isEntryValid(entry) && areSettingsMatch(entry, offset, fields)) {
          defer.resolve(entry.result);
        } else {
          playlistTracks.get(playlist, offset, fields).then(function (result) {
            memory[playlist.id] = {
              offset: offset,
              fields: fields,
              result: result,
              added: new Date()
            };
            defer.resolve(result);
          }, function (reason) {
            defer.reject(reason);
          }, function (notify) {
            defer.notify(notify);
          });
        }

        return defer.promise;
      };

      var refresh = function (playlist) {
        if (memory.hasOwnProperty(playlist.id)) {
          memory[playlist.id] = null;
        }
      };

      return {
        get: getTracks,
        refresh: refresh
      };
    });

})(angular);
