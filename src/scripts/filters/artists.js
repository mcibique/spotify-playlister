(function (ng, $) {
  'use strict';

  ng.module('playlister.filters.artists', [])
    .filter('artists', function () {
      return function (artists) {
        if (!artists) {
          return '';
        }
        return artists.map(function (artist) {
          return artist.name || '';
        }).join(', ');
      };
    });

})(angular, jQuery);
