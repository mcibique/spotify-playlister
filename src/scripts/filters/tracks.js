'use strict';

angular
  .module('playlister.filters.tracks', ['playlister.filters.artists'])
  .filter('track', function trackFilterFactory($filter) {
    const artistsFilter = $filter('artists');
    return function trackFilter(track) {
      if (!track) {
        return '';
      }
      let result = artistsFilter(track.artists);
      if (result) {
        result += ' - ';
      }
      result += track.name;
      if (track.album && track.album.name) {
        result += ` (${track.album.name})`;
      }
      return result;
    };
  });
