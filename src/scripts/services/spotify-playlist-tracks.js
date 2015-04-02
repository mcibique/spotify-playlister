(function (ng, $) {
  'use strict';

  ng.module('playlister.spotify.playlistTracks', ['playlister.spotify.resources'])
    .factory('playlistTracks', function ($q, SpotifyPlaylist) {
      var defaultLimit = 100;
      var getTracksResponse = function (response, playlist, offset, fields) {
        var defer = $q.defer();
        if (response.items.length && response.items.length === defaultLimit) {
          getTracks(playlist, offset + defaultLimit, fields).then(function (tracks) {
            defer.resolve(response.items.concat(tracks));
          });
        } else {
          defer.resolve(response.items);
        }

        return defer.promise;
      };

      var getTracks = function (playlist, offset, fields) {
        var defer = $q.defer();
        SpotifyPlaylist.tracks({
          userId: playlist.owner.id,
          playlistId: playlist.id,
          limit: defaultLimit,
          offset: offset,
          fields: fields
        }, function (response) {
          getTracksResponse(response, playlist, offset, fields).then(function (tracks) {
            defer.resolve(tracks);
          });
        });

        return defer.promise;
      };

      return {
        get: getTracks
      };
    });

})(angular, jQuery);