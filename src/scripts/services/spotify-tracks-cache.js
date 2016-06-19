angular
  .module('playlister.spotify.tracksCache', ['playlister.settings', 'playlister.spotify.playlistTracks'])
  .factory('tracksCache', function tracksCache($q, playlistTracks, tracksCacheSettings) {
    const memory = Object.create(null);

    function isEntryValid(entry) {
      const milisecondsInOneMinute = 1000 * 60;
      const diff = Math.abs(new Date() - entry.added) / milisecondsInOneMinute;
      return diff <= tracksCacheSettings.expires;
    }

    function areSettingsMatch(entry, offset, fields) {
      return entry.offset === offset && entry.fields === fields;
    }

    function getTracks(playlist, offset, fields) {
      const defer = $q.defer();

      const entry = memory[playlist.id];
      if (entry && isEntryValid(entry) && areSettingsMatch(entry, offset, fields)) {
        defer.resolve(entry.result);
      } else {
        playlistTracks
          .get(playlist, offset, fields)
          .then(result => {
            memory[playlist.id] = {
              offset,
              fields,
              result,
              added: new Date()
            };
            defer.resolve(result);
          },
          reason => defer.reject(reason),
          notify => defer.notify(notify)
        );
      }

      return defer.promise;
    }

    function invalidate(playlist) {
      if (playlist.id in memory) {
        memory[playlist.id] = null;
      }
    }

    return {
      get: getTracks,
      invalidate
    };
  });
