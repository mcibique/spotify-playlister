(function (ng, $) {
  'use strict';

  ng.module('playlister.spotify', ['playlister.spotify.credentials', 'playlister.spotify.resources',
    'playlister.spotify.tracksCache', 'playlister.spotify.playlistTracks'
  ]);

})(angular, jQuery);