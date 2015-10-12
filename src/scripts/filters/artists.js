'use strict';

angular
  .module('playlister.filters.artists', [])
  .filter('artists', () => {
    return function (artists) {
      if (!artists) {
        return '';
      }
      return artists.map((artist) => {
        return artist.name || '';
      }).join(', ');
    };
  });
