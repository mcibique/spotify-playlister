(function (ng, $) {
  'use strict';

  ng.module('playlister.filters', [])
    .filter('artists', function () {
      return function (artists) {
        if (!artists) {
          return '';
        }
        return artists.map(function (artist) {
          return artist.name || '';
        }).join(', ');
      };
    })
    .filter('track', function ($filter) {
      var artistsFilter = $filter('artists');
      return function (track) {
        if (!track) {
          return '';
        }
        var result = artistsFilter(track.artists);
        if (result) {
          result += ' - ';
        }
        result += track.name;
        if (track.album && track.album.name) {
          result += ' (' + track.album.name + ')';
        }
        return result;
      };
    });

})(angular, jQuery);